import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Mic, ImageIcon, Loader2, Volume2, Image as ImageLucide, Volume1 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useHistorico } from '@/hooks/useHistorico';
import { useConquistas } from '@/hooks/useConquistas';
import { useLimites } from '@/hooks/useLimites';
import { useToast } from '@/hooks/use-toast';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import React from 'react';
import Tesseract from 'tesseract.js';

export const ChatDemo = () => {
  const { user } = useAuth();
  const { profile, addCoins } = useProfile();
  const { addHistoricoItem } = useHistorico();
  const { checkAndUnlockConquistas } = useConquistas();
  const { checkLimit, incrementLimit } = useLimites();
  const { toast } = useToast();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrText, setOcrText] = useState<string | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Reconhecimento de voz: preenche o campo de mensagem com a transcrição
  React.useEffect(() => {
    if (!listening && transcript) {
      setMessage(transcript);
    }
  }, [transcript, listening]);

  // Síntese de fala: lê a resposta da IA em voz alta usando a API nativa do navegador
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Upload de imagem + OCR + integração IA + histórico + limites
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Validação de tipo e tamanho
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({ title: 'Arquivo inválido', description: 'Apenas imagens JPEG ou PNG são permitidas.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Arquivo muito grande', description: 'O tamanho máximo é 5MB.', variant: 'destructive' });
      return;
    }
    // Checagem de limite mensal de uploads
    const podeUpload = await checkLimit('uploads_mensais');
    if (!podeUpload) {
      toast({ title: 'Limite atingido!', description: 'Você atingiu o limite mensal de uploads de imagem.', variant: 'destructive' });
      return;
    }
    setOcrLoading(true);
    setOcrText(null);
    try {
      // OCR com Tesseract.js
      const { data: { text } } = await Tesseract.recognize(file, 'por');
      setOcrText(text);
      toast({ title: 'Texto extraído!', description: text.slice(0, 100) + (text.length > 100 ? '...' : '') });
      // Exibe no chat
      setConversation(prev => [...prev, {
        type: 'user',
        content: '[Imagem enviada]\n' + (text ? `Texto extraído: ${text}` : ''),
        timestamp: new Date()
      }]);
      // Envia texto + imagem para API Gemini
      setIsLoading(true);
      const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const imageBase64 = await toBase64(file);
      // Contexto do usuário para personalização
      const userContext = {
        nome: profile?.nome,
        tipo: profile?.tipo,
        serie: profile?.serie,
        idade: profile?.idade,
        regiao: profile?.regiao,
        objetivo: profile?.objetivo,
        moedas: profile?.moedas,
        conquistas: profile?.conquistas || []
      };
      const response = await fetch('https://nxincjuhkijzyjjcisml.supabase.co/functions/v1/chat-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aW5janVoa2lqenlqamNpc21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzOTI2MzksImV4cCI6MjA2Nzk2ODYzOX0.UjUY6c4QIBiZB3W2WRhFeW6yZ2mb7zOKv6qCXO7sBHM`,
        },
        body: JSON.stringify({
          message: text,
          image: imageBase64,
          userContext,
          tipo: 'imagem'
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar imagem');
      }
      const aiResponse = data.resposta || data.fallback;
      setConversation(prev => [...prev, {
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }]);
      // Salva no histórico
      await addHistoricoItem({
        pergunta: text,
        resposta: aiResponse,
        tipo: 'imagem',
        materia: 'geral',
        perfil: profile?.tipo || 'aluno',
        resultado: null,
        audio_url: null,
        imagem_url: null, // Pode ser ajustado para URL real se usar storage
      });
      await incrementLimit('uploads_mensais');
      toast({ title: 'Resposta gerada!', description: 'A análise da imagem foi concluída.' });
    } catch (err) {
      toast({ title: 'Erro', description: 'Não foi possível processar a imagem.', variant: 'destructive' });
    } finally {
      setOcrLoading(false);
      setIsLoading(false);
    }
  };

  // Envio de mensagem por texto/voz + integração IA + histórico + limites
  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    // Checagem de limite diário de perguntas
    const canAsk = await checkLimit('perguntas_diarias');
    if (!canAsk) {
      toast({
        title: "Limite atingido!",
        description: "Você atingiu o limite diário de perguntas. Volte amanhã!",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const userMessage = message;
    setMessage('');
    // Adiciona mensagem do usuário ao chat
    const userEntry = {
      type: 'user' as const,
      content: userMessage,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userEntry]);
    try {
      // Contexto do usuário para personalização
      const userContext = {
        nome: profile?.nome,
        tipo: profile?.tipo,
        serie: profile?.serie,
        idade: profile?.idade,
        regiao: profile?.regiao,
        objetivo: profile?.objetivo,
        moedas: profile?.moedas,
        conquistas: profile?.conquistas || []
      };
      // Chama API Gemini
      const response = await fetch('https://nxincjuhkijzyjjcisml.supabase.co/functions/v1/chat-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aW5janVoa2lqenlqamNpc21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzOTI2MzksImV4cCI6MjA2Nzk2ODYzOX0.UjUY6c4QIBiZB3W2WRhFeW6yZ2mb7zOKv6qCXO7sBHM`,
        },
        body: JSON.stringify({
          message: userMessage,
          userContext
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pergunta');
      }
      const aiResponse = data.resposta || data.fallback;
      // Adiciona resposta da IA ao chat
      const aiEntry = {
        type: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiEntry]);
      // Detecta se foi por voz
      const foiPorVoz = !!transcript && transcript === userMessage;
      // Salva no histórico
      await addHistoricoItem({
        pergunta: userMessage,
        resposta: aiResponse,
        tipo: foiPorVoz ? 'voz' : 'pergunta',
        materia: 'geral',
        perfil: profile?.tipo || 'aluno',
        resultado: null,
        audio_url: null,
        imagem_url: null,
      });
      await incrementLimit('perguntas_diarias');
      await addCoins(5, 'Pergunta respondida');
      // Conquistas
      const isFirstQuestion = conversation.length === 0;
      if (isFirstQuestion) {
        await checkAndUnlockConquistas({ firstQuestion: true });
      }
      toast({
        title: "Resposta gerada!",
        description: "+5 moedas pela sua curiosidade!",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua pergunta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <Card className="bg-gradient-card shadow-card border-0">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Faça login para começar a conversar!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Chat com Professor IA</CardTitle>
              <CardDescription>
                Olá, {profile?.nome}! Como posso te ajudar hoje?
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline">
            {profile?.moedas || 0} moedas
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Conversation History */}
        {conversation.length > 0 && (
          <div className="max-h-60 overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-lg">
            {conversation.map((entry, index) => (
              <div
                key={index}
                className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    entry.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground border'
                  } flex items-center gap-2`}
                >
                  {/* Ícones de tipo de mensagem */}
                  {entry.content.startsWith('[Imagem enviada]') && (
                    <ImageLucide className="w-4 h-4 text-blue-500 mr-1" />
                  )}
                  {entry.type === 'assistant' && (
                    <Volume1 className="w-4 h-4 text-green-500 mr-1" />
                  )}
                  <p className="text-sm">{entry.content}</p>
                  {/* Botão Ouvir Resposta para mensagens da IA */}
                  {entry.type === 'assistant' && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Ouvir resposta"
                      onClick={() => speak(entry.content)}
                      className="ml-2"
                    >
                      <Volume2 className="w-5 h-5" />
                    </Button>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {entry.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dica multimídia e privacidade */}
        <div className="text-xs text-muted-foreground mt-2 flex flex-col gap-1">
          <span>
            💡 Você pode enviar perguntas por texto, voz <Mic className="inline w-3 h-3" /> ou imagem <ImageLucide className="inline w-3 h-3" />. Clique nos ícones abaixo do chat!
          </span>
          <span>
            🔒 Suas imagens e áudios são processados com segurança e não são compartilhados. Evite enviar fotos de pessoas ou dados sensíveis.
          </span>
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2">
          <Textarea
            className="flex-1"
            placeholder="Digite sua pergunta ou use o microfone..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          {/* Removido botão Falar daqui */}
        </div>
        
        <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              {/* Botão de upload de imagem */}
              <label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                  disabled={ocrLoading || isLoading}
                />
                <Button variant="outline" size="sm" asChild disabled={ocrLoading || isLoading}>
                  <span>
                    <ImageIcon className="h-4 w-4 mr-1" />
                    {ocrLoading ? 'Analisando...' : 'Foto'}
                  </span>
                </Button>
              </label>
              {/* Botão Falar funcional movido para cá */}
              {browserSupportsSpeechRecognition && (
                <Button
                  type="button"
                  variant={listening ? "secondary" : "outline"}
                  onClick={() => {
                    if (listening) {
                      SpeechRecognition.stopListening();
                    } else {
                      resetTranscript();
                      SpeechRecognition.startListening({ language: 'pt-BR', continuous: false });
                    }
                  }}
                  className={listening ? "animate-pulse border-2 border-primary" : ""}
                  disabled={isLoading}
                >
                  <Mic className="h-4 w-4 mr-1" />
                  {listening ? "Gravando..." : "Falar"}
                </Button>
              )}
            </div>
            
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </CardContent>
        {/* Exibir texto extraído do OCR, se houver */}
        {ocrText && (
          <div className="p-2 bg-muted/50 rounded text-sm mt-2">
            <b>Texto extraído da imagem:</b>
            <pre className="whitespace-pre-wrap break-words">{ocrText}</pre>
          </div>
        )}
      </Card>
    );
  };

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChatBubble } from './ChatBubble'; // Importa o novo componente
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Mic, ImageIcon, Loader2, Volume2, Image as ImageLucide, Volume1, ArrowDown, Camera } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useHistorico } from '@/hooks/useHistorico';
import { useConquistas } from '@/hooks/useConquistas';
import { useLimites } from '@/hooks/useLimites';
import { useToast } from '@/hooks/use-toast';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import React from 'react';
import Tesseract from 'tesseract.js';
import { CameraCapture } from '@/components/ui/CameraCapture';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/Spinner';
import TextareaAutosize from 'react-textarea-autosize';
import { CardChat } from './CardChat';

// Adiciona tipagem global para ImportMeta.env (Vite)
declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

interface ChatDemoProps {
  chatMessage?: string;
  setChatMessage?: (msg: string) => void;
  chatMomento?: string;
  chatExtra?: Record<string, any>;
  setChatMomento?: (momento?: string) => void;
  setChatExtra?: (extra?: Record<string, any>) => void;
}

/**
 * Componente ChatDemo
 * Agora aceita props opcionais chatMessage/setChatMessage para integração com CardsDeAcao.
 */
export const ChatDemo: React.FC<ChatDemoProps> = ({ chatMessage, setChatMessage, chatMomento, chatExtra, setChatMomento, setChatExtra }) => {
  const { user } = useAuth();
  const { profile, addCoins } = useProfile();
  const { addHistoricoItem } = useHistorico();
  const { checkAndUnlockConquistas } = useConquistas();
  const { checkLimit, incrementLimit } = useLimites();
  const { toast } = useToast();
  const { fetchHistorico } = useHistorico();

  // Estado interno de mensagem, sincronizado com prop chatMessage se fornecida
  const [message, setMessage] = useState(chatMessage || '');

  // Sincroniza message com chatMessage externo
  useEffect(() => {
    if (typeof chatMessage === 'string' && chatMessage !== message) {
      setMessage(chatMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessage]);

  const [isLoading, setIsLoading] = useState(false);
  // Estado do chat agora aceita entradas expandidas
  type ChatEntry = {
    type: 'user' | 'assistant' | 'microdesafio' | 'conquista' | 'feedback';
    content: string;
    timestamp: Date;
    // Props opcionais para gamificação e animações
    emoji?: string;
    resultado?: 'acerto' | 'erro';
    moedas?: number;
    streak?: number;
    progresso?: number;
  };
  const [conversation, setConversation] = useState<ChatEntry[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrText, setOcrText] = useState<string | null>(null);

  // Estado para preview de imagem
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Estado para modal da câmera
  const [cameraOpen, setCameraOpen] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Reconhecimento de voz: preenche o campo de mensagem com a transcrição
  React.useEffect(() => {
    if (!listening && transcript) {
      if (setChatMessage) {
        setChatMessage(transcript);
      } else {
        setMessage(transcript);
      }
    }
  }, [transcript, listening, setChatMessage]);

  // Síntese de fala: lê a resposta da IA em voz alta usando a API nativa do navegador
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Refatorar lógica de upload para aceitar File diretamente
  const uploadImageFile = async (file: File) => {
    // Validação de tipo e tamanho já foi feita antes
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
      // Envia texto + imagem para API multi-ai-proxy
      const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const imageBase64 = await toBase64(file);
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nxincjuhkijzyjjcisml.supabase.co";
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aW5janVoa2lqenlqamNpc21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzOTI2MzksImV4cCI6MjA2Nzk2ODYzOX0.UjUY6c4QIBiZB3W2WRhFeW6yZ2mb7zOKv6qCXO7sBHM";
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
      const response = await fetch(`${supabaseUrl}/functions/v1/multi-ai-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          message: text,
          image: imageBase64,
          userContext,
          tipo: 'imagem',
          momento: 'recebendo_imagem' // exemplo, pode ser dinâmico
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
    if (!message.trim() || !user || !profile) {
      toast({
        title: "Erro",
        description: "Seu perfil não foi carregado corretamente. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }
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
    if (setChatMessage) {
      setChatMessage('');
    } else {
      setMessage('');
    }
    if (setChatMomento) setChatMomento(undefined);
    if (setChatExtra) setChatExtra(undefined);
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
        conquistas: profile?.conquistas || [],
        ...(chatExtra || {})
      };
      console.log('Enviando para API:', {
        message: userMessage,
        userContext
      });
      // Chama API multi-ai-proxy
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nxincjuhkijzyjjcisml.supabase.co";
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aW5janVoa2lqenlqamNpc21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzOTI2MzksImV4cCI6MjA2Nzk2ODYzOX0.UjUY6c4QIBiZB3W2WRhFeW6yZ2mb7zOKv6qCXO7sBHM";
      const momento = chatMomento;
      const response = await fetch(`${supabaseUrl}/functions/v1/multi-ai-proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          message: userMessage,
          userContext,
          momento
        }),
      });
      const data = await response.json();
      console.log('Resposta da API:', data, response.status);
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
      let errorMessage = "Não foi possível processar sua pergunta. Tente novamente.";
      if (error instanceof Error && error.message) {
        if (error.message.includes('503') || error.message.toLowerCase().includes('overload')) {
          errorMessage = "O sistema de IA está temporariamente sobrecarregado. Por favor, tente novamente em alguns minutos.";
        }
      }
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Novo handler para seleção de imagem
  const handleSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({ title: 'Arquivo inválido', description: 'Apenas imagens JPEG ou PNG são permitidas.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Arquivo muito grande', description: 'O tamanho máximo é 5MB.', variant: 'destructive' });
      return;
    }
    setSelectedImage(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  // Handler para remover imagem
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
  };

  // Handler para confirmar envio da imagem
  const handleConfirmImageUpload = async () => {
    if (!selectedImage) return;
    await uploadImageFile(selectedImage);
    handleRemoveImage();
  };

  // Handler para receber imagem da câmera
  const handleCameraCapture = async (file: File) => {
    setCameraOpen(false);
    await uploadImageFile(file);
  };

  // Handler antigo adaptado para usar uploadImageFile
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({ title: 'Arquivo inválido', description: 'Apenas imagens JPEG ou PNG são permitidas.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Arquivo muito grande', description: 'O tamanho máximo é 5MB.', variant: 'destructive' });
      return;
    }
    await uploadImageFile(file);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    // Permite integração com CardsDeAcao: se setChatMessage for passado, atualiza externo também
    if (setChatMessage) {
      setChatMessage((e.target as HTMLTextAreaElement).value);
    }
  };

  // Paginação do histórico
  const PAGE_SIZE = 20;
  const [historicoOffset, setHistoricoOffset] = useState(0);
  const [hasMoreHistorico, setHasMoreHistorico] = useState(true);
  const isFirstLoad = useRef(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);
  // Estado de loading do histórico (scroll infinito)
  const [historicoLoading, setHistoricoLoading] = useState(false);

  // Reconstrução do chat a partir do histórico do Supabase
  useEffect(() => {
    if (!user) return;
    // Carrega as últimas PAGE_SIZE mensagens ao abrir
    const loadHistorico = async () => {
      const { data, error } = await fetchHistorico({ limit: PAGE_SIZE, offset: 0 });
      if (data && Array.isArray(data)) {
        // Converte e ordena do mais antigo para o mais recente
        const msgs = data
          .flatMap((item: any) => [
            item.pergunta ? {
              type: 'user',
              content: item.pergunta,
              timestamp: new Date(item.criado_em)
            } : null,
            item.resposta ? {
              type: 'assistant',
              content: item.resposta,
              timestamp: new Date(item.criado_em)
            } : null
          ])
          .filter(Boolean)
          .sort((a, b) => (a.timestamp as Date).getTime() - (b.timestamp as Date).getTime());
        setConversation(msgs as ChatEntry[]);
        setHistoricoOffset(data.length);
        setHasMoreHistorico(data.length === PAGE_SIZE);
      }
    };
    if (isFirstLoad.current) {
      loadHistorico();
      isFirstLoad.current = false;
    }
  }, [user]);

  // Função para carregar mais histórico (scroll infinito)
  const handleLoadMoreHistorico = useCallback(async () => {
    if (loadingMoreRef.current || !hasMoreHistorico) return;
    loadingMoreRef.current = true;
    setHistoricoLoading(true);
    const { data, error } = await fetchHistorico({ limit: PAGE_SIZE, offset: historicoOffset });
    if (data && Array.isArray(data) && data.length > 0) {
      const msgs = data
        .flatMap((item: any) => [
          item.pergunta ? {
            type: 'user' as 'user',
            content: item.pergunta,
            timestamp: new Date(item.criado_em)
          } : null,
          item.resposta ? {
            type: 'assistant' as 'assistant',
            content: item.resposta,
            timestamp: new Date(item.criado_em)
          } : null
        ])
        .filter(Boolean)
        .sort((a, b) => (a.timestamp as Date).getTime() - (b.timestamp as Date).getTime());
      setConversation(prev => [...msgs, ...prev]);
      setHistoricoOffset(historicoOffset + data.length);
      setHasMoreHistorico(data.length === PAGE_SIZE);
    } else {
      setHasMoreHistorico(false);
    }
    loadingMoreRef.current = false;
    setHistoricoLoading(false);
  }, [fetchHistorico, historicoOffset, hasMoreHistorico]);

  // --- NOVOS ESTADOS E REFS PARA SCROLL REVERSO ---
  const [isAtBottom, setIsAtBottom] = useState(true); // Se o scroll está grudado no fundo
  const [showGoToBottom, setShowGoToBottom] = useState(false); // Botão "Ir para mais recente"
  const prevScrollHeightRef = useRef<number | null>(null); // Para manter posição ao carregar mais mensagens

  // --- POSICIONA O SCROLL NO FUNDO AO MONTAR E AO RECEBER NOVAS MENSAGENS ---
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    // Se está grudado no fundo, rola para o fundo ao adicionar mensagem
    if (isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [conversation, isAtBottom]);

  // --- DETECTA SE O USUÁRIO ESTÁ NO FUNDO OU LONGE (para mostrar botão) ---
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      const atBottom = distanceFromBottom < 40; // margem de tolerância
      setIsAtBottom(atBottom);
      setShowGoToBottom(!atBottom);
      // Scroll infinito reverso: carrega mais mensagens ao chegar no topo
      if (container.scrollTop === 0 && hasMoreHistorico) {
        // Salva altura antes de carregar mais
        prevScrollHeightRef.current = container.scrollHeight;
        handleLoadMoreHistorico();
      }
    };
    container.addEventListener('scroll', handleScroll);
    // Inicializa estado
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMoreHistorico, handleLoadMoreHistorico]);

  // --- AJUSTA SCROLL APÓS CARREGAR MAIS MENSAGENS (scroll infinito reverso) ---
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    if (prevScrollHeightRef.current !== null) {
      // Mantém a posição visual após inserir mensagens no topo
      const diff = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop = diff;
      prevScrollHeightRef.current = null;
    }
  }, [conversation]);

  // Exemplo de função utilitária para identificar tipo de mensagem (pode ser expandida)
  function identificarTipoMensagem(entry: ChatEntry) {
    // Aqui pode-se usar lógica mais sofisticada no futuro
    if (entry.type === 'conquista') return 'conquista';
    if (entry.type === 'microdesafio') return 'microdesafio';
    if (entry.type === 'feedback') return 'feedback';
    if (entry.type === 'assistant') return 'feedback'; // fallback para respostas da IA
    return entry.type;
  }

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
    <>
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
            <div
              ref={chatContainerRef}
              className="flex flex-col space-y-3 overflow-y-auto bg-muted/30 rounded-lg relative max-h-[calc(100vh-10rem)] md:max-h-60 min-h-[200px] p-2 sm:p-3"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Spinner de loading do histórico no topo */}
              {historicoLoading && (
                <div className="flex justify-center items-center py-2 absolute left-0 right-0 top-0 z-20 pointer-events-none">
                  <Spinner className="h-5 w-5 text-primary/70" />
                </div>
              )}
              {historicoLoading && <div style={{ height: 32 }} />}
              {/* Renderização dos cards animados e gamificados */}
              {conversation.map((entry, index) => {
                // Só passar tipos válidos para CardChat
                const tipoValido = ['microdesafio', 'conquista', 'feedback'].includes(entry.type)
                  ? entry.type
                  : entry.type === 'assistant'
                  ? 'feedback'
                  : undefined;
                return (
                  <CardChat
                    key={index}
                    tipo={tipoValido as 'microdesafio' | 'conquista' | 'feedback'}
                    conteudo={entry.content}
                    {...(entry.emoji ? { emoji: entry.emoji } : {})}
                    {...(entry.resultado ? { resultado: entry.resultado } : {})}
                    {...(entry.moedas ? { moedas: entry.moedas } : {})}
                    {...(entry.streak ? { streak: entry.streak } : {})}
                    {...(entry.progresso ? { progresso: entry.progresso } : {})}
                    onAudioClick={entry.type === 'assistant' ? () => speak(entry.content) : undefined}
                    acessivelLabel={entry.type === 'assistant' ? 'Resposta da IA' : 'Mensagem do usuário'}
                  />
                );
              })}
              {/* Botão Ir para mais recente */}
              {showGoToBottom && (
                <button
                  onClick={() => {
                    const container = chatContainerRef.current;
                    if (container) {
                      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-4 bottom-4 z-10 bg-primary text-primary-foreground rounded-full shadow-lg p-2 flex items-center gap-1 hover:bg-primary/90 transition"
                  aria-label="Ir para mais recente"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}
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

          {/* Input Area WhatsApp Style Multiline */}
          <div className="flex items-end w-full gap-0.5 sm:gap-1 md:gap-2 mt-2">
            <div className="flex-1 flex items-center bg-background rounded-xl md:rounded-full border px-2 md:px-3 py-3 md:py-2 shadow-sm min-h-[44px]">
              <TextareaAutosize
                className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none text-sm placeholder:text-muted-foreground text-foreground px-1 md:px-2 py-1 min-h-[36px] max-h-[120px] leading-relaxed"
                placeholder="Digite uma mensagem"
                value={message}
                onChange={e => {
                  if (setChatMessage) {
                    setChatMessage(e.target.value);
                  } else {
                    setMessage(e.target.value);
                  }
                }}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                minRows={1}
                maxRows={5}
                style={{ overflowY: 'auto' }}
              />
              {/* Botão Foto */}
              <label className="ml-0.5 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleSelectImage}
                  disabled={ocrLoading || isLoading}
                />
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              </label>
              {/* Botão Câmera */}
              {navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (
                <button
                  type="button"
                  className="ml-0.5 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 transition"
                  onClick={() => setCameraOpen(true)}
                  disabled={ocrLoading || isLoading}
                  aria-label="Abrir câmera"
                >
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </button>
              )}
              {/* Botão Falar */}
              {browserSupportsSpeechRecognition && (
                <button
                  type="button"
                  className={`ml-0.5 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full ${
                    listening ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-muted hover:bg-primary/10'
                  } transition`}
                  onClick={async () => {
                    if (listening) {
                      SpeechRecognition.stopListening();
                    } else {
                      resetTranscript();
                      try {
                        await SpeechRecognition.startListening({ language: 'pt-BR', continuous: false });
                      } catch (err) {
                        toast({
                          title: 'Erro ao acessar microfone',
                          description: 'Verifique as permissões do navegador.',
                          variant: 'destructive',
                        });
                        console.error('Erro ao iniciar reconhecimento de voz:', err);
                      }
                    }
                  }}
                  disabled={isLoading}
                  aria-label={listening ? 'Parar gravação' : 'Falar'}
                >
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              {/* Botão Enviar */}
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="ml-0.5 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition shrink-0"
                aria-label="Enviar mensagem"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {/* Preview da imagem selecionada */}
                {imagePreviewUrl && (
                  <div className="flex items-center space-x-2">
                    <img src={imagePreviewUrl} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                    <Button variant="ghost" size="icon" onClick={handleRemoveImage} aria-label="Remover imagem">
                      ✕
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleConfirmImageUpload} disabled={ocrLoading || isLoading}>
                      Enviar
                    </Button>
                  </div>
                )}
              </div>
              
              
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
        {/* Modal da câmera */}
        <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
          <DialogContent className="max-w-md">
            <CameraCapture
              onCapture={handleCameraCapture}
              onCancel={() => setCameraOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  };

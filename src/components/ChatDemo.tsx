import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Mic, ImageIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useHistorico } from '@/hooks/useHistorico';
import { useConquistas } from '@/hooks/useConquistas';
import { useLimites } from '@/hooks/useLimites';
import { useToast } from '@/hooks/use-toast';

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

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    // Check daily limit
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

    // Add user message to conversation
    const userEntry = {
      type: 'user' as const,
      content: userMessage,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userEntry]);

    try {
      // Simulate AI response (in real implementation, this would call Gemini API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responses = [
        "Ótima pergunta! Vou te ajudar com isso. Em matemática, esse conceito é fundamental para...",
        "Que interessante! Em português, podemos analisar isso de várias formas. Primeiro, vamos ver...",
        "Excelente! Em ciências, esse fenômeno acontece porque... Quer que eu explique com um exemplo prático?",
        "Vou te explicar de um jeito fácil! Imagina que... Faz sentido para você?",
        "Legal! Essa é uma dúvida muito comum. A resposta é... Quer fazer um exercício sobre isso?"
      ];
      
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Add AI response to conversation
      const aiEntry = {
        type: 'assistant' as const,
        content: aiResponse,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiEntry]);

      // Save to history
      await addHistoricoItem({
        pergunta: userMessage,
        resposta: aiResponse,
        tipo: 'pergunta',
        materia: 'geral',
        perfil: profile?.tipo || 'aluno',
        resultado: null,
        audio_url: null,
        imagem_url: null,
      });

      // Increment limit
      await incrementLimit('perguntas_diarias');

      // Add coins and check achievements
      await addCoins(5, 'Pergunta respondida');
      
      // Check if this is first question
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
                  }`}
                >
                  <p className="text-sm">{entry.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {entry.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          <Textarea
            placeholder="Digite sua dúvida ou pergunta aqui..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[100px] resize-none"
            disabled={isLoading}
          />
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                <ImageIcon className="h-4 w-4 mr-1" />
                Foto
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Mic className="h-4 w-4 mr-1" />
                Voz
              </Button>
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
        </div>
      </CardContent>
    </Card>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Sparkles, MessageCircle, Clock, TrendingUp, Calendar } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useConquistas } from '@/hooks/useConquistas';
import { useLimites } from '@/hooks/useLimites';
import { useHistorico } from '@/hooks/useHistorico';
import { useEffect, useState } from 'react';

export const UserStats = () => {
  const { profile } = useProfile();
  const { conquistas } = useConquistas();
  const { getLimitStatus } = useLimites();
  const { historico } = useHistorico();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    todayQuestions: 0,
    streak: 7, // This would be calculated from actual data
    avgResponseTime: '2.5s',
  });

  const questionsLimit = getLimitStatus('perguntas_diarias');
  const uploadsLimit = getLimitStatus('uploads_mensais');

  useEffect(() => {
    // Calculate stats from historico
    const totalQuestions = historico.filter(h => h.tipo === 'pergunta').length;
    const today = new Date().toDateString();
    const todayQuestions = historico.filter(h => 
      h.tipo === 'pergunta' && 
      new Date(h.criado_em).toDateString() === today
    ).length;

    setStats(prev => ({
      ...prev,
      totalQuestions,
      todayQuestions,
    }));
  }, [historico]);

  return (
    <Card className="bg-gradient-card shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-primary" />
          <span>Seu Progresso</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{profile?.moedas || 0}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center">
              {/* Moedas com animação de pulso ao hover */}
              <Sparkles className="h-3 w-3 mr-1 transition-all hover:scale-125 animate-pulse" />
              Moedas
            </div>
          </div>
          
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-success">{conquistas.length}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center">
              <Target className="h-3 w-3 mr-1" />
              Conquistas
            </div>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Perguntas hoje</span>
            <Badge variant="outline" className="text-sm">
              {questionsLimit.current}/{questionsLimit.max}
            </Badge>
          </div>
          <Progress value={questionsLimit.percentage} className="h-2" />
        </div>

        {/* Streak */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Sequência de estudos</span>
          <Badge variant="secondary" className="text-lg px-3 py-1 animate-bounce transition-all">{/* Badge de streak com bounce */}
            🔥 {stats.streak} dias
          </Badge>
        </div>

        {/* Additional Stats */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center">
              <MessageCircle className="h-3 w-3 mr-1" />
              Total de perguntas
            </span>
            <span className="text-sm font-medium">{stats.totalQuestions}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Tempo médio resposta
            </span>
            <span className="text-sm font-medium">{stats.avgResponseTime}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Uploads mensais
            </span>
            <span className="text-sm font-medium">{uploadsLimit.current}/{uploadsLimit.max}</span>
          </div>
        </div>

        {/* Level Indicator */}
        <div className="text-center pt-4 border-t">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Nível {Math.floor((profile?.moedas || 0) / 100) + 1}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {100 - ((profile?.moedas || 0) % 100)} moedas para o próximo nível
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
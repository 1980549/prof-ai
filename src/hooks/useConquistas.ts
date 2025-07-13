import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

export type Conquista = Tables<'conquistas'>;

export const useConquistas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conquistas, setConquistas] = useState<Conquista[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConquistas();
    } else {
      setConquistas([]);
    }
  }, [user]);

  const fetchConquistas = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conquistas')
        .select('*')
        .eq('user_id', user.id)
        .order('data_conquista', { ascending: false });

      if (error) {
        console.error('Error fetching conquistas:', error);
        return { error };
      }

      setConquistas(data || []);
      return { data, error: null };
    } catch (error) {
      console.error('Error in fetchConquistas:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const unlockConquista = async (badge: string, descricao: string, moedas: number = 10) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      // Check if achievement already exists
      const { data: existing } = await supabase
        .from('conquistas')
        .select('id')
        .eq('user_id', user.id)
        .eq('badge', badge)
        .single();

      if (existing) {
        return { error: 'Conquista já desbloqueada' };
      }

      // Add achievement
      const { data, error } = await supabase
        .from('conquistas')
        .insert({
          user_id: user.id,
          badge,
          descricao,
        })
        .select()
        .single();

      if (error) {
        console.error('Error unlocking conquista:', error);
        return { error };
      }

      // Add coins to profile - we'll handle this with a separate hook call

      setConquistas(prev => [data, ...prev]);

      toast({
        title: `🏆 Conquista desbloqueada!`,
        description: `${descricao} (+${moedas} moedas)`,
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error in unlockConquista:', error);
      return { error };
    }
  };

  const checkAndUnlockConquistas = async (context: {
    firstQuestion?: boolean;
    exerciseCompleted?: boolean;
    perfectScore?: boolean;
    dailyStreak?: number;
    totalQuestions?: number;
  }) => {
    if (!user) return;

    const achievements = [];

    if (context.firstQuestion) {
      achievements.push({
        badge: '🎯',
        descricao: 'Primeira Pergunta - Fez sua primeira pergunta!',
        moedas: 20
      });
    }

    if (context.exerciseCompleted) {
      achievements.push({
        badge: '📝',
        descricao: 'Primeiro Exercício - Completou seu primeiro exercício!',
        moedas: 15
      });
    }

    if (context.perfectScore) {
      achievements.push({
        badge: '⭐',
        descricao: 'Nota Perfeita - Acertou todas as questões!',
        moedas: 25
      });
    }

    if (context.dailyStreak && context.dailyStreak >= 3) {
      achievements.push({
        badge: '🔥',
        descricao: `Sequência de ${context.dailyStreak} Dias - Mantém o foco!`,
        moedas: context.dailyStreak * 5
      });
    }

    if (context.totalQuestions && context.totalQuestions >= 10) {
      achievements.push({
        badge: '🧠',
        descricao: 'Curioso - Fez mais de 10 perguntas!',
        moedas: 30
      });
    }

    if (context.totalQuestions && context.totalQuestions >= 50) {
      achievements.push({
        badge: '📚',
        descricao: 'Estudioso - Fez mais de 50 perguntas!',
        moedas: 50
      });
    }

    // Unlock achievements
    for (const achievement of achievements) {
      await unlockConquista(achievement.badge, achievement.descricao, achievement.moedas);
    }
  };

  const getAvailableConquistas = () => {
    return [
      { badge: '🎯', name: 'Primeira Pergunta', descricao: 'Faça sua primeira pergunta' },
      { badge: '📝', name: 'Primeiro Exercício', descricao: 'Complete seu primeiro exercício' },
      { badge: '⭐', name: 'Nota Perfeita', descricao: 'Acerte todas as questões de um exercício' },
      { badge: '🔥', name: 'Sequência de 3 Dias', descricao: 'Estude por 3 dias consecutivos' },
      { badge: '🔥', name: 'Sequência de 7 Dias', descricao: 'Estude por 7 dias consecutivos' },
      { badge: '🧠', name: 'Curioso', descricao: 'Faça mais de 10 perguntas' },
      { badge: '📚', name: 'Estudioso', descricao: 'Faça mais de 50 perguntas' },
      { badge: '🏆', name: 'Explorador', descricao: 'Estude todas as matérias disponíveis' },
      { badge: '🎨', name: 'Criativo', descricao: 'Envie sua primeira imagem' },
      { badge: '🗣️', name: 'Comunicativo', descricao: 'Use o comando de voz pela primeira vez' },
    ];
  };

  return {
    conquistas,
    loading,
    fetchConquistas,
    unlockConquista,
    checkAndUnlockConquistas,
    getAvailableConquistas,
  };
};
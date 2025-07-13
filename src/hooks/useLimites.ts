import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

export type Limite = Tables<'limites'>;

export const useLimites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [limites, setLimites] = useState<Limite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLimites();
    } else {
      setLimites([]);
    }
  }, [user]);

  const fetchLimites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('limites')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching limites:', error);
        return { error };
      }

      setLimites(data || []);
      return { data, error: null };
    } catch (error) {
      console.error('Error in fetchLimites:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const checkLimit = async (tipo: string): Promise<boolean> => {
    if (!user) return false;

    const limite = limites.find(l => l.tipo_limite === tipo);
    if (!limite) return true; // If no limit exists, allow action

    return limite.valor_atual < limite.valor_maximo;
  };

  const incrementLimit = async (tipo: string, amount: number = 1) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const limite = limites.find(l => l.tipo_limite === tipo);
      if (!limite) {
        // Create new limit if it doesn't exist
        const maxValues: { [key: string]: number } = {
          'perguntas_diarias': 20,
          'uploads_mensais': 50,
          'exercicios_diarios': 10,
        };

        const { data, error } = await supabase
          .from('limites')
          .insert({
            user_id: user.id,
            tipo_limite: tipo,
            valor_atual: amount,
            valor_maximo: maxValues[tipo] || 100,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating limit:', error);
          return { error };
        }

        setLimites(prev => [...prev, data]);
        return { data, error: null };
      }

      // Check if increment would exceed limit
      if (limite.valor_atual + amount > limite.valor_maximo) {
        toast({
          title: "Limite atingido!",
          description: `Você atingiu o limite diário de ${getLimitDisplayName(tipo)}. Tente novamente amanhã ou considere fazer upgrade do seu plano.`,
          variant: "destructive",
        });
        return { error: 'Limite excedido' };
      }

      // Update existing limit
      const { data, error } = await supabase
        .from('limites')
        .update({ 
          valor_atual: limite.valor_atual + amount,
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', limite.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating limit:', error);
        return { error };
      }

      setLimites(prev => prev.map(l => l.id === limite.id ? data : l));

      // Warning when approaching limit
      const newPercentage = (data.valor_atual / data.valor_maximo) * 100;
      if (newPercentage >= 80 && newPercentage < 100) {
        toast({
          title: "Atenção!",
          description: `Você está próximo do limite de ${getLimitDisplayName(tipo)} (${data.valor_atual}/${data.valor_maximo})`,
          variant: "destructive",
        });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in incrementLimit:', error);
      return { error };
    }
  };

  const resetDailyLimits = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('limites')
        .update({ 
          valor_atual: 0,
          atualizado_em: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .in('tipo_limite', ['perguntas_diarias', 'exercicios_diarios']);

      if (error) {
        console.error('Error resetting daily limits:', error);
        return { error };
      }

      await fetchLimites();
      return { error: null };
    } catch (error) {
      console.error('Error in resetDailyLimits:', error);
      return { error };
    }
  };

  const resetMonthlyLimits = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('limites')
        .update({ 
          valor_atual: 0,
          atualizado_em: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .in('tipo_limite', ['uploads_mensais']);

      if (error) {
        console.error('Error resetting monthly limits:', error);
        return { error };
      }

      await fetchLimites();
      return { error: null };
    } catch (error) {
      console.error('Error in resetMonthlyLimits:', error);
      return { error };
    }
  };

  const getLimitDisplayName = (tipo: string): string => {
    const names: { [key: string]: string } = {
      'perguntas_diarias': 'perguntas diárias',
      'uploads_mensais': 'uploads mensais',
      'exercicios_diarios': 'exercícios diários',
    };
    return names[tipo] || tipo;
  };

  const getLimitStatus = (tipo: string) => {
    const limite = limites.find(l => l.tipo_limite === tipo);
    if (!limite) return { current: 0, max: 0, percentage: 0 };

    const percentage = (limite.valor_atual / limite.valor_maximo) * 100;
    return {
      current: limite.valor_atual,
      max: limite.valor_maximo,
      percentage,
    };
  };

  return {
    limites,
    loading,
    fetchLimites,
    checkLimit,
    incrementLimit,
    resetDailyLimits,
    resetMonthlyLimits,
    getLimitDisplayName,
    getLimitStatus,
  };
};
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

export type HistoricoItem = Tables<'historico'>;

export const useHistorico = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistorico();
    } else {
      setHistorico([]);
    }
  }, [user]);

  const fetchHistorico = async (filters?: {
    materia?: string;
    tipo?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('historico')
        .select('*')
        .eq('user_id', user.id)
        .order('criado_em', { ascending: false });

      if (filters?.materia) {
        query = query.eq('materia', filters.materia);
      }
      if (filters?.tipo) {
        query = query.eq('tipo', filters.tipo);
      }
      if (filters?.startDate) {
        query = query.gte('criado_em', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('criado_em', filters.endDate);
      }
      if (typeof filters?.limit === 'number') {
        if (typeof filters?.offset === 'number') {
          query = query.range(filters.offset, filters.offset + filters.limit - 1);
        } else {
          query = query.limit(filters.limit);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching historico:', error);
        toast({
          title: "Erro ao carregar histórico",
          description: "Não foi possível carregar seu histórico de estudos",
          variant: "destructive",
        });
        return { error };
      }

      setHistorico(data as HistoricoItem[] || []);
      return { data, error: null };
    } catch (error) {
      console.error('Error in fetchHistorico:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const addHistoricoItem = async (item: Omit<HistoricoItem, 'id' | 'user_id' | 'criado_em'>) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const { data, error } = await supabase
        .from('historico')
        .insert({
          user_id: user.id,
          ...item,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding historico item:', error);
        return { error };
      }

      setHistorico(prev => [data as HistoricoItem, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error in addHistoricoItem:', error);
      return { error };
    }
  };

  const deleteHistoricoItem = async (id: number) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const { error } = await supabase
        .from('historico')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting historico item:', error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o item do histórico",
          variant: "destructive",
        });
        return { error };
      }

      setHistorico(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Item excluído",
        description: "O item foi removido do seu histórico",
      });

      return { error: null };
    } catch (error) {
      console.error('Error in deleteHistoricoItem:', error);
      return { error };
    }
  };

  const clearHistorico = async () => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const { error } = await supabase
        .from('historico')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing historico:', error);
        toast({
          title: "Erro ao limpar histórico",
          description: "Não foi possível limpar seu histórico",
          variant: "destructive",
        });
        return { error };
      }

      setHistorico([]);
      toast({
        title: "Histórico limpo",
        description: "Todo seu histórico foi removido",
      });

      return { error: null };
    } catch (error) {
      console.error('Error in clearHistorico:', error);
      return { error };
    }
  };

  const searchHistorico = async (searchTerm: string) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('historico')
        .select('*')
        .eq('user_id', user.id)
        .or(`pergunta.ilike.%${searchTerm}%,resposta.ilike.%${searchTerm}%,materia.ilike.%${searchTerm}%`)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Error searching historico:', error);
        return { error };
      }

      setHistorico(data as HistoricoItem[] || []);
      return { data, error: null };
    } catch (error) {
      console.error('Error in searchHistorico:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return {
    historico,
    loading,
    fetchHistorico,
    addHistoricoItem,
    deleteHistoricoItem,
    clearHistorico,
    searchHistorico,
  };
};
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Perfil não existe, criar automaticamente
        const newProfile = {
          user_id: user?.id,
          nome: user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Usuário',
          tipo: user?.user_metadata?.tipo || 'aluno',
          idade: user?.user_metadata?.idade || null,
          serie: user?.user_metadata?.serie || null,
          regiao: user?.user_metadata?.regiao || null,
          objetivo: user?.user_metadata?.objetivo || null,
          moedas: 50,
          conquistas: [],
        };
        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
        if (createError) {
          console.error('Erro ao criar perfil automaticamente:', createError);
          toast({
            title: 'Erro ao criar perfil',
            description: 'Não foi possível criar seu perfil automaticamente. Tente novamente ou entre em contato com o suporte.',
            variant: 'destructive',
          });
          setProfile(null);
        } else {
          // Criar limites iniciais
          try {
            await supabase.from('limites').insert([
              {
                user_id: user?.id,
                tipo_limite: 'perguntas_diarias',
                valor_atual: 0,
                valor_maximo: 20,
              },
              {
                user_id: user?.id,
                tipo_limite: 'uploads_mensais',
                valor_atual: 0,
                valor_maximo: 50,
              }
            ]);
          } catch (limiteError) {
            console.error('Erro ao criar limites iniciais:', limiteError);
          }
          setProfile(created as Profile);
          toast({
            title: 'Perfil criado!',
            description: 'Seu perfil foi criado automaticamente.',
          });
        }
      } else if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar seus dados",
          variant: "destructive",
        });
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Erro ao atualizar perfil",
          description: "Não foi possível salvar as alterações",
          variant: "destructive",
        });
        return { error };
      }

      setProfile(data as Profile);
      toast({
        title: "Perfil atualizado!",
        description: "Suas alterações foram salvas com sucesso",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error };
    }
  };

  const addCoins = async (amount: number, reason: string) => {
    if (!profile) return;

    try {
      const newAmount = profile.moedas + amount;
      const { data, error } = await supabase
        .from('profiles')
        .update({ moedas: newAmount })
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) {
        console.error('Error adding coins:', error);
        return { error };
      }

      setProfile(data as Profile);
      
      toast({
        title: `+${amount} moedas! 🪙`,
        description: reason,
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error in addCoins:', error);
      return { error };
    }
  };

  const spendCoins = async (amount: number, reason: string) => {
    if (!profile || profile.moedas < amount) {
      toast({
        title: "Moedas insuficientes",
        description: "Você não tem moedas suficientes para esta ação",
        variant: "destructive",
      });
      return { error: 'Insufficient coins' };
    }

    try {
      const newAmount = profile.moedas - amount;
      const { data, error } = await supabase
        .from('profiles')
        .update({ moedas: newAmount })
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) {
        console.error('Error spending coins:', error);
        return { error };
      }

      setProfile(data as Profile);
      
      toast({
        title: `${amount} moedas gastas`,
        description: reason,
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error in spendCoins:', error);
      return { error };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    addCoins,
    spendCoins,
    refreshProfile: fetchProfile,
  };
};
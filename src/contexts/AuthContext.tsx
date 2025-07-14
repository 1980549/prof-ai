import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, profileData: {
    nome: string;
    tipo: 'aluno' | 'responsavel' | 'professor';
    idade?: number;
    serie?: string;
    regiao?: string;
    objetivo?: string;
  }) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle auth events
        if (event === 'SIGNED_IN') {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo de volta ao Prof AI.",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logout realizado",
            description: "Até logo! Volte sempre para continuar aprendendo.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let message = "Erro no login";
        if (error.message.includes('Invalid login credentials')) {
          message = "Email ou senha incorretos";
        } else if (error.message.includes('Email not confirmed')) {
          message = "Confirme seu email antes de fazer login";
        }
        
        toast({
          title: "Erro no login",
          description: message,
          variant: "destructive",
        });
      }

      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    profileData: {
      nome: string;
      tipo: 'aluno' | 'responsavel' | 'professor';
      idade?: number;
      serie?: string;
      regiao?: string;
      objetivo?: string;
    }
  ) => {
    try {
      setLoading(true);
      // Corrigir a URL de redirecionamento para produção e dev
      let redirectUrl = '';
      if (import.meta && import.meta.env && import.meta.env.VITE_SITE_URL) {
        redirectUrl = import.meta.env.VITE_SITE_URL;
      } else {
        redirectUrl = window.location.origin + '/';
      }
      // Garante que termina com barra
      if (!redirectUrl.endsWith('/')) redirectUrl += '/';
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: profileData
        }
      });

      if (error) {
        let message = "Erro no cadastro";
        if (error.message.includes('User already registered')) {
          message = "Este email já está cadastrado";
        }
        
        toast({
          title: "Erro no cadastro",
          description: message,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        // Create profile after successful signup
        await createUserProfile(data.user.id, profileData);
        
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const createUserProfile = async (userId: string, profileData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          ...profileData,
          moedas: 50, // Starting coins
          conquistas: [],
        });

      if (error) {
        console.error('Error creating profile:', error);
      }

      // Create initial limits
      await supabase
        .from('limites')
        .insert([
          {
            user_id: userId,
            tipo_limite: 'perguntas_diarias',
            valor_atual: 0,
            valor_maximo: 20,
          },
          {
            user_id: userId,
            tipo_limite: 'uploads_mensais',
            valor_atual: 0,
            valor_maximo: 50,
          }
        ]);

    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro no logout",
          description: "Não foi possível fazer logout",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
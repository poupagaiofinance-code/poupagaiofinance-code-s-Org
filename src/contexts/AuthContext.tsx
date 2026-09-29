import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, supabaseConfigError } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  configError: string | null;
  isRecoveryMode: boolean;
  setRecoveryMode: (value: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);

  // Carrega o perfil do usuário autenticado no banco
  const fetchProfile = useCallback(async (currentUser: User) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!error && data) {
        setProfile(data as Profile);
      } else {
        // Fallback resiliente caso o trigger ainda não tenha sido disparado ou migration não aplicada
        const metadataName = (currentUser.user_metadata?.full_name as string) || '';
        setProfile({
          id: currentUser.id,
          full_name: metadataName || null,
          avatar_url: (currentUser.user_metadata?.avatar_url as string) || null,
          created_at: currentUser.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Erro ao consultar perfil:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Verifica se a URL contém indicador de recuperação de senha (hash com type=recovery)
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash && (hash.includes('type=recovery') || hash.includes('type=invite'))) {
        setIsRecoveryMode(true);
      }
    }

    // Inicialização da sessão com getSession
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Erro ao obter sessão inicial:', error);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchProfile(initialSession.user);
      }
      setLoading(false);
    });

    // Escuta mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsRecoveryMode(true);
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error(supabaseConfigError || 'Configuração do Supabase ausente ou inválida.') };
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      console.error('Erro no signIn:', err);
      return { error: err instanceof Error ? err : new Error('Falha na autenticação') };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error(supabaseConfigError || 'Configuração do Supabase ausente ou inválida.'),
        needsEmailConfirmation: false,
      };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        return { error: new Error(error.message), needsEmailConfirmation: false };
      }

      // Se o usuário foi criado mas não retornou sessão ativa, a confirmação de e-mail está habilitada no projeto
      const needsEmailConfirmation = Boolean(data.user && !data.session);
      return { error: null, needsEmailConfirmation };
    } catch (err) {
      console.error('Erro no signUp:', err);
      return {
        error: err instanceof Error ? err : new Error('Falha no cadastro'),
        needsEmailConfirmation: false,
      };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Erro ao encerrar sessão:', err);
      }
    }
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsRecoveryMode(false);
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error(supabaseConfigError || 'Configuração do Supabase ausente ou inválida.') };
    }
    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      console.error('Erro no resetPassword:', err);
      return { error: err instanceof Error ? err : new Error('Falha ao enviar e-mail de recuperação') };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error(supabaseConfigError || 'Configuração do Supabase ausente ou inválida.') };
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (!error) {
        setIsRecoveryMode(false);
      }
      return { error: error ? new Error(error.message) : null };
    } catch (err) {
      console.error('Erro no updatePassword:', err);
      return { error: err instanceof Error ? err : new Error('Falha ao redefinir a senha') };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        configError: supabaseConfigError,
        isRecoveryMode,
        setRecoveryMode: setIsRecoveryMode,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

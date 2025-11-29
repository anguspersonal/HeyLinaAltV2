import {
  createContext,
  createElement,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AuthError, Session, User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase/client';

type AuthStatus = 'idle' | 'loading' | 'unauthenticated' | 'authenticated';

type Credentials = {
  email: string;
  password: string;
};

type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  error: string | null;
  isReady: boolean;
  bootstrap: () => Promise<void>;
  signIn: (credentials: Credentials) => Promise<boolean>;
  signUp: (credentials: Credentials) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const friendlyErrorMessage = (error: AuthError | null) => {
  if (!error) {
    return null;
  }

  const lower = error.message.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'Email or password is incorrect.';
  }
  if (lower.includes('invalid password')) {
    return 'Password must meet Supabase security requirements.';
  }
  if (lower.includes('network')) {
    return 'Network problem detected. Please try again.';
  }
  if (lower.includes('already')) {
    return 'An account with that email already exists.';
  }

  return error.message;
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleSession = useCallback((newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
    setStatus(newSession ? 'authenticated' : 'unauthenticated');
    setError(null);
  }, []);

  const bootstrap = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw sessionError;
      }
      handleSession(data.session ?? null);
    } catch (bootstrapError) {
      setSession(null);
      setUser(null);
      setStatus('unauthenticated');
      setError('Unable to restore authentication. Please sign in again.');
    } finally {
      setIsReady(true);
    }
  }, [handleSession]);

  const signIn = useCallback(
    async ({ email, password }: Credentials) => {
      setStatus('loading');
      setError(null);
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(friendlyErrorMessage(authError));
        setStatus('unauthenticated');
        return false;
      }

      return true;
    },
    []
  );

  const signUp = useCallback(
    async ({ email, password }: Credentials) => {
      setStatus('loading');
      setError(null);
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(friendlyErrorMessage(authError));
        setStatus('unauthenticated');
        return false;
      }

      return true;
    },
    []
  );

  const signOut = useCallback(async () => {
    setStatus('loading');
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError('Unable to sign out right now. Please try again.');
    }
    handleSession(null);
  }, [handleSession]);

  useEffect(() => {
    bootstrap();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      handleSession(newSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [bootstrap, handleSession]);

  const contextValue = useMemo(
    () => ({
      status,
      session,
      user,
      error,
      isReady,
      bootstrap,
      signIn,
      signUp,
      signOut,
    }),
    [status, session, user, error, isReady, bootstrap, signIn, signUp, signOut]
  );

  return createElement(AuthContext.Provider, { value: contextValue }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}

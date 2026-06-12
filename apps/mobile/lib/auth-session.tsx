import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from './supabase';

type AuthSessionState = {
  isLoading: boolean;
  isSignedIn: boolean;
  session: Session | null;
};

const AuthSessionContext = createContext<AuthSessionState>({
  isLoading: true,
  isSignedIn: false,
  session: null,
});

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return undefined;
    }

    const supabaseClient = supabase;
    let mounted = true;

    supabaseClient.auth.getSession().then(async ({ data, error }) => {
      if (!mounted) {
        return;
      }

      if (!error && data.session?.user.is_anonymous) {
        await supabaseClient.auth.signOut();
        if (mounted) {
          setSession(null);
        }
      } else if (!error) {
        setSession(data.session);
      }

      setIsLoading(false);
    });

    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      isSignedIn: Boolean(session),
      session,
    }),
    [isLoading, session],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  return useContext(AuthSessionContext);
}

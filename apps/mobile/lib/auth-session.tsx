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

export const isAuthBypassEnabled = process.env.EXPO_PUBLIC_AUTH_BYPASS === 'true';

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

      if (!error && data.session) {
        setSession(data.session);
      } else if (!error && isAuthBypassEnabled) {
        const { data: anonymousData } = await supabaseClient.auth
          .signInAnonymously()
          .catch(() => ({ data: { session: null } }));

        if (mounted && anonymousData.session) {
          setSession(anonymousData.session);
        }
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
      isSignedIn: isAuthBypassEnabled || Boolean(session),
      session,
    }),
    [isLoading, session],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  return useContext(AuthSessionContext);
}

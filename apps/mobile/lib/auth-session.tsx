import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
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
const authBypassStorageKey = 'hausy.authBypassSession';
const authBypassEventName = 'hausy-auth-bypass-change';

export function markAuthBypassSession() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(authBypassStorageKey, 'true');
  window.dispatchEvent(new Event(authBypassEventName));
}

export function clearAuthBypassSession() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(authBypassStorageKey);
  window.dispatchEvent(new Event(authBypassEventName));
}

function readAuthBypassSession() {
  return (
    isAuthBypassEnabled
    && Platform.OS === 'web'
    && typeof window !== 'undefined'
    && window.localStorage.getItem(authBypassStorageKey) === 'true'
  );
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isBypassSession, setIsBypassSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsBypassSession(readAuthBypassSession());
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

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }

    function handleBypassChange() {
      setIsBypassSession(readAuthBypassSession());
    }

    window.addEventListener(authBypassEventName, handleBypassChange);

    return () => {
      window.removeEventListener(authBypassEventName, handleBypassChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      isSignedIn: isBypassSession || Boolean(session),
      session,
    }),
    [isBypassSession, isLoading, session],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  return useContext(AuthSessionContext);
}

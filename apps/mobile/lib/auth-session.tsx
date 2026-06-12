import type { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthUser } from '@hausy/types';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from './supabase';

const DUMMY_AUTH_STORAGE_KEY = 'hausy:dummy-auth-user';

type AuthSessionState = {
  dummyUser: AuthUser | null;
  isLoading: boolean;
  isSignedIn: boolean;
  session: Session | null;
  signInWithDummy: (email: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionState>({
  dummyUser: null,
  isLoading: true,
  isSignedIn: false,
  session: null,
  signInWithDummy: async () => createDummyUser('demo@hausy.local'),
  signOut: async () => {},
});

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [dummyUser, setDummyUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | undefined;

    async function bootstrapAuth() {
      const storedDummyUser = await loadDummyUser();

      if (!mounted) {
        return;
      }

      if (storedDummyUser) {
        setDummyUser(storedDummyUser);
        setIsLoading(false);
        return;
      }

      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const supabaseClient = supabase;

      const { data, error } = await supabaseClient.auth.getSession();

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

      const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
        setIsLoading(false);
      });

      unsubscribe = () => listener.subscription.unsubscribe();
    }

    bootstrapAuth();

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, []);

  async function signInWithDummy(email: string) {
    const nextDummyUser = createDummyUser(email);
    await AsyncStorage.setItem(DUMMY_AUTH_STORAGE_KEY, JSON.stringify(nextDummyUser));
    setDummyUser(nextDummyUser);
    setSession(null);
    return nextDummyUser;
  }

  async function signOut() {
    await AsyncStorage.removeItem(DUMMY_AUTH_STORAGE_KEY);
    setDummyUser(null);
    await supabase?.auth.signOut();
    setSession(null);
  }

  const value = useMemo(
    () => ({
      dummyUser,
      isLoading,
      isSignedIn: Boolean(dummyUser) || Boolean(session),
      session,
      signInWithDummy,
      signOut,
    }),
    [dummyUser, isLoading, session],
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  return useContext(AuthSessionContext);
}

async function loadDummyUser() {
  try {
    const storedValue = await AsyncStorage.getItem(DUMMY_AUTH_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue) as Partial<AuthUser>;

    if (typeof parsedValue.id !== 'string') {
      return null;
    }

    return {
      avatarUrl: typeof parsedValue.avatarUrl === 'string' ? parsedValue.avatarUrl : null,
      email: typeof parsedValue.email === 'string' ? parsedValue.email : null,
      id: parsedValue.id,
      name: typeof parsedValue.name === 'string' ? parsedValue.name : 'Demo guest',
    };
  } catch {
    return null;
  }
}

function createDummyUser(email: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase() || 'demo@hausy.local';
  const name = normalizedEmail
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ') || 'Demo guest';

  return {
    avatarUrl: null,
    email: normalizedEmail,
    id: `dummy-${normalizedEmail.replace(/[^a-z0-9]+/g, '-')}`,
    name,
  };
}

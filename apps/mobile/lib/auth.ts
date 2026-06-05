import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { fail, ok } from '@hausy/api';
import type { ApiResult, AuthUser } from '@hausy/types';
import { logAppEvent } from '@hausy/utils';
import { Platform } from 'react-native';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

const authRedirectScheme = process.env.EXPO_PUBLIC_AUTH_REDIRECT_SCHEME || 'hausy';
const authRedirectPath = process.env.EXPO_PUBLIC_AUTH_REDIRECT_PATH || 'auth/callback';

export const authRedirectTo =
  Platform.OS === 'web'
    ? makeRedirectUri({ path: authRedirectPath })
    : `${authRedirectScheme}://${authRedirectPath}`;

export async function createSessionFromUrl(url: string): Promise<ApiResult<AuthUser | null>> {
  try {
    if (!supabase) {
      return fail('missingSupabaseConfig', 'Supabase is not configured yet.');
    }

    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) {
      return fail('oauthError', errorCode, true);
    }

    const { access_token, code, refresh_token } = params;

    if (code && typeof code === 'string') {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        logAppEvent('error', 'auth.exchangeCodeForSession', { message: error.message });
        return fail('sessionError', 'Could not finish Google sign-in.', true);
      }

      return ok(mapAuthUser(data.user));
    }

    if (!access_token || !refresh_token) {
      return ok(null);
    }

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      logAppEvent('error', 'auth.setSession', { message: error.message });
      return fail('sessionError', 'Could not finish Google sign-in.', true);
    }

    return ok(mapAuthUser(data.user));
  } catch (error) {
    logAppEvent('error', 'auth.createSessionFromUrl', error);
    return fail('sessionError', 'Could not finish Google sign-in.', true);
  }
}

export async function signInWithGoogle(): Promise<ApiResult<AuthUser | null>> {
  try {
    if (!supabase) {
      return fail('missingSupabaseConfig', 'Supabase is not configured yet.');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authRedirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) {
      logAppEvent('error', 'auth.signInWithOAuth', { message: error?.message });
      return fail('oauthError', 'Could not start Google sign-in.', true);
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, authRedirectTo);

    if (result.type !== 'success') {
      return ok(null);
    }

    return createSessionFromUrl(result.url);
  } catch (error) {
    logAppEvent('error', 'auth.signInWithGoogle', error);
    return fail('oauthError', 'Could not start Google sign-in.', true);
  }
}

export async function signInWithPassword(email: string, password: string): Promise<ApiResult<AuthUser | null>> {
  try {
    if (!supabase) {
      return fail('missingSupabaseConfig', 'Supabase is not configured yet.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      logAppEvent('error', 'auth.signInWithPassword', { message: error.message });
      return fail('passwordLoginError', 'Could not sign in with that email and password.', true);
    }

    return ok(mapAuthUser(data.user));
  } catch (error) {
    logAppEvent('error', 'auth.signInWithPassword', error);
    return fail('passwordLoginError', 'Could not sign in with that email and password.', true);
  }
}

export async function signUpWithPassword(email: string, password: string): Promise<ApiResult<AuthUser | null>> {
  try {
    if (!supabase) {
      return fail('missingSupabaseConfig', 'Supabase is not configured yet.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      logAppEvent('error', 'auth.signUpWithPassword', { message: error.message });
      return fail('passwordSignupError', 'Could not create an account with that email and password.', true);
    }

    if (!data.session) {
      return fail(
        'emailConfirmationRequired',
        'Account created. Check your email to confirm it, then log in.',
        false,
      );
    }

    return ok(mapAuthUser(data.user));
  } catch (error) {
    logAppEvent('error', 'auth.signUpWithPassword', error);
    return fail('passwordSignupError', 'Could not create an account with that email and password.', true);
  }
}

export async function enterWithDevBypass(): Promise<ApiResult<AuthUser | null>> {
  try {
    if (!supabase) {
      return ok(null);
    }

    const { data: existingSession } = await supabase.auth.getSession();

    if (existingSession.session?.user) {
      return ok(mapAuthUser(existingSession.session.user));
    }

    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      logAppEvent('warn', 'auth.signInAnonymously', { message: error.message });
      return ok(null);
    }

    return ok(mapAuthUser(data.user));
  } catch (error) {
    logAppEvent('warn', 'auth.enterWithDevBypass', error);
    return ok(null);
  }
}

export function useAuthCallbackUrl() {
  return Linking.useURL();
}

function mapAuthUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    avatarUrl: typeof user.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : null,
    email: user.email ?? null,
    id: user.id,
    name: typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null,
  };
}

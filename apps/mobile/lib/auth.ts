import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { fail, ok } from '@hausy/api';
import type { ApiResult, AuthUser } from '@hausy/types';
import { logAppEvent } from '@hausy/utils';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

const authRedirectScheme = process.env.EXPO_PUBLIC_AUTH_REDIRECT_SCHEME || 'hausy';
const authRedirectPath = process.env.EXPO_PUBLIC_AUTH_REDIRECT_PATH || 'auth/callback';

const redirectTo = makeRedirectUri({
  scheme: authRedirectScheme,
  path: authRedirectPath,
});

export async function createSessionFromUrl(url: string): Promise<ApiResult<AuthUser | null>> {
  try {
    if (!supabase) {
      return fail('missing_supabase_config', 'Supabase is not configured yet.');
    }

    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) {
      return fail('oauth_error', errorCode, true);
    }

    const { access_token, code, refresh_token } = params;

    if (code && typeof code === 'string') {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        logAppEvent('error', 'auth.exchangeCodeForSession', { message: error.message });
        return fail('session_error', 'Could not finish Google sign-in.', true);
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
      return fail('session_error', 'Could not finish Google sign-in.', true);
    }

    return ok(mapAuthUser(data.user));
  } catch (error) {
    logAppEvent('error', 'auth.createSessionFromUrl', error);
    return fail('session_error', 'Could not finish Google sign-in.', true);
  }
}

export async function signInWithGoogle(): Promise<ApiResult<AuthUser | null>> {
  try {
    if (!supabase) {
      return fail('missing_supabase_config', 'Supabase is not configured yet.');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) {
      logAppEvent('error', 'auth.signInWithOAuth', { message: error?.message });
      return fail('oauth_error', 'Could not start Google sign-in.', true);
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type !== 'success') {
      return ok(null);
    }

    return createSessionFromUrl(result.url);
  } catch (error) {
    logAppEvent('error', 'auth.signInWithGoogle', error);
    return fail('oauth_error', 'Could not start Google sign-in.', true);
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

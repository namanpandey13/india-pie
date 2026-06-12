import { fail, ok } from '@hausy/api';
import type { ApiResult, AuthUser } from '@hausy/types';
import { logAppEvent } from '@hausy/utils';
import { supabase } from './supabase';

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<ApiResult<AuthUser | null>> {
  try {
    if (!supabase) {
      return fail('missingSupabaseConfig', 'Supabase is not configured yet.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      logAppEvent('error', 'auth.signInWithPassword', { message: error.message });
      return fail('passwordLoginError', 'Incorrect email or password.', true);
    }

    return ok(mapAuthUser(data.user));
  } catch (error) {
    logAppEvent('error', 'auth.signInWithPassword', error);
    return fail('passwordLoginError', 'Could not sign in. Try again.', true);
  }
}

export async function signUpWithPassword(
  email: string,
  password: string,
): Promise<ApiResult<AuthUser | null>> {
  try {
    if (!supabase) {
      return fail('missingSupabaseConfig', 'Supabase is not configured yet.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      logAppEvent('error', 'auth.signUpWithPassword', { message: error.message });
      return fail('passwordSignupError', 'Could not create that account.', true);
    }

    if (!data.session) {
      return fail(
        'emailConfirmationRequired',
        'Email confirmation is enabled in Supabase. Turn it off for local testing, then register again.',
        false,
      );
    }

    return ok(mapAuthUser(data.user));
  } catch (error) {
    logAppEvent('error', 'auth.signUpWithPassword', error);
    return fail('passwordSignupError', 'Could not create that account.', true);
  }
}

export async function signOut(): Promise<ApiResult<null>> {
  try {
    if (!supabase) {
      return fail('missingSupabaseConfig', 'Supabase is not configured yet.');
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      return fail('signOutError', 'Could not sign out.', true);
    }

    return ok(null);
  } catch (error) {
    logAppEvent('error', 'auth.signOut', error);
    return fail('signOutError', 'Could not sign out.', true);
  }
}

function mapAuthUser(
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  } | null,
): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    avatarUrl:
      typeof user.user_metadata?.avatar_url === 'string'
        ? user.user_metadata.avatar_url
        : null,
    email: user.email ?? null,
    id: user.id,
    name:
      typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : null,
  };
}

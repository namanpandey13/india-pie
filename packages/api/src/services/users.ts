import type { AuthUser, LoginProfile } from '@hausy/types';
import { fail, ok } from '../result';

export function getCurrentUser() {
  try {
    return ok<AuthUser | null>(null);
  } catch {
    return fail<AuthUser | null>('auth_unavailable', 'Could not load the current user.', true);
  }
}

export function getProfile() {
  try {
    return ok<LoginProfile | null>(null);
  } catch {
    return fail<LoginProfile | null>('profile_unavailable', 'Could not load profile.', true);
  }
}

export function updateProfile(input: Partial<LoginProfile>) {
  try {
    return ok<Partial<LoginProfile>>(input);
  } catch {
    return fail<Partial<LoginProfile>>('profile_update_failed', 'Could not update profile.', true);
  }
}

export function signInWithGoogle() {
  try {
    return ok<AuthUser | null>(null);
  } catch {
    return fail<AuthUser | null>('oauth_unavailable', 'Could not start Google sign-in.', true);
  }
}

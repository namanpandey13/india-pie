import type { AuthUser, LoginProfile } from '@hausy/types';
import { getApiClient, getAuthenticatedProfileId } from '../client';
import { type ProfileRow, selectProfileById, updateProfileById } from '../queries/profiles';
import { fail, ok } from '../result';

export async function getCurrentUser() {
  const client = getApiClient();

  if (!client) {
    return fail<AuthUser | null>('supabaseNotConfigured', 'Supabase is not configured for this build.', false);
  }

  try {
    const { data, error } = await client.auth.getUser();

    if (error) {
      return fail<AuthUser | null>('authUnavailable', error.message ?? 'Could not load the current user.', true);
    }

    const user = data?.user;

    if (!user) {
      return ok<AuthUser | null>(null);
    }

    return ok<AuthUser | null>({
      avatarUrl: typeof user.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : null,
      email: user.email ?? null,
      id: user.id,
      name: typeof user.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : null,
    });
  } catch {
    return fail<AuthUser | null>('authUnavailable', 'Could not load the current user.', true);
  }
}

export async function getProfile() {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return ok<LoginProfile | null>(null);
  }

  try {
    const { data, error } = await selectProfileById(client, profileId);

    if (error) {
      return fail<LoginProfile | null>('profileUnavailable', error.message ?? 'Could not load profile.', true);
    }

    return ok<LoginProfile | null>(data ? mapLoginProfile(data) : null);
  } catch {
    return fail<LoginProfile | null>('profileUnavailable', 'Could not load profile.', true);
  }
}

export async function updateProfile(input: Partial<LoginProfile>) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<Partial<LoginProfile>>('authRequired', 'Sign in before updating your profile.', false);
  }

  try {
    const { error } = await updateProfileById(client, profileId, input);

    if (error) {
      return fail<Partial<LoginProfile>>('profileUpdateFailed', error.message ?? 'Could not update profile.', true);
    }

    return ok<Partial<LoginProfile>>(input);
  } catch {
    return fail<Partial<LoginProfile>>('profileUpdateFailed', 'Could not update profile.', true);
  }
}

export function signInWithGoogle() {
  return fail<AuthUser | null>('useMobileAuth', 'Use the mobile auth adapter for Google sign-in.', false);
}

function mapLoginProfile(row: ProfileRow): LoginProfile {
  const name = row.displayName ?? 'Hausy member';

  return {
    id: row.id,
    city: row.city,
    initials: initialsFor(name),
    instagram: row.instagram ?? '',
    intent: row.bio ?? '',
    linkedin: row.linkedin ?? '',
    name,
    phone: '',
  };
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

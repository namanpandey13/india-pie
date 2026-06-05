import type { HausyApiClient } from '../client';
import type { LoginProfile } from '@hausy/types';

export type ProfileRow = {
  id: string;
  displayName: string | null;
  handle: string | null;
  avatarUrl: string | null;
  city: string;
  bio: string | null;
  instagram: string | null;
  linkedin: string | null;
};

export function selectProfileById(client: HausyApiClient, profileId: string) {
  return client
    .from<ProfileRow>('profiles')
    .select('id,displayName,handle,avatarUrl,city,bio,instagram,linkedin')
    .eq('id', profileId)
    .maybeSingle();
}

export function updateProfileById(client: HausyApiClient, profileId: string, input: Partial<LoginProfile>) {
  return client
    .from('profiles')
    .update({
      bio: input.intent,
      city: input.city,
      displayName: input.name,
      instagram: input.instagram,
      linkedin: input.linkedin,
    })
    .eq('id', profileId);
}

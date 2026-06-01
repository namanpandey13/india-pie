import type { HausyApiClient } from '../client';
import type { LoginProfile } from '@hausy/types';

export type ProfileRow = {
  id: string;
  display_name: string | null;
  handle: string | null;
  avatar_url: string | null;
  city: string;
  bio: string | null;
  instagram: string | null;
  linkedin: string | null;
};

export function selectProfileById(client: HausyApiClient, profileId: string) {
  return client
    .from<ProfileRow>('profiles')
    .select('id,display_name,handle,avatar_url,city,bio,instagram,linkedin')
    .eq('id', profileId)
    .maybeSingle();
}

export function updateProfileById(client: HausyApiClient, profileId: string, input: Partial<LoginProfile>) {
  return client
    .from('profiles')
    .update({
      bio: input.intent,
      city: input.city,
      display_name: input.name,
      instagram: input.instagram,
      linkedin: input.linkedin,
    })
    .eq('id', profileId);
}

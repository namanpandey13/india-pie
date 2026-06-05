import type { HausyApiClient } from '../client';
import type { CreatorCredentialRow, CreatorLinkRow, CreatorRow } from '../services/event-mappers';

const CREATOR_SELECT =
  'id,profileId,handle,displayName,title,bio,philosophy,communityTone,rating,repeatRate,pastEvents,recurringAttendees,status';

export type CreatorTemplateRow = {
  label: string;
};

export type CreatorIdRow = {
  id: string;
};

export type CreatorUpsertRow = {
  id: string;
  profileId: string;
};

export function selectActiveCreatorTemplates(client: HausyApiClient) {
  return client
    .from<CreatorTemplateRow[]>('creatorTemplates')
    .select('label')
    .eq('active', true)
    .order('position', { ascending: true });
}

export function selectCreatorById(client: HausyApiClient, creatorId: string) {
  return client.from<CreatorRow>('creators').select(CREATOR_SELECT).eq('id', creatorId).maybeSingle();
}

export function selectCreatorByProfileId(client: HausyApiClient, profileId: string) {
  return client.from<CreatorRow>('creators').select(CREATOR_SELECT).eq('profileId', profileId).maybeSingle();
}

export function upsertCreatorForProfile(client: HausyApiClient, input: {
  bio: string;
  displayName: string;
  handle: string;
  profileId: string;
  title: string;
}) {
  return client
    .from<CreatorUpsertRow>('creators')
    .upsert(
      {
        bio: input.bio,
        communityTone: 'Self-serve host, guest-list controlled.',
        displayName: input.displayName,
        handle: input.handle,
        philosophy: 'Clear plan details, in-app updates, and direct guest review.',
        profileId: input.profileId,
        status: 'approved',
        title: input.title,
      },
      { onConflict: 'profileId' },
    )
    .select('id,profileId')
    .single();
}

export function selectCreatorLinksByCreatorId(client: HausyApiClient, creatorId: string) {
  return client.from<CreatorLinkRow[]>('creatorLinks').select('creatorId,label').eq('creatorId', creatorId);
}

export function selectCreatorCredentialsByCreatorId(client: HausyApiClient, creatorId: string) {
  return client.from<CreatorCredentialRow[]>('creatorCredentials').select('creatorId,label').eq('creatorId', creatorId);
}

export function selectCreatorSpotlightIds(client: HausyApiClient) {
  return client.from<CreatorIdRow[]>('creators').select('id').eq('status', 'approved').order('rating', { ascending: false }).limit(1);
}

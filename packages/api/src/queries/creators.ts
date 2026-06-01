import type { HausyApiClient } from '../client';
import type { CreatorCredentialRow, CreatorLinkRow, CreatorRow } from '../services/event-mappers';

const CREATOR_SELECT =
  'id,profile_id,handle,display_name,title,bio,philosophy,community_tone,rating,repeat_rate,past_events,recurring_attendees,status';

export type CreatorTemplateRow = {
  label: string;
};

export type CreatorIdRow = {
  id: string;
};

export function selectActiveCreatorTemplates(client: HausyApiClient) {
  return client
    .from<CreatorTemplateRow[]>('creator_templates')
    .select('label')
    .eq('active', true)
    .order('position', { ascending: true });
}

export function selectCreatorById(client: HausyApiClient, creatorId: string) {
  return client.from<CreatorRow>('creators').select(CREATOR_SELECT).eq('id', creatorId).maybeSingle();
}

export function selectCreatorLinksByCreatorId(client: HausyApiClient, creatorId: string) {
  return client.from<CreatorLinkRow[]>('creator_links').select('creator_id,label').eq('creator_id', creatorId);
}

export function selectCreatorCredentialsByCreatorId(client: HausyApiClient, creatorId: string) {
  return client.from<CreatorCredentialRow[]>('creator_credentials').select('creator_id,label').eq('creator_id', creatorId);
}

export function selectCreatorSpotlightIds(client: HausyApiClient) {
  return client.from<CreatorIdRow[]>('creators').select('id').eq('status', 'approved').order('rating', { ascending: false }).limit(1);
}

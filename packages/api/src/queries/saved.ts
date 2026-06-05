import type { HausyApiClient } from '../client';

export type SavedEventRow = {
  eventId: string;
};

export function selectSavedEventsForProfile(client: HausyApiClient, profileId: string) {
  return client
    .from<SavedEventRow[]>('savedEvents')
    .select('eventId')
    .eq('profileId', profileId)
    .order('createdAt', { ascending: false });
}

export function upsertSavedEvent(client: HausyApiClient, profileId: string, eventId: string) {
  return client.from('savedEvents').upsert({ eventId, profileId }, { onConflict: 'profileId,eventId' });
}

export function deleteSavedEvent(client: HausyApiClient, profileId: string, eventId: string) {
  return client.from('savedEvents').delete().eq('eventId', eventId).eq('profileId', profileId);
}

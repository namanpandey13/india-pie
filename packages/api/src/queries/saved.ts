import type { HausyApiClient } from '../client';

export type SavedEventRow = {
  event_id: string;
};

export function selectSavedEventsForProfile(client: HausyApiClient, profileId: string) {
  return client
    .from<SavedEventRow[]>('saved_events')
    .select('event_id')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
}

export function upsertSavedEvent(client: HausyApiClient, profileId: string, eventId: string) {
  return client.from('saved_events').upsert({ event_id: eventId, profile_id: profileId }, { onConflict: 'profile_id,event_id' });
}

export function deleteSavedEvent(client: HausyApiClient, profileId: string, eventId: string) {
  return client.from('saved_events').delete().eq('event_id', eventId).eq('profile_id', profileId);
}

import type { HausyApiClient } from '../client';

export type RsvpRequestRow = {
  id: string;
  profile_id: string;
  event_id: string;
  session_id: string | null;
  status: string;
  note: string | null;
};

const RSVP_SELECT = 'id,profile_id,event_id,session_id,status,note';
const ACTIVE_RSVP_STATUSES = ['requested', 'accepted', 'confirmed', 'waitlisted'] as const;

export function selectActiveRsvpsForEvent(client: HausyApiClient, profileId: string, eventId: string) {
  return client
    .from<RsvpRequestRow[]>('rsvp_requests')
    .select(RSVP_SELECT)
    .eq('profile_id', profileId)
    .eq('event_id', eventId)
    .in('status', ACTIVE_RSVP_STATUSES)
    .limit(1);
}

export function selectActiveRsvpsForProfile(client: HausyApiClient, profileId: string) {
  return client.from<unknown[]>('rsvp_requests').select('id').eq('profile_id', profileId).in('status', ACTIVE_RSVP_STATUSES);
}

export function insertRsvpRequest(client: HausyApiClient, input: {
  eventId: string;
  note?: string;
  profileId: string;
  sessionId?: string;
}) {
  return client
    .from<RsvpRequestRow>('rsvp_requests')
    .insert({
      event_id: input.eventId,
      note: input.note,
      profile_id: input.profileId,
      session_id: input.sessionId ?? null,
      status: 'requested',
    })
    .select(RSVP_SELECT)
    .single();
}

export function updateRsvpRequestCancelled(client: HausyApiClient, profileId: string, id: string) {
  return client
    .from<RsvpRequestRow>('rsvp_requests')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('profile_id', profileId)
    .select(RSVP_SELECT)
    .single();
}

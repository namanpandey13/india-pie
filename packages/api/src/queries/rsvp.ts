import type { HausyApiClient } from '../client';

export type RsvpRequestRow = {
  id: string;
  profileId: string;
  eventId: string;
  sessionId: string | null;
  status: string;
  note: string | null;
};

const RSVP_SELECT = 'id,profileId,eventId,sessionId,status,note';
const ACTIVE_RSVP_STATUSES = ['requested', 'accepted', 'confirmed', 'waitlisted'] as const;

export function selectActiveRsvpsForEvent(client: HausyApiClient, profileId: string, eventId: string) {
  return client
    .from<RsvpRequestRow[]>('rsvpRequests')
    .select(RSVP_SELECT)
    .eq('profileId', profileId)
    .eq('eventId', eventId)
    .in('status', ACTIVE_RSVP_STATUSES)
    .limit(1);
}

export function selectActiveRsvpsForProfile(client: HausyApiClient, profileId: string) {
  return client.from<unknown[]>('rsvpRequests').select('id').eq('profileId', profileId).in('status', ACTIVE_RSVP_STATUSES);
}

export function insertRsvpRequest(client: HausyApiClient, input: {
  eventId: string;
  note?: string;
  profileId: string;
  sessionId?: string;
}) {
  return client
    .from<RsvpRequestRow>('rsvpRequests')
    .insert({
      eventId: input.eventId,
      note: input.note,
      profileId: input.profileId,
      sessionId: input.sessionId ?? null,
      status: 'requested',
    })
    .select(RSVP_SELECT)
    .single();
}

export function updateRsvpRequestCancelled(client: HausyApiClient, profileId: string, id: string) {
  return client
    .from<RsvpRequestRow>('rsvpRequests')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('profileId', profileId)
    .select(RSVP_SELECT)
    .single();
}

import type { HausyApiClient } from '../client';

export type ReviewRow = {
  id: string;
  eventId: string;
  creatorId: string | null;
  body: string;
  context: string | null;
  profiles?: {
    displayName: string | null;
  } | null;
};

export type EventCheckpointRow = {
  id: string;
  eventId: string;
  kind: string;
  label: string;
  verifiedAt: string | null;
};

export function selectReviewsForEvent(client: HausyApiClient, eventId: string) {
  return client
    .from<ReviewRow[]>('reviews')
    .select('id,eventId,creatorId,body,context,profiles(displayName)')
    .eq('eventId', eventId)
    .order('createdAt', { ascending: false })
    .limit(4);
}

export function selectCheckpointsForEvent(client: HausyApiClient, eventId: string) {
  return client
    .from<EventCheckpointRow[]>('eventCheckpoints')
    .select('id,eventId,kind,label,verifiedAt')
    .eq('eventId', eventId)
    .order('createdAt', { ascending: true });
}

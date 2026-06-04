import type { HausyApiClient } from '../client';

export type ReviewRow = {
  id: string;
  event_id: string;
  creator_id: string | null;
  body: string;
  context: string | null;
  profiles?: {
    display_name: string | null;
  } | null;
};

export type EventCheckpointRow = {
  id: string;
  event_id: string;
  kind: string;
  label: string;
  verified_at: string | null;
};

export function selectReviewsForEvent(client: HausyApiClient, eventId: string) {
  return client
    .from<ReviewRow[]>('reviews')
    .select('id,event_id,creator_id,body,context,profiles(display_name)')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false })
    .limit(4);
}

export function selectCheckpointsForEvent(client: HausyApiClient, eventId: string) {
  return client
    .from<EventCheckpointRow[]>('event_checkpoints')
    .select('id,event_id,kind,label,verified_at')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });
}

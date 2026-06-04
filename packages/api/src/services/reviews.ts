import type { EventCheckpoint, Review } from '@hausy/types';
import { getApiClient } from '../client';
import { type EventCheckpointRow, type ReviewRow, selectCheckpointsForEvent, selectReviewsForEvent } from '../queries/reviews';
import { fail, ok } from '../result';

export async function listReviewsForEvent(eventId: string) {
  const client = getApiClient();

  if (!client) {
    return fail<Review[]>('supabase_not_configured', 'Supabase is not configured for this build.', false);
  }

  try {
    const { data, error } = await selectReviewsForEvent(client, eventId);

    if (error) {
      return fail<Review[]>('reviews_unavailable', error.message ?? 'Could not load reviews.', true);
    }

    return ok<Review[]>((data ?? []).map(mapReview));
  } catch {
    return fail<Review[]>('reviews_unavailable', 'Could not load reviews.', true);
  }
}

export async function listEventCheckpointsForEvent(eventId: string) {
  const client = getApiClient();

  if (!client) {
    return fail<EventCheckpoint[]>('supabase_not_configured', 'Supabase is not configured for this build.', false);
  }

  try {
    const { data, error } = await selectCheckpointsForEvent(client, eventId);

    if (error) {
      return fail<EventCheckpoint[]>('checkpoints_unavailable', error.message ?? 'Could not load event checkpoints.', true);
    }

    return ok<EventCheckpoint[]>((data ?? []).map(mapCheckpoint));
  } catch {
    return fail<EventCheckpoint[]>('checkpoints_unavailable', 'Could not load event checkpoints.', true);
  }
}

function mapReview(row: ReviewRow): Review {
  const reviewerName = row.profiles?.display_name ?? 'Hausy attendee';

  return {
    id: row.id,
    eventId: row.event_id,
    hostId: row.creator_id ?? '',
    reviewerName,
    reviewerInitials: initialsFor(reviewerName),
    tone: 'violet',
    body: row.body,
    context: row.context ?? 'Verified attendee',
  };
}

function mapCheckpoint(row: EventCheckpointRow): EventCheckpoint {
  return {
    id: row.id,
    eventId: row.event_id,
    kind:
      row.kind === 'route_proof_added' || row.kind === 'guest_list_reviewed' || row.kind === 'creator_confirmed'
        ? row.kind
        : 'venue_verified',
    label: row.label,
    verifiedAt: row.verified_at,
  };
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

import type { EventCheckpoint, Review } from '@hausy/types';
import { getApiClient } from '../client';
import { type EventCheckpointRow, type ReviewRow, selectCheckpointsForEvent, selectReviewsForEvent } from '../queries/reviews';
import { fail, ok } from '../result';

export async function listReviewsForEvent(eventId: string) {
  const client = getApiClient();

  if (!client) {
    return fail<Review[]>('supabaseNotConfigured', 'Supabase is not configured for this build.', false);
  }

  try {
    const { data, error } = await selectReviewsForEvent(client, eventId);

    if (error) {
      return fail<Review[]>('reviewsUnavailable', error.message ?? 'Could not load reviews.', true);
    }

    return ok<Review[]>((data ?? []).map(mapReview));
  } catch {
    return fail<Review[]>('reviewsUnavailable', 'Could not load reviews.', true);
  }
}

export async function listEventCheckpointsForEvent(eventId: string) {
  const client = getApiClient();

  if (!client) {
    return fail<EventCheckpoint[]>('supabaseNotConfigured', 'Supabase is not configured for this build.', false);
  }

  try {
    const { data, error } = await selectCheckpointsForEvent(client, eventId);

    if (error) {
      return fail<EventCheckpoint[]>('checkpointsUnavailable', error.message ?? 'Could not load event checkpoints.', true);
    }

    return ok<EventCheckpoint[]>((data ?? []).map(mapCheckpoint));
  } catch {
    return fail<EventCheckpoint[]>('checkpointsUnavailable', 'Could not load event checkpoints.', true);
  }
}

function mapReview(row: ReviewRow): Review {
  const reviewerName = row.profiles?.displayName ?? 'Hausy attendee';

  return {
    id: row.id,
    eventId: row.eventId,
    hostId: row.creatorId ?? '',
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
    eventId: row.eventId,
    kind:
      row.kind === 'routeProofAdded' || row.kind === 'guestListReviewed' || row.kind === 'creatorConfirmed'
        ? row.kind
        : 'venueVerified',
    label: row.label,
    verifiedAt: row.verifiedAt,
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

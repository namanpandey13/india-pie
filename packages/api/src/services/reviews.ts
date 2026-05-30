import type { EventCheckpoint, Review } from '@hausy/types';
import { fail, ok } from '../result';

export function listReviewsForEvent(eventId: string) {
  try {
    void eventId;
    return ok<Review[]>([]);
  } catch {
    return fail<Review[]>('reviews_unavailable', 'Could not load reviews.', true);
  }
}

export function listEventCheckpointsForEvent(eventId: string) {
  try {
    void eventId;
    return ok<EventCheckpoint[]>([]);
  } catch {
    return fail<EventCheckpoint[]>('checkpoints_unavailable', 'Could not load event checkpoints.', true);
  }
}

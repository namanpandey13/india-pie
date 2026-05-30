import { listReviewsForEvent } from '@hausy/api';

export function useEventReviews(eventId: string) {
  const result = listReviewsForEvent(eventId);
  return {
    error: result.error,
    reviews: result.data ?? [],
  };
}

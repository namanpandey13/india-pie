import { listReviewsForEvent } from '@hausy/api';
import { useQuery } from '@tanstack/react-query';

export function useEventReviews(eventId: string) {
  const result = useQuery({
    queryKey: ['reviews', eventId],
    queryFn: () => listReviewsForEvent(eventId),
    enabled: Boolean(eventId),
  });

  return {
    error: result.data?.error ?? null,
    reviews: result.data?.data ?? [],
  };
}

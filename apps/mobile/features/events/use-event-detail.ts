import {
  getEventById,
  getHostProfile,
  listEventCheckpointsForEvent,
  listReviewsForEvent,
} from '@hausy/api';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useAppStore } from '@/state/app-store';

export type EventDetailTab = 'details' | 'organizer' | 'going';

export function useEventDetail(id?: string) {
  const event = useMemo(() => getEventById(id), [id]);
  const hostQuery = useQuery({
    queryKey: ['host', event.data?.organizer.id],
    queryFn: () => getHostProfile(event.data?.organizer.id ?? ''),
    enabled: Boolean(event.data),
  });
  const checkpointsQuery = useQuery({
    queryKey: ['event-checkpoints', event.data?.id],
    queryFn: () => listEventCheckpointsForEvent(event.data?.id ?? ''),
    enabled: Boolean(event.data),
  });
  const reviewsQuery = useQuery({
    queryKey: ['reviews', event.data?.id],
    queryFn: () => listReviewsForEvent(event.data?.id ?? ''),
    enabled: Boolean(event.data),
  });
  const followedHosts = useAppStore((state) => state.followedHosts);
  const followHost = useAppStore((state) => state.followHost);
  const saved = useAppStore((state) => state.savedEventIds.includes(event.data?.id ?? ''));
  const toggleSavedEvent = useAppStore((state) => state.toggleSavedEvent);
  const [tab, setTab] = useState<EventDetailTab>('details');
  const [joined, setJoined] = useState(false);
  return {
    checkpoints: checkpointsQuery.data?.data ?? [],
    event: event.data,
    eventError: event.error,
    followHost: () => {
      if (event.data) {
        followHost(event.data.organizer.id);
      }
    },
    host: hostQuery.data?.data ?? null,
    hostFollowed: followedHosts.includes(event.data?.organizer.id ?? ''),
    joined,
    reviews: reviewsQuery.data?.data ?? [],
    saved,
    setJoined,
    setTab,
    tab,
    toggleSaved: () => {
      if (event.data) {
        toggleSavedEvent(event.data.id);
      }
    },
  };
}

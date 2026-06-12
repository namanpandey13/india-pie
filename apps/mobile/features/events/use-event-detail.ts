import {
  getEventById,
  getHostProfile,
  toggleSavedEvent as toggleSavedEventRemote,
} from '@hausy/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAppStore } from '@/state/app-store';

export type EventDetailTab = 'details' | 'organizer' | 'going';

export function useEventDetail(id?: string) {
  const eventQuery = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id),
    enabled: Boolean(id),
  });
  const queryClient = useQueryClient();
  const event = eventQuery.data?.data ?? null;
  const hostQuery = useQuery({
    queryKey: ['host', event?.organizer.id],
    queryFn: () => getHostProfile(event?.organizer.id ?? ''),
    enabled: Boolean(event),
  });
  const followedHosts = useAppStore((state) => state.followedHosts);
  const followHost = useAppStore((state) => state.followHost);
  const saved = useAppStore((state) => state.savedEventIds.includes(event?.id ?? ''));
  const toggleSavedEvent = useAppStore((state) => state.toggleSavedEvent);
  const saveMutation = useMutation({
    mutationFn: ({ eventId, saved: nextSaved }: { eventId: string; saved: boolean }) =>
      toggleSavedEventRemote(eventId, nextSaved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-events'] });
    },
  });
  const [tab, setTab] = useState<EventDetailTab>('details');
  const [joined, setJoined] = useState(false);
  return {
    event,
    eventError: eventQuery.data?.error ?? null,
    followHost: () => {
      if (event) {
        followHost(event.organizer.id);
      }
    },
    host: hostQuery.data?.data ?? null,
    hostFollowed: followedHosts.includes(event?.organizer.id ?? ''),
    joined,
    saved,
    setJoined,
    setTab,
    tab,
    toggleSaved: () => {
      if (event) {
        const nextSaved = toggleSavedEvent(event.id);
        saveMutation.mutate({ eventId: event.id, saved: nextSaved });
      }
    },
  };
}

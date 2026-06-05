import { listEvents, listMyRsvpRequests, listSavedEvents, toggleSavedEvent } from '@hausy/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAppStore } from '@/state/app-store';

export function useSavedEvents() {
  const queryClient = useQueryClient();
  const localSavedIds = useAppStore((state) => state.savedEventIds);
  const toggleSavedLocally = useAppStore((state) => state.toggleSavedEvent);
  const savedQuery = useQuery({
    queryKey: ['saved-events'],
    queryFn: listSavedEvents,
  });
  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: () => listEvents(),
  });
  const rsvpsQuery = useQuery({
    queryKey: ['my-rsvps'],
    queryFn: listMyRsvpRequests,
  });
  const toggleSaved = useMutation({
    mutationFn: (eventId: string) => toggleSavedEvent(eventId, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
  const savedEvents = useMemo(() => {
    const byId = new Map((savedQuery.data?.data ?? []).map((event) => [event.id, event]));
    const requestedIds = new Set((rsvpsQuery.data?.data ?? []).map((rsvp) => rsvp.eventId));

    for (const event of eventsQuery.data?.data ?? []) {
      if (localSavedIds.includes(event.id) || requestedIds.has(event.id)) {
        byId.set(event.id, event);
      }
    }

    return [...byId.values()];
  }, [eventsQuery.data, localSavedIds, rsvpsQuery.data, savedQuery.data]);

  function removeSaved(eventId: string) {
    if (localSavedIds.includes(eventId)) {
      toggleSavedLocally(eventId);
    }

    toggleSaved.mutate(eventId);
  }

  return {
    error: savedQuery.data?.error ?? eventsQuery.data?.error ?? rsvpsQuery.data?.error ?? null,
    isLoading: savedQuery.isLoading || eventsQuery.isLoading || rsvpsQuery.isLoading,
    rsvps: rsvpsQuery.data?.data ?? [],
    savedEvents,
    toggleSaved: removeSaved,
  };
}

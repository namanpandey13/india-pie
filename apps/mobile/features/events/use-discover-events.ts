import { useQuery } from '@tanstack/react-query';
import { listDiscoveryMetadata, listEvents, toggleSavedEvent } from '@hausy/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useAppStore } from '@/state/app-store';

export function useDiscoverEvents() {
  const [activeTag, setActiveTag] = useState('all');
  const [query, setQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();
  const saved = useAppStore((state) => state.savedEventIds);
  const toggleSavedLocally = useAppStore((state) => state.toggleSavedEvent);
  const joined = ['hk-boardgames'];
  const eventsQuery = useQuery({
    queryKey: ['events', activeTag, query],
    queryFn: () => listEvents({ query, tag: activeTag }),
  });
  const metadataQuery = useQuery({
    queryKey: ['discovery-metadata'],
    queryFn: listDiscoveryMetadata,
  });
  const visibleEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const events = eventsQuery.data?.data ?? [];

    if (!normalizedQuery) {
      return events;
    }

    return events.filter((event) =>
      [event.title, event.locality, event.venue.name, event.venue.locality, event.vibe, event.organizer.name]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [eventsQuery.data, query]);
  const saveMutation = useMutation({
    mutationFn: ({ id, saved: nextSaved }: { id: string; saved: boolean }) => toggleSavedEvent(id, nextSaved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-events'] });
    },
  });

  function toggleSaved(id: string) {
    const nextSaved = toggleSavedLocally(id);
    saveMutation.mutate({ id, saved: nextSaved });
  }

  return {
    activeTag,
    city: metadataQuery.data?.data?.city ?? 'Launch region',
    error: eventsQuery.data?.error ?? null,
    eventTags: metadataQuery.data?.data?.eventTags ?? [],
    isLoading: eventsQuery.isLoading,
    joined,
    query,
    saved,
    setActiveTag,
    setQuery,
    setShowFilters,
    setShowMap,
    showFilters,
    showMap,
    toggleSaved,
    visibleEvents,
  };
}

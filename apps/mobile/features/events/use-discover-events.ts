import { useQuery } from '@tanstack/react-query';
import { eventTags, city, listEvents } from '@hausy/api';
import { useMemo, useState } from 'react';
import { useAppStore } from '@/state/app-store';

export function useDiscoverEvents() {
  const [activeTag, setActiveTag] = useState('all');
  const [query, setQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const saved = useAppStore((state) => state.savedEventIds);
  const toggleSavedEvent = useAppStore((state) => state.toggleSavedEvent);
  const joined = ['hk-boardgames'];
  const eventsQuery = useQuery({
    queryKey: ['events', activeTag, query],
    queryFn: () => listEvents({ query, tag: activeTag }),
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

  function toggleSaved(id: string) {
    toggleSavedEvent(id);
  }

  return {
    activeTag,
    city,
    error: eventsQuery.data?.error ?? null,
    eventTags,
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

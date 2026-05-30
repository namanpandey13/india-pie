import { useMemo } from 'react';
import { listEvents } from '@hausy/api';
import { useAppStore } from '@/state/app-store';

export function useSavedEvents() {
  const savedEventIds = useAppStore((state) => state.savedEventIds);
  const toggleSaved = useAppStore((state) => state.toggleSavedEvent);
  const savedEvents = useMemo(
    () => (listEvents().data ?? []).filter((event) => savedEventIds.includes(event.id)),
    [savedEventIds],
  );

  return {
    savedEvents,
    toggleSaved,
  };
}

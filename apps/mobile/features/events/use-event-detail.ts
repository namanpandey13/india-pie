import { getEventById } from '@hausy/api';
import { useMemo, useState } from 'react';

export type EventDetailTab = 'details' | 'organizer' | 'going';

export function useEventDetail(id?: string) {
  const event = useMemo(() => getEventById(id), [id]);
  const [tab, setTab] = useState<EventDetailTab>('details');
  const [joined, setJoined] = useState(event.id === 'hk-boardgames');

  return {
    event,
    joined,
    setJoined,
    setTab,
    tab,
  };
}

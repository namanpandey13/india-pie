import { eventTags, city, listEvents } from '@hausy/api';
import { toggleInList } from '@hausy/utils';
import { useMemo, useState } from 'react';

export function useDiscoverEvents() {
  const [activeTag, setActiveTag] = useState('all');
  const [saved, setSaved] = useState<string[]>(['lodhi-photo-walk']);
  const joined = ['hk-boardgames'];
  const visibleEvents = useMemo(() => listEvents({ tag: activeTag }), [activeTag]);

  function toggleSaved(id: string) {
    setSaved((current) => toggleInList(current, id));
  }

  return {
    activeTag,
    city,
    eventTags,
    joined,
    saved,
    setActiveTag,
    toggleSaved,
    visibleEvents,
  };
}

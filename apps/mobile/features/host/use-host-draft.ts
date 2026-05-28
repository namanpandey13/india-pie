import { createHostDraft, hostTemplates } from '@hausy/api';
import type { HostVisibility } from '@hausy/types';
import { useMemo, useState } from 'react';

export function useHostDraft() {
  const [template, setTemplate] = useState(hostTemplates[0]);
  const [visibility, setVisibility] = useState<HostVisibility>('curated');
  const [title, setTitle] = useState('Khan Market coffee table for new operators');
  const [capacity, setCapacity] = useState('14');
  const draft = useMemo(
    () => createHostDraft({ template, visibility, title, capacity }),
    [capacity, template, title, visibility],
  );

  return {
    capacity,
    draft,
    setCapacity,
    setTemplate,
    setTitle,
    setVisibility,
    template,
    templates: hostTemplates,
    title,
    visibility,
  };
}

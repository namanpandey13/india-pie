import { createHostDraft, hostTemplates } from '@hausy/api';
import type { HostVisibility } from '@hausy/types';
import { useMemo } from 'react';
import { useAppStore } from '@/state/app-store';

export function useHostDraft() {
  const hostDraft = useAppStore((state) => state.hostDraft);
  const saveHostDraft = useAppStore((state) => state.saveHostDraft);
  const setHostDraft = useAppStore((state) => state.setHostDraft);
  const submitHostDraftForReview = useAppStore((state) => state.submitHostDraftForReview);
  const { capacity, template, title, visibility } = hostDraft;
  const draft = useMemo(
    () => createHostDraft({ template, visibility, title, capacity }).data,
    [capacity, template, title, visibility],
  );

  return {
    capacity,
    draft,
    hostDraft,
    saveHostDraft,
    submitHostDraftForReview,
    setCapacity: (next: string) => setHostDraft({ capacity: next }),
    setTemplate: (next: string) => setHostDraft({ template: next }),
    setTitle: (next: string) => setHostDraft({ title: next }),
    setVisibility: (next: HostVisibility) => setHostDraft({ visibility: next }),
    template,
    templates: hostTemplates,
    title,
    visibility,
  };
}

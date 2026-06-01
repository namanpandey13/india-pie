import { createHostDraft, listCreatorTemplates } from '@hausy/api';
import type { HostVisibility } from '@hausy/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/state/app-store';

export function useHostDraft() {
  const hostDraft = useAppStore((state) => state.hostDraft);
  const saveHostDraft = useAppStore((state) => state.saveHostDraft);
  const setHostDraft = useAppStore((state) => state.setHostDraft);
  const submitHostDraftForReview = useAppStore((state) => state.submitHostDraftForReview);
  const templatesQuery = useQuery({
    queryKey: ['creator-templates'],
    queryFn: listCreatorTemplates,
  });
  const { capacity, template, title, visibility } = hostDraft;
  const templates = templatesQuery.data?.data ?? [];

  useEffect(() => {
    if (!template && templates[0]) {
      setHostDraft({ template: templates[0] });
    }
  }, [setHostDraft, template, templates]);

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
    templates,
    title,
    visibility,
  };
}

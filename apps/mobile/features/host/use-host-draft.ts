import {
  changeHostEventStatus,
  createHostDraft,
  decideGuestRequest,
  listCreatorTemplates,
  listHostEventsAndRequests,
  publishHostEvent,
} from '@hausy/api';
import type { EventStatus, HostDraft, HostVisibility } from '@hausy/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/state/app-store';
import { supabase } from '@/lib/supabase';

export function useHostDraft() {
  const hostDraft = useAppStore((state) => state.hostDraft);
  const saveHostDraft = useAppStore((state) => state.saveHostDraft);
  const setHostDraft = useAppStore((state) => state.setHostDraft);
  const submitHostDraftForReview = useAppStore((state) => state.submitHostDraftForReview);
  const templatesQuery = useQuery({
    queryKey: ['creator-templates'],
    queryFn: listCreatorTemplates,
  });
  const hostDashboardQuery = useQuery({
    queryKey: ['host-dashboard'],
    queryFn: listHostEventsAndRequests,
  });
  const queryClient = useQueryClient();
  const publishMutation = useMutation({
    mutationFn: async (overrides?: Partial<HostDraft>) => {
      const publishDraft = { ...hostDraft, ...overrides };
      let coverImageUrl = publishDraft.coverImageUrl;

      if (coverImageUrl && !coverImageUrl.startsWith('http')) {
        if (!supabase) {
          throw new Error('Supabase is not configured for image uploads.');
        }
        const response = await fetch(coverImageUrl);
        const file = await response.arrayBuffer();
        const extension = coverImageUrl.split('.').pop()?.split('?')[0]?.toLowerCase() || 'jpg';
        const path = `${(await supabase.auth.getUser()).data.user?.id}/${Date.now()}.${extension}`;
        const upload = await supabase.storage.from('event-covers').upload(path, file, {
          contentType: extension === 'png' ? 'image/png' : 'image/jpeg',
          upsert: false,
        });
        if (upload.error) {
          throw upload.error;
        }
        coverImageUrl = supabase.storage.from('event-covers').getPublicUrl(path).data.publicUrl;
      }

      return publishHostEvent({ ...publishDraft, coverImageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
  const decisionMutation = useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: 'accepted' | 'declined' }) =>
      decideGuestRequest({ requestId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
  const statusMutation = useMutation({
    mutationFn: ({ eventId, status }: { eventId: string; status: Extract<EventStatus, 'planning' | 'confirmed' | 'cancelled'> }) =>
      changeHostEventStatus({ eventId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
  const { about, capacity, location, startsAt, template, title, vibe, visibility } = hostDraft;
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
    about,
    error: publishMutation.error instanceof Error
      ? { code: 'coverUploadFailed', message: publishMutation.error.message, retryable: true }
      : publishMutation.data?.error ?? hostDashboardQuery.data?.error ?? null,
    draft,
    events: hostDashboardQuery.data?.data?.events ?? [],
    hostDraft,
    isLoadingDashboard: hostDashboardQuery.isLoading,
    isPublishing: publishMutation.isPending,
    publishedEventId: publishMutation.data?.data?.id ?? null,
    location,
    publishHostDraft: (overrides?: Partial<HostDraft>) => publishMutation.mutate(overrides),
    requests: hostDashboardQuery.data?.data?.requests ?? [],
    reviewRequest: (requestId: string, status: 'accepted' | 'declined') => decisionMutation.mutate({ requestId, status }),
    saveHostDraft,
    submitHostDraftForReview,
    setAbout: (next: string) => setHostDraft({ about: next }),
    setCapacity: (next: string) => setHostDraft({ capacity: next }),
    setCoverImageUrl: (next: string) => setHostDraft({ coverImageUrl: next }),
    setEventStatus: (eventId: string, status: Extract<EventStatus, 'planning' | 'confirmed' | 'cancelled'>) =>
      statusMutation.mutate({ eventId, status }),
    setLocation: (next: string) => setHostDraft({ location: next }),
    setStartsAt: (next: string) => setHostDraft({ startsAt: next }),
    setTemplate: (next: string) => setHostDraft({ template: next }),
    setTitle: (next: string) => setHostDraft({ title: next }),
    setVibe: (next: string) => setHostDraft({ vibe: next }),
    setVisibility: (next: HostVisibility) => setHostDraft({ visibility: next }),
    startsAt,
    template,
    templates,
    title,
    vibe,
    visibility,
  };
}

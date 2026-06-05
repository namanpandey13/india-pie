import {
  changeHostEventStatus,
  createHostDraft,
  decideGuestRequest,
  listCreatorTemplates,
  listHostEventsAndRequests,
  publishHostEvent,
} from '@hausy/api';
import type { EventStatus, HostVisibility } from '@hausy/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  const hostDashboardQuery = useQuery({
    queryKey: ['host-dashboard'],
    queryFn: listHostEventsAndRequests,
  });
  const queryClient = useQueryClient();
  const publishMutation = useMutation({
    mutationFn: () => publishHostEvent(hostDraft),
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
    error: publishMutation.data?.error ?? hostDashboardQuery.data?.error ?? null,
    draft,
    events: hostDashboardQuery.data?.data?.events ?? [],
    hostDraft,
    isLoadingDashboard: hostDashboardQuery.isLoading,
    isPublishing: publishMutation.isPending,
    location,
    publishHostDraft: () => publishMutation.mutate(),
    requests: hostDashboardQuery.data?.data?.requests ?? [],
    reviewRequest: (requestId: string, status: 'accepted' | 'declined') => decisionMutation.mutate({ requestId, status }),
    saveHostDraft,
    submitHostDraftForReview,
    setAbout: (next: string) => setHostDraft({ about: next }),
    setCapacity: (next: string) => setHostDraft({ capacity: next }),
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

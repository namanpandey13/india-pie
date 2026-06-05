import { cancelRsvpRequest, createRsvpRequest, listMyRsvpRequests } from '@hausy/api';
import { logAppEvent } from '@hausy/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAppStore } from '@/state/app-store';

export function useRsvpRequest(eventId: string) {
  const draft = useAppStore((state) => state.rsvps[eventId]);
  const submitRsvp = useAppStore((state) => state.submitRsvp);
  const cancelRsvp = useAppStore((state) => state.cancelRsvp);
  const updateRsvpDraft = useAppStore((state) => state.updateRsvpDraft);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const rsvpsQuery = useQuery({
    queryKey: ['my-rsvps'],
    queryFn: listMyRsvpRequests,
  });
  const remoteRequest = (rsvpsQuery.data?.data ?? []).find((rsvp) => rsvp.eventId === eventId);
  const requested = Boolean(remoteRequest && remoteRequest.status !== 'cancelled' && remoteRequest.status !== 'declined') || draft?.status === 'requested';
  const requestMutation = useMutation({
    mutationFn: () =>
      createRsvpRequest({
        eventId,
        note: draft?.note || 'Interested in joining this plan.',
      }),
    onSuccess: (request) => {
      if (request.error) {
        setError(request.error.message);
        logAppEvent('error', 'rsvp.request', request.error);
        return;
      }

      setError(null);
      updateRsvpDraft(eventId, { requestId: request.data.id });
      submitRsvp(eventId);
      queryClient.invalidateQueries({ queryKey: ['plan-inbox-threads'] });
      queryClient.invalidateQueries({ queryKey: ['my-rsvps'] });
    },
    onError: (caughtError) => {
      logAppEvent('error', 'rsvp.request.unexpected', caughtError);
      setError('Could not send this RSVP request.');
    },
  });
  const cancelMutation = useMutation({
    mutationFn: () => (draft?.requestId ? cancelRsvpRequest(draft.requestId) : Promise.resolve(null)),
    onSettled: () => {
      cancelRsvp(eventId);
      queryClient.invalidateQueries({ queryKey: ['plan-inbox-threads'] });
      queryClient.invalidateQueries({ queryKey: ['my-rsvps'] });
    },
  });

  function requestToJoin() {
    requestMutation.mutate();
  }

  return {
    cancelRsvp: () => cancelMutation.mutate(),
    draft,
    error,
    requestToJoin,
    requested,
    status: remoteRequest?.status ?? draft?.status ?? 'draft',
    updateDraft: (patch: Parameters<typeof updateRsvpDraft>[1]) => updateRsvpDraft(eventId, patch),
  };
}

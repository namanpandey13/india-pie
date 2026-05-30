import { createRsvpRequest } from '@hausy/api';
import { logAppEvent } from '@hausy/utils';
import { useState } from 'react';
import { useAppStore } from '@/state/app-store';

export function useRsvpRequest(eventId: string) {
  const draft = useAppStore((state) => state.rsvps[eventId]);
  const submitRsvp = useAppStore((state) => state.submitRsvp);
  const cancelRsvp = useAppStore((state) => state.cancelRsvp);
  const updateRsvpDraft = useAppStore((state) => state.updateRsvpDraft);
  const [error, setError] = useState<string | null>(null);
  const requested = draft?.status === 'requested';

  function requestToJoin() {
    try {
      const request = createRsvpRequest({
        userId: 'current-user',
        eventId,
        note: draft?.note || 'Interested in joining this plan.',
      });

      if (request.error) {
        setError(request.error.message);
        logAppEvent('error', 'rsvp.request', request.error);
        return request;
      }

      setError(null);
      submitRsvp(eventId);
      return request;
    } catch (caughtError) {
      logAppEvent('error', 'rsvp.request.unexpected', caughtError);
      setError('Could not send this RSVP request.');
      return null;
    }
  }

  return {
    cancelRsvp: () => cancelRsvp(eventId),
    draft,
    error,
    requestToJoin,
    requested,
    updateDraft: (patch: Parameters<typeof updateRsvpDraft>[1]) => updateRsvpDraft(eventId, patch),
  };
}

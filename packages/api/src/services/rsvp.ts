import type { RsvpRequest } from '@hausy/types';
import { fail, ok } from '../result';

export function createRsvpRequest(input: Omit<RsvpRequest, 'id' | 'status'>) {
  try {
    return ok<RsvpRequest>({
      id: `rsvp-${input.userId}-${input.eventId}`,
      ...input,
      status: 'requested' as const,
    });
  } catch {
    return fail<RsvpRequest>('rsvp_failed', 'Could not send this RSVP request.', true);
  }
}

export function cancelRsvpRequest(id: string) {
  try {
    return ok<RsvpRequest>({
      id,
      eventId: '',
      userId: '',
      status: 'cancelled',
    });
  } catch {
    return fail<RsvpRequest>('rsvp_cancel_failed', 'Could not cancel this RSVP request.', true);
  }
}

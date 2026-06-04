import type { RsvpRequest } from '@hausy/types';
import { getApiClient, getAuthenticatedProfileId } from '../client';
import {
  type RsvpRequestRow,
  insertRsvpRequest,
  selectActiveRsvpsForEvent,
  updateRsvpRequestCancelled,
} from '../queries/rsvp';
import { fail, ok } from '../result';

export async function createRsvpRequest(input: Omit<RsvpRequest, 'id' | 'status' | 'userId'> & { userId?: string }) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<RsvpRequest>('auth_required', 'Sign in before requesting to join.', false);
  }

  try {
    const existing = await selectActiveRsvpsForEvent(client, profileId, input.eventId);

    if (existing.error) {
      return fail<RsvpRequest>('rsvp_failed', existing.error.message ?? 'Could not send this RSVP request.', true);
    }

    if (existing.data?.[0]) {
      return ok<RsvpRequest>(mapRsvp(existing.data[0]));
    }

    const { data, error } = await insertRsvpRequest(client, {
      eventId: input.eventId,
      note: input.note,
      profileId,
      sessionId: input.sessionId,
    });

    if (error || !data) {
      return fail<RsvpRequest>('rsvp_failed', error?.message ?? 'Could not send this RSVP request.', true);
    }

    return ok<RsvpRequest>(mapRsvp(data));
  } catch {
    return fail<RsvpRequest>('rsvp_failed', 'Could not send this RSVP request.', true);
  }
}

export async function cancelRsvpRequest(id: string) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<RsvpRequest>('auth_required', 'Sign in before cancelling this RSVP.', false);
  }

  try {
    const { data, error } = await updateRsvpRequestCancelled(client, profileId, id);

    if (error || !data) {
      return fail<RsvpRequest>('rsvp_cancel_failed', error?.message ?? 'Could not cancel this RSVP request.', true);
    }

    return ok<RsvpRequest>(mapRsvp(data));
  } catch {
    return fail<RsvpRequest>('rsvp_cancel_failed', 'Could not cancel this RSVP request.', true);
  }
}

function mapRsvp(row: RsvpRequestRow): RsvpRequest {
  return {
    id: row.id,
    eventId: row.event_id,
    note: row.note ?? undefined,
    sessionId: row.session_id ?? undefined,
    status:
      row.status === 'accepted' ||
      row.status === 'confirmed' ||
      row.status === 'waitlisted' ||
      row.status === 'declined' ||
      row.status === 'cancelled'
        ? row.status
        : 'requested',
    userId: row.profile_id,
  };
}

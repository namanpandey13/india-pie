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
    return fail<RsvpRequest>('authRequired', 'Sign in before requesting to join.', false);
  }

  try {
    const existing = await selectActiveRsvpsForEvent(client, profileId, input.eventId);

    if (existing.error) {
      return fail<RsvpRequest>('rsvpFailed', existing.error.message ?? 'Could not send this RSVP request.', true);
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
      return fail<RsvpRequest>('rsvpFailed', error?.message ?? 'Could not send this RSVP request.', true);
    }

    return ok<RsvpRequest>(mapRsvp(data));
  } catch {
    return fail<RsvpRequest>('rsvpFailed', 'Could not send this RSVP request.', true);
  }
}

export async function cancelRsvpRequest(id: string) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<RsvpRequest>('authRequired', 'Sign in before cancelling this RSVP.', false);
  }

  try {
    const { data, error } = await updateRsvpRequestCancelled(client, profileId, id);

    if (error || !data) {
      return fail<RsvpRequest>('rsvpCancelFailed', error?.message ?? 'Could not cancel this RSVP request.', true);
    }

    return ok<RsvpRequest>(mapRsvp(data));
  } catch {
    return fail<RsvpRequest>('rsvpCancelFailed', 'Could not cancel this RSVP request.', true);
  }
}

function mapRsvp(row: RsvpRequestRow): RsvpRequest {
  return {
    id: row.id,
    eventId: row.eventId,
    note: row.note ?? undefined,
    sessionId: row.sessionId ?? undefined,
    status:
      row.status === 'accepted' ||
      row.status === 'confirmed' ||
      row.status === 'waitlisted' ||
      row.status === 'declined' ||
      row.status === 'cancelled'
        ? row.status
        : 'requested',
    userId: row.profileId,
  };
}

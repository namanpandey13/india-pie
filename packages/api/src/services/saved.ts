import type { Event } from '@hausy/types';
import { getApiClient, getAuthenticatedProfileId } from '../client';
import { deleteSavedEvent, selectSavedEventsForProfile, upsertSavedEvent } from '../queries/saved';
import { fail, ok } from '../result';
import { getEventById } from './events';

export async function listSavedEvents() {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<Event[]>('auth_required', 'Sign in to see saved plans.', false);
  }

  try {
    const { data, error } = await selectSavedEventsForProfile(client, profileId);

    if (error) {
      return fail<Event[]>('saved_unavailable', error.message ?? 'Could not load saved plans.', true);
    }

    const events = await Promise.all((data ?? []).map((row) => getEventById(row.event_id)));
    return ok<Event[]>(events.map((event) => event.data).filter((event): event is Event => Boolean(event)));
  } catch {
    return fail<Event[]>('saved_unavailable', 'Could not load saved plans.', true);
  }
}

export async function toggleSavedEvent(eventId: string, saved = true) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail('auth_required', 'Sign in before saving plans.', false);
  }

  try {
    const { error } = saved ? await upsertSavedEvent(client, profileId, eventId) : await deleteSavedEvent(client, profileId, eventId);

    if (error) {
      return fail('saved_toggle_failed', error.message ?? 'Could not update this saved plan.', true);
    }

    return ok({ eventId, saved });
  } catch {
    return fail('saved_toggle_failed', 'Could not update this saved plan.', true);
  }
}

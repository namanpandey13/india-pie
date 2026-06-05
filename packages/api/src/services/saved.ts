import type { Event } from '@hausy/types';
import { getApiClient, getAuthenticatedProfileId } from '../client';
import { deleteSavedEvent, selectSavedEventsForProfile, upsertSavedEvent } from '../queries/saved';
import { fail, ok } from '../result';
import { getEventById } from './events';

export async function listSavedEvents() {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<Event[]>('authRequired', 'Sign in to see saved plans.', false);
  }

  try {
    const { data, error } = await selectSavedEventsForProfile(client, profileId);

    if (error) {
      return fail<Event[]>('savedUnavailable', error.message ?? 'Could not load saved plans.', true);
    }

    const events = await Promise.all((data ?? []).map((row) => getEventById(row.eventId)));
    return ok<Event[]>(events.map((event) => event.data).filter((event): event is Event => Boolean(event)));
  } catch {
    return fail<Event[]>('savedUnavailable', 'Could not load saved plans.', true);
  }
}

export async function toggleSavedEvent(eventId: string, saved = true) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail('authRequired', 'Sign in before saving plans.', false);
  }

  try {
    const { error } = saved ? await upsertSavedEvent(client, profileId, eventId) : await deleteSavedEvent(client, profileId, eventId);

    if (error) {
      return fail('savedToggleFailed', error.message ?? 'Could not update this saved plan.', true);
    }

    return ok({ eventId, saved });
  } catch {
    return fail('savedToggleFailed', 'Could not update this saved plan.', true);
  }
}

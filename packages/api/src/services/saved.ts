import type { Event } from '@hausy/types';
import { fail, ok } from '../result';

export function listSavedEvents() {
  try {
    return ok<Event[]>([]);
  } catch {
    return fail<Event[]>('saved_unavailable', 'Could not load saved plans.', true);
  }
}

export function toggleSavedEvent(eventId: string, saved = true) {
  try {
    return ok({ eventId, saved });
  } catch {
    return fail('saved_toggle_failed', 'Could not update this saved plan.', true);
  }
}

import type { HomeSummary } from '@hausy/types';
import { fail, ok } from '../result';

export function listHomeSummary() {
  try {
    return ok<HomeSummary>({
      creatorSpotlight: null,
      inboxUnreadCount: 0,
      savedCount: 0,
      upcomingRsvpCount: 0,
    });
  } catch {
    return fail<HomeSummary>('home_unavailable', 'Could not load home.', true);
  }
}

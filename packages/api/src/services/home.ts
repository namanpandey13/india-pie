import type { HomeSummary } from '@hausy/types';
import { getApiClient, getAuthenticatedProfileId } from '../client';
import { selectCreatorSpotlightIds } from '../queries/creators';
import { selectPlanInboxThreadIds } from '../queries/inbox';
import { selectActiveRsvpsForProfile } from '../queries/rsvp';
import { selectSavedEventsForProfile } from '../queries/saved';
import { fail, ok } from '../result';
import { getCreatorProfile } from './host';

export async function listHomeSummary() {
  const client = getApiClient();

  if (!client) {
    return fail<HomeSummary>('supabase_not_configured', 'Supabase is not configured for this build.', false);
  }

  try {
    const profileId = await getAuthenticatedProfileId();
    const spotlightResult = await selectCreatorSpotlightIds(client);
    const creatorId = spotlightResult.data?.[0]?.id;
    const creatorSpotlight = creatorId ? (await getCreatorProfile(creatorId)).data : null;

    if (!profileId) {
      return ok<HomeSummary>({
        creatorSpotlight,
        inboxUnreadCount: 0,
        savedCount: 0,
        upcomingRsvpCount: 0,
      });
    }

    const [savedResult, rsvpResult, inboxResult] = await Promise.all([
      selectSavedEventsForProfile(client, profileId),
      selectActiveRsvpsForProfile(client, profileId),
      selectPlanInboxThreadIds(client),
    ]);

    if (savedResult.error || rsvpResult.error || inboxResult.error) {
      return fail<HomeSummary>(
        'home_unavailable',
        savedResult.error?.message ?? rsvpResult.error?.message ?? inboxResult.error?.message ?? 'Could not load home.',
        true,
      );
    }

    return ok<HomeSummary>({
      creatorSpotlight,
      inboxUnreadCount: 0,
      savedCount: savedResult.data?.length ?? 0,
      upcomingRsvpCount: rsvpResult.data?.length ?? 0,
    });
  } catch {
    return fail<HomeSummary>('home_unavailable', 'Could not load home.', true);
  }
}

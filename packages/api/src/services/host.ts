import type {
  ApiResult,
  CreatorProfile,
  CreatorSubmission,
  EventStatus,
  HostDraft,
  HostEventSummary,
  HostGuestRequest,
  HostProfile,
  RsvpRequest,
} from '@hausy/types';
import { getApiClient, getAuthenticatedProfileId } from '../client';
import {
  selectActiveCreatorTemplates,
  selectCreatorById,
  selectCreatorByProfileId,
  selectCreatorCredentialsByCreatorId,
  selectCreatorLinksByCreatorId,
  upsertCreatorForProfile,
} from '../queries/creators';
import {
  insertEvent,
  insertEventPrompts,
  insertEventSession,
  insertEventTags,
  insertPlanInboxThread,
  insertVenue,
  selectEventsByCreatorId,
  updateEventStatusById,
} from '../queries/events';
import { insertNotification } from '../queries/notifications';
import { selectProfilesByIds, selectProfileById } from '../queries/profiles';
import { selectRsvpsForEventIds, updateRsvpStatusById } from '../queries/rsvp';
import { upsertTicket } from '../queries/tickets';
import { fail, ok } from '../result';
import {
  mapCreatorProfile,
  mapHostProfile,
} from './event-mappers';

export async function listCreatorTemplates() {
  const client = getApiClient();

  if (!client) {
    return fail<string[]>('supabaseNotConfigured', 'Supabase is not configured for this build.', false);
  }

  try {
    const { data, error } = await selectActiveCreatorTemplates(client);

    if (error) {
      return fail<string[]>('creatorTemplatesUnavailable', error.message ?? 'Could not load creator templates.', true);
    }

    return ok((data ?? []).map((template) => template.label));
  } catch {
    return fail<string[]>('creatorTemplatesUnavailable', 'Could not load creator templates.', true);
  }
}

export function createHostDraft(input: HostDraft): ApiResult<HostDraft & { id: string; status: 'draft' }> {
  try {
    return ok({
      id: `draft-${input.template.replace(/\s+/g, '-')}`,
      ...input,
      status: 'draft' as const,
    });
  } catch {
    return fail<HostDraft & { id: string; status: 'draft' }>('draftFailed', 'Could not create this creator draft.', true);
  }
}

export async function getHostProfile(hostId: string) {
  const client = getApiClient();

  if (!client) {
    return fail<HostProfile | null>('supabaseNotConfigured', 'Supabase is not configured for this build.', false);
  }

  try {
    const [{ data: creator, error }, linksResult, credentialsResult] = await Promise.all([
      selectCreatorById(client, hostId),
      selectCreatorLinksByCreatorId(client, hostId),
      selectCreatorCredentialsByCreatorId(client, hostId),
    ]);

    if (error || linksResult.error || credentialsResult.error) {
      return fail<HostProfile | null>(
        'creatorUnavailable',
        error?.message ?? linksResult.error?.message ?? credentialsResult.error?.message ?? 'Could not load this creator.',
        true,
      );
    }

    return ok<HostProfile | null>(creator ? mapHostProfile(creator, linksResult.data ?? [], credentialsResult.data ?? []) : null);
  } catch {
    return fail<HostProfile | null>('creatorUnavailable', 'Could not load this creator.', true);
  }
}

export async function getCreatorProfile(creatorId: string): Promise<ApiResult<CreatorProfile | null>> {
  const client = getApiClient();

  if (!client) {
    return fail<CreatorProfile | null>('supabaseNotConfigured', 'Supabase is not configured for this build.', false);
  }

  const [{ data: creator, error }, linksResult, credentialsResult] = await Promise.all([
    selectCreatorById(client, creatorId),
    selectCreatorLinksByCreatorId(client, creatorId),
    selectCreatorCredentialsByCreatorId(client, creatorId),
  ]);

  if (error || linksResult.error || credentialsResult.error || !creator) {
    return fail<CreatorProfile | null>('creatorUnavailable', error?.message ?? 'Could not load this creator.', true);
  }

  return ok<CreatorProfile | null>(mapCreatorProfile(creator, linksResult.data ?? [], credentialsResult.data ?? []));
}

export async function createCreatorSubmission(input: Omit<CreatorSubmission, 'id' | 'status'>) {
  try {
    return ok<CreatorSubmission>({
      ...input,
      id: `creator-submission-${Date.now()}`,
      status: 'draft',
    });
  } catch {
    return fail<CreatorSubmission>('creatorSubmissionFailed', 'Could not create this creator submission.', true);
  }
}

export async function submitCreatorEvent(input: CreatorSubmission) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<CreatorSubmission>('authRequired', 'Sign in before submitting a creator plan.', false);
  }

  try {
    return ok<CreatorSubmission>({
      ...input,
      status: 'inReview',
    });
  } catch {
    return fail<CreatorSubmission>('creatorSubmitFailed', 'Could not submit this creator plan.', true);
  }
}

export async function publishHostEvent(input: HostDraft) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<HostEventSummary>('authRequired', 'Sign in before posting a plan.', false);
  }

  try {
    const profileResult = await selectProfileById(client, profileId);
    const profile = profileResult.data;
    const creator = await ensureCreatorForProfile(client, profileId, profile?.displayName ?? 'Hausy host');

    if (!creator) {
      return fail<HostEventSummary>('hostUnavailable', 'Could not prepare your host profile.', true);
    }

    const capacity = Math.max(1, Number.parseInt(input.capacity, 10) || 12);
    const startsAt = input.startsAt?.trim() || defaultStartDate();
    const location = input.location?.trim() || profile?.city || 'Delhi NCR';
    const title = input.title.trim() || `${input.template || 'Hausy'} plan`;
    const venueResult = await insertVenue(client, {
      city: profile?.city || 'Delhi NCR',
      createdBy: profileId,
      locality: location,
      name: location,
    });

    if (venueResult.error || !venueResult.data) {
      return fail<HostEventSummary>('venueCreateFailed', venueResult.error?.message ?? 'Could not create venue.', true);
    }

    const eventResult = await insertEvent(client, {
      about: input.about?.trim() || 'A host-led Hausy plan with guest requests, tickets, and in-app announcements.',
      capacity,
      category: categoryForTemplate(input.template),
      creatorId: creator.id,
      imageUrl: defaultEventImage(input.template),
      posterText: title.toUpperCase(),
      priceLabel: 'Free',
      status: 'planning',
      title,
      venueId: venueResult.data.id,
      vibe: input.vibe?.trim() || `${input.visibility} guest list, hosted on Hausy.`,
    });

    if (eventResult.error || !eventResult.data) {
      return fail<HostEventSummary>('eventCreateFailed', eventResult.error?.message ?? 'Could not post this plan.', true);
    }

    await Promise.all([
      insertEventSession(client, { capacity, eventId: eventResult.data.id, startsAt }),
      insertEventTags(client, eventResult.data.id, [input.visibility, input.template || 'hosted'].filter(Boolean)),
      insertEventPrompts(client, eventResult.data.id, [
        'What brings you to this plan?',
        'Are you coming solo or with someone?',
        'What would make this worth leaving home for?',
      ]),
    ]);

    const threadResult = await insertPlanInboxThread(client, {
      eventId: eventResult.data.id,
      title: `${title} plan updates`,
    });

    return ok<HostEventSummary>({
      id: eventResult.data.id,
      acceptedCount: 0,
      capacity,
      requestCount: 0,
      status: 'planning',
      threadId: threadResult.data?.id ?? null,
      title,
    });
  } catch {
    return fail<HostEventSummary>('eventCreateFailed', 'Could not post this plan.', true);
  }
}

export async function listHostEventsAndRequests() {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<{ events: HostEventSummary[]; requests: HostGuestRequest[] }>('authRequired', 'Sign in as a host.', false);
  }

  try {
    const creatorResult = await selectCreatorByProfileId(client, profileId);
    const creator = creatorResult.data;

    if (!creator) {
      return ok({ events: [], requests: [] });
    }

    const eventsResult = await selectEventsByCreatorId(client, creator.id);

    if (eventsResult.error) {
      return fail<{ events: HostEventSummary[]; requests: HostGuestRequest[] }>(
        'hostEventsUnavailable',
        eventsResult.error.message ?? 'Could not load your hosted plans.',
        true,
      );
    }

    const events = eventsResult.data ?? [];
    const rsvpsResult = events.length ? await selectRsvpsForEventIds(client, events.map((event) => event.id)) : { data: [], error: null };

    if (rsvpsResult.error) {
      return fail<{ events: HostEventSummary[]; requests: HostGuestRequest[] }>(
        'hostRequestsUnavailable',
        rsvpsResult.error.message ?? 'Could not load guest requests.',
        true,
      );
    }

    const rsvps = rsvpsResult.data ?? [];
    const profilesResult = rsvps.length ? await selectProfilesByIds(client, unique(rsvps.map((rsvp) => rsvp.profileId))) : { data: [], error: null };
    const profilesById = new Map((profilesResult.data ?? []).map((profile) => [profile.id, profile]));
    const eventTitles = new Map(events.map((event) => [event.id, event.title]));

    return ok({
      events: events.map((event) => ({
        id: event.id,
        acceptedCount: rsvps.filter((rsvp) => rsvp.eventId === event.id && ['accepted', 'confirmed'].includes(rsvp.status)).length,
        capacity: event.capacity,
        requestCount: rsvps.filter((rsvp) => rsvp.eventId === event.id).length,
        status: normalizeEventStatus(event.status),
        threadId: null,
        title: event.title,
      })),
      requests: rsvps.map((rsvp) => mapHostRequest(rsvp, profilesById.get(rsvp.profileId), eventTitles.get(rsvp.eventId) ?? 'Hausy plan')),
    });
  } catch {
    return fail<{ events: HostEventSummary[]; requests: HostGuestRequest[] }>('hostEventsUnavailable', 'Could not load host dashboard.', true);
  }
}

export async function decideGuestRequest(input: { requestId: string; status: 'accepted' | 'declined' }) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<RsvpRequest>('authRequired', 'Sign in as a host before reviewing requests.', false);
  }

  try {
    const { data, error } = await updateRsvpStatusById(client, input.requestId, input.status);

    if (error || !data) {
      return fail<RsvpRequest>('requestDecisionFailed', error?.message ?? 'Could not update this request.', true);
    }

    if (input.status === 'accepted') {
      const ticket = await upsertTicket(client, {
        eventId: data.eventId,
        profileId: data.profileId,
        rsvpRequestId: data.id,
        ticketCode: ticketCode(data.eventId, data.profileId),
      });

      await insertNotification(client, {
        actorId: profileId,
        body: ticket.data ? `Your ticket code is ${ticket.data.ticketCode}.` : 'Your entry request was approved.',
        eventId: data.eventId,
        kind: ticket.data ? 'ticketIssued' : 'rsvpAccepted',
        profileId: data.profileId,
        title: 'Entry approved',
      });
    } else {
      await insertNotification(client, {
        actorId: profileId,
        body: 'This host did not approve your request. You can still request other public plans.',
        eventId: data.eventId,
        kind: 'rsvpDeclined',
        profileId: data.profileId,
        title: 'Request not approved',
      });
    }

    return ok<RsvpRequest>(mapRsvp(data));
  } catch {
    return fail<RsvpRequest>('requestDecisionFailed', 'Could not update this request.', true);
  }
}

export async function changeHostEventStatus(input: { eventId: string; status: Extract<EventStatus, 'planning' | 'confirmed' | 'cancelled'> }) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<HostEventSummary>('authRequired', 'Sign in as a host before changing plan status.', false);
  }

  try {
    const { data, error } = await updateEventStatusById(client, input.eventId, input.status);

    if (error || !data) {
      return fail<HostEventSummary>('eventStatusFailed', error?.message ?? 'Could not update plan status.', true);
    }

    const rsvps = await selectRsvpsForEventIds(client, [input.eventId]);
    await Promise.all(
      (rsvps.data ?? [])
        .filter((rsvp) => ['requested', 'accepted', 'confirmed', 'waitlisted'].includes(rsvp.status))
        .map((rsvp) =>
          insertNotification(client, {
            actorId: profileId,
            body:
              input.status === 'confirmed'
                ? `${data.title} is confirmed. Check Chat for announcements and ticket details.`
                : input.status === 'cancelled'
                  ? `${data.title} was cancelled by the host.`
                  : `${data.title} is back in planning.`,
            eventId: data.id,
            kind: input.status === 'confirmed' ? 'eventConfirmed' : input.status === 'cancelled' ? 'eventCancelled' : 'announcement',
            profileId: rsvp.profileId,
            title: input.status === 'confirmed' ? 'Event confirmed' : input.status === 'cancelled' ? 'Event cancelled' : 'Event update',
          }),
        ),
    );

    return ok({
      id: data.id,
      acceptedCount: 0,
      capacity: data.capacity,
      requestCount: 0,
      status: normalizeEventStatus(data.status),
      threadId: null,
      title: data.title,
    });
  } catch {
    return fail<HostEventSummary>('eventStatusFailed', 'Could not update plan status.', true);
  }
}

async function ensureCreatorForProfile(client: NonNullable<ReturnType<typeof getApiClient>>, profileId: string, displayName: string) {
  const existing = await selectCreatorByProfileId(client, profileId);

  if (existing.data) {
    return existing.data;
  }

  const created = await upsertCreatorForProfile(client, {
    bio: 'Hosts offline plans on Hausy.',
    displayName,
    handle: handleFor(displayName, profileId),
    profileId,
    title: 'Hausy host',
  });

  return created.data ?? null;
}

function mapHostRequest(
  row: { id: string; eventId: string; note: string | null; profileId: string; sessionId: string | null; status: string },
  profile: { bio: string | null; city: string; displayName: string | null; instagram: string | null; linkedin: string | null } | undefined,
  eventTitle: string,
): HostGuestRequest {
  const name = profile?.displayName ?? 'Hausy guest';

  return {
    id: row.id,
    eventId: row.eventId,
    eventTitle,
    guestBio: profile?.bio ?? undefined,
    guestCity: profile?.city,
    guestInitials: initialsFor(name),
    guestInstagram: profile?.instagram ?? undefined,
    guestLinkedin: profile?.linkedin ?? undefined,
    guestName: name,
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

function mapRsvp(row: { id: string; eventId: string; note: string | null; profileId: string; sessionId: string | null; status: string }): RsvpRequest {
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

function normalizeEventStatus(status: string): EventStatus {
  return status === 'draft' || status === 'inReview' || status === 'confirmed' || status === 'cancelled' || status === 'completed'
    ? status
    : 'planning';
}

function categoryForTemplate(template: string) {
  const normalized = template.toLowerCase();
  if (normalized.includes('coffee')) return 'coffee';
  if (normalized.includes('builder') || normalized.includes('founder')) return 'founders';
  if (normalized.includes('music') || normalized.includes('listening')) return 'music';
  if (normalized.includes('sport')) return 'sports';
  return 'culture';
}

function defaultEventImage(template: string) {
  return template.toLowerCase().includes('dinner')
    ? 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80'
    : 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80';
}

function defaultStartDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  date.setHours(19, 30, 0, 0);
  return date.toISOString();
}

function handleFor(name: string, profileId: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'hausy-host';
  return `${slug}-${profileId.slice(0, 6)}`;
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function ticketCode(eventId: string, profileId: string) {
  return `HAUSY-${eventId.slice(0, 4).toUpperCase()}-${profileId.slice(0, 4).toUpperCase()}`;
}

function unique(values: string[]) {
  return [...new Set(values)];
}

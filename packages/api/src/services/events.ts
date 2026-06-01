import type { Event } from '@hausy/types';
import { getApiClient } from '../client';
import { selectActiveDiscoveryMarkets, selectActiveDiscoveryTags } from '../queries/discovery';
import {
  selectCreatorCredentialsByCreatorIds,
  selectCreatorLinksByCreatorIds,
  selectCreatorsByIds,
  selectEventAttendeePreviewsByEventIds,
  selectEventCheckpointsByEventIds,
  selectEventPromptsByEventIds,
  selectEventSessionsByEventIds,
  selectEventTagsByEventIds,
  selectPublicEventById,
  selectPublicEvents,
  selectVenuesByIds,
} from '../queries/events';
import { fail, ok } from '../result';
import {
  type EventRow,
  type EventSessionRow,
  mapEventRow,
} from './event-mappers';

export type EventFilters = {
  tag?: string;
  query?: string;
};

export type DiscoveryMetadata = {
  city: string | null;
  eventTags: string[];
};

export async function listDiscoveryMetadata() {
  const client = getApiClient();

  if (!client) {
    return fail<DiscoveryMetadata>('supabase_not_configured', 'Supabase is not configured for this build.', false);
  }

  try {
    const [marketsResult, tagsResult] = await Promise.all([
      selectActiveDiscoveryMarkets(client),
      selectActiveDiscoveryTags(client),
    ]);

    if (marketsResult.error || tagsResult.error) {
      return fail<DiscoveryMetadata>(
        'discovery_metadata_unavailable',
        marketsResult.error?.message ?? tagsResult.error?.message ?? 'Could not load discovery metadata.',
        true,
      );
    }

    return ok<DiscoveryMetadata>({
      city: marketsResult.data?.[0]?.label ?? null,
      eventTags: (tagsResult.data ?? []).map((tag) => tag.label),
    });
  } catch {
    return fail<DiscoveryMetadata>('discovery_metadata_unavailable', 'Could not load discovery metadata.', true);
  }
}

export async function listEvents(filters: EventFilters = {}) {
  const client = getApiClient();

  if (!client) {
    return fail<Event[]>('supabase_not_configured', 'Supabase is not configured for this build.', false);
  }

  try {
    const { data, error } = await selectPublicEvents(client);

    if (error) {
      return fail<Event[]>('events_unavailable', error.message ?? 'Could not load events.', true);
    }

    const events = data ?? [];
    const mappedEvents = await hydrateEvents(events);
    return ok(applyEventFilters(mappedEvents, filters));
  } catch {
    return fail<Event[]>('events_unavailable', 'Could not load events.', true);
  }
}

export async function getEventById(id?: string) {
  const client = getApiClient();

  if (!id) {
    return ok<Event | null>(null);
  }

  if (!client) {
    return fail<Event | null>('supabase_not_configured', 'Supabase is not configured for this build.', false);
  }

  try {
    const { data, error } = await selectPublicEventById(client, id);

    if (error) {
      return fail<Event | null>('event_unavailable', error.message ?? 'Could not load this event.', true);
    }

    if (!data) {
      return ok<Event | null>(null);
    }

    const [event] = await hydrateEvents([data]);
    return ok<Event | null>(event ?? null);
  } catch {
    return fail<Event | null>('event_unavailable', 'Could not load this event.', true);
  }
}

async function hydrateEvents(events: EventRow[]) {
  const client = getApiClient();

  if (!client || events.length === 0) {
    return [];
  }

  const creatorIds = unique(events.map((event) => event.creator_id));
  const venueIds = unique(events.map((event) => event.venue_id));
  const eventIds = unique(events.map((event) => event.id));

  const [creatorsResult, venuesResult, sessionsResult, checkpointsResult, tagsResult, promptsResult, attendeesResult] =
    await Promise.all([
      selectCreatorsByIds(client, creatorIds),
      selectVenuesByIds(client, venueIds),
      selectEventSessionsByEventIds(client, eventIds),
      selectEventCheckpointsByEventIds(client, eventIds),
      selectEventTagsByEventIds(client, eventIds),
      selectEventPromptsByEventIds(client, eventIds),
      selectEventAttendeePreviewsByEventIds(client, eventIds),
    ]);

  const firstError =
    creatorsResult.error ??
    venuesResult.error ??
    sessionsResult.error ??
    checkpointsResult.error ??
    tagsResult.error ??
    promptsResult.error ??
    attendeesResult.error;

  if (firstError) {
    throw new Error(firstError.message ?? 'Could not hydrate event records.');
  }

  const creatorLinksResult = await selectCreatorLinksByCreatorIds(client, creatorIds);
  const creatorCredentialsResult = await selectCreatorCredentialsByCreatorIds(client, creatorIds);

  if (creatorLinksResult.error || creatorCredentialsResult.error) {
    throw new Error(creatorLinksResult.error?.message ?? creatorCredentialsResult.error?.message ?? 'Could not load creators.');
  }

  const creatorsById = byId(creatorsResult.data ?? []);
  const venuesById = byId(venuesResult.data ?? []);

  return events
    .map((event) => {
      const creator = creatorsById.get(event.creator_id);
      const venue = venuesById.get(event.venue_id);

      if (!creator || !venue) {
        return null;
      }

      return mapEventRow({
        attendeePreviews: byEventId(attendeesResult.data ?? [], event.id),
        checkpoints: byEventId(checkpointsResult.data ?? [], event.id),
        creator,
        creatorCredentials: byCreatorId(creatorCredentialsResult.data ?? [], event.creator_id),
        creatorLinks: byCreatorId(creatorLinksResult.data ?? [], event.creator_id),
        event,
        prompts: byEventId(promptsResult.data ?? [], event.id),
        session: firstSessionByEventId(sessionsResult.data ?? [], event.id),
        tags: byEventId(tagsResult.data ?? [], event.id),
        venue,
      });
    })
    .filter((event): event is Event => Boolean(event));
}

function applyEventFilters(events: Event[], filters: EventFilters) {
  const normalizedTag = filters.tag?.trim().toLowerCase();
  const normalizedQuery = filters.query?.trim().toLowerCase();

  return events.filter((event) => {
    const matchesTag =
      !normalizedTag ||
      normalizedTag === 'all' ||
      normalizedTag === 'for you' ||
      event.tags.some((tag) => tag.toLowerCase() === normalizedTag) ||
      event.category.toLowerCase() === normalizedTag ||
      event.dateLabel.toLowerCase() === normalizedTag;
    const matchesQuery =
      !normalizedQuery ||
      [event.title, event.locality, event.venue.name, event.venue.locality, event.vibe, event.organizer.name]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesTag && matchesQuery;
  });
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function byId<T extends { id: string }>(rows: T[]) {
  return new Map(rows.map((row) => [row.id, row]));
}

function byEventId<T extends { event_id: string }>(rows: T[], eventId: string) {
  return rows.filter((row) => row.event_id === eventId);
}

function byCreatorId<T extends { creator_id: string }>(rows: T[], creatorId: string) {
  return rows.filter((row) => row.creator_id === creatorId);
}

function firstSessionByEventId(rows: EventSessionRow[], eventId: string) {
  return rows
    .filter((row) => row.event_id === eventId)
    .sort((left, right) => new Date(left.starts_at).getTime() - new Date(right.starts_at).getTime())[0] ?? null;
}

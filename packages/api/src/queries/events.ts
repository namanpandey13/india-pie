import type { HausyApiClient } from '../client';
import type {
  CreatorCredentialRow,
  CreatorLinkRow,
  CreatorRow,
  EventAttendeePreviewRow,
  EventCheckpointRow,
  EventPromptRow,
  EventRow,
  EventSessionRow,
  EventTagRow,
  ProfileAvatarRow,
  VenueRow,
} from '../services/event-mappers';

const PUBLIC_EVENT_STATUSES = ['planning', 'confirmed'] as const;
const EVENT_SELECT = 'id,seriesKey,occurrenceNumber,creatorId,venueId,title,category,imageUrl,posterText,priceLabel,vibe,about,capacity,status';
const CREATOR_SELECT =
  'id,profileId,handle,displayName,title,bio,philosophy,communityTone,rating,repeatRate,pastEvents,recurringAttendees,status';

export function selectPublicEvents(client: HausyApiClient) {
  return client
    .from<EventRow[]>('events')
    .select(EVENT_SELECT)
    .in('status', PUBLIC_EVENT_STATUSES)
    .order('occurrenceNumber', { ascending: false })
    .order('createdAt', { ascending: false });
}

export function selectPublicEventById(client: HausyApiClient, id: string) {
  return client.from<EventRow>('events').select(EVENT_SELECT).eq('id', id).in('status', PUBLIC_EVENT_STATUSES).maybeSingle();
}

export function selectCreatorsByIds(client: HausyApiClient, creatorIds: string[]) {
  return client.from<CreatorRow[]>('creators').select(CREATOR_SELECT).in('id', creatorIds);
}

export function selectProfileAvatarsByIds(client: HausyApiClient, profileIds: string[]) {
  return client.from<ProfileAvatarRow[]>('profiles').select('id,avatarUrl').in('id', profileIds);
}

export function selectVenuesByIds(client: HausyApiClient, venueIds: string[]) {
  return client.from<VenueRow[]>('venues').select('id,name,locality,city,status').in('id', venueIds);
}

export function selectEventSessionsByEventIds(client: HausyApiClient, eventIds: string[]) {
  return client.from<EventSessionRow[]>('eventSessions').select('id,eventId,startsAt,capacity').in('eventId', eventIds);
}

export function selectEventCheckpointsByEventIds(client: HausyApiClient, eventIds: string[]) {
  return client.from<EventCheckpointRow[]>('eventCheckpoints').select('id,eventId,kind,label,verifiedAt').in('eventId', eventIds);
}

export function selectEventTagsByEventIds(client: HausyApiClient, eventIds: string[]) {
  return client.from<EventTagRow[]>('eventTags').select('eventId,tag').in('eventId', eventIds);
}

export function selectEventPromptsByEventIds(client: HausyApiClient, eventIds: string[]) {
  return client.from<EventPromptRow[]>('eventPrompts').select('eventId,prompt').in('eventId', eventIds);
}

export function selectEventAttendeePreviewsByEventIds(client: HausyApiClient, eventIds: string[]) {
  return client
    .from<EventAttendeePreviewRow[]>('eventAttendeePreviews')
    .select('id,eventId,avatarUrl,displayName,role,signal,status,initials,accent')
    .in('eventId', eventIds);
}

export function selectCreatorLinksByCreatorIds(client: HausyApiClient, creatorIds: string[]) {
  return client.from<CreatorLinkRow[]>('creatorLinks').select('creatorId,label').in('creatorId', creatorIds);
}

export function selectCreatorCredentialsByCreatorIds(client: HausyApiClient, creatorIds: string[]) {
  return client.from<CreatorCredentialRow[]>('creatorCredentials').select('creatorId,label').in('creatorId', creatorIds);
}

export type VenueInsertRow = {
  id: string;
};

export type EventInsertRow = {
  id: string;
  creatorId: string;
  status: string;
  title: string;
};

export type PlanThreadInsertRow = {
  id: string;
  eventId: string | null;
  title: string;
};

export function insertVenue(client: HausyApiClient, input: {
  city: string;
  createdBy: string;
  locality: string;
  name: string;
}) {
  return client
    .from<VenueInsertRow>('venues')
    .insert({
      addressLine: input.locality,
      city: input.city,
      createdBy: input.createdBy,
      locality: input.locality,
      name: input.name,
      status: 'unverified',
    })
    .select('id')
    .single();
}

export function insertEvent(client: HausyApiClient, input: {
  about: string;
  capacity: number;
  category: string;
  creatorId: string;
  imageUrl: string;
  occurrenceNumber?: number;
  posterText: string;
  priceLabel: string;
  status: string;
  title: string;
  seriesKey?: string;
  venueId: string;
  vibe: string;
}) {
  return client
    .from<EventInsertRow>('events')
    .insert({
      ...input,
      occurrenceNumber: input.occurrenceNumber ?? 1,
      seriesKey: input.seriesKey ?? input.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    })
    .select('id,creatorId,status,title')
    .single();
}

export function insertEventSession(client: HausyApiClient, input: {
  capacity: number;
  eventId: string;
  startsAt: string;
}) {
  return client
    .from<EventSessionRow>('eventSessions')
    .insert(input)
    .select('id,eventId,startsAt,capacity')
    .single();
}

export function insertEventPrompts(client: HausyApiClient, eventId: string, prompts: string[]) {
  return client.from('eventPrompts').insert(prompts.map((prompt, index) => ({ eventId, position: index + 1, prompt })));
}

export function insertEventTags(client: HausyApiClient, eventId: string, tags: string[]) {
  return client.from('eventTags').insert(tags.map((tag) => ({ eventId, tag })));
}

export function insertPlanInboxThread(client: HausyApiClient, input: {
  eventId: string;
  title: string;
}) {
  return client.from<PlanThreadInsertRow>('planInboxThreads').insert(input).select('id,eventId,title').single();
}

export function selectEventsByCreatorId(client: HausyApiClient, creatorId: string) {
  return client.from<EventRow[]>('events').select(EVENT_SELECT).eq('creatorId', creatorId).order('createdAt', { ascending: false });
}

export function updateEventStatusById(client: HausyApiClient, eventId: string, status: string) {
  return client.from<EventRow>('events').update({ status }).eq('id', eventId).select(EVENT_SELECT).single();
}

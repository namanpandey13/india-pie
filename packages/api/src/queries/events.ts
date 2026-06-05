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
  VenueRow,
} from '../services/event-mappers';

const PUBLIC_EVENT_STATUSES = ['planning', 'confirmed'] as const;
const EVENT_SELECT = 'id,creatorId,venueId,title,category,imageUrl,posterText,priceLabel,vibe,about,capacity,status';
const CREATOR_SELECT =
  'id,profileId,handle,displayName,title,bio,philosophy,communityTone,rating,repeatRate,pastEvents,recurringAttendees,status';

export function selectPublicEvents(client: HausyApiClient) {
  return client
    .from<EventRow[]>('events')
    .select(EVENT_SELECT)
    .in('status', PUBLIC_EVENT_STATUSES)
    .order('createdAt', { ascending: false });
}

export function selectPublicEventById(client: HausyApiClient, id: string) {
  return client.from<EventRow>('events').select(EVENT_SELECT).eq('id', id).in('status', PUBLIC_EVENT_STATUSES).maybeSingle();
}

export function selectCreatorsByIds(client: HausyApiClient, creatorIds: string[]) {
  return client.from<CreatorRow[]>('creators').select(CREATOR_SELECT).in('id', creatorIds);
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
    .select('id,eventId,displayName,role,signal,status,initials,accent')
    .in('eventId', eventIds);
}

export function selectCreatorLinksByCreatorIds(client: HausyApiClient, creatorIds: string[]) {
  return client.from<CreatorLinkRow[]>('creatorLinks').select('creatorId,label').in('creatorId', creatorIds);
}

export function selectCreatorCredentialsByCreatorIds(client: HausyApiClient, creatorIds: string[]) {
  return client.from<CreatorCredentialRow[]>('creatorCredentials').select('creatorId,label').in('creatorId', creatorIds);
}

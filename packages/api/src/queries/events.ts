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
const EVENT_SELECT = 'id,creator_id,venue_id,title,category,image_url,poster_text,price_label,vibe,about,capacity,status';
const CREATOR_SELECT =
  'id,profile_id,handle,display_name,title,bio,philosophy,community_tone,rating,repeat_rate,past_events,recurring_attendees,status';

export function selectPublicEvents(client: HausyApiClient) {
  return client
    .from<EventRow[]>('events')
    .select(EVENT_SELECT)
    .in('status', PUBLIC_EVENT_STATUSES)
    .order('created_at', { ascending: false });
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
  return client.from<EventSessionRow[]>('event_sessions').select('id,event_id,starts_at,capacity').in('event_id', eventIds);
}

export function selectEventCheckpointsByEventIds(client: HausyApiClient, eventIds: string[]) {
  return client.from<EventCheckpointRow[]>('event_checkpoints').select('id,event_id,kind,label,verified_at').in('event_id', eventIds);
}

export function selectEventTagsByEventIds(client: HausyApiClient, eventIds: string[]) {
  return client.from<EventTagRow[]>('event_tags').select('event_id,tag').in('event_id', eventIds);
}

export function selectEventPromptsByEventIds(client: HausyApiClient, eventIds: string[]) {
  return client.from<EventPromptRow[]>('event_prompts').select('event_id,prompt').in('event_id', eventIds);
}

export function selectEventAttendeePreviewsByEventIds(client: HausyApiClient, eventIds: string[]) {
  return client
    .from<EventAttendeePreviewRow[]>('event_attendee_previews')
    .select('id,event_id,display_name,role,signal,status,initials,accent')
    .in('event_id', eventIds);
}

export function selectCreatorLinksByCreatorIds(client: HausyApiClient, creatorIds: string[]) {
  return client.from<CreatorLinkRow[]>('creator_links').select('creator_id,label').in('creator_id', creatorIds);
}

export function selectCreatorCredentialsByCreatorIds(client: HausyApiClient, creatorIds: string[]) {
  return client.from<CreatorCredentialRow[]>('creator_credentials').select('creator_id,label').in('creator_id', creatorIds);
}

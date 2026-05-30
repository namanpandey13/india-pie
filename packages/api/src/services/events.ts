import type { Event } from '@hausy/types';
import { fail, ok } from '../result';

export type EventFilters = {
  tag?: string;
  query?: string;
};

export const city = 'Delhi NCR';
export const eventTags = ['all', 'free', 'today', 'curated', 'creator-led', 'friends going'];

export function listEvents(filters: EventFilters = {}) {
  try {
    void filters;
    return ok<Event[]>([]);
  } catch {
    return fail<Event[]>('events_unavailable', 'Could not load events.', true);
  }
}

export function getEventById(id?: string) {
  try {
    void id;
    return ok<Event | null>(null);
  } catch {
    return fail<Event | null>('event_unavailable', 'Could not load this event.', true);
  }
}

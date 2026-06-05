import type { EventTicket } from '@hausy/types';
import { getApiClient, getAuthenticatedProfileId } from '../client';
import { selectPublicEventById } from '../queries/events';
import { type EventTicketRow, selectTicketsForProfile } from '../queries/tickets';
import { fail, ok } from '../result';

export async function listMyTickets() {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<EventTicket[]>('authRequired', 'Sign in to view tickets.', false);
  }

  try {
    const { data, error } = await selectTicketsForProfile(client, profileId);

    if (error) {
      return fail<EventTicket[]>('ticketsUnavailable', error.message ?? 'Could not load tickets.', true);
    }

    const tickets = await Promise.all((data ?? []).map((ticket) => mapTicket(client, ticket)));
    return ok<EventTicket[]>(tickets);
  } catch {
    return fail<EventTicket[]>('ticketsUnavailable', 'Could not load tickets.', true);
  }
}

async function mapTicket(client: NonNullable<ReturnType<typeof getApiClient>>, row: EventTicketRow): Promise<EventTicket> {
  const eventResult = await selectPublicEventById(client, row.eventId);

  return {
    id: row.id,
    eventId: row.eventId,
    eventTitle: eventResult.data?.title ?? 'Hausy plan',
    issuedAt: row.issuedAt,
    status: row.status,
    ticketCode: row.ticketCode,
  };
}

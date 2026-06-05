import type { HausyApiClient } from '../client';

export type EventTicketRow = {
  id: string;
  eventId: string;
  profileId: string;
  rsvpRequestId: string;
  ticketCode: string;
  status: 'active' | 'cancelled' | 'used';
  issuedAt: string;
};

const TICKET_SELECT = 'id,eventId,profileId,rsvpRequestId,ticketCode,status,issuedAt';

export function selectTicketsForProfile(client: HausyApiClient, profileId: string) {
  return client
    .from<EventTicketRow[]>('eventTickets')
    .select(TICKET_SELECT)
    .eq('profileId', profileId)
    .order('issuedAt', { ascending: false });
}

export function upsertTicket(client: HausyApiClient, input: {
  eventId: string;
  profileId: string;
  rsvpRequestId: string;
  ticketCode: string;
}) {
  return client
    .from<EventTicketRow>('eventTickets')
    .upsert(
      {
        eventId: input.eventId,
        profileId: input.profileId,
        rsvpRequestId: input.rsvpRequestId,
        status: 'active',
        ticketCode: input.ticketCode,
      },
      { onConflict: 'rsvpRequestId' },
    )
    .select(TICKET_SELECT)
    .single();
}

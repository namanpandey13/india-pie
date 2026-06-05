import type { AppNotification } from '@hausy/types';
import { getApiClient, getAuthenticatedProfileId } from '../client';
import { type NotificationRow, selectNotificationsForProfile } from '../queries/notifications';
import { fail, ok } from '../result';

export async function listNotifications() {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<AppNotification[]>('authRequired', 'Sign in to view notifications.', false);
  }

  try {
    const { data, error } = await selectNotificationsForProfile(client, profileId);

    if (error) {
      return fail<AppNotification[]>('notificationsUnavailable', error.message ?? 'Could not load notifications.', true);
    }

    return ok<AppNotification[]>((data ?? []).map(mapNotification));
  } catch {
    return fail<AppNotification[]>('notificationsUnavailable', 'Could not load notifications.', true);
  }
}

function mapNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    body: row.body,
    createdAt: row.createdAt,
    eventId: row.eventId,
    kind:
      row.kind === 'rsvpAccepted' ||
      row.kind === 'rsvpDeclined' ||
      row.kind === 'eventConfirmed' ||
      row.kind === 'eventCancelled' ||
      row.kind === 'announcement' ||
      row.kind === 'ticketIssued'
        ? row.kind
        : 'announcement',
    readAt: row.readAt,
    title: row.title,
  };
}

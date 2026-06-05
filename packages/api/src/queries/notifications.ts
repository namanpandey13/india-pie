import type { HausyApiClient } from '../client';

export type NotificationRow = {
  id: string;
  profileId: string;
  eventId: string | null;
  actorId: string | null;
  kind: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
};

const NOTIFICATION_SELECT = 'id,profileId,eventId,actorId,kind,title,body,readAt,createdAt';

export function selectNotificationsForProfile(client: HausyApiClient, profileId: string) {
  return client
    .from<NotificationRow[]>('appNotifications')
    .select(NOTIFICATION_SELECT)
    .eq('profileId', profileId)
    .order('createdAt', { ascending: false });
}

export function insertNotification(client: HausyApiClient, input: {
  actorId: string;
  body: string;
  eventId: string;
  kind: string;
  profileId: string;
  title: string;
}) {
  return client.from<NotificationRow>('appNotifications').insert(input).select(NOTIFICATION_SELECT).single();
}

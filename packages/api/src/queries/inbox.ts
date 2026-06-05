import type { HausyApiClient } from '../client';

export type ThreadRow = {
  id: string;
  eventId: string | null;
  title: string;
  status: 'open' | 'archived';
};

export type MessageRow = {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  createdAt: string;
  kind: 'hostUpdate' | 'rsvpStatus' | 'message';
};

export function selectPlanInboxThreads(client: HausyApiClient) {
  return client.from<ThreadRow[]>('planInboxThreads').select('id,eventId,title,status').order('createdAt', { ascending: false });
}

export function selectPlanInboxMessagesByThreadIds(client: HausyApiClient, threadIds: string[]) {
  return client
    .from<MessageRow[]>('planInboxMessages')
    .select('id,threadId,authorId,body,createdAt,kind')
    .in('threadId', threadIds)
    .order('createdAt', { ascending: true });
}

export function insertPlanInboxMessage(client: HausyApiClient, input: {
  authorId: string;
  body: string;
  kind: 'hostUpdate' | 'rsvpStatus' | 'message';
  threadId: string;
}) {
  return client
    .from<MessageRow>('planInboxMessages')
    .insert({
      authorId: input.authorId,
      body: input.body,
      kind: input.kind,
      threadId: input.threadId,
    })
    .select('id,threadId,authorId,body,createdAt,kind')
    .single();
}

export function selectPlanInboxThreadIds(client: HausyApiClient) {
  return client.from<unknown[]>('planInboxThreads').select('id');
}

import type { HausyApiClient } from '../client';

export type ThreadRow = {
  id: string;
  event_id: string | null;
  title: string;
  status: 'open' | 'archived';
};

export type MessageRow = {
  id: string;
  thread_id: string;
  author_id: string;
  body: string;
  created_at: string;
  kind: 'host_update' | 'rsvp_status' | 'message';
};

export function selectPlanInboxThreads(client: HausyApiClient) {
  return client.from<ThreadRow[]>('plan_inbox_threads').select('id,event_id,title,status').order('created_at', { ascending: false });
}

export function selectPlanInboxMessagesByThreadIds(client: HausyApiClient, threadIds: string[]) {
  return client
    .from<MessageRow[]>('plan_inbox_messages')
    .select('id,thread_id,author_id,body,created_at,kind')
    .in('thread_id', threadIds)
    .order('created_at', { ascending: true });
}

export function insertPlanInboxMessage(client: HausyApiClient, input: {
  authorId: string;
  body: string;
  kind: 'host_update' | 'rsvp_status' | 'message';
  threadId: string;
}) {
  return client
    .from<MessageRow>('plan_inbox_messages')
    .insert({
      author_id: input.authorId,
      body: input.body,
      kind: input.kind,
      thread_id: input.threadId,
    })
    .select('id,thread_id,author_id,body,created_at,kind')
    .single();
}

export function selectPlanInboxThreadIds(client: HausyApiClient) {
  return client.from<unknown[]>('plan_inbox_threads').select('id');
}

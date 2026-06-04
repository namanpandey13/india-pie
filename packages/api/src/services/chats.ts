import type { PlanInboxMessage, PlanInboxThread } from '@hausy/types';
import { getApiClient, getAuthenticatedProfileId } from '../client';
import {
  type MessageRow,
  insertPlanInboxMessage,
  selectPlanInboxMessagesByThreadIds,
  selectPlanInboxThreads,
} from '../queries/inbox';
import { fail, ok } from '../result';

export async function listPlanInboxThreads() {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<PlanInboxThread[]>('auth_required', 'Sign in to view Plan Inbox.', false);
  }

  try {
    const { data: threads, error } = await selectPlanInboxThreads(client);

    if (error) {
      return fail<PlanInboxThread[]>('inbox_unavailable', error.message ?? 'Could not load Plan Inbox.', true);
    }

    const threadIds = (threads ?? []).map((thread) => thread.id);
    const messagesResult =
      threadIds.length > 0
        ? await selectPlanInboxMessagesByThreadIds(client, threadIds)
        : { data: [], error: null };

    if (messagesResult.error) {
      return fail<PlanInboxThread[]>('inbox_unavailable', messagesResult.error.message ?? 'Could not load Plan Inbox.', true);
    }

    return ok<PlanInboxThread[]>(
      (threads ?? []).map((thread) => ({
        id: thread.id,
        eventId: thread.event_id,
        messages: (messagesResult.data ?? []).filter((message) => message.thread_id === thread.id).map(mapMessage),
        status: thread.status,
        title: thread.title,
        unreadCount: 0,
      })),
    );
  } catch {
    return fail<PlanInboxThread[]>('inbox_unavailable', 'Could not load Plan Inbox.', true);
  }
}

export async function sendPlanInboxMessage(input: Omit<PlanInboxMessage, 'id' | 'createdAt'>) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<PlanInboxMessage>('auth_required', 'Sign in before sending messages.', false);
  }

  try {
    const { data, error } = await insertPlanInboxMessage(client, {
      authorId: profileId,
      body: input.body,
      kind: input.kind,
      threadId: input.threadId,
    });

    if (error || !data) {
      return fail<PlanInboxMessage>('message_failed', error?.message ?? 'Could not send this message.', true);
    }

    return ok<PlanInboxMessage>(mapMessage(data));
  } catch {
    return fail<PlanInboxMessage>('message_failed', 'Could not send this message.', true);
  }
}

export function listChatsForUser() {
  return listPlanInboxThreads();
}

function mapMessage(row: MessageRow): PlanInboxMessage {
  return {
    id: row.id,
    authorId: row.author_id,
    body: row.body,
    createdAt: row.created_at,
    kind: row.kind,
    threadId: row.thread_id,
  };
}

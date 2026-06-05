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
    return fail<PlanInboxThread[]>('authRequired', 'Sign in to view Plan Inbox.', false);
  }

  try {
    const { data: threads, error } = await selectPlanInboxThreads(client);

    if (error) {
      return fail<PlanInboxThread[]>('inboxUnavailable', error.message ?? 'Could not load Plan Inbox.', true);
    }

    const threadIds = (threads ?? []).map((thread) => thread.id);
    const messagesResult =
      threadIds.length > 0
        ? await selectPlanInboxMessagesByThreadIds(client, threadIds)
        : { data: [], error: null };

    if (messagesResult.error) {
      return fail<PlanInboxThread[]>('inboxUnavailable', messagesResult.error.message ?? 'Could not load Plan Inbox.', true);
    }

    return ok<PlanInboxThread[]>(
      (threads ?? []).map((thread) => ({
        id: thread.id,
        eventId: thread.eventId,
        messages: (messagesResult.data ?? []).filter((message) => message.threadId === thread.id).map(mapMessage),
        status: thread.status,
        title: thread.title,
        unreadCount: 0,
      })),
    );
  } catch {
    return fail<PlanInboxThread[]>('inboxUnavailable', 'Could not load Plan Inbox.', true);
  }
}

export async function sendPlanInboxMessage(input: Omit<PlanInboxMessage, 'id' | 'createdAt'>) {
  const client = getApiClient();
  const profileId = await getAuthenticatedProfileId();

  if (!client || !profileId) {
    return fail<PlanInboxMessage>('authRequired', 'Sign in before sending messages.', false);
  }

  try {
    const { data, error } = await insertPlanInboxMessage(client, {
      authorId: profileId,
      body: input.body,
      kind: input.kind,
      threadId: input.threadId,
    });

    if (error || !data) {
      return fail<PlanInboxMessage>('messageFailed', error?.message ?? 'Could not send this message.', true);
    }

    return ok<PlanInboxMessage>(mapMessage(data));
  } catch {
    return fail<PlanInboxMessage>('messageFailed', 'Could not send this message.', true);
  }
}

export function listChatsForUser() {
  return listPlanInboxThreads();
}

function mapMessage(row: MessageRow): PlanInboxMessage {
  return {
    id: row.id,
    authorId: row.authorId,
    body: row.body,
    createdAt: row.createdAt,
    kind: row.kind,
    threadId: row.threadId,
  };
}

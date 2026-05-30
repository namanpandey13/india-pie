import type { PlanInboxMessage, PlanInboxThread } from '@hausy/types';
import { fail, ok } from '../result';

export function listPlanInboxThreads() {
  try {
    return ok<PlanInboxThread[]>([]);
  } catch {
    return fail<PlanInboxThread[]>('inbox_unavailable', 'Could not load Plan Inbox.', true);
  }
}

export function sendPlanInboxMessage(input: Omit<PlanInboxMessage, 'id' | 'createdAt'>) {
  try {
    return ok<PlanInboxMessage>({
      ...input,
      id: `message-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
  } catch {
    return fail<PlanInboxMessage>('message_failed', 'Could not send this message.', true);
  }
}

export function listChatsForUser() {
  return listPlanInboxThreads();
}

import { listChatsForUser } from '@hausy/api';

export function useChatOverview() {
  return {
    chats: listChatsForUser('demo-user'),
  };
}

import type { Chat } from '@hausy/types';

export const chats: Chat[] = [
  {
    id: 'chat-boardgames',
    eventId: 'hk-boardgames',
    title: 'Board Game Baithak pre-chat',
    members: ['Tara', 'Riya', 'Arjun', 'Isha', 'Kabir', 'You'],
    unread: 3,
    lastMessage: 'Tara: I will split tables by game comfort. Solo folks, you are covered.',
    prompt: 'Which game should we start with?',
  },
  {
    id: 'chat-photo',
    eventId: 'lodhi-photo-walk',
    title: 'Lodhi photo walk',
    members: ['Zoya', 'Neil', 'Mehak', 'You'],
    unread: 0,
    lastMessage: 'Zoya shared the route and cafe stop.',
    prompt: 'Share one photo style you like.',
  },
];

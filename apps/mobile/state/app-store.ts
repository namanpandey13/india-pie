import { create } from 'zustand';
import type { HostVisibility, RsvpStatus } from '@hausy/types';
import type { ColorSchemeName } from '@hausy/ui';

export type RsvpDraft = {
  answers: Record<string, string>;
  eventId: string;
  note: string;
  requestId?: string;
  selectedDate: string;
  status: 'draft' | RsvpStatus;
};

type AppState = {
  chatDrafts: Record<string, string>;
  chatMessages: Record<string, string[]>;
  comfortSettings: Record<string, boolean>;
  dismissedConnectionPrompts: string[];
  followedHosts: string[];
  colorScheme: ColorSchemeName;
  hostDraft: {
    about: string;
    capacity: string;
    lastSavedAt?: string;
    location: string;
    startsAt: string;
    submittedForReview: boolean;
    template: string;
    title: string;
    vibe: string;
    visibility: HostVisibility;
  };
  reflections: Record<string, string>;
  rsvps: Record<string, RsvpDraft>;
  savedEventIds: string[];
  setChatDraft: (chatId: string, value: string) => void;
  sendChatMessage: (chatId: string) => void;
  dismissConnectionPrompt: (id: string) => void;
  followHost: (hostId: string) => void;
  setColorScheme: (mode: ColorSchemeName) => void;
  setComfortSetting: (key: string, value: boolean) => void;
  setHostDraft: (patch: Partial<AppState['hostDraft']>) => void;
  saveHostDraft: () => void;
  submitHostDraftForReview: () => void;
  setReflection: (eventId: string, value: string) => void;
  toggleSavedEvent: (eventId: string) => boolean;
  updateRsvpDraft: (eventId: string, patch: Partial<RsvpDraft>) => void;
  submitRsvp: (eventId: string) => void;
  cancelRsvp: (eventId: string) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  chatDrafts: {},
  chatMessages: {},
  comfortSettings: {
    curatedGuestLists: true,
    confirmedAttendees: true,
    inAppComms: true,
  },
  dismissedConnectionPrompts: [],
  followedHosts: [],
  colorScheme: 'light',
  hostDraft: {
    about: '',
    capacity: '14',
    location: 'Delhi NCR',
    startsAt: '',
    submittedForReview: false,
    template: '',
    title: '',
    vibe: '',
    visibility: 'curated',
  },
  reflections: {},
  rsvps: {},
  savedEventIds: [],
  setChatDraft: (chatId, value) =>
    set((state) => ({
      chatDrafts: {
        ...state.chatDrafts,
        [chatId]: value,
      },
    })),
  sendChatMessage: (chatId) => {
    const draft = get().chatDrafts[chatId]?.trim();
    if (!draft) {
      return;
    }
    set((state) => ({
      chatDrafts: {
        ...state.chatDrafts,
        [chatId]: '',
      },
      chatMessages: {
        ...state.chatMessages,
        [chatId]: [...(state.chatMessages[chatId] ?? []), draft],
      },
    }));
  },
  dismissConnectionPrompt: (id) =>
    set((state) => ({
      dismissedConnectionPrompts: state.dismissedConnectionPrompts.includes(id)
        ? state.dismissedConnectionPrompts
        : [...state.dismissedConnectionPrompts, id],
    })),
  followHost: (hostId) =>
    set((state) => ({
      followedHosts: state.followedHosts.includes(hostId)
        ? state.followedHosts.filter((id) => id !== hostId)
        : [...state.followedHosts, hostId],
    })),
  setColorScheme: (mode) => set({ colorScheme: mode }),
  setComfortSetting: (key, value) =>
    set((state) => ({
      comfortSettings: {
        ...state.comfortSettings,
        [key]: value,
      },
    })),
  setHostDraft: (patch) =>
    set((state) => ({
      hostDraft: {
        ...state.hostDraft,
        ...patch,
        submittedForReview: false,
      },
    })),
  saveHostDraft: () =>
    set((state) => ({
      hostDraft: {
        ...state.hostDraft,
        lastSavedAt: 'Saved just now',
      },
    })),
  submitHostDraftForReview: () =>
    set((state) => ({
      hostDraft: {
        ...state.hostDraft,
        lastSavedAt: 'Submitted for review',
        submittedForReview: true,
      },
    })),
  setReflection: (eventId, value) =>
    set((state) => ({
      reflections: {
        ...state.reflections,
        [eventId]: value,
      },
    })),
  toggleSavedEvent: (eventId) => {
    const exists = get().savedEventIds.includes(eventId);
    set((state) => ({
      savedEventIds: exists
        ? state.savedEventIds.filter((id) => id !== eventId)
        : [...state.savedEventIds, eventId],
    }));
    return !exists;
  },
  updateRsvpDraft: (eventId, patch) =>
    set((state) => ({
      rsvps: {
        ...state.rsvps,
        [eventId]: {
          ...{
            answers: {},
            eventId,
            note: '',
            selectedDate: '',
            status: 'draft' as const,
          },
          ...state.rsvps[eventId],
          ...patch,
        },
      },
    })),
  submitRsvp: (eventId) =>
    set((state) => ({
      rsvps: {
        ...state.rsvps,
        [eventId]: {
          ...{
            answers: {},
            eventId,
            note: '',
            selectedDate: '',
          },
          ...state.rsvps[eventId],
          status: 'requested',
        },
      },
    })),
  cancelRsvp: (eventId) =>
    set((state) => {
      const next = { ...state.rsvps };
      delete next[eventId];
      return { rsvps: next };
    }),
}));

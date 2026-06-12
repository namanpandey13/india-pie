import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { listMyRsvpRequests, listMyTickets, sendPlanInboxMessage } from '@hausy/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rsvpStatusLabel } from '@hausy/types';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, Header, Screen, SectionTitle, typographyRoles, useThemeColors } from '@hausy/ui';
import { useChatOverview } from '@/features/chat/use-chat-overview';
import { useAppStore } from '@/state/app-store';

export default function ChatScreen() {
  const colors = useThemeColors();
  const [activeSection, setActiveSection] = useState<'chats' | 'rsvps' | 'tickets'>('chats');
  const { error, isLoading, threads } = useChatOverview();
  const ticketsQuery = useQuery({
    queryKey: ['tickets'],
    queryFn: listMyTickets,
  });
  const tickets = ticketsQuery.data?.data ?? [];
  const rsvpsQuery = useQuery({
    queryKey: ['my-rsvps'],
    queryFn: listMyRsvpRequests,
  });
  const rsvps = rsvpsQuery.data?.data ?? [];
  const queryClient = useQueryClient();
  const chatDrafts = useAppStore((state) => state.chatDrafts);
  const setChatDraft = useAppStore((state) => state.setChatDraft);
  const sendMutation = useMutation({
    mutationFn: ({ kind, threadId }: { kind: 'message' | 'hostUpdate'; threadId: string }) =>
      sendPlanInboxMessage({
        authorId: '',
        body: chatDrafts[threadId] ?? '',
        kind,
        threadId,
      }),
    onSuccess: (_result, { threadId }) => {
      setChatDraft(threadId, '');
      queryClient.invalidateQueries({ queryKey: ['plan-inbox-threads'] });
    },
  });

  return (
    <Screen>
      <Header eyebrow="rooms" title="Everything around the plan." subtitle="Conversations, requests, and entry details stay together." />

      <View style={[styles.segmented, { backgroundColor: colors.surfaceAlt }]}>
        <RoomTab label="Chats" active={activeSection === 'chats'} onPress={() => setActiveSection('chats')} />
        <RoomTab label="RSVPs" active={activeSection === 'rsvps'} onPress={() => setActiveSection('rsvps')} />
        <RoomTab label="Tickets" active={activeSection === 'tickets'} onPress={() => setActiveSection('tickets')} />
      </View>

      {activeSection === 'tickets' ? (
        <View style={styles.sectionStack}>
          <SectionTitle title="Your tickets" action={`${tickets.length}`} />
          {tickets.map((ticket) => (
            <Card key={ticket.id} style={styles.ticketCard}>
              <View style={styles.chatTop}>
                <Ionicons name="ticket-outline" size={24} color={colors.brand} />
                <View style={styles.chatCopy}>
                  <Text style={[styles.chatTitle, { color: colors.ink }]}>{ticket.eventTitle}</Text>
                  <Text style={[styles.chatMeta, { color: colors.muted }]}>Entry code</Text>
                </View>
              </View>
              <Text style={[styles.ticketCode, { color: colors.ink }]}>{ticket.ticketCode}</Text>
            </Card>
          ))}
          {!ticketsQuery.isLoading && tickets.length === 0 ? (
            <Card style={styles.alignedCard}>
              <Text style={[styles.chatTitle, { color: colors.ink }]}>No tickets yet.</Text>
              <Text style={[styles.prompt, { color: colors.muted }]}>Confirmed event tickets will appear here.</Text>
            </Card>
          ) : null}
        </View>
      ) : null}

      {activeSection === 'rsvps' ? (
        <View style={styles.sectionStack}>
          <SectionTitle title="Your requests" action={`${rsvps.length}`} />
          {rsvps.map((rsvp) => (
            <Pressable
              key={rsvp.id}
              onPress={() => router.push({ pathname: '/event/[id]', params: { id: rsvp.eventId } })}>
              <Card style={styles.rsvpCard}>
                <View style={[styles.statusIcon, { backgroundColor: colors.surfaceAlt }]}>
                  <Ionicons name="calendar-outline" size={21} color={colors.brand} />
                </View>
                <View style={styles.chatCopy}>
                  <Text style={[styles.chatTitle, { color: colors.ink }]}>Event request</Text>
                  <Text style={[styles.chatMeta, { color: colors.muted }]}>
                    {rsvpStatusLabel[rsvp.status]}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.faint} />
              </Card>
            </Pressable>
          ))}
          {!rsvpsQuery.isLoading && rsvps.length === 0 ? (
            <Card style={styles.alignedCard}>
              <Text style={[styles.chatTitle, { color: colors.ink }]}>No RSVP requests yet.</Text>
              <Text style={[styles.prompt, { color: colors.muted }]}>Requests you send from an event will appear here.</Text>
            </Card>
          ) : null}
        </View>
      ) : null}

      {activeSection === 'chats' && isLoading ? (
        <Card style={styles.chatCard}>
          <Text style={[styles.chatTitle, { color: colors.ink }]}>Loading plan inbox.</Text>
        </Card>
      ) : null}
      {activeSection === 'chats' && error ? (
        <Card style={styles.chatCard}>
          <Text style={[styles.chatTitle, { color: colors.ink }]}>Plan Inbox is unavailable.</Text>
          <Text style={[styles.message, { backgroundColor: colors.surfaceAlt, color: colors.ink }]}>{error.message}</Text>
        </Card>
      ) : null}
      {activeSection === 'chats' ? threads.map((thread) => (
          <Card key={thread.id} style={styles.chatCard}>
            <View style={styles.chatTop}>
              <View style={styles.chatCopy}>
                <Text style={[styles.chatTitle, { color: colors.ink }]}>{thread.title}</Text>
                <Text style={[styles.chatMeta, { color: colors.muted }]}>Creator updates and RSVP context</Text>
              </View>
              {thread.unreadCount ? (
                <View style={[styles.unread, { backgroundColor: colors.brand }]}>
                  <Text style={[styles.unreadText, { color: colors.black }]}>{thread.unreadCount}</Text>
                </View>
              ) : null}
            </View>

            {thread.messages.map((message) => (
              <Text key={message.id} style={[styles.message, { backgroundColor: colors.surfaceAlt, color: colors.ink }]}>{message.body}</Text>
            ))}

            <View style={[styles.replyRow, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}>
              <TextInput
                value={chatDrafts[thread.id] ?? ''}
                onChangeText={(value) => setChatDraft(thread.id, value)}
                placeholder="Message this plan thread..."
                placeholderTextColor={colors.faint}
                style={[styles.replyInput, { color: colors.ink }]}
              />
              <Pressable
                onPress={() => {
                  if (chatDrafts[thread.id]?.trim()) {
                    sendMutation.mutate({ kind: 'message', threadId: thread.id });
                  }
                }}
                hitSlop={8}
              >
                <Ionicons name="send" size={18} color={colors.brand} />
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (chatDrafts[thread.id]?.trim()) {
                  sendMutation.mutate({ kind: 'hostUpdate', threadId: thread.id });
                }
              }}
              style={[styles.announceButton, { borderColor: colors.line }]}
            >
              <Ionicons name="megaphone-outline" size={17} color={colors.brand} />
              <Text style={[styles.announceText, { color: colors.ink }]}>Post as announcement</Text>
            </Pressable>
          </Card>
        )) : null}

      {activeSection === 'chats' && !isLoading && !error && threads.length === 0 ? (
        <Card style={styles.alignedCard}>
          <Text style={[styles.chatTitle, { color: colors.ink }]}>No plan threads yet.</Text>
          <Text style={[styles.prompt, { color: colors.muted }]}>Threads appear after you request or join creator-led plans.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

function RoomTab({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.roomTab, active && { backgroundColor: colors.surface }]}>
      <Text style={[styles.roomTabText, { color: active ? colors.ink : colors.muted }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chatCard: {
    gap: 14,
  },
  ticketCard: {
    gap: 12,
  },
  ticketCode: {
    ...typographyRoles.h2,
    letterSpacing: 0,
  },
  segmented: {
    borderRadius: 16,
    flexDirection: 'row',
    padding: 4,
  },
  roomTab: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    paddingVertical: 10,
  },
  roomTabText: {
    ...typographyRoles.label,
  },
  sectionStack: {
    gap: 14,
  },
  rsvpCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  statusIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  chatTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  stack: {
    flexDirection: 'row',
    width: 82,
  },
  chatCopy: {
    flex: 1,
    gap: 3,
  },
  chatTitle: {
    ...typographyRoles.h3,
  },
  chatMeta: {
    ...typographyRoles.caption,
  },
  unread: {
    alignItems: 'center',
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  unreadText: {
    ...typographyRoles.caption,
  },
  message: {
    borderRadius: 14,
    ...typographyRoles.bodyStrong,
    padding: 12,
  },
  promptBox: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  prompt: {
    flex: 1,
    ...typographyRoles.caption,
  },
  replyRow: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 46,
    paddingHorizontal: 14,
  },
  replyPlaceholder: {
    ...typographyRoles.bodyStrong,
  },
  replyInput: {
    flex: 1,
    ...typographyRoles.bodyStrong,
    minHeight: 44,
  },
  announceButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  announceText: {
    ...typographyRoles.caption,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    borderRadius: 14,
    ...typographyRoles.bodyStrong,
    maxWidth: '86%',
    padding: 12,
  },
  alignedCard: {
    gap: 16,
  },
  alignedPeople: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  personTile: {
    alignItems: 'center',
    gap: 8,
  },
  personLabel: {
    ...typographyRoles.caption,
  },
  dismiss: {
    ...typographyRoles.label,
    textAlign: 'center',
  },
});

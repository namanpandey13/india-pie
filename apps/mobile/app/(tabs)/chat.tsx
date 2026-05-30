import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, Header, Screen, SectionTitle, TopBar, typographyRoles, useThemeColors } from '@hausy/ui';
import { useChatOverview } from '@/features/chat/use-chat-overview';
import { useAppStore } from '@/state/app-store';

export default function ChatScreen() {
  const colors = useThemeColors();
  const { error, isLoading, threads } = useChatOverview();
  const chatDrafts = useAppStore((state) => state.chatDrafts);
  const chatMessages = useAppStore((state) => state.chatMessages);
  const sendChatMessage = useAppStore((state) => state.sendChatMessage);
  const setChatDraft = useAppStore((state) => state.setChatDraft);

  return (
    <Screen>
      <TopBar onChatPress={() => router.push('/chat')} onNotificationPress={() => router.push('/modal')} />
      <Header
        eyebrow="plan inbox"
        title="Host updates stay close to the plan."
        subtitle="RSVP status, route proof, and creator updates live here so guests do not need a WhatsApp migration."
      />

      <SectionTitle title="Plan threads" action={`${threads.length} active`} />
      {isLoading ? (
        <Card style={styles.chatCard}>
          <Text style={[styles.chatTitle, { color: colors.ink }]}>Loading plan inbox.</Text>
        </Card>
      ) : null}
      {error ? (
        <Card style={styles.chatCard}>
          <Text style={[styles.chatTitle, { color: colors.ink }]}>Plan Inbox is unavailable.</Text>
          <Text style={[styles.message, { backgroundColor: colors.surfaceAlt, color: colors.ink }]}>{error.message}</Text>
        </Card>
      ) : null}
      {threads.map((thread) => (
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

            {(chatMessages[thread.id] ?? []).map((message) => (
              <Text key={message} style={[styles.sentMessage, { backgroundColor: colors.surfaceLift, color: colors.ink }]}>{message}</Text>
            ))}

            <View style={[styles.replyRow, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}>
              <TextInput
                value={chatDrafts[thread.id] ?? ''}
                onChangeText={(value) => setChatDraft(thread.id, value)}
                placeholder="Message this plan thread..."
                placeholderTextColor={colors.faint}
                style={[styles.replyInput, { color: colors.ink }]}
              />
              <Pressable onPress={() => sendChatMessage(thread.id)} hitSlop={8}>
                <Ionicons name="send" size={18} color={colors.brand} />
              </Pressable>
            </View>
          </Card>
        ))}

      {!isLoading && !error && threads.length === 0 ? (
        <Card style={styles.alignedCard}>
          <Text style={[styles.chatTitle, { color: colors.ink }]}>No plan threads yet.</Text>
          <Text style={[styles.prompt, { color: colors.muted }]}>Threads appear after you request or join creator-led plans.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chatCard: {
    gap: 14,
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

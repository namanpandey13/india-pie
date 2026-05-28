import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar, Card, colors, Header, PrimaryButton, Screen, SectionTitle, TopBar } from '@/components/mvp-kit';
import { chats, events } from '@/data/mvp';

export default function ChatScreen() {
  return (
    <Screen>
      <TopBar />
      <Header
        eyebrow="chat"
        title="plans stay inside the app."
        subtitle="A fake chat layer for pre-event reassurance, route proof, host updates, and small-group warmups."
      />

      <SectionTitle title="active pre-chats" action="no WhatsApp" />
      {chats.map((chat) => {
        const event = events.find((item) => item.id === chat.eventId);

        return (
          <Card key={chat.id} style={styles.chatCard}>
            <View style={styles.chatTop}>
              <View style={styles.stack}>
                {chat.members.slice(0, 4).map((member, index) => (
                  <View key={member} style={{ marginLeft: index === 0 ? 0 : -9 }}>
                    <Avatar
                      label={member.slice(0, 1)}
                      color={[colors.lime, colors.coral, colors.blue, colors.yellow][index]}
                      size={36}
                    />
                  </View>
                ))}
              </View>
              <View style={styles.chatCopy}>
                <Text style={styles.chatTitle}>{chat.title}</Text>
                <Text style={styles.chatMeta}>
                  {chat.members.length} members - {event?.locality}
                </Text>
              </View>
              {chat.unread ? (
                <View style={styles.unread}>
                  <Text style={styles.unreadText}>{chat.unread}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.message}>{chat.lastMessage}</Text>

            <View style={styles.promptBox}>
              <Ionicons name="sparkles-outline" size={17} color={colors.lime} />
              <Text style={styles.prompt}>{chat.prompt}</Text>
            </View>

            <View style={styles.replyRow}>
              <Text style={styles.replyPlaceholder}>Message the group...</Text>
              <Ionicons name="send" size={18} color={colors.lime} />
            </View>
          </Card>
        );
      })}

      <SectionTitle title="stars aligned" action="people to meet" />
      <Card style={styles.alignedCard}>
        <View style={styles.alignedPeople}>
          <View style={styles.personTile}>
            <Avatar label="YO" color={colors.lime} size={72} />
            <Text style={styles.personLabel}>you</Text>
          </View>
          <Ionicons name="star" size={24} color={colors.ink} />
          <View style={styles.personTile}>
            <Avatar label="RI" color={colors.coral} size={72} />
            <Text style={styles.personLabel}>riya</Text>
          </View>
        </View>
        <PrimaryButton label="start chat" icon="chatbubble-outline" />
        <Text style={styles.dismiss}>dismiss</Text>
      </Card>
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
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  chatMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  unread: {
    alignItems: 'center',
    backgroundColor: colors.lime,
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  unreadText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '900',
  },
  message: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    padding: 12,
  },
  promptBox: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  prompt: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  replyRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 46,
    paddingHorizontal: 14,
  },
  replyPlaceholder: {
    color: colors.faint,
    fontSize: 14,
    fontWeight: '800',
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
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  dismiss: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
});

import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { listNotifications } from '@hausy/api';
import { useQuery } from '@tanstack/react-query';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, typographyRoles, useThemeColors } from '@hausy/ui';
import { useAuthSession } from '@/lib/auth-session';

export default function NotificationsScreen() {
  const { isLoading, isSignedIn } = useAuthSession();

  if (isLoading) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/login" />;
  }

  return <ProtectedNotificationsScreen />;
}

function ProtectedNotificationsScreen() {
  const colors = useThemeColors();
  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: listNotifications,
  });
  const notifications = notificationsQuery.data?.data ?? [];
  const error = notificationsQuery.data?.error ?? null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.brand }]}>updates</Text>
          <Text style={[styles.title, { color: colors.ink }]}>Notifications</Text>
        </View>
        <Pressable
          accessibilityLabel="Close notifications"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.closeButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}
        >
          <Ionicons name="close" size={24} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.summaryCard}>
          <View style={[styles.summaryIcon, { backgroundColor: colors.surfaceAlt }]}>
            <Ionicons name="notifications-outline" size={24} color={colors.brand} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={[styles.summaryTitle, { color: colors.ink }]}>
              {notifications.length ? `${notifications.length} plan update${notifications.length === 1 ? '' : 's'}` : 'No urgent updates'}
            </Text>
            <Text style={[styles.summaryBody, { color: colors.muted }]}>
              RSVP decisions, ticket updates, and host announcements stay focused here.
            </Text>
          </View>
        </Card>

        <Text style={[styles.sectionLabel, { color: colors.ink }]}>Plan-critical updates</Text>

        <View style={styles.list}>
          {notificationsQuery.isLoading ? (
            <Text style={[styles.itemBody, { color: colors.muted }]}>Loading notifications.</Text>
          ) : null}
          {error ? <Text style={[styles.itemBody, { color: colors.muted }]}>{error.message}</Text> : null}
          {notifications.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.itemRow, { borderColor: colors.line }]}
              onPress={() => item.eventId ? router.push({ pathname: '/event/[id]', params: { id: item.eventId } }) : undefined}
            >
              <View style={[styles.itemIcon, { backgroundColor: colors.surfaceAlt }]}>
                <Ionicons name={iconForNotification(item.kind)} size={20} color={colors.ink} />
              </View>
              <View style={styles.itemCopy}>
                <Text style={[styles.itemTitle, { color: colors.ink }]}>{item.title}</Text>
                <Text style={[styles.itemBody, { color: colors.muted }]}>{item.body}</Text>
                <Text style={[styles.itemMeta, { color: colors.faint }]}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
            </Pressable>
          ))}
          {!notificationsQuery.isLoading && !error && notifications.length === 0 ? (
            <Text style={[styles.itemBody, { color: colors.muted }]}>Approvals, non-approvals, tickets, and announcements will appear here.</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function iconForNotification(kind: string): keyof typeof Ionicons.glyphMap {
  if (kind === 'ticketIssued') return 'ticket-outline';
  if (kind === 'rsvpAccepted' || kind === 'eventConfirmed') return 'checkmark-circle-outline';
  if (kind === 'rsvpDeclined' || kind === 'eventCancelled') return 'close-circle-outline';
  return 'megaphone-outline';
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  content: {
    gap: 18,
    paddingBottom: 28,
    paddingHorizontal: 18,
  },
  eyebrow: {
    ...typographyRoles.eyebrow,
  },
  itemBody: {
    ...typographyRoles.body,
  },
  itemCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  itemIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  itemRow: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  itemTitle: {
    ...typographyRoles.bodyStrong,
  },
  itemMeta: {
    ...typographyRoles.micro,
  },
  list: {
    gap: 16,
  },
  safe: {
    flex: 1,
  },
  sectionLabel: {
    ...typographyRoles.h3,
  },
  summaryBody: {
    ...typographyRoles.body,
  },
  summaryCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  summaryCopy: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  summaryIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  summaryTitle: {
    ...typographyRoles.h3,
  },
  title: {
    ...typographyRoles.h1,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
  },
});

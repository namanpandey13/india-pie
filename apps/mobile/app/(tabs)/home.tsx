import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  GhostButton,
  Header,
  PrimaryButton,
  Screen,
  SectionTitle,
  TopBar,
  typographyRoles,
  useThemeColors,
} from '@hausy/ui';
import { listHomeSummary } from '@hausy/api';

export default function HomeScreen() {
  const colors = useThemeColors();
  const summaryQuery = useQuery({
    queryKey: ['home-summary'],
    queryFn: listHomeSummary,
  });
  const summary = summaryQuery.data?.data;

  return (
    <Screen>
      <TopBar onChatPress={() => router.push('/chat')} onNotificationPress={() => router.push('/modal')} />
      <Header
        eyebrow="home"
        title="Your offline plans, calmly organized."
        subtitle="Track RSVP requests, saved plans, and creator updates without turning Hausy into a feed."
      />

      <Card style={styles.summaryCard}>
        <View style={styles.metricRow}>
          <Metric label="RSVPs" value={summary?.upcomingRsvpCount ?? 0} />
          <Metric label="Saved" value={summary?.savedCount ?? 0} />
          <Metric label="Inbox" value={summary?.inboxUnreadCount ?? 0} />
        </View>
        <PrimaryButton label="Explore plans" icon="sparkles-outline" onPress={() => router.push('/discover')} />
      </Card>

      <SectionTitle title="Creator spotlight" action="Coming soon" />
      <Card style={styles.emptyCard}>
        <Text style={[styles.emptyTitle, { color: colors.ink }]}>Creators are under review.</Text>
        <Text style={[styles.emptyBody, { color: colors.muted }]}>
          Hausy will only surface creator-led plans after identity, venue, and trust checks are in place.
        </Text>
        <GhostButton label="Open Creator Studio" icon="create-outline" onPress={() => router.push('/profile')} />
      </Card>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  const colors = useThemeColors();

  return (
    <View style={[styles.metric, { backgroundColor: colors.surfaceAlt }]}>
      <Text style={[styles.metricValue, { color: colors.brand }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    gap: 16,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metric: {
    borderRadius: 14,
    flex: 1,
    gap: 4,
    padding: 12,
  },
  metricValue: {
    ...typographyRoles.h2,
  },
  metricLabel: {
    ...typographyRoles.caption,
  },
  emptyCard: {
    gap: 12,
  },
  emptyTitle: {
    ...typographyRoles.h3,
  },
  emptyBody: {
    ...typographyRoles.body,
  },
});

import { Redirect, router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Card, GhostButton, Header, Screen, SectionTitle, typographyRoles, useThemeColors } from '@hausy/ui';
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

  return (
    <Screen>
      <Header
        eyebrow="updates"
        title="Plan-critical updates only."
        subtitle="Host approvals, RSVP changes, and route proof will appear here after Supabase is connected."
      />

      <SectionTitle title="Today" action="0 updates" />
      <Card style={styles.card}>
        <Text style={[styles.title, { color: colors.ink }]}>No updates yet.</Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          Hausy will keep notifications focused on trust and attendance, not engagement noise.
        </Text>
      </Card>

      <GhostButton label="Back to app" icon="chevron-back" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  title: {
    ...typographyRoles.h3,
  },
  body: {
    ...typographyRoles.body,
  },
});

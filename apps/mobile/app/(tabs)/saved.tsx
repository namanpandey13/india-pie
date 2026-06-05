import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import {
  Card,
  EventCard,
  GhostButton,
  Header,
  Screen,
  SectionTitle,
  TopBar,
  typographyRoles,
  useThemeColors,
} from '@hausy/ui';

import { useSavedEvents } from '@/features/saved/use-saved-events';

export default function SavedScreen() {
  const colors = useThemeColors();
  const { error, isLoading, savedEvents, toggleSaved } = useSavedEvents();

  return (
    <Screen>
      <TopBar onChatPress={() => router.push('/chat')} onNotificationPress={() => router.push('/modal')} />
      <Header
        eyebrow="saved"
        title="Plans worth returning to."
        subtitle="Keep a short list of experiences, hosts, and rooms you may want to join later."
      />

      <SectionTitle title="Saved plans" action={`${savedEvents.length} plans`} />
      <View style={styles.feed}>
        {isLoading ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>Loading saved plans.</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>Checking your local saves and Supabase records.</Text>
          </Card>
        ) : null}

        {error && savedEvents.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>Saved plans could not sync.</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>{error.message}</Text>
          </Card>
        ) : null}

        {savedEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            saved
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
            onSave={() => toggleSaved(event.id)}
          />
        ))}
        {!isLoading && !error && savedEvents.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>No saved plans yet.</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>Save one from Explore when the host, room, and timing feel right.</Text>
            <GhostButton label="Browse Explore" icon="search-outline" onPress={() => router.push('/discover')} />
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  feed: {
    gap: 18,
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

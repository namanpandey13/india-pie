import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  Card,
  EventCard,
  Pill,
  Screen,
  SectionTitle,
  TopBar,
  typographyRoles,
  useThemeColors,
} from '@hausy/ui';
import { useDiscoverEvents } from '@/features/events/use-discover-events';

export default function DiscoverScreen() {
  const colors = useThemeColors();
  const {
    activeTag,
    city,
    error,
    eventTags,
    isLoading,
    joined,
    query,
    saved,
    setActiveTag,
    setQuery,
    toggleSaved,
    visibleEvents,
  } = useDiscoverEvents();

  return (
    <Screen>
      <TopBar onChatPress={() => router.push('/chat')} onNotificationPress={() => router.push('/modal')} />

      <View style={styles.controls}>
        <View style={[styles.cityPill, { backgroundColor: colors.surface, borderColor: colors.line }]}>
          <Ionicons name="location-outline" size={16} color={colors.brand} />
          <Text style={[styles.cityText, { color: colors.ink }]}>{city}</Text>
        </View>
      </View>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search by plan, host, venue, or locality"
        placeholderTextColor={colors.faint}
        style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.line, color: colors.ink }]}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
        {eventTags.map((tag) => (
          <Pill
            key={tag}
            label={tag}
            active={tag === activeTag}
            onPress={() => setActiveTag(tag)}
            tone={tag === 'free' ? 'lime' : tag === 'creator-led' ? 'violet' : 'yellow'}
          />
        ))}
      </ScrollView>

      <SectionTitle title="Find things to do" action={`${visibleEvents.length} plans`} />

      <View style={styles.feed}>
        {isLoading ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>Loading plans.</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>Checking creator-led events in {city}.</Text>
          </Card>
        ) : null}
        {error ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>Explore is unavailable.</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>{error.message}</Text>
          </Card>
        ) : null}
        {visibleEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            joined={joined.includes(event.id)}
            saved={saved.includes(event.id)}
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
            onSave={() => toggleSaved(event.id)}
          />
        ))}
        {!isLoading && !error && visibleEvents.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>No creator-led plans yet.</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>Planning and confirmed Hausy Creator events will appear here once Supabase data is connected.</Text>
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  controls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  cityPill: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  cityText: {
    ...typographyRoles.label,
  },
  pillRow: {
    gap: 10,
    paddingRight: 18,
  },
  searchInput: {
    borderRadius: 18,
    borderWidth: 1,
    ...typographyRoles.bodyStrong,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  feed: {
    gap: 18,
  },
  emptyCard: {
    gap: 6,
  },
  emptyTitle: {
    ...typographyRoles.h3,
  },
  emptyBody: {
    ...typographyRoles.body,
  },
});

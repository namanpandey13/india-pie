import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, Pill, Screen, SectionTitle, TopBar, typographyRoles, useThemeColors } from '@hausy/ui';
import { eventStatusLabel } from '@hausy/types';
import { useDiscoverEvents } from '@/features/events/use-discover-events';

export default function DiscoverScreen() {
  const colors = useThemeColors();
  const {
    activeTag,
    city,
    error,
    eventTags,
    isLoading,
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

      <View style={styles.headerCopy}>
        <Text style={[styles.title, { color: colors.ink }]}>Explore</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={colors.ink} />
          <Text style={[styles.locationText, { color: colors.muted }]}>{city}</Text>
        </View>
      </View>

      <View style={[styles.searchShell, { backgroundColor: colors.surface, borderColor: colors.line }]}>
        <Ionicons name="search-outline" size={20} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search plans, hosts, venues"
          placeholderTextColor={colors.faint}
          style={[styles.searchInput, { color: colors.ink }]}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
        {['all', ...eventTags].map((tag, index) => (
          <Pill
            key={`${tag}-${index}`}
            label={tag === 'all' ? 'All' : tag}
            active={tag === activeTag}
            onPress={() => setActiveTag(tag)}
          />
        ))}
      </ScrollView>

      <SectionTitle title="Plans" action={`${visibleEvents.length}`} />

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

      <View style={styles.grid}>
        {visibleEvents.map((event, index) => (
          <Pressable
            key={`${event.id}-${index}`}
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
            style={[styles.tile, index % 7 === 0 ? styles.tallTile : null]}
          >
            <Image source={{ uri: event.image }} style={styles.tileImage} contentFit="cover" />
            <View style={styles.tileShade} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={saved.includes(event.id) ? 'Unsave event' : 'Save event'}
              onPress={() => toggleSaved(event.id)}
              style={styles.saveButton}
            >
              <Ionicons name={saved.includes(event.id) ? 'bookmark' : 'bookmark-outline'} size={18} color={colors.white} />
            </Pressable>
            <View style={styles.tileCopy}>
              <Text style={styles.tileStatus}>{eventStatusLabel[event.status]}</Text>
              <Text style={styles.tileTitle} numberOfLines={2}>
                {event.title}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {!isLoading && !error && visibleEvents.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={[styles.emptyTitle, { color: colors.ink }]}>No plans here yet.</Text>
          <Text style={[styles.emptyBody, { color: colors.muted }]}>Try a broader search or a different category.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyBody: {
    ...typographyRoles.body,
  },
  emptyCard: {
    gap: 6,
  },
  emptyTitle: {
    ...typographyRoles.h3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  headerCopy: {
    gap: 6,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  locationText: {
    ...typographyRoles.body,
  },
  pillRow: {
    gap: 10,
    paddingRight: 18,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 999,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 8,
    width: 34,
  },
  searchInput: {
    ...typographyRoles.body,
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
  },
  searchShell: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  tallTile: {
    aspectRatio: 0.66,
  },
  tile: {
    aspectRatio: 1,
    flexBasis: '32.8%',
    overflow: 'hidden',
  },
  tileCopy: {
    bottom: 8,
    left: 8,
    position: 'absolute',
    right: 8,
  },
  tileImage: {
    ...StyleSheet.absoluteFillObject,
  },
  tileShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  tileStatus: {
    ...typographyRoles.micro,
    color: '#ffffff',
  },
  tileTitle: {
    ...typographyRoles.caption,
    color: '#ffffff',
  },
  title: {
    ...typographyRoles.h1,
  },
});

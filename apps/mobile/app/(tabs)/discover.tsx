import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  Card,
  colors,
  EventCard,
  Metric,
  Pill,
  Screen,
  SectionTitle,
  TopBar,
} from '@/components/mvp-kit';
import { city, events, tags } from '@/data/mvp';

export default function DiscoverScreen() {
  const [activeTag, setActiveTag] = useState('all');
  const [saved, setSaved] = useState<string[]>(['lodhi-photo-walk']);
  const [joined] = useState<string[]>(['hk-boardgames']);

  const visibleEvents =
    activeTag === 'all' ? events : events.filter((event) => event.tags.includes(activeTag));

  function toggleSaved(id: string) {
    setSaved((current) =>
      current.includes(id) ? current.filter((eventId) => eventId !== id) : [...current, id],
    );
  }

  return (
    <Screen>
      <TopBar />

      <View style={styles.feedToggle}>
        <Text style={styles.toggleActive}>all</Text>
        <Text style={styles.toggleMuted}>friends</Text>
      </View>

      <Card style={styles.activityCard}>
        <View style={styles.activityAccent} />
        <View style={styles.activityCopy}>
          <Text style={styles.activityTitle}>Riya is going to Board Game Baithak</Text>
          <Text style={styles.activityMeta}>2m - Hauz Khas - host-approved crowd</Text>
        </View>
      </Card>

      <View style={styles.controls}>
        <Pressable style={styles.searchCircle}>
          <Ionicons name="search-outline" size={18} color={colors.ink} />
        </Pressable>
        <View style={styles.cityPill}>
          <Ionicons name="location-outline" size={16} color={colors.lime} />
          <Text style={styles.cityText}>{city}</Text>
        </View>
        <Pressable style={styles.mapButton}>
          <Text style={styles.mapText}>map</Text>
        </Pressable>
        <Pressable style={styles.searchCircle}>
          <Ionicons name="options-outline" size={18} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
        {tags.map((tag) => (
          <Pill
            key={tag}
            label={tag}
            active={tag === activeTag}
            onPress={() => setActiveTag(tag)}
            tone={tag === 'free' ? 'lime' : tag === 'creator-led' ? 'violet' : 'yellow'}
          />
        ))}
      </ScrollView>

      <View style={styles.metricsRow}>
        <Metric value="27" label="Delhi plans this week" />
        <Metric value="92%" label="top confidence score" />
        <Metric value="0" label="WhatsApp groups" />
      </View>

      <SectionTitle title="find things to do" action={`${visibleEvents.length} plans`} />

      <View style={styles.feed}>
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  feedToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'center',
  },
  toggleActive: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  toggleMuted: {
    color: colors.faint,
    fontSize: 13,
    fontWeight: '800',
  },
  activityCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  activityAccent: {
    backgroundColor: colors.lime,
    borderRadius: 8,
    height: 52,
    width: 6,
  },
  activityCopy: {
    flex: 1,
    gap: 4,
  },
  activityTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  activityMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  controls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  searchCircle: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  cityPill: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
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
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  mapButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLift,
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  mapText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  pillRow: {
    gap: 10,
    paddingRight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  feed: {
    gap: 18,
  },
});

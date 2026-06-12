import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CompactEventCard,
  EditorialCategoryTabs,
  EditorialHomeHeader,
  EditorialSearch,
  FeaturedEventCard,
  Screen,
  typographyRoles,
  useThemeColors,
} from '@hausy/ui';
import { listDiscoveryMetadata, listEvents, toggleSavedEvent as toggleSavedEventRemote } from '@hausy/api';
import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/state/app-store';

export default function ExploreScreen() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState('');
  const [query, setQuery] = useState('');
  const queryClient = useQueryClient();
  const saved = useAppStore((state) => state.savedEventIds);
  const toggleSavedEventLocal = useAppStore((state) => state.toggleSavedEvent);
  const eventsQuery = useQuery({
    queryKey: ['explore-events', activeTab, query],
    queryFn: () => listEvents({ tag: activeTab, query }),
  });
  const metadataQuery = useQuery({
    queryKey: ['discovery-metadata'],
    queryFn: listDiscoveryMetadata,
  });
  const eventTags = useMemo(() => metadataQuery.data?.data?.eventTags ?? [], [metadataQuery.data]);
  const events = eventsQuery.data?.data ?? [];
  const featuredEvent = events[0];
  const compactEvents = events.slice(1, 5);
  const saveMutation = useMutation({
    mutationFn: ({ eventId, saved: nextSaved }: { eventId: string; saved: boolean }) =>
      toggleSavedEventRemote(eventId, nextSaved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-events'] });
    },
  });

  function openEvent(id: string) {
    router.push({ pathname: '/event/[id]', params: { id } });
  }

  useEffect(() => {
    if (!activeTab && eventTags[0]) {
      setActiveTab(eventTags[0]);
    }
  }, [activeTab, eventTags]);

  return (
    <Screen>
      <EditorialHomeHeader city={metadataQuery.data?.data?.city ?? 'Launch region'} onNotificationPress={() => router.push('/modal')} />
      <EditorialSearch query={query} onChangeQuery={setQuery} />
      <EditorialCategoryTabs activeTab={activeTab} tabs={eventTags} onChangeTab={setActiveTab} />

      <View style={styles.feed}>
        {featuredEvent ? (
          <FeaturedEventCard
            event={featuredEvent}
            saved={saved.includes(featuredEvent.id)}
            onPress={() => openEvent(featuredEvent.id)}
            onSave={() => {
              const nextSaved = toggleSavedEventLocal(featuredEvent.id);
              saveMutation.mutate({ eventId: featuredEvent.id, saved: nextSaved });
            }}
          />
        ) : null}

        {compactEvents.map((event) => (
          <CompactEventCard
            key={event.id}
            event={event}
            saved={saved.includes(event.id)}
            onPress={() => openEvent(event.id)}
            onSave={() => {
              const nextSaved = toggleSavedEventLocal(event.id);
              saveMutation.mutate({ eventId: event.id, saved: nextSaved });
            }}
          />
        ))}

        {eventsQuery.isLoading ? (
          <View style={[styles.emptyState, { borderColor: colors.line, backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>Finding rooms worth leaving home for.</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>Checking host-led plans around you.</Text>
          </View>
        ) : null}

        {eventsQuery.data?.error ? (
          <View style={[styles.emptyState, { borderColor: colors.line, backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>Explore is unavailable.</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>{eventsQuery.data.error.message}</Text>
          </View>
        ) : null}

        {!eventsQuery.isLoading && !eventsQuery.data?.error && events.length === 0 ? (
          <View style={[styles.emptyState, { borderColor: colors.line, backgroundColor: colors.surfaceAlt }]}>
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>No rooms match this search.</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>Try For You, Coffee, Music, or a different neighbourhood.</Text>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  feed: {
    gap: 18,
  },
  emptyTitle: {
    ...typographyRoles.h3,
  },
  emptyBody: {
    ...typographyRoles.body,
  },
  emptyState: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 18,
  },
});

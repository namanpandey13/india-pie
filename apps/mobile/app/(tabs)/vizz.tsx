import { useAppStore } from '@/state/app-store';
import { listEvents, toggleSavedEvent as toggleSavedEventRemote } from '@hausy/api';
import type { Event } from '@hausy/types';
import {
  Header,
  IconButton,
  EventEditionMark,
  Loader,
  Screen,
  typographyRoles,
  useThemeColors,
} from '@hausy/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const portraitImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
];

export default function VizzScreen() {
  const colors = useThemeColors();
  const [index, setIndex] = useState(0);
  const queryClient = useQueryClient();
  const savedEventIds = useAppStore((state) => state.savedEventIds);
  const toggleSavedEventLocal = useAppStore((state) => state.toggleSavedEvent);
  const eventsQuery = useQuery({
    queryKey: ['vizz-events'],
    queryFn: () => listEvents(),
  });
  const events = useMemo(() => eventsQuery.data?.data ?? [], [eventsQuery.data]);
  const event = events[index];
  const saveMutation = useMutation({
    mutationFn: ({ eventId, saved }: { eventId: string; saved: boolean }) =>
      toggleSavedEventRemote(eventId, saved),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-events'] }),
  });

  function advance() {
    if (events.length) {
      setIndex((current) => (current + 1) % events.length);
    }
  }

  function toggleSaved() {
    if (!event) {
      return;
    }

    const saved = toggleSavedEventLocal(event.id);
    saveMutation.mutate({ eventId: event.id, saved });
  }

  return (
    <Screen>
      <Header
        eyebrow="vizz"
        title="Meet the plan."
        subtitle="The feeling first. The people next. The decision when you are ready."
      />

      {event ? (
        <>
          <VizzEventProfile
            event={event}
            saved={savedEventIds.includes(event.id)}
            onOpen={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
            onSave={toggleSaved}
          />
          <View style={styles.actions}>
            <View style={styles.actionItem}>
              <IconButton
                icon="close-circle-outline"
                onPress={advance}
                style={[
                  styles.secondaryAction,
                  { backgroundColor: colors.surface, borderColor: colors.line },
                ]}
              />
              <Text style={[styles.actionLabel, { color: colors.muted }]}>Pass</Text>
            </View>
            <View style={styles.actionItem}>
              <IconButton
                icon={savedEventIds.includes(event.id) ? 'bookmark' : 'bookmark-outline'}
                onPress={toggleSaved}
                style={[
                  styles.secondaryAction,
                  { backgroundColor: colors.surface, borderColor: colors.line },
                ]}
              />
              <Text style={[styles.actionLabel, { color: colors.muted }]}>Save</Text>
            </View>
            <View style={styles.actionItem}>
              <IconButton
                color={colors.black}
                icon="arrow-forward-outline"
                onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
                style={[
                  styles.primaryAction,
                  { backgroundColor: colors.brand, borderColor: colors.brand },
                ]}
              />
              <Text style={[styles.actionLabel, { color: colors.ink }]}>Explore</Text>
            </View>
          </View>
          <Text style={[styles.counter, { color: colors.faint }]}>
            {index + 1} of {events.length}
          </Text>
        </>
      ) : (
        <View style={styles.empty}>
          {eventsQuery.isLoading ? <Loader /> : (
            <>
              <Text style={[styles.emptyTitle, { color: colors.ink }]}>No plans to Vizz yet.</Text>
              <Text style={[styles.emptyBody, { color: colors.muted }]}>
                {eventsQuery.data?.error?.message ?? 'New public events will appear here automatically.'}
              </Text>
            </>
          )}
        </View>
      )}
    </Screen>
  );
}

function VizzEventProfile({
  event,
  onOpen,
  onSave,
  saved,
}: {
  event: Event;
  onOpen: () => void;
  onSave: () => void;
  saved: boolean;
}) {
  const colors = useThemeColors();
  const attendees = event.attendees.slice(0, 5);

  return (
    <View
      style={[
        styles.profile,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.black,
        },
      ]}>
      <View style={styles.hero}>
        <Image
          accessibilityLabel={`${event.title} event`}
          cachePolicy="memory-disk"
          contentFit="cover"
          source={event.image}
          style={styles.heroImage}
          transition={220}
        />
        <View style={styles.editionMark}>
          <EventEditionMark previousOccurrences={event.previousOccurrences} inverted />
        </View>
        <Pressable
          accessibilityLabel={saved ? 'Remove from saved events' : 'Save event'}
          accessibilityRole="button"
          onPress={onSave}
          style={[styles.floatingSave, { backgroundColor: colors.overlayMedium }]}>
          <Text style={styles.saveGlyph}>{saved ? '●' : '○'}</Text>
        </Pressable>
      </View>

      <View style={styles.decisionBlock}>
        <View style={styles.titleRow}>
          <Text style={[styles.eventTitle, { color: colors.ink }]}>{event.title}</Text>
          <Text style={[styles.price, { color: colors.ink }]}>{event.priceLabel}</Text>
        </View>
        <Text style={[styles.vibe, { color: colors.muted }]}>{event.vibe}</Text>

        <View style={styles.factGrid}>
          <Fact label="When" value={`${event.dateLabel}\n${event.timeLabel}`} />
          <Fact label="Where" value={`${event.venue.name}\n${event.locality}`} />
        </View>

        {event.tags.length ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tags}>
            {event.tags.slice(0, 4).map((tag) => (
              <Text
                key={tag}
                style={[
                  styles.tag,
                  {
                    backgroundColor: colors.surfaceAlt,
                    color: colors.ink,
                  },
                ]}>
                {tag}
              </Text>
            ))}
          </ScrollView>
        ) : null}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.line }]} />

      <View style={styles.socialBlock}>
        <Text style={[styles.sectionEyebrow, { color: colors.faint }]}>THE PEOPLE</Text>
        <View style={styles.hostRow}>
          <Portrait
            fallbackUrl={portraitImages[0]}
            imageUrl={event.organizer.avatarUrl}
            initials={event.organizer.initials}
            label={`${event.organizer.name}, event host`}
            style={styles.hostPortrait}
          />
          <View style={styles.hostCopy}>
            <Text style={[styles.hostName, { color: colors.ink }]}>
              {event.organizer.name}
            </Text>
            <Text style={[styles.hostRole, { color: colors.muted }]}>
              {event.organizer.title}
            </Text>
            <Text numberOfLines={2} style={[styles.hostBio, { color: colors.muted }]}>
              {event.organizer.bio}
            </Text>
          </View>
          <Text style={[styles.rating, { color: colors.ink }]}>
            {event.organizer.rating}
          </Text>
        </View>

        <View style={styles.attendeeSection}>
          <View style={styles.attendeeStack}>
            {attendees.map((attendee, attendeeIndex) => (
              <Portrait
                key={attendee.id}
                fallbackUrl={portraitImages[(attendeeIndex + 1) % portraitImages.length]}
                imageUrl={attendee.avatarUrl}
                initials={attendee.initials}
                label={attendee.name}
                style={[
                  styles.attendeePortrait,
                  {
                    marginLeft: attendeeIndex === 0 ? 0 : -12,
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.attendeeCopy}>
            <Text style={[styles.attendeeTitle, { color: colors.ink }]}>
              {attendees.length
                ? `${attendees.map((attendee) => attendee.name.split(' ')[0]).slice(0, 2).join(', ')} and others`
                : 'Be among the first'}
            </Text>
            <Text style={[styles.attendeeMeta, { color: colors.muted }]}>
              {event.friendContext || `${event.attendees.length} people are already part of this room.`}
            </Text>
          </View>
        </View>

        <Pressable accessibilityRole="button" onPress={onOpen} style={styles.openProfile}>
          <Text style={[styles.openProfileText, { color: colors.ink }]}>See the full plan</Text>
          <Text style={[styles.openProfileArrow, { color: colors.brand }]}>→</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Portrait({
  fallbackUrl,
  imageUrl,
  initials,
  label,
  style,
}: {
  fallbackUrl?: string;
  imageUrl?: string | null;
  initials: string;
  label: string;
  style: object;
}) {
  const colors = useThemeColors();
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [imageUrl]);

  if (!imageUrl || failed) {
    return (
      <View style={[style, styles.portraitFallback, { backgroundColor: colors.surfaceAlt }]}>
        <Text style={[styles.portraitInitials, { color: colors.ink }]}>{initials}</Text>
      </View>
    );
  }

  return (
    <Image
      accessibilityLabel={label}
      contentFit="cover"
      onError={() => setFailed(true)}
      source={imageUrl || fallbackUrl}
      style={style}
      transition={180}
    />
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  const colors = useThemeColors();

  return (
    <View style={styles.fact}>
      <Text style={[styles.factLabel, { color: colors.faint }]}>{label}</Text>
      <Text style={[styles.factValue, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionItem: {
    alignItems: 'center',
    gap: 7,
  },
  actionLabel: {
    ...typographyRoles.micro,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 28,
    justifyContent: 'center',
  },
  attendeeCopy: {
    flex: 1,
    gap: 3,
  },
  attendeeMeta: {
    ...typographyRoles.caption,
  },
  attendeePortrait: {
    borderRadius: 999,
    height: 40,
    width: 40,
  },
  attendeeSection: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  attendeeStack: {
    flexDirection: 'row',
  },
  attendeeTitle: {
    ...typographyRoles.label,
  },
  counter: {
    ...typographyRoles.caption,
    textAlign: 'center',
  },
  decisionBlock: {
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 20,
  },
  empty: {
    gap: 8,
    paddingVertical: 28,
  },
  emptyBody: {
    ...typographyRoles.body,
  },
  emptyTitle: {
    ...typographyRoles.h3,
  },
  editionMark: {
    left: 14,
    position: 'absolute',
    top: 14,
  },
  eventTitle: {
    ...typographyRoles.cardTitle,
    flex: 1,
  },
  fact: {
    flex: 1,
    gap: 5,
  },
  factGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  factLabel: {
    ...typographyRoles.micro,
    textTransform: 'uppercase',
  },
  factValue: {
    ...typographyRoles.bodyStrong,
  },
  floatingSave: {
    alignItems: 'center',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    position: 'absolute',
    right: 14,
    top: 14,
    width: 42,
  },
  hero: {
    height: 370,
    position: 'relative',
  },
  heroImage: {
    height: '100%',
    width: '100%',
  },
  hostBio: {
    ...typographyRoles.caption,
  },
  hostCopy: {
    flex: 1,
    gap: 2,
  },
  hostName: {
    ...typographyRoles.h3,
  },
  hostPortrait: {
    borderRadius: 999,
    height: 62,
    width: 62,
  },
  hostRole: {
    ...typographyRoles.caption,
  },
  hostRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 13,
  },
  openProfile: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  openProfileArrow: {
    fontSize: 24,
  },
  openProfileText: {
    ...typographyRoles.label,
  },
  price: {
    ...typographyRoles.label,
    paddingTop: 5,
  },
  primaryAction: {
    height: 58,
    width: 58,
  },
  portraitFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  portraitInitials: {
    ...typographyRoles.caption,
  },
  profile: {
    borderRadius: 28,
    elevation: 5,
    overflow: 'hidden',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  rating: {
    ...typographyRoles.label,
  },
  saveGlyph: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 24,
  },
  secondaryAction: {
    borderWidth: 1,
    height: 52,
    width: 52,
  },
  sectionEyebrow: {
    ...typographyRoles.micro,
    letterSpacing: 0.8,
  },
  socialBlock: {
    gap: 18,
    padding: 20,
  },
  tag: {
    ...typographyRoles.caption,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tags: {
    gap: 8,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
  },
  vibe: {
    ...typographyRoles.body,
  },
});

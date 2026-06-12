import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Event } from '@hausy/types';
import { countConfirmed } from '@hausy/utils';
import { Avatar } from '../primitives/avatar';
import { EventEditionMark } from '../primitives/event-edition-mark';
import { radius, spacing, typographyRoles, useThemeColors } from '../styles/theme';

const TRUST_CHIPS = ['Verified Host', 'Women-friendly', 'First-timer Friendly', 'Balanced Crowd'];

export function EditorialHomeHeader({
  city,
  onNotificationPress,
}: {
  city: string;
  onNotificationPress?: () => void;
}) {
  const colors = useThemeColors();

  return (
    <View style={styles.header}>
      <View style={styles.wordmarkBlock}>
        <View style={styles.wordmarkRow}>
          <Text style={[styles.wordmark, { color: colors.ink }]}>hausy</Text>
          <View style={[styles.logoDot, { backgroundColor: colors.brand }]} />
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={17} color={colors.ink} />
          <Text style={[styles.locationText, { color: colors.ink }]}>{city}</Text>
          <Ionicons name="chevron-down" size={16} color={colors.ink} />
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open notifications"
        onPress={onNotificationPress}
        style={[styles.notificationButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}>
        <Ionicons name="notifications-outline" size={25} color={colors.ink} />
        <View style={[styles.notificationDot, { backgroundColor: colors.brand }]} />
      </Pressable>
    </View>
  );
}

export function EditorialSearch({
  query,
  onChangeQuery,
}: {
  query: string;
  onChangeQuery: (value: string) => void;
}) {
  const colors = useThemeColors();

  return (
    <View style={[styles.searchShell, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}>
      <Ionicons name="search-outline" size={24} color={colors.muted} />
      <TextInput
        value={query}
        onChangeText={onChangeQuery}
        placeholder="Search events, people, or communities"
        placeholderTextColor={colors.faint}
        style={[styles.searchInput, { color: colors.ink }]}
      />
    </View>
  );
}

export function EditorialCategoryTabs({
  activeTab,
  tabs,
  onChangeTab,
}: {
  activeTab: string;
  tabs: string[];
  onChangeTab: (tab: string) => void;
}) {
  const colors = useThemeColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
      {tabs.map((tab, index) => {
        const active = tab === activeTab;

        return (
          <View key={tab} style={styles.categoryItem}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onChangeTab(tab)}
              style={[
                styles.categoryPill,
                active && { backgroundColor: colors.black },
              ]}>
              <Text style={[styles.categoryText, { color: active ? colors.white : colors.ink }]}>{tab}</Text>
            </Pressable>
            {!active && index < tabs.length - 1 ? <View style={[styles.categoryDivider, { backgroundColor: colors.line }]} /> : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

export function FeaturedEventCard({
  event,
  saved,
  onPress,
  onSave,
}: {
  event: Event;
  saved?: boolean;
  onPress?: () => void;
  onSave?: () => void;
}) {
  const colors = useThemeColors();
  const confirmed = countConfirmed(event.attendees);

  return (
    <Pressable onPress={onPress} style={[styles.featuredCard, { backgroundColor: colors.black }]}>
      <Image source={{ uri: event.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        intensity={12}
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        tint="dark"
      />
      <View style={[styles.featuredShade, { backgroundColor: colors.overlaySoft }]} />

      <View style={styles.featuredTopRow}>
        <EventEditionMark previousOccurrences={event.previousOccurrences} inverted />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Unsave event' : 'Save event'}
          onPress={onSave}
          style={[styles.featureSave, { borderColor: colors.overlayBorder }]}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={25} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: colors.white }]}>{event.title}</Text>
        <Text style={[styles.featureVibe, { color: colors.white }]}>{event.vibe}</Text>
        <EventMetaRow event={event} light />
        <View style={[styles.featureRule, { backgroundColor: colors.overlayBorder }]} />
        <View style={styles.featureHostRow}>
          <View style={styles.hostIdentity}>
            <Avatar
              accessibilityLabel={event.organizer.name}
              imageUrl={event.organizer.avatarUrl}
              label={event.organizer.initials}
              color={colors.elevatedSurface}
              size={42}
            />
            <View>
              <View style={styles.verifiedNameRow}>
                <Text style={[styles.featureHostName, { color: colors.white }]}>{event.organizer.name}</Text>
                <Ionicons name="checkmark-circle" size={15} color={colors.brand} />
              </View>
              <Text style={[styles.featureHostLabel, { color: colors.overlayLight }]}>{event.organizer.title}</Text>
            </View>
          </View>
          <View style={styles.goingCluster}>
            <AvatarStack event={event} light />
            <Text style={[styles.featureGoing, { color: colors.white }]}>{confirmed || event.capacity} going</Text>
          </View>
        </View>
        <TrustChipRow light />
      </View>
    </Pressable>
  );
}

export function CompactEventCard({
  event,
  saved,
  onPress,
  onSave,
}: {
  event: Event;
  saved?: boolean;
  onPress?: () => void;
  onSave?: () => void;
}) {
  const colors = useThemeColors();
  const confirmed = countConfirmed(event.attendees);

  return (
    <Pressable onPress={onPress} style={[styles.compactCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <View style={styles.compactMain}>
        <View style={styles.compactImageColumn}>
          <Image source={{ uri: event.image }} style={styles.compactImage} contentFit="cover" />
          <View style={styles.compactEdition}>
            <EventEditionMark previousOccurrences={event.previousOccurrences} />
          </View>
        </View>
        <View style={styles.compactCopy}>
          <View style={styles.compactTitleRow}>
            <View style={styles.compactTitleBlock}>
              <Text style={[styles.compactTitle, { color: colors.ink }]} numberOfLines={2}>
                {event.title}
              </Text>
              <Text style={[styles.compactVibe, { color: colors.muted }]} numberOfLines={1}>
                {event.vibe}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={saved ? 'Unsave event' : 'Save event'}
              onPress={onSave}
              style={styles.compactSave}>
              <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={25} color={colors.ink} />
            </Pressable>
          </View>
          <EventMetaRow event={event} />
          <View style={styles.compactHostFooter}>
            <View style={styles.hostIdentity}>
              <Avatar
                accessibilityLabel={event.organizer.name}
                imageUrl={event.organizer.avatarUrl}
                label={event.organizer.initials}
                color={colors.surfaceLift}
                size={33}
              />
              <View>
                <View style={styles.verifiedNameRow}>
                  <Text style={[styles.compactHostName, { color: colors.ink }]}>{event.organizer.name}</Text>
                  <Ionicons name="checkmark-circle" size={13} color={colors.brand} />
                </View>
                <Text style={[styles.compactHostLabel, { color: colors.muted }]}>{event.organizer.title}</Text>
              </View>
            </View>
            <View style={styles.compactGoing}>
              <AvatarStack event={event} />
              <Text style={[styles.goingText, { color: colors.ink }]}>{confirmed || event.capacity} going</Text>
            </View>
          </View>
        </View>
      </View>
      <TrustChipRow />
    </Pressable>
  );
}

function EventMetaRow({ event, light }: { event: Event; light?: boolean }) {
  const colors = useThemeColors();
  const textColor = light ? colors.white : colors.ink;
  const iconColor = light ? colors.white : colors.muted;

  return (
    <View style={styles.metaRow}>
      <Ionicons name="calendar-outline" size={16} color={iconColor} />
      <Text style={[styles.metaText, { color: textColor }]} numberOfLines={1}>
        {event.dateLabel}, {event.timeLabel}
      </Text>
      <Text style={[styles.metaDot, { color: textColor }]}>•</Text>
      <Ionicons name="location-outline" size={16} color={iconColor} />
      <Text style={[styles.metaText, { color: textColor }]} numberOfLines={1}>
        {event.locality}, {event.venue.city}
      </Text>
    </View>
  );
}

function AvatarStack({ event, light }: { event: Event; light?: boolean }) {
  const colors = useThemeColors();

  return (
    <View style={styles.avatarStack}>
      {event.attendees.slice(0, 3).map((attendee, index) => (
        <View
          key={`${attendee.id}-${index}`}
          style={[
            styles.stackedAvatar,
            {
              borderColor: light ? colors.black : colors.surface,
              marginLeft: index === 0 ? 0 : -9,
            },
          ]}>
          <Avatar
            accessibilityLabel={attendee.name}
            imageUrl={attendee.avatarUrl}
            label={attendee.initials}
            color={light ? colors.white : colors.surfaceLift}
            size={28}
          />
        </View>
      ))}
    </View>
  );
}

function TrustChipRow({ light }: { light?: boolean }) {
  const colors = useThemeColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trustRow}>
      {TRUST_CHIPS.map((chip) => (
        <View
          key={chip}
          style={[
            styles.trustChip,
            {
              backgroundColor: light ? colors.overlayPanel : colors.surfaceLift,
              borderColor: light ? colors.overlayBorder : colors.line,
            },
          ]}>
          <Ionicons name={chip === 'Verified Host' ? 'shield-checkmark-outline' : 'people-outline'} size={14} color={colors.ink} />
          <Text style={[styles.trustChipText, { color: colors.ink }]}>{chip}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  wordmarkBlock: {
    gap: spacing.xs,
  },
  wordmarkRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  wordmark: {
    ...typographyRoles.wordmark,
  },
  logoDot: {
    borderRadius: 5,
    height: 9,
    marginLeft: 3,
    marginTop: 6,
    width: 9,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  locationText: {
    ...typographyRoles.bodyStrong,
  },
  notificationButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  notificationDot: {
    borderRadius: 4,
    height: 8,
    position: 'absolute',
    right: 7,
    top: 7,
    width: 8,
  },
  searchShell: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 61,
    paddingHorizontal: spacing.lg,
  },
  searchInput: {
    ...typographyRoles.body,
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
  },
  categoryRow: {
    gap: 10,
    paddingRight: spacing.xl,
  },
  categoryItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  categoryPill: {
    borderRadius: radius.md,
    minHeight: 38,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  categoryText: {
    ...typographyRoles.label,
  },
  categoryDivider: {
    height: 24,
    width: 1,
  },
  featuredCard: {
    borderRadius: 18,
    minHeight: 522,
    overflow: 'hidden',
  },
  featuredShade: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  featureBadge: {
    alignItems: 'center',
    borderRadius: radius.sm,
    flexDirection: 'row',
    gap: 5,
    minHeight: 31,
    paddingHorizontal: spacing.sm,
  },
  featureBadgeText: {
    ...typographyRoles.caption,
  },
  featureSave: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  featureContent: {
    bottom: 0,
    gap: spacing.md,
    left: 0,
    padding: spacing.lg,
    position: 'absolute',
    right: 0,
  },
  featureTitle: {
    ...typographyRoles.poster,
    maxWidth: 290,
  },
  featureVibe: {
    ...typographyRoles.h3,
  },
  featureRule: {
    height: 1,
  },
  featureHostRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  hostIdentity: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minWidth: 0,
  },
  verifiedNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  featureHostName: {
    ...typographyRoles.bodyStrong,
  },
  featureHostLabel: {
    ...typographyRoles.caption,
  },
  goingCluster: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  featureGoing: {
    ...typographyRoles.caption,
  },
  compactCard: {
    borderRadius: 17,
    borderWidth: 1,
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.sm,
  },
  compactMain: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  compactImageColumn: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  compactImage: {
    borderRadius: 13,
    height: 168,
    width: 148,
  },
  compactEdition: {
    left: 8,
    position: 'absolute',
    top: 8,
  },
  compactCopy: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
    paddingVertical: spacing.sm,
  },
  compactTitleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  compactTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  compactTitle: {
    ...typographyRoles.cardTitle,
  },
  compactVibe: {
    ...typographyRoles.body,
  },
  compactSave: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaText: {
    ...typographyRoles.caption,
    flexShrink: 1,
  },
  metaDot: {
    ...typographyRoles.caption,
  },
  compactHostFooter: {
    gap: spacing.sm,
  },
  compactHostName: {
    ...typographyRoles.caption,
  },
  compactHostLabel: {
    ...typographyRoles.micro,
  },
  compactGoing: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  goingText: {
    ...typographyRoles.caption,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  stackedAvatar: {
    borderRadius: 15,
  },
  trustRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  trustChip: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    minHeight: 34,
    paddingHorizontal: spacing.sm,
  },
  trustChipText: {
    ...typographyRoles.micro,
  },
});

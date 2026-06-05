import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { eventStatusLabel, type Event } from '@hausy/types';
import { countConfirmed, formatEventMeta } from '@hausy/utils';
import { Avatar } from '../primitives/avatar';
import { Badge } from '../primitives/badge';
import { IconButton } from '../primitives/icon-button';
import { Typography } from '../primitives/typography';
import { componentTokens, radius, spacing, typographyRoles, useThemeColors } from '../styles/theme';

export function EventCard({
  event,
  saved,
  joined,
  onPress,
  onSave,
}: {
  event: Event;
  saved?: boolean;
  joined?: boolean;
  onPress?: () => void;
  onSave?: () => void;
}) {
  const confirmed = countConfirmed(event.attendees);
  const colors = useThemeColors();

  return (
    <Pressable onPress={onPress} style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <Image source={{ uri: event.image }} style={styles.eventImage} contentFit="cover" />
      <View style={[styles.eventOverlay, { backgroundColor: colors.overlaySoft }]} />
      <View style={[styles.eventPoster, { backgroundColor: colors.overlayMedium, borderColor: colors.overlayLight }]}>
        <Typography variant="h2" style={[styles.posterText, { color: colors.white }]}>
          {event.posterText}
        </Typography>
      </View>
      <View style={styles.eventButtons}>
        <IconButton
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          onPress={onSave}
          color={colors.white}
          style={[styles.saveButton, { backgroundColor: colors.overlayMedium, borderColor: colors.overlayBorder }]}
        />
      </View>
      <View style={styles.eventText}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eventTopline}>
          <Badge
            label={eventStatusLabel[event.status]}
            status={event.status === 'cancelled' ? 'cancelled' : event.status === 'confirmed' ? 'confirmed' : 'planning'}
          />
          <Badge label={event.priceLabel} />
          {joined ? <Badge label="Going" active /> : null}
        </ScrollView>
        <Typography variant="h2" style={styles.eventTitle}>
          {event.title}
        </Typography>
        <Typography variant="caption" muted style={styles.eventMeta}>
          {formatEventMeta(event)}
        </Typography>
        <View style={styles.creatorRow}>
          <Avatar label={event.organizer.initials} color={event.organizer.color} size={34} />
          <View style={styles.creatorCopy}>
            <Typography variant="caption" muted>
              Creator
            </Typography>
            <Typography variant="caption">{event.organizer.name}</Typography>
          </View>
        </View>
        <View style={styles.eventFooter}>
          <View style={styles.friendStack}>
            {event.attendees.slice(0, 6).map((attendee, index) => (
              <View key={`${attendee.id}-${index}`} style={{ marginLeft: index === 0 ? 0 : -7 }}>
                <Avatar label={attendee.initials.slice(0, 1)} color={attendee.color} size={30} />
              </View>
            ))}
            <View style={[styles.moreBubble, { backgroundColor: colors.surfaceLift, borderColor: colors.bg, marginLeft: -7 }]}>
              <Text style={[styles.moreBubbleText, { color: colors.ink }]}>+{Math.max(event.capacity - 6, 0)}</Text>
            </View>
          </View>
          <Typography variant="caption">
            {confirmed}/{event.capacity} confirmed
          </Typography>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    minHeight: componentTokens.cards.eventMinHeight,
    overflow: 'hidden',
  },
  eventImage: {
    height: componentTokens.hero.imageHeight,
    width: '100%',
  },
  eventOverlay: {
    height: componentTokens.hero.imageHeight,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  eventPoster: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    left: spacing['2xl'],
    minHeight: componentTokens.hero.posterMinHeight,
    padding: spacing.lg,
    position: 'absolute',
    right: spacing['2xl'],
    top: 74,
  },
  posterText: {
    textAlign: 'center',
  },
  eventButtons: {
    gap: spacing.md,
    position: 'absolute',
    right: 14,
    top: 14,
  },
  saveButton: {
    height: componentTokens.controls.iconButtonSize,
    width: componentTokens.controls.iconButtonSize,
  },
  eventText: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  eventTopline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  eventTitle: {
    fontSize: typographyRoles.h2.fontSize,
  },
  eventMeta: {
    fontSize: typographyRoles.body.fontSize,
  },
  creatorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: 2,
  },
  creatorCopy: {
    gap: 1,
  },
  eventFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  friendStack: {
    flexDirection: 'row',
  },
  moreBubble: {
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 2,
    height: 30,
    justifyContent: 'center',
    width: 40,
  },
  moreBubbleText: {
    ...typographyRoles.caption,
  },
});

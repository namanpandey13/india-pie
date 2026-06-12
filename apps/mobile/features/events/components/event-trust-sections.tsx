import { Ionicons } from '@expo/vector-icons';
import { rsvpStatusLabel, type Event, type HostProfile } from '@hausy/types';
import { EventEditionMark, typographyRoles, useThemeColors } from '@hausy/ui';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function EventIntro({ event }: { event: Event }) {
  const colors = useThemeColors();

  return (
    <View style={styles.intro}>
      <View style={styles.titleRow}>
        <Text style={[styles.eventTitle, { color: colors.ink }]}>{event.title}</Text>
        <View style={styles.identityMeta}>
          <EventEditionMark previousOccurrences={event.previousOccurrences} />
          <Text style={[styles.price, { color: colors.muted }]}>{event.priceLabel}</Text>
        </View>
      </View>
      <Text style={[styles.description, { color: colors.muted }]}>{event.about || event.vibe}</Text>
      <View style={styles.details}>
        <Detail icon="calendar-outline" text={`${event.dateLabel} at ${event.timeLabel}`} />
        <Detail icon="location-outline" text={`${event.venue.name}, ${event.locality}`} />
      </View>
      {event.tags.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
          {event.tags.slice(0, 4).map((tag) => (
            <Text key={tag} style={[styles.tag, { backgroundColor: colors.surfaceAlt, color: colors.ink }]}>
              {tag}
            </Text>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

export function RsvpActionPanel({
  error,
  requested,
  status,
  onRequest,
  onContact,
  onMore,
}: {
  error?: string | null;
  requested: boolean;
  status?: keyof typeof rsvpStatusLabel | 'draft';
  onRequest: () => void;
  onContact: () => void;
  onMore: () => void;
}) {
  const colors = useThemeColors();
  const registerLabel = requested
    ? rsvpStatusLabel[status === 'draft' || !status ? 'requested' : status]
    : 'Register';

  return (
    <View style={styles.actionArea}>
      <View style={styles.actionRow}>
        <Pressable onPress={requested ? undefined : onRequest} style={[styles.registerAction, { backgroundColor: colors.brand }]}>
          <Ionicons name={requested ? 'checkmark-circle-outline' : 'ticket-outline'} size={19} color={colors.black} />
          <Text style={[styles.actionText, { color: colors.black }]}>{registerLabel}</Text>
        </Pressable>
        <ActionButton icon="chatbubble-outline" label="Contact" onPress={onContact} />
        <Pressable
          accessibilityLabel="More event options"
          onPress={onMore}
          style={[styles.moreAction, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}>
          <Ionicons name="ellipsis-horizontal" size={21} color={colors.ink} />
        </Pressable>
      </View>
      {error ? <Text style={[styles.helper, { color: colors.ink }]}>{error}</Text> : null}
    </View>
  );
}

export function HostTrustPanel({
  followed,
  host,
  onFollow,
  onOpenProfile,
}: {
  followed: boolean;
  host: HostProfile;
  onFollow: () => void;
  onOpenProfile?: () => void;
}) {
  const colors = useThemeColors();

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: colors.ink }]}>Hosted by</Text>
      <View style={styles.hostRow}>
        <Pressable onPress={onOpenProfile}>
        <Portrait imageUrl={host.avatarUrl} initials={host.initials} label={host.name} style={styles.hostImage} />
        </Pressable>
        <View style={styles.hostCopy}>
          <Pressable onPress={onOpenProfile}>
            <Text style={[styles.hostName, { color: colors.ink }]}>{host.name}</Text>
          </Pressable>
          <Text style={[styles.hostTitle, { color: colors.muted }]}>{host.title}</Text>
          <Text numberOfLines={2} style={[styles.hostBio, { color: colors.muted }]}>{host.bio}</Text>
        </View>
        <Pressable onPress={onFollow} style={[styles.followAction, { borderColor: colors.line }]}>
          <Text style={[styles.followText, { color: colors.ink }]}>{followed ? 'Following' : 'Follow'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function AttendeePreview({
  event,
  onOpenProfile,
}: {
  event: Event;
  onOpenProfile?: (id: string) => void;
}) {
  const colors = useThemeColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.peopleBlock}>
      <Pressable onPress={() => setExpanded((value) => !value)} style={styles.peopleSummary}>
        <View style={styles.avatarStack}>
          {event.attendees.slice(0, 5).map((attendee, index) => (
            <View key={attendee.id} style={[styles.stackAvatar, { marginLeft: index ? -10 : 0 }]}>
              <Portrait imageUrl={attendee.avatarUrl} initials={attendee.initials} label={attendee.name} style={styles.stackPortrait} />
            </View>
          ))}
        </View>
        <Text style={[styles.peopleLabel, { color: colors.muted }]}>
          {event.attendees.length} people joining
        </Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
      </Pressable>
      {expanded ? (
        <ScrollView nestedScrollEnabled style={[styles.peopleList, { borderColor: colors.line }]}>
          {event.attendees.map((attendee) => (
            <View key={attendee.id} style={styles.personRow}>
              <Pressable onPress={() => onOpenProfile?.(attendee.id)}>
                <Portrait imageUrl={attendee.avatarUrl} initials={attendee.initials} label={attendee.name} style={styles.listPortrait} />
              </Pressable>
              <Pressable onPress={() => onOpenProfile?.(attendee.id)} style={styles.personCopy}>
                <Text style={[styles.personName, { color: colors.ink }]}>{attendee.name}</Text>
                <Text numberOfLines={1} style={[styles.personSignal, { color: colors.muted }]}>{attendee.role}</Text>
              </Pressable>
              <Pressable onPress={() => Linking.openURL('https://instagram.com')} hitSlop={8}>
                <Ionicons name="logo-instagram" size={18} color={colors.muted} />
              </Pressable>
              <Pressable onPress={() => Linking.openURL('https://linkedin.com')} hitSlop={8}>
                <Ionicons name="logo-linkedin" size={18} color={colors.muted} />
              </Pressable>
              <Pressable style={[styles.personFollow, { borderColor: colors.line }]}>
                <Text style={[styles.personFollowText, { color: colors.ink }]}>Follow</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

function ActionButton({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  const colors = useThemeColors();
  return (
    <Pressable onPress={onPress} style={[styles.secondaryAction, { backgroundColor: colors.surfaceAlt, borderColor: colors.line }]}>
      <Ionicons name={icon} size={18} color={colors.ink} />
      <Text style={[styles.actionText, { color: colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

export function EventStory({ event }: { event: Event }) {
  const colors = useThemeColors();
  const prompts = event.prompts.slice(0, 2);

  if (!prompts.length) {
    return null;
  }

  return (
    <View style={styles.story}>
      <View style={[styles.promptMoment, { backgroundColor: colors.surfaceAlt }]}>
        <Text style={[styles.promptQuote, { color: colors.ink }]}>{prompts[0]}</Text>
      </View>
      <Image accessibilityLabel={`A closer look at ${event.title}`} contentFit="cover" source={event.image} style={styles.storyImage} />
      {prompts[1] ? (
        <View style={styles.promptMomentPlain}>
          <Text style={[styles.label, { color: colors.ink }]}>A good fit if...</Text>
          <Text style={[styles.promptQuoteSmall, { color: colors.ink }]}>{prompts[1]}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Detail({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const colors = useThemeColors();
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={18} color={colors.muted} />
      <Text style={[styles.detailText, { color: colors.ink }]}>{text}</Text>
    </View>
  );
}

function Portrait({
  imageUrl,
  initials,
  label,
  style,
}: {
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
  return <Image accessibilityLabel={label} contentFit="cover" onError={() => setFailed(true)} source={imageUrl} style={style} />;
}

const styles = StyleSheet.create({
  description: { ...typographyRoles.body, fontSize: 16, lineHeight: 24 },
  detailRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  details: { gap: 10 },
  detailText: { ...typographyRoles.bodyStrong, flex: 1 },
  eventTitle: { ...typographyRoles.hero, flex: 1 },
  actionArea: { gap: 8 },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionText: { ...typographyRoles.label },
  registerAction: { alignItems: 'center', borderRadius: 999, flex: 1.35, flexDirection: 'row', gap: 8, justifyContent: 'center', minHeight: 50 },
  secondaryAction: { alignItems: 'center', borderRadius: 999, borderWidth: 1, flex: 1, flexDirection: 'row', gap: 7, justifyContent: 'center', minHeight: 50 },
  moreAction: { alignItems: 'center', borderRadius: 999, borderWidth: 1, height: 50, justifyContent: 'center', width: 50 },
  followAction: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  followText: { ...typographyRoles.label },
  helper: { ...typographyRoles.caption, textAlign: 'center' },
  hostBio: { ...typographyRoles.caption },
  hostCopy: { flex: 1, gap: 3 },
  hostImage: { borderRadius: 999, height: 68, width: 68 },
  hostName: { ...typographyRoles.h3 },
  hostRow: { alignItems: 'center', flexDirection: 'row', gap: 14 },
  hostTitle: { ...typographyRoles.caption },
  intro: { gap: 16 },
  identityMeta: { alignItems: 'flex-end', gap: 8 },
  label: { ...typographyRoles.h3 },
  avatarStack: { alignItems: 'center', flexDirection: 'row' },
  peopleBlock: { gap: 12 },
  peopleSummary: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  peopleLabel: { ...typographyRoles.caption, flex: 1 },
  stackAvatar: { borderRadius: 999 },
  stackPortrait: { borderRadius: 999, height: 34, width: 34 },
  peopleList: { borderTopWidth: 1, maxHeight: 250, paddingTop: 4 },
  personRow: { alignItems: 'center', flexDirection: 'row', gap: 10, minHeight: 62 },
  listPortrait: { borderRadius: 999, height: 42, width: 42 },
  personCopy: { flex: 1, minWidth: 0 },
  personName: { ...typographyRoles.caption },
  personSignal: { ...typographyRoles.micro },
  personFollow: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  personFollowText: { ...typographyRoles.micro },
  portraitFallback: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  portraitInitials: { ...typographyRoles.caption },
  price: { ...typographyRoles.label, paddingTop: 9 },
  promptMoment: { borderRadius: 22, padding: 24 },
  promptMomentPlain: { gap: 10, paddingHorizontal: 4 },
  promptQuote: { ...typographyRoles.h2, lineHeight: 34 },
  promptQuoteSmall: { ...typographyRoles.h3, lineHeight: 28 },
  section: { gap: 16, paddingTop: 6 },
  story: { gap: 24, paddingTop: 6 },
  storyImage: { borderRadius: 22, height: 300, width: '100%' },
  tag: { ...typographyRoles.caption, borderRadius: 999, overflow: 'hidden', paddingHorizontal: 12, paddingVertical: 8 },
  tags: { gap: 8, paddingRight: 18 },
  titleRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 14 },
});

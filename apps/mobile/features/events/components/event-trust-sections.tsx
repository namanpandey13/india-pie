import type { RsvpDraft } from '@/state/app-store';
import { Ionicons } from '@expo/vector-icons';
import { rsvpStatusLabel, type Event, type HostProfile } from '@hausy/types';
import { EventEditionMark, GhostButton, PrimaryButton, typographyRoles, useThemeColors } from '@hausy/ui';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

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
  draft,
  error,
  event,
  onCancel,
  requested,
  status,
  onRequest,
  onUpdateDraft,
}: {
  draft?: RsvpDraft;
  error?: string | null;
  event: Event;
  onCancel: () => void;
  requested: boolean;
  status?: keyof typeof rsvpStatusLabel | 'draft';
  onRequest: () => void;
  onUpdateDraft: (patch: Partial<RsvpDraft>) => void;
}) {
  const colors = useThemeColors();
  const selectedDate = draft?.selectedDate || `${event.dateLabel}, ${event.timeLabel}`;
  const note = draft?.note ?? '';
  const ready = note.trim().length >= 8;

  return (
    <View style={[styles.rsvp, { backgroundColor: colors.surfaceAlt }]}>
      <Text style={[styles.label, { color: colors.ink }]}>Send a request</Text>
      <TextInput
        value={note}
        onChangeText={(value) => onUpdateDraft({ note: value, selectedDate })}
        placeholder="Add a note to the host..."
        placeholderTextColor={colors.faint}
        multiline
        style={[styles.noteInput, { color: colors.ink }]}
      />
      <PrimaryButton
        label={requested ? rsvpStatusLabel[status === 'draft' || !status ? 'requested' : status] : 'Send request'}
        icon={requested ? 'checkmark-circle-outline' : 'send-outline'}
        onPress={ready ? onRequest : undefined}
      />
      {requested ? <GhostButton label="Cancel request" icon="close-circle-outline" onPress={onCancel} /> : null}
      {!ready && !requested ? (
        <Text style={[styles.helper, { color: colors.faint }]}>Write one short sentence to send your request.</Text>
      ) : null}
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
      <Pressable onPress={onOpenProfile} style={styles.hostRow}>
        <Portrait imageUrl={host.avatarUrl} initials={host.initials} label={host.name} style={styles.hostImage} />
        <View style={styles.hostCopy}>
          <Text style={[styles.hostName, { color: colors.ink }]}>{host.name}</Text>
          <Text style={[styles.hostTitle, { color: colors.muted }]}>{host.title}</Text>
          <Text numberOfLines={2} style={[styles.hostBio, { color: colors.muted }]}>{host.bio}</Text>
        </View>
        <Ionicons name="chevron-forward" size={19} color={colors.faint} />
      </Pressable>
      <Pressable onPress={onFollow} style={styles.followAction}>
        <Ionicons name={followed ? 'checkmark' : 'person-add-outline'} size={17} color={colors.ink} />
        <Text style={[styles.followText, { color: colors.ink }]}>{followed ? 'Following' : 'Follow host'}</Text>
      </Pressable>
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

  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: colors.ink }]}>People joining</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.peopleRow}>
        {event.attendees.map((attendee) => (
          <Pressable key={attendee.id} onPress={() => onOpenProfile?.(attendee.id)} style={styles.person}>
            <Portrait imageUrl={attendee.avatarUrl} initials={attendee.initials} label={attendee.name} style={styles.personImage} />
            <Text numberOfLines={1} style={[styles.personName, { color: colors.ink }]}>{attendee.name.split(' ')[0]}</Text>
            <Text numberOfLines={1} style={[styles.personSignal, { color: colors.muted }]}>{attendee.role}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
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
  followAction: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: 7, paddingVertical: 4 },
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
  noteInput: { ...typographyRoles.bodyStrong, minHeight: 76, padding: 0, textAlignVertical: 'top' },
  peopleRow: { gap: 18, paddingRight: 18 },
  person: { gap: 6, width: 72 },
  personImage: { borderRadius: 24, height: 88, width: 72 },
  personName: { ...typographyRoles.caption },
  personSignal: { ...typographyRoles.micro },
  portraitFallback: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  portraitInitials: { ...typographyRoles.caption },
  price: { ...typographyRoles.label, paddingTop: 9 },
  promptMoment: { borderRadius: 22, padding: 24 },
  promptMomentPlain: { gap: 10, paddingHorizontal: 4 },
  promptQuote: { ...typographyRoles.h2, lineHeight: 34 },
  promptQuoteSmall: { ...typographyRoles.h3, lineHeight: 28 },
  rsvp: { borderRadius: 22, gap: 14, padding: 18 },
  section: { gap: 16, paddingTop: 6 },
  story: { gap: 24, paddingTop: 6 },
  storyImage: { borderRadius: 22, height: 300, width: '100%' },
  tag: { ...typographyRoles.caption, borderRadius: 999, overflow: 'hidden', paddingHorizontal: 12, paddingVertical: 8 },
  tags: { gap: 8, paddingRight: 18 },
  titleRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 14 },
});

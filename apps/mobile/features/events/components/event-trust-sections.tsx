import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { eventStatusLabel, rsvpStatusLabel, type Event, type EventCheckpoint, type HostProfile, type Review } from '@hausy/types';
import {
  ActionBar,
  Avatar,
  Badge,
  Card,
  GhostButton,
  HostSummary,
  PrimaryButton,
  ReviewCard,
  SectionTitle,
  TrustSignal,
  Typography,
  typographyRoles,
  useThemeColors,
} from '@hausy/ui';
import type { RsvpDraft } from '@/state/app-store';

export function EventIntro({ event }: { event: Event }) {
  return (
    <View style={styles.section}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badges}>
        <Badge
          label={eventStatusLabel[event.status]}
          status={event.status === 'cancelled' ? 'cancelled' : event.status === 'confirmed' ? 'confirmed' : 'planning'}
        />
        <Badge label={event.priceLabel} />
      </ScrollView>
      <Typography variant="h1">{event.title}</Typography>
      <Typography muted>
        {event.vibe}
      </Typography>
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
  return (
    <View style={styles.section}>
      <SectionTitle title="Host" action="Trust anchor" />
      <HostSummary host={host} />
      <GhostButton
        label="View profile"
        icon="person-circle-outline"
        onPress={onOpenProfile}
      />
      <GhostButton
        label={followed ? 'Following host' : 'Follow host'}
        icon={followed ? 'checkmark-circle-outline' : 'person-add-outline'}
        onPress={onFollow}
      />
    </View>
  );
}

export function SocialTrustPanel({
  event,
  checkpoints,
}: {
  event: Event;
  checkpoints: EventCheckpoint[];
}) {
  const verifiedCheckpoints = [...event.checkpoints, ...checkpoints].filter((checkpoint) => checkpoint.verifiedAt);

  return (
    <View style={styles.section}>
      <SectionTitle title="Plan readiness" action={eventStatusLabel[event.status]} />
      <Card style={styles.stackCard}>
        {verifiedCheckpoints.length > 0 ? (
          verifiedCheckpoints.map((checkpoint, index) => <TrustSignal key={`${checkpoint.id}-${index}`} label={checkpoint.label} />)
        ) : (
          <Typography muted>Readiness checks appear after the creator verifies venue, route, and guest-list steps.</Typography>
        )}
      </Card>
    </View>
  );
}

export function WhatYouDoPanel({ event }: { event: Event }) {
  const colors = useThemeColors();

  return (
    <View style={styles.section}>
      <SectionTitle title="What you'll do" />
      <Card style={styles.stackCard}>
        <Typography muted>{event.about}</Typography>
        {event.prompts.map((prompt, index) => (
          <View key={`${prompt}-${index}`} style={styles.promptRow}>
            <Ionicons name="sparkles-outline" size={17} color={colors.brand} />
            <Typography style={styles.promptText}>{prompt}</Typography>
          </View>
        ))}
      </Card>
    </View>
  );
}

export function AttendeePreview({ event, onOpenProfile }: { event: Event; onOpenProfile?: (id: string) => void }) {
  const colors = useThemeColors();

  return (
    <View style={styles.section}>
      <SectionTitle title="Attendee vibe" action={`${event.attendees.length} previewed`} />
      <Card style={styles.stackCard}>
        <Typography muted>{event.friendContext}</Typography>
        {event.attendees.map((attendee, index) => (
          <Pressable key={`${attendee.id}-${index}`} onPress={() => onOpenProfile?.(attendee.id)} style={styles.attendeeRow}>
            <Avatar label={attendee.initials} color={attendee.color} size={42} />
            <View style={styles.attendeeCopy}>
              <Typography variant="caption">{attendee.name}</Typography>
              <Typography variant="caption" muted>
                {attendee.role}
              </Typography>
              <Typography variant="caption" style={{ color: colors.brand }}>
                {attendee.signal}
              </Typography>
            </View>
            <Text style={[styles.status, { color: colors.faint }]}>{attendee.status}</Text>
          </Pressable>
        ))}
      </Card>
    </View>
  );
}

export function ReviewsPreview({ reviews }: { reviews: Review[] }) {
  return (
    <View style={styles.section}>
      <SectionTitle title="Reviews" action="Specific stories" />
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </View>
  );
}

export function LogisticsPanel({ event }: { event: Event }) {
  return (
    <View style={styles.section}>
      <SectionTitle title="Logistics" />
      <Card style={styles.stackCard}>
        <TrustSignal label={`${event.venue.name} - ${event.venue.locality}`} />
        <TrustSignal label={`${event.dateLabel}, ${event.timeLabel}`} />
        <TrustSignal label={`${event.capacity} guest cap`} />
      </Card>
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
  const ready = selectedDate.length > 0 && note.trim().length >= 8;

  return (
    <View style={styles.section}>
      <SectionTitle title="RSVP" action="Final step" />
      <Card style={styles.stackCard}>
        <Typography muted>
          Requesting is not an attendance promise. If accepted, confirm only when you can show up.
        </Typography>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {[`${event.dateLabel}, ${event.timeLabel}`, 'Next similar plan'].map((date, index) => (
            <Pressable
              key={`${date}-${index}`}
              onPress={() => onUpdateDraft({ selectedDate: date })}
              style={[
                styles.datePill,
                { borderColor: colors.line },
                selectedDate === date && { backgroundColor: colors.brand, borderColor: colors.brand },
              ]}>
              <Text
                style={[
                  selectedDate === date ? styles.dateTextActive : styles.dateText,
                  { color: selectedDate === date ? colors.black : colors.ink },
                ]}>
                {date}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <TextInput
          value={note}
          onChangeText={(value) => onUpdateDraft({ note: value, selectedDate })}
          placeholder="Tell the host why this plan fits you"
          placeholderTextColor={colors.faint}
          multiline
          style={[styles.noteInput, { backgroundColor: colors.surfaceAlt, borderColor: colors.line, color: colors.ink }]}
        />
      </Card>

      <ActionBar>
        <PrimaryButton
          label={requested ? rsvpStatusLabel[status === 'draft' || !status ? 'requested' : status] : 'Request to join'}
          icon={requested ? 'checkmark-circle-outline' : 'send-outline'}
          onPress={ready ? onRequest : undefined}
        />
        {requested ? (
          <GhostButton label="Cancel request" icon="close-circle-outline" onPress={onCancel} />
        ) : (
          <GhostButton
            label="Ask host a question"
            icon="chatbubble-outline"
            onPress={() => onUpdateDraft({ note: note || 'Question for the host: ' })}
          />
        )}
      </ActionBar>
      {!ready && !requested ? (
        <Typography variant="caption" muted>
          Add a short note before requesting to join.
        </Typography>
      ) : null}
      {error ? (
        <Typography variant="caption" style={{ color: colors.brand }}>
          {error}
        </Typography>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 14,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 18,
  },
  stackCard: {
    gap: 12,
  },
  signalRow: {
    alignItems: 'flex-start',
  },
  promptRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  promptText: {
    flex: 1,
    ...typographyRoles.bodyStrong,
  },
  attendeeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  attendeeCopy: {
    flex: 1,
    gap: 2,
  },
  status: {
    ...typographyRoles.caption,
    maxWidth: 76,
    textAlign: 'right',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 18,
  },
  datePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dateText: {
    ...typographyRoles.caption,
  },
  dateTextActive: {
    ...typographyRoles.caption,
  },
  noteInput: {
    borderRadius: 16,
    borderWidth: 1,
    ...typographyRoles.bodyStrong,
    minHeight: 92,
    padding: 12,
    textAlignVertical: 'top',
  },
});

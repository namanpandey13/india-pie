import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Card, colors, GhostButton, Pill, PrimaryButton, SectionTitle } from '@/components/mvp-kit';
import { events } from '@/data/mvp';

type Tab = 'details' | 'organizer' | 'going';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = useMemo(() => events.find((item) => item.id === id) ?? events[0], [id]);
  const [tab, setTab] = useState<Tab>('details');
  const [joined, setJoined] = useState(event.id === 'hk-boardgames');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Image source={{ uri: event.image }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.heroShade} />
          <Pressable onPress={() => router.back()} style={[styles.floatingIcon, styles.backIcon]}>
            <Ionicons name="chevron-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={styles.heroActions}>
            <View style={styles.floatingIcon}>
              <Ionicons name="star-outline" size={19} color={colors.ink} />
            </View>
            <View style={styles.floatingIcon}>
              <Ionicons name="share-outline" size={19} color={colors.ink} />
            </View>
          </View>
          <View style={styles.poster}>
            <Text style={styles.posterText}>{event.posterText}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.badges}>
            <Text style={styles.badge}>{event.priceLabel}</Text>
            <Text style={styles.badge}>{event.confidenceScore}% confidence</Text>
            <Text style={styles.badge}>host reviewed</Text>
          </View>

          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.meta}>
            {event.venue} - {event.dateLabel}, {event.timeLabel}
          </Text>
          <Text style={styles.vibe}>{event.vibe}</Text>

          <View style={styles.ctaRow}>
            <PrimaryButton
              label={joined ? 'Leave plan' : 'Join plan'}
              icon={joined ? 'close-circle-outline' : 'checkmark-circle-outline'}
              tone={joined ? 'coral' : 'lime'}
              onPress={() => setJoined((value) => !value)}
              style={styles.primaryCta}
            />
            <GhostButton label="chat" icon="chatbubble-outline" />
          </View>

          <View style={styles.tabRow}>
            <Pill label="details" active={tab === 'details'} onPress={() => setTab('details')} />
            <Pill label="organizer" active={tab === 'organizer'} onPress={() => setTab('organizer')} tone="blue" />
            <Pill label="who's going" active={tab === 'going'} onPress={() => setTab('going')} tone="yellow" />
          </View>

          {tab === 'details' ? <DetailsTab event={event} /> : null}
          {tab === 'organizer' ? <OrganizerTab event={event} /> : null}
          {tab === 'going' ? <GoingTab event={event} /> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailsTab({ event }: { event: (typeof events)[number] }) {
  return (
    <View style={styles.tabContent}>
      <Card style={styles.copyCard}>
        <Text style={styles.cardTitle}>about this plan</Text>
        <Text style={styles.copy}>{event.about}</Text>
      </Card>

      <SectionTitle title="trust signals" action="why show up" />
      <Card style={styles.stackCard}>
        {event.trustSignals.map((signal) => (
          <View key={signal} style={styles.checkRow}>
            <Ionicons name="checkmark-circle" size={19} color={colors.lime} />
            <Text style={styles.checkText}>{signal}</Text>
          </View>
        ))}
      </Card>

      <SectionTitle title="pre-chat prompts" action="inside app" />
      <Card style={styles.stackCard}>
        {event.prompts.map((prompt) => (
          <Text key={prompt} style={styles.promptText}>
            - {prompt}
          </Text>
        ))}
      </Card>
    </View>
  );
}

function OrganizerTab({ event }: { event: (typeof events)[number] }) {
  const organizer = event.organizer;

  return (
    <View style={styles.tabContent}>
      <Card style={styles.organizerCard}>
        <View style={styles.organizerTop}>
          <Avatar label={organizer.initials} color={organizer.color} size={58} />
          <View style={styles.organizerCopy}>
            <Text style={styles.organizerName}>{organizer.name}</Text>
            <Text style={styles.organizerRole}>{organizer.title}</Text>
          </View>
        </View>
        <Text style={styles.copy}>{organizer.bio}</Text>
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{organizer.rating}</Text>
            <Text style={styles.statLabel}>host rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{organizer.repeatRate}</Text>
            <Text style={styles.statLabel}>repeat guests</Text>
          </View>
        </View>
        {organizer.links.map((link) => (
          <View key={link} style={styles.checkRow}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.lime} />
            <Text style={styles.checkText}>{link}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

function GoingTab({ event }: { event: (typeof events)[number] }) {
  return (
    <View style={styles.tabContent}>
      <Card style={styles.copyCard}>
        <Text style={styles.cardTitle}>guest context</Text>
        <Text style={styles.copy}>{event.friendContext}</Text>
      </Card>
      {event.attendees.map((attendee) => (
        <Card key={attendee.id} style={styles.attendeeCard}>
          <Avatar label={attendee.initials} color={attendee.color} size={44} />
          <View style={styles.attendeeCopy}>
            <Text style={styles.attendeeName}>{attendee.name}</Text>
            <Text style={styles.attendeeRole}>{attendee.role}</Text>
            <Text style={styles.attendeeSignal}>{attendee.signal}</Text>
          </View>
          <Text style={styles.status}>{attendee.status}</Text>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingBottom: 34,
  },
  hero: {
    height: 360,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  floatingIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.58)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  backIcon: {
    left: 18,
    position: 'absolute',
    top: 14,
  },
  heroActions: {
    gap: 10,
    position: 'absolute',
    right: 18,
    top: 14,
  },
  poster: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.56)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: 18,
    borderWidth: 1,
    bottom: 40,
    justifyContent: 'center',
    left: 28,
    minHeight: 120,
    padding: 18,
    position: 'absolute',
    right: 28,
  },
  posterText: {
    color: colors.ink,
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 35,
    textAlign: 'center',
  },
  body: {
    gap: 16,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.lime,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    textTransform: 'lowercase',
  },
  title: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 38,
  },
  meta: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
  },
  vibe: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 23,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryCta: {
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tabContent: {
    gap: 14,
  },
  copyCard: {
    gap: 8,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    textTransform: 'lowercase',
  },
  copy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  stackCard: {
    gap: 10,
  },
  checkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
  },
  checkText: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  promptText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  organizerCard: {
    gap: 14,
  },
  organizerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 13,
  },
  organizerCopy: {
    flex: 1,
    gap: 3,
  },
  organizerName: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  organizerRole: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    flex: 1,
    padding: 12,
  },
  statValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  attendeeCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  attendeeCopy: {
    flex: 1,
    gap: 2,
  },
  attendeeName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  attendeeRole: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  attendeeSignal: {
    color: colors.lime,
    fontSize: 12,
    fontWeight: '800',
  },
  status: {
    color: colors.faint,
    fontSize: 11,
    fontWeight: '900',
    maxWidth: 76,
    textAlign: 'right',
    textTransform: 'lowercase',
  },
});

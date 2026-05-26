import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { PropsWithChildren } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Event } from '@/data/mvp';

export const colors = {
  bg: '#050505',
  ink: '#F7F2E8',
  muted: '#A7A097',
  faint: '#6D665F',
  line: '#24211F',
  surface: '#121212',
  surfaceAlt: '#1C1A18',
  surfaceLift: '#25221F',
  lime: '#C8F86D',
  coral: '#F77258',
  blue: '#8FA7FF',
  yellow: '#F6C85F',
  violet: '#AF7BFF',
  white: '#FFFFFF',
  black: '#000000',
};

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function TopBar({ title = 'aangan' }: { title?: string }) {
  return (
    <View style={styles.topBar}>
      <Text style={styles.logo}>{title}</Text>
      <View style={styles.topActions}>
        <View style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={18} color={colors.ink} />
          <View style={styles.dot} />
        </View>
        <View style={styles.iconButton}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.ink} />
        </View>
      </View>
    </View>
  );
}

export function Header({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{title}</Text>
      {action ? <Text style={styles.sectionAction}>{action}</Text> : null}
    </View>
  );
}

export function Pill({
  label,
  active,
  onPress,
  tone = 'lime',
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  tone?: 'lime' | 'coral' | 'blue' | 'yellow' | 'violet';
}) {
  const activeColor = colors[tone];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        active && { backgroundColor: activeColor, borderColor: activeColor },
      ]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  icon,
  onPress,
  tone = 'lime',
  style,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  tone?: 'lime' | 'coral' | 'blue' | 'yellow' | 'violet';
  style?: StyleProp<ViewStyle>;
}) {
  const bg = colors[tone];

  return (
    <Pressable onPress={onPress} style={[styles.button, { backgroundColor: bg }, style]}>
      {icon ? <Ionicons name={icon} size={18} color={colors.black} /> : null}
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  label,
  icon,
  onPress,
  style,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.ghostButton, style]}>
      {icon ? <Ionicons name={icon} size={17} color={colors.ink} /> : null}
      <Text style={styles.ghostButtonText}>{label}</Text>
    </Pressable>
  );
}

export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function Avatar({
  label,
  color = colors.lime,
  size = 42,
}: {
  label: string;
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}>
      <Text style={[styles.avatarText, size < 36 && { fontSize: 11 }]}>{label}</Text>
    </View>
  );
}

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
  const confirmed = event.attendees.filter((attendee) => attendee.status !== 'maybe').length;

  return (
    <Pressable onPress={onPress} style={styles.eventCard}>
      <Image source={{ uri: event.image }} style={styles.eventImage} contentFit="cover" />
      <View style={styles.eventOverlay} />
      <View style={styles.eventPoster}>
        <Text style={styles.posterText}>{event.posterText}</Text>
      </View>
      <View style={styles.eventButtons}>
        <Pressable onPress={onSave} style={styles.saveButton}>
          <Ionicons name={saved ? 'star' : 'star-outline'} size={18} color={colors.ink} />
        </Pressable>
        <View style={styles.saveButton}>
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.ink} />
        </View>
      </View>
      <View style={styles.eventText}>
        <View style={styles.eventTopline}>
          <Text style={styles.eventBadge}>{event.priceLabel}</Text>
          <Text style={[styles.eventBadge, styles.confidenceBadge]}>
            {event.confidenceScore}% confidence
          </Text>
          {joined ? <Text style={[styles.eventBadge, styles.joinedBadge]}>going</Text> : null}
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventMeta}>
          {event.locality} - {event.dateLabel}, {event.timeLabel}
        </Text>
        <View style={styles.creatorRow}>
          <Avatar label={event.organizer.initials} color={event.organizer.color} size={34} />
          <View style={styles.creatorCopy}>
            <Text style={styles.creatorLabel}>creator</Text>
            <Text style={styles.creatorName}>{event.organizer.name}</Text>
          </View>
        </View>
        <View style={styles.eventFooter}>
          <View style={styles.friendStack}>
            {event.attendees.slice(0, 6).map((attendee, index) => (
              <Avatar
                key={attendee.id}
                label={attendee.initials.slice(0, 1)}
                color={attendee.color}
                size={30}
              />
            )).map((avatar, index) => (
              <View key={event.attendees[index].id} style={{ marginLeft: index === 0 ? 0 : -7 }}>
                {avatar}
              </View>
            ))}
            <View style={[styles.moreBubble, { marginLeft: -7 }]}>
              <Text style={styles.moreBubbleText}>+{Math.max(event.capacity - 6, 0)}</Text>
            </View>
          </View>
          <Text style={styles.eventFooterText}>
            {confirmed}/{event.capacity} confirmed
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}) {
  return (
    <Card style={styles.empty}>
      <Ionicons name={icon} size={26} color={colors.lime} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: 18,
    paddingBottom: 34,
    paddingHorizontal: 18,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  logo: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  topActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  dot: {
    backgroundColor: colors.lime,
    borderRadius: 5,
    height: 10,
    position: 'absolute',
    right: 6,
    top: 6,
    width: 10,
  },
  header: {
    gap: 8,
    paddingTop: 2,
  },
  eyebrow: {
    color: colors.lime,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 37,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 340,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionText: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionAction: {
    color: colors.lime,
    fontSize: 13,
    fontWeight: '800',
  },
  pill: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 14,
  },
  pillText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
  },
  pillTextActive: {
    color: colors.black,
  },
  button: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: '900',
  },
  ghostButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 16,
  },
  ghostButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  metric: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 82,
    padding: 12,
  },
  metricValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: 3,
  },
  avatar: {
    alignItems: 'center',
    borderColor: colors.bg,
    borderWidth: 2,
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '900',
  },
  eventCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 500,
    overflow: 'hidden',
  },
  eventImage: {
    height: 260,
    width: '100%',
  },
  eventOverlay: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    height: 260,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  eventPoster: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.58)',
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    left: 24,
    minHeight: 110,
    padding: 16,
    position: 'absolute',
    right: 24,
    top: 74,
  },
  posterText: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 32,
    textAlign: 'center',
  },
  eventButtons: {
    gap: 10,
    position: 'absolute',
    right: 14,
    top: 14,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 24,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  eventText: {
    gap: 10,
    padding: 16,
  },
  eventTopline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  eventBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceLift,
    borderColor: colors.line,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    textTransform: 'lowercase',
  },
  confidenceBadge: {
    color: colors.lime,
  },
  joinedBadge: {
    backgroundColor: colors.lime,
    color: colors.black,
  },
  eventTitle: {
    color: colors.ink,
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 30,
  },
  eventMeta: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  creatorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 2,
  },
  creatorCopy: {
    gap: 1,
  },
  creatorLabel: {
    color: colors.faint,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'lowercase',
  },
  creatorName: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  eventFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  friendStack: {
    flexDirection: 'row',
  },
  moreBubble: {
    alignItems: 'center',
    backgroundColor: colors.surfaceLift,
    borderColor: colors.bg,
    borderRadius: 15,
    borderWidth: 2,
    height: 30,
    justifyContent: 'center',
    width: 40,
  },
  moreBubbleText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: '900',
  },
  eventFooterText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  empty: {
    alignItems: 'flex-start',
    gap: 8,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});

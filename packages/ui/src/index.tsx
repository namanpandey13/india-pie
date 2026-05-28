import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type TextProps,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  radius,
  semanticAccents,
  semanticColors as colors,
  spacing,
} from '@hausy/design-tokens';
import { countConfirmed, formatEventMeta } from '@hausy/utils';

import type { AccentTone, Event } from '@hausy/types';

export { colors, radius, semanticAccents, spacing };
export type { SemanticAccent as AccentTone, SemanticColor } from '@hausy/design-tokens';

type IconName = keyof typeof Ionicons.glyphMap;

type TypographyVariant = 'eyebrow' | 'h1' | 'h2' | 'h3' | 'body' | 'caption';

export function Typography({
  variant = 'body',
  muted,
  style,
  ...props
}: TextProps & { variant?: TypographyVariant; muted?: boolean }) {
  return <Text style={[typographyStyles[variant], muted && styles.textMuted, style]} {...props} />;
}

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

export function TopBar({ title = 'hausy' }: { title?: string }) {
  return (
    <View style={styles.topBar}>
      <Typography variant="h2">{title}</Typography>
      <View style={styles.topActions}>
        <IconButton icon="notifications-outline" indicator />
        <IconButton icon="chatbubble-outline" />
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
      <Typography variant="eyebrow">{eyebrow}</Typography>
      <Typography variant="h1">{title}</Typography>
      <Typography variant="body" muted style={styles.headerSubtitle}>
        {subtitle}
      </Typography>
    </View>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionTitle}>
      <Typography variant="h3">{title}</Typography>
      {action ? (
        <Typography variant="caption" style={styles.sectionAction}>
          {action}
        </Typography>
      ) : null}
    </View>
  );
}

export const SectionTitle = SectionHeader;

export function Pill({
  label,
  active,
  onPress,
  tone = 'lime',
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  tone?: AccentTone;
}) {
  const activeColor = semanticAccents[tone];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active && { backgroundColor: activeColor, borderColor: activeColor }]}>
      <Typography variant="caption" style={active ? styles.pillTextActive : styles.pillText}>
        {label}
      </Typography>
    </Pressable>
  );
}

export function Badge({
  label,
  tone = 'lime',
  active,
}: {
  label: string;
  tone?: AccentTone;
  active?: boolean;
}) {
  return (
    <Text
      style={[
        styles.badge,
        { color: semanticAccents[tone] },
        active && { backgroundColor: semanticAccents[tone], color: colors.black },
      ]}>
      {label}
    </Text>
  );
}

export function Button({
  label,
  icon,
  onPress,
  tone = 'lime',
  variant = 'primary',
  style,
}: {
  label: string;
  icon?: IconName;
  onPress?: () => void;
  tone?: AccentTone;
  variant?: 'primary' | 'ghost';
  style?: StyleProp<ViewStyle>;
}) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      style={[
        isPrimary ? styles.button : styles.ghostButton,
        isPrimary && { backgroundColor: semanticAccents[tone] },
        style,
      ]}>
      {icon ? (
        <Ionicons name={icon} size={18} color={isPrimary ? colors.black : colors.ink} />
      ) : null}
      <Text style={isPrimary ? styles.buttonText : styles.ghostButtonText}>{label}</Text>
    </Pressable>
  );
}

export function PrimaryButton(props: Omit<Parameters<typeof Button>[0], 'variant'>) {
  return <Button {...props} variant="primary" />;
}

export function GhostButton(props: Omit<Parameters<typeof Button>[0], 'variant'>) {
  return <Button {...props} variant="ghost" />;
}

export function IconButton({
  icon,
  onPress,
  indicator,
  style,
}: {
  icon: IconName;
  onPress?: () => void;
  indicator?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.iconButton, style]}>
      <Ionicons name={icon} size={18} color={colors.ink} />
      {indicator ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Input(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.faint} style={[styles.input, props.style]} {...props} />;
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.metric}>
      <Typography variant="h2">{value}</Typography>
      <Typography variant="caption" muted style={styles.metricLabel}>
        {label}
      </Typography>
    </View>
  );
}

export function Avatar({
  label,
  color = 'lime',
  size = 42,
}: {
  label: string;
  color?: AccentTone | string;
  size?: number;
}) {
  const backgroundColor = color in semanticAccents ? semanticAccents[color as AccentTone] : color;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
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
  const confirmed = countConfirmed(event.attendees);

  return (
    <Pressable onPress={onPress} style={styles.eventCard}>
      <Image source={{ uri: event.image }} style={styles.eventImage} contentFit="cover" />
      <View style={styles.eventOverlay} />
      <View style={styles.eventPoster}>
        <Typography variant="h2" style={styles.posterText}>
          {event.posterText}
        </Typography>
      </View>
      <View style={styles.eventButtons}>
        <IconButton icon={saved ? 'star' : 'star-outline'} onPress={onSave} style={styles.saveButton} />
        <IconButton icon="ellipsis-horizontal" style={styles.saveButton} />
      </View>
      <View style={styles.eventText}>
        <View style={styles.eventTopline}>
          <Badge label={event.priceLabel} />
          <Badge label={`${event.confidenceScore}% confidence`} />
          {joined ? <Badge label="going" active /> : null}
        </View>
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
              host
            </Typography>
            <Typography variant="caption">{event.organizer.name}</Typography>
          </View>
        </View>
        <View style={styles.eventFooter}>
          <View style={styles.friendStack}>
            {event.attendees.slice(0, 6).map((attendee, index) => (
              <View key={attendee.id} style={{ marginLeft: index === 0 ? 0 : -7 }}>
                <Avatar label={attendee.initials.slice(0, 1)} color={attendee.color} size={30} />
              </View>
            ))}
            <View style={[styles.moreBubble, { marginLeft: -7 }]}>
              <Text style={styles.moreBubbleText}>+{Math.max(event.capacity - 6, 0)}</Text>
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

export function EmptyState({
  icon,
  title,
  body,
}: {
  icon: IconName;
  title: string;
  body: string;
}) {
  return (
    <Card style={styles.empty}>
      <Ionicons name={icon} size={26} color={colors.lime} />
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body" muted>
        {body}
      </Typography>
    </Card>
  );
}

export function InlineRow({
  icon,
  children,
}: PropsWithChildren<{
  icon: IconName;
}>) {
  return (
    <View style={styles.inlineRow}>
      <Ionicons name={icon} size={19} color={colors.lime} />
      <View style={styles.inlineCopy}>{children as ReactNode}</View>
    </View>
  );
}

const typographyStyles = StyleSheet.create({
  eyebrow: {
    color: colors.lime,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  h1: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 37,
  },
  h2: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 30,
  },
  h3: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 24,
  },
  body: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
});

const styles = StyleSheet.create({
  textMuted: {
    color: colors.muted,
  },
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: spacing.xl,
    paddingBottom: spacing['3xl'],
    paddingHorizontal: spacing.xl,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  topActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.pill,
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
    gap: spacing.sm,
    paddingTop: 2,
  },
  headerSubtitle: {
    maxWidth: 340,
  },
  sectionTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionAction: {
    color: colors.lime,
  },
  pill: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 14,
  },
  pillText: {
    color: colors.ink,
  },
  pillTextActive: {
    color: colors.black,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceLift,
    borderColor: colors.line,
    borderRadius: radius.pill,
    borderWidth: 1,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    textTransform: 'lowercase',
  },
  button: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.xl,
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
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: spacing.lg,
  },
  ghostButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  metric: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    minHeight: 82,
    padding: spacing.md,
  },
  metricLabel: {
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
    borderRadius: radius.xl,
    borderWidth: 1,
    minHeight: 500,
    overflow: 'hidden',
  },
  eventImage: {
    height: 260,
    width: '100%',
  },
  eventOverlay: {
    backgroundColor: colors.overlaySoft,
    height: 260,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  eventPoster: {
    alignItems: 'center',
    backgroundColor: colors.overlayMedium,
    borderColor: colors.overlayLight,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    left: spacing['2xl'],
    minHeight: 110,
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
    backgroundColor: colors.overlayMedium,
    borderColor: colors.overlayBorder,
    height: 42,
    width: 42,
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
    fontSize: 25,
  },
  eventMeta: {
    fontSize: 14,
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
  empty: {
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  inlineCopy: {
    flex: 1,
  },
});

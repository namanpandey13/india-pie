import { StyleSheet, View } from 'react-native';
import { spacing, useThemeColors } from '../styles/theme';
import { IconButton } from './icon-button';
import { Typography } from './typography';

export function TopBar({
  onChatPress,
  onNotificationPress,
  title = 'Hausy',
}: {
  onChatPress?: () => void;
  onNotificationPress?: () => void;
  title?: string;
}) {
  return (
    <View style={styles.topBar}>
      <Typography variant="h2">{title}</Typography>
      <View style={styles.topActions}>
        <IconButton icon="notifications-outline" indicator onPress={onNotificationPress} />
        <IconButton icon="chatbubble-outline" onPress={onChatPress} />
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
  const colors = useThemeColors();

  return (
    <View style={styles.sectionTitle}>
      <Typography variant="h3">{title}</Typography>
      {action ? (
        <Typography variant="caption" style={{ color: colors.brand }}>
          {action}
        </Typography>
      ) : null}
    </View>
  );
}

export const SectionTitle = SectionHeader;

const styles = StyleSheet.create({
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
});

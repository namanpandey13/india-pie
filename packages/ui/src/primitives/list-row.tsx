import { Ionicons } from '@expo/vector-icons';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing, useThemeColors, type IconName } from '../styles/theme';

export function InlineRow({
  icon,
  children,
}: PropsWithChildren<{
  icon: IconName;
}>) {
  const colors = useThemeColors();

  return (
    <View style={styles.inlineRow}>
      <Ionicons name={icon} size={19} color={colors.brand} />
      <View style={styles.inlineCopy}>{children}</View>
    </View>
  );
}

export function ListRow({ children }: PropsWithChildren) {
  return <View style={styles.listRow}>{children}</View>;
}

const styles = StyleSheet.create({
  inlineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  inlineCopy: {
    flex: 1,
  },
  listRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
});

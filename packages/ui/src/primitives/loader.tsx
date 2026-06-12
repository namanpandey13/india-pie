import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { spacing, typographyRoles, useThemeColors } from '../styles/theme';

export function Loader({ label, fill = false }: { label?: string; fill?: boolean }) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityLabel={label ?? 'Loading'}
      accessibilityRole="progressbar"
      style={[styles.root, fill && styles.fill]}>
      <ActivityIndicator color={colors.muted} size="small" />
      {label ? <Text style={[styles.label, { color: colors.muted }]}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 120,
  },
  fill: {
    flex: 1,
  },
  label: {
    ...typographyRoles.caption,
  },
});

import { StyleSheet, View } from 'react-native';
import { componentTokens, radius, spacing, useThemeColors } from '../styles/theme';
import { Typography } from './typography';

export function Metric({ value, label }: { value: string; label: string }) {
  const colors = useThemeColors();

  return (
    <View style={[styles.metric, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      <Typography variant="h2">{value}</Typography>
      <Typography variant="caption" muted style={styles.metricLabel}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  metric: {
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    minHeight: componentTokens.cards.metricMinHeight,
    padding: spacing.md,
  },
  metricLabel: {
    marginTop: 3,
  },
});

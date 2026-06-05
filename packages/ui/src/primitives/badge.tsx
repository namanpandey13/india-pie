import { StyleSheet, Text } from 'react-native';
import { radius, typographyRoles, useSemanticAccents, useThemeColors, type AccentTone } from '../styles/theme';

type StatusTone = 'cancelled' | 'confirmed' | 'planning';

const statusColors: Record<StatusTone, { background: string; border: string; text: string }> = {
  cancelled: {
    background: '#FEE2E2',
    border: '#FCA5A5',
    text: '#991B1B',
  },
  confirmed: {
    background: '#DCFCE7',
    border: '#86EFAC',
    text: '#166534',
  },
  planning: {
    background: '#FEF3C7',
    border: '#FCD34D',
    text: '#92400E',
  },
};

export function Badge({
  active,
  label,
  status,
  tone = 'lime',
}: {
  active?: boolean;
  label: string;
  status?: StatusTone;
  tone?: AccentTone;
}) {
  const colors = useThemeColors();
  const semanticAccents = useSemanticAccents();
  const activeColor = semanticAccents[tone];
  const statusColor = status ? statusColors[status] : null;

  return (
    <Text
      style={[
        styles.badge,
        { backgroundColor: colors.surfaceLift, borderColor: colors.line, color: semanticAccents[tone] },
        active && { backgroundColor: activeColor, color: colors.black },
        statusColor && {
          backgroundColor: statusColor.background,
          borderColor: statusColor.border,
          color: statusColor.text,
        },
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    borderWidth: 1,
    ...typographyRoles.caption,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});

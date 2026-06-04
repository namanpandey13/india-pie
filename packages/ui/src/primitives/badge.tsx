import { StyleSheet, Text } from 'react-native';
import { radius, typographyRoles, useSemanticAccents, useThemeColors, type AccentTone } from '../styles/theme';

export function Badge({
  label,
  tone = 'lime',
  active,
}: {
  label: string;
  tone?: AccentTone;
  active?: boolean;
}) {
  const colors = useThemeColors();
  const semanticAccents = useSemanticAccents();

  return (
    <Text
      style={[
        styles.badge,
        { backgroundColor: colors.surfaceLift, borderColor: colors.line, color: semanticAccents[tone] },
        active && { backgroundColor: semanticAccents[tone], color: colors.black },
      ]}>
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

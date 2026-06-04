import { Pressable, StyleSheet } from 'react-native';
import { radius, useSemanticAccents, useThemeColors, type AccentTone } from '../styles/theme';
import { Typography } from './typography';

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
  const colors = useThemeColors();
  const semanticAccents = useSemanticAccents();
  const activeColor = semanticAccents[tone];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, { borderColor: colors.line }, active && { backgroundColor: activeColor, borderColor: activeColor }]}>
      <Typography variant="caption" style={active ? { color: colors.black } : { color: colors.ink }}>
        {label}
      </Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 14,
  },
});

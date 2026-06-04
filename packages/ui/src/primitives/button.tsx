import { Ionicons } from '@expo/vector-icons';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';
import {
  componentTokens,
  radius,
  spacing,
  typographyRoles,
  useSemanticAccents,
  useThemeColors,
  type AccentTone,
  type IconName,
} from '../styles/theme';

export function Button({
  label,
  icon,
  disabled,
  onPress,
  tone = 'lime',
  variant = 'primary',
  style,
}: {
  label: string;
  icon?: IconName;
  disabled?: boolean;
  onPress?: () => void;
  tone?: AccentTone;
  variant?: 'primary' | 'ghost';
  style?: StyleProp<ViewStyle>;
}) {
  const isPrimary = variant === 'primary';
  const colors = useThemeColors();
  const semanticAccents = useSemanticAccents();

  return (
    <Pressable
      disabled={disabled || !onPress}
      onPress={onPress}
      style={[
        isPrimary ? styles.button : styles.ghostButton,
        isPrimary && { backgroundColor: semanticAccents[tone] },
        !isPrimary && { backgroundColor: colors.surfaceAlt, borderColor: colors.line },
        (disabled || !onPress) && styles.disabled,
        style,
      ]}>
      {icon ? (
        <Ionicons name={icon} size={18} color={isPrimary ? colors.black : colors.ink} />
      ) : null}
      <Text style={[isPrimary ? styles.buttonText : styles.ghostButtonText, { color: isPrimary ? colors.black : colors.ink }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function PrimaryButton(props: Omit<Parameters<typeof Button>[0], 'variant'>) {
  return <Button {...props} variant="primary" />;
}

export function GhostButton(props: Omit<Parameters<typeof Button>[0], 'variant'>) {
  return <Button {...props} variant="ghost" />;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: componentTokens.controls.minHeight,
    paddingHorizontal: spacing.xl,
  },
  buttonText: {
    ...typographyRoles.label,
  },
  ghostButton: {
    alignItems: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: componentTokens.controls.minHeight,
    paddingHorizontal: spacing.lg,
  },
  ghostButtonText: {
    ...typographyRoles.label,
  },
  disabled: {
    opacity: 0.48,
  },
});

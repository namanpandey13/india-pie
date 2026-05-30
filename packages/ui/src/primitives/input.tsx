import type { TextInputProps } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';
import { componentTokens, radius, spacing, typographyRoles, useThemeColors } from '../styles/theme';

export function Input(props: TextInputProps) {
  const colors = useThemeColors();

  return (
    <TextInput
      placeholderTextColor={colors.faint}
      style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.line, color: colors.ink }, props.style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: radius.lg,
    borderWidth: 1,
    ...typographyRoles.bodyStrong,
    minHeight: componentTokens.controls.minHeight,
    paddingHorizontal: spacing.md,
  },
});

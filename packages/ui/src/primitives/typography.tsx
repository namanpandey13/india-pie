import type { TextProps } from 'react-native';
import { Text } from 'react-native';
import { useThemeColors, useTypographyStyles } from '../styles/theme';

export type TypographyVariant = 'eyebrow' | 'hero' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyStrong' | 'caption' | 'label';

export function Typography({
  variant = 'body',
  muted,
  style,
  ...props
}: TextProps & { variant?: TypographyVariant; muted?: boolean }) {
  const colors = useThemeColors();
  const typographyStyles = useTypographyStyles();

  return <Text style={[typographyStyles[variant], muted && { color: colors.muted }, style]} {...props} />;
}

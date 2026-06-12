import { StyleSheet } from 'react-native';
import { createContext, createElement, useContext, type PropsWithChildren } from 'react';
import {
  colorSchemes,
  componentTokens,
  radius,
  semanticAccents,
  semanticColors as colors,
  spacing,
  typographyRoles,
  type ColorSchemeName,
} from '@hausy/design-tokens';

export { colors, componentTokens, radius, semanticAccents, spacing, typographyRoles };
export type { ColorSchemeName, SemanticAccent as AccentTone, SemanticColor } from '@hausy/design-tokens';

export const themeModes = ['dark', 'light'] as const satisfies readonly ColorSchemeName[];

const ThemeContext = createContext<ColorSchemeName>('dark');

export function HausyThemeProvider({ children, mode }: PropsWithChildren<{ mode: ColorSchemeName }>) {
  return createElement(ThemeContext.Provider, { value: mode }, children);
}

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function useThemeColors() {
  return colorSchemes[useThemeMode()];
}

export function useSemanticAccents() {
  const themeColors = useThemeColors();
  return {
    brand: themeColors.brand,
    lime: themeColors.brand,
    coral: themeColors.brand,
    blue: themeColors.brand,
    yellow: themeColors.brand,
    violet: themeColors.brand,
  } as const;
}

export type IconName =
  | 'add-circle-outline'
  | 'arrow-forward-outline'
  | 'chatbubble-outline'
  | 'chatbubbles-outline'
  | 'checkmark'
  | 'checkmark-circle'
  | 'checkmark-circle-outline'
  | 'chevron-back'
  | 'close-circle-outline'
  | 'create-outline'
  | 'document-text-outline'
  | 'ellipsis-horizontal'
  | 'heart-outline'
  | 'home-outline'
  | 'location-outline'
  | 'log-out-outline'
  | 'logo-instagram'
  | 'logo-linkedin'
  | 'notifications-outline'
  | 'people-outline'
  | 'person-add-outline'
  | 'person-circle-outline'
  | 'pencil-outline'
  | 'radio-button-off'
  | 'radio-button-on'
  | 'search-outline'
  | 'send'
  | 'send-outline'
  | 'share-outline'
  | 'shield-checkmark-outline'
  | 'sparkles-outline'
  | 'star'
  | 'star-outline'
  | 'time-outline'
  | 'bookmark'
  | 'bookmark-outline';

export const typographyStyles = StyleSheet.create({
  eyebrow: {
    color: colors.brand,
    ...typographyRoles.eyebrow,
  },
  h1: {
    color: colors.ink,
    ...typographyRoles.h1,
  },
  h2: {
    color: colors.ink,
    ...typographyRoles.h2,
  },
  h3: {
    color: colors.ink,
    ...typographyRoles.h3,
  },
  body: {
    color: colors.ink,
    ...typographyRoles.body,
  },
  caption: {
    color: colors.ink,
    ...typographyRoles.caption,
  },
});

export function useTypographyStyles() {
  const themeColors = useThemeColors();

  return {
    eyebrow: {
      ...typographyStyles.eyebrow,
      color: themeColors.brand,
    },
    h1: {
      ...typographyRoles.h1,
      ...typographyStyles.h1,
      color: themeColors.ink,
    },
    hero: {
      ...typographyRoles.hero,
      color: themeColors.ink,
    },
    h2: {
      ...typographyStyles.h2,
      color: themeColors.ink,
    },
    h3: {
      ...typographyStyles.h3,
      color: themeColors.ink,
    },
    body: {
      ...typographyStyles.body,
      color: themeColors.ink,
    },
    bodyStrong: {
      ...typographyRoles.bodyStrong,
      color: themeColors.ink,
    },
    caption: {
      ...typographyStyles.caption,
      color: themeColors.ink,
    },
    label: {
      ...typographyRoles.label,
      color: themeColors.ink,
    },
  };
}

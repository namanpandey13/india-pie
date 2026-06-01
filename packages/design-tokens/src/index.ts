export const darkSemanticColors = {
  background: '#0F0F0F',
  bg: '#0F0F0F',
  surface: '#171717',
  cardSurface: '#171717',
  surfaceAlt: '#242424',
  elevatedSurface: '#2E2E2E',
  surfaceLift: '#2E2E2E',
  ink: '#FFFFFF',
  muted: '#C9C9C4',
  faint: '#8A8A84',
  border: '#30302C',
  line: '#30302C',
  brand: '#c14dffb7',
  brandMuted: '#BEB4FF',
  brandPressed: '#c14dffb7',
  lime: '#F3F3F0',
  coral: '#F3F3F0',
  blue: '#F3F3F0',
  yellow: '#F3F3F0',
  violet: '#F3F3F0',
  white: '#FFFFFF',
  black: '#000000',
  overlayLight: 'rgba(255,255,255,0.16)',
  overlayBorder: 'rgba(255,255,255,0.18)',
  overlaySoft: 'rgba(0,0,0,0.28)',
  overlayHero: 'rgba(0,0,0,0.42)',
  overlayMedium: 'rgba(0,0,0,0.56)',
  overlayPanel: 'rgba(18,18,18,0.94)',
  overlayStrong: 'rgba(0,0,0,0.72)',
} as const;

type SemanticColorValues = Record<keyof typeof darkSemanticColors, string>;

export const lightSemanticColors: SemanticColorValues = {
  background: '#FFFFFF',
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  cardSurface: '#FFFFFF',
  surfaceAlt: '#FAFAF7',
  elevatedSurface: '#F3F3F0',
  surfaceLift: '#F3F3F0',
  ink: '#0F0F0F',
  muted: '#6F6F6F',
  faint: '#A7A7A1',
  border: '#E6E6E2',
  line: '#E6E6E2',
  brand: '#c14dffb7',
  brandMuted: '#D9D3FF',
  brandPressed: '#c14dffb7',
  lime: '#F3F3F0',
  coral: '#F3F3F0',
  blue: '#F3F3F0',
  yellow: '#F3F3F0',
  violet: '#F3F3F0',
  white: '#FFFFFF',
  black: '#000000',
  overlayLight: 'rgba(255,255,255,0.22)',
  overlayBorder: 'rgba(255,255,255,0.28)',
  overlaySoft: 'rgba(0,0,0,0.18)',
  overlayHero: 'rgba(0,0,0,0.34)',
  overlayMedium: 'rgba(0,0,0,0.46)',
  overlayPanel: 'rgba(247,242,232,0.94)',
  overlayStrong: 'rgba(0,0,0,0.62)',
} as const;

export const colorSchemes = {
  dark: darkSemanticColors,
  light: lightSemanticColors,
} as const;

export type ColorSchemeName = keyof typeof colorSchemes;
export const semanticColors = darkSemanticColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
  '2xl': 24,
  '3xl': 34,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
  '2xl': 24,
  pill: 999,
} as const;

export const fontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_600SemiBold',
  strong: 'Inter_700Bold',
  display: 'Inter_900Black',
} as const;

export const fontWeights = {
  regular: '400',
  medium: '600',
  strong: '700',
  display: '900',
} as const;

export const typographyRoles = {
  eyebrow: {
    fontFamily: fontFamilies.strong,
    fontSize: 12,
    fontWeight: fontWeights.strong,
    letterSpacing: 0,
    lineHeight: 16,
  },
  h1: {
    fontFamily: fontFamilies.display,
    fontSize: 30,
    fontWeight: fontWeights.display,
    letterSpacing: 0,
    lineHeight: 36,
  },
  hero: {
    fontFamily: fontFamilies.display,
    fontSize: 40,
    fontWeight: fontWeights.display,
    letterSpacing: 0,
    lineHeight: 44,
  },
  wordmark: {
    fontFamily: fontFamilies.display,
    fontSize: 43,
    fontWeight: fontWeights.display,
    letterSpacing: 0,
    lineHeight: 47,
  },
  poster: {
    fontFamily: fontFamilies.display,
    fontSize: 43,
    fontWeight: fontWeights.display,
    letterSpacing: 0,
    lineHeight: 43,
  },
  cardTitle: {
    fontFamily: fontFamilies.display,
    fontSize: 28,
    fontWeight: fontWeights.display,
    letterSpacing: 0,
    lineHeight: 31,
  },
  micro: {
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    fontWeight: fontWeights.medium,
    letterSpacing: 0,
    lineHeight: 14,
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontSize: 24,
    fontWeight: fontWeights.display,
    letterSpacing: 0,
    lineHeight: 30,
  },
  h3: {
    fontFamily: fontFamilies.strong,
    fontSize: 19,
    fontWeight: fontWeights.strong,
    letterSpacing: 0,
    lineHeight: 24,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: fontFamilies.medium,
    fontSize: 15,
    fontWeight: fontWeights.medium,
    letterSpacing: 0,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    fontWeight: fontWeights.medium,
    letterSpacing: 0,
    lineHeight: 16,
  },
  label: {
    fontFamily: fontFamilies.strong,
    fontSize: 14,
    fontWeight: fontWeights.strong,
    letterSpacing: 0,
    lineHeight: 18,
  },
} as const;

export const componentTokens = {
  controls: {
    minHeight: 48,
    iconButtonSize: 44,
    tabBarHeight: 74,
    tabIconSize: 24,
  },
  avatar: {
    fontSize: 12,
    smallFontSize: 11,
  },
  hero: {
    height: 360,
    imageHeight: 260,
    posterMinHeight: 110,
  },
  cards: {
    eventMinHeight: 500,
    metricMinHeight: 82,
  },
} as const;

export const semanticAccents = {
  brand: semanticColors.brand,
  lime: semanticColors.brand,
  coral: semanticColors.brand,
  blue: semanticColors.brand,
  yellow: semanticColors.brand,
  violet: semanticColors.brand,
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter', 'Geist', 'System'],
  },
  fontSize: {
    h1: ['32px', { lineHeight: '37px', fontWeight: '900' }],
    h2: ['24px', { lineHeight: '30px', fontWeight: '900' }],
    h3: ['19px', { lineHeight: '24px', fontWeight: '900' }],
    body: ['15px', { lineHeight: '22px', fontWeight: '500' }],
    caption: ['12px', { lineHeight: '16px', fontWeight: '700' }],
  },
} as const;

export const nativeWindTheme = {
  colors: semanticColors,
  spacing,
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize,
  borderRadius: {
    sm: `${radius.sm}px`,
    md: `${radius.md}px`,
    lg: `${radius.lg}px`,
    pill: '999px',
  },
} as const;

export type SemanticColor = keyof typeof semanticColors;
export type SemanticAccent = keyof typeof semanticAccents;

export const darkSemanticColors = {
  background: '#050505',
  bg: '#050505',
  surface: '#121212',
  cardSurface: '#1C1A18',
  surfaceAlt: '#1C1A18',
  elevatedSurface: '#25221F',
  surfaceLift: '#25221F',
  ink: '#F7F2E8',
  muted: '#A7A097',
  faint: '#6D665F',
  border: '#24211F',
  line: '#24211F',
  brand: '#FF6B5F',
  brandMuted: '#8F3E38',
  brandPressed: '#E85B50',
  lime: '#FF6B5F',
  coral: '#FF6B5F',
  blue: '#FF6B5F',
  yellow: '#FF6B5F',
  violet: '#FF6B5F',
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
  background: '#F7F2E8',
  bg: '#F7F2E8',
  surface: '#FFFFFF',
  cardSurface: '#FFFFFF',
  surfaceAlt: '#EFE8DD',
  elevatedSurface: '#E7DED1',
  surfaceLift: '#E7DED1',
  ink: '#1A1714',
  muted: '#6D6257',
  faint: '#9B8F82',
  border: '#DDD1C3',
  line: '#DDD1C3',
  brand: '#D85F55',
  brandMuted: '#F3B8AF',
  brandPressed: '#BD4E46',
  lime: '#D85F55',
  coral: '#D85F55',
  blue: '#D85F55',
  yellow: '#D85F55',
  violet: '#D85F55',
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

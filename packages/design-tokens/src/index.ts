export const semanticColors = {
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
  lime: '#C8F86D',
  coral: '#F77258',
  blue: '#8FA7FF',
  yellow: '#F6C85F',
  violet: '#AF7BFF',
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

export const semanticAccents = {
  lime: semanticColors.lime,
  coral: semanticColors.coral,
  blue: semanticColors.blue,
  yellow: semanticColors.yellow,
  violet: semanticColors.violet,
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

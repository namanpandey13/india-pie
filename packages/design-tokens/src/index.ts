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
  fontFamily: typography.fontFamily,
  fontSize: typography.fontSize,
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    pill: '999px',
  },
} as const;

export type SemanticColor = keyof typeof semanticColors;

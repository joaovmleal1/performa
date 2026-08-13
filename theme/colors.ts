/**
 * PERFORMA — tokens oficiais (source of truth visual)
 * Backgrounds mais profundos; cards #12161D/#161A22; borders em rgba.
 */
export const colors = {
  // Surfaces
  background: '#080B10',
  backgroundAlt: '#0B0E14',
  backgroundElevated: '#101319',
  surfaceDark: '#101319',
  surfaceMedium: '#12161D',
  surfaceLight: '#161A22',
  surface: '#12161D',
  surfaceHover: '#1A1E27',
  surfacePressed: '#0E1218',
  surfaceMuted: '#101319',
  surfaceElevated: '#1A1E27',
  surfaceHighlight: '#1F2430',

  // Borders
  border: 'rgba(255,255,255,0.09)',
  borderSubtle: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.14)',
  overlay: 'rgba(8, 11, 16, 0.78)',

  // Brand primaries
  primary: '#00FF85',
  primaryDark: '#00E875',
  primarySoft: '#25FF8E',
  primaryMuted: 'rgba(0, 255, 133, 0.14)',
  primaryPressed: '#00E070',
  primaryGlow: 'rgba(0, 255, 133, 0.15)',
  onPrimary: '#07100B',

  // Brand secondary (AI / insights)
  secondary: '#7B5CFF',
  secondarySoft: '#8A5CFF',
  secondaryBright: '#995FFF',
  secondaryMuted: 'rgba(123, 92, 255, 0.16)',
  secondaryPressed: '#6A4AE6',
  secondaryGlow: 'rgba(123, 92, 255, 0.18)',
  onSecondary: '#FFFFFF',

  // Text
  white: '#FFFFFF',
  text: '#FFFFFF',
  textSecondary: '#A4A6AF',
  textMuted: '#6F727C',
  textDisabled: '#555861',

  // Feedback
  success: '#00FF85',
  successDark: '#00E875',
  successSoft: '#25FF8E',
  warning: '#FFC83D',
  error: '#FF4D57',
  errorMuted: 'rgba(255, 77, 87, 0.14)',
  info: '#55CFFF',

  // Domain accents (spec nutrição)
  protein: '#7B5CFF',
  carbs: '#00FF85',
  fats: '#FFC83D',
  water: '#55CFFF',
  fat: '#FFC83D',

  chartLine: '#7B5CFF',
  chartFill: 'rgba(123, 92, 255, 0.16)',
  streak: '#00FF85',
  disabled: '#3A3E48',

  tabActive: '#00FF85',
  tabInactive: '#777A84',

  skeleton: '#161A22',
  skeletonHighlight: '#1A1E27',
} as const;

export type ColorToken = keyof typeof colors;

/** Gradientes oficiais da marca */
export const gradients = {
  ai: ['#7B5CFF', '#55CFFF', '#00FF85'] as const,
  aiSoft: ['#7B5CFF', '#55CFFF'] as const,
  primaryFade: ['rgba(0,255,133,0.18)', 'rgba(0,255,133,0)'] as const,
  hero: ['rgba(8,11,16,0)', '#080B10'] as const,
  purpleGlow: ['rgba(123,92,255,0.28)', 'rgba(85,207,255,0.08)'] as const,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  glowGreen: {
    shadowColor: '#00FF85',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  glowPurple: {
    shadowColor: '#7B5CFF',
    shadowOpacity: 0.18,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
} as const;

/**
 * PERFORMA — Manual de Identidade Visual
 * Dark mode only. Tokens oficiais da marca.
 */
export const colors = {
  // Surfaces
  background: '#121217',
  backgroundElevated: '#18181F',
  surfaceDark: '#18181F',
  surfaceMedium: '#202027',
  surfaceLight: '#2A2A33',
  surface: '#202027',
  surfaceHover: '#2A2A33',
  surfacePressed: '#1A1A22',
  surfaceMuted: '#18181F',
  surfaceElevated: '#2A2A33',
  surfaceHighlight: '#33333D',

  // Borders
  border: '#33333D',
  borderSubtle: '#2A2A33',
  borderStrong: '#3A3A45',
  overlay: 'rgba(8, 8, 12, 0.72)',

  // Brand primaries
  primary: '#00FF85',
  primaryDark: '#00805F',
  primarySoft: '#5AFFAD',
  primaryMuted: 'rgba(0, 255, 133, 0.16)',
  primaryPressed: '#00D970',
  primaryGlow: 'rgba(0, 255, 133, 0.28)',
  onPrimary: '#0A0A0D',

  // Brand secondary (AI / insights)
  secondary: '#7B5CFF',
  secondaryMuted: 'rgba(123, 92, 255, 0.18)',
  secondaryPressed: '#6A4AE6',
  secondaryGlow: 'rgba(123, 92, 255, 0.3)',
  onSecondary: '#FFFFFF',

  // Text
  white: '#FFFFFF',
  text: '#FFFFFF',
  textSecondary: '#A9A9B2',
  textMuted: '#6F707A',
  textDisabled: '#555561',

  // Feedback
  success: '#00FF85',
  successDark: '#00805F',
  successSoft: '#5AFFAD',
  warning: '#FFCA3A',
  error: '#FF4D57',
  errorMuted: 'rgba(255, 77, 87, 0.14)',
  info: '#5C8CFF',

  // Domain accents
  protein: '#00FF85',
  carbs: '#7B5CFF',
  fats: '#FFCA3A',
  water: '#5C8CFF',
  fat: '#FFCA3A',

  chartLine: '#7B5CFF',
  chartFill: 'rgba(123, 92, 255, 0.18)',
  streak: '#00FF85',
  disabled: '#3E3E48',

  tabActive: '#00FF85',
  tabInactive: '#6F707A',

  skeleton: '#2A2A33',
  skeletonHighlight: '#33333D',
} as const;

export type ColorToken = keyof typeof colors;

/** Gradientes oficiais da marca */
export const gradients = {
  ai: ['#7B5CFF', '#5C8CFF'] as const,
  primaryFade: ['rgba(0,255,133,0.22)', 'rgba(0,255,133,0)'] as const,
  hero: ['rgba(18,18,23,0)', '#121217'] as const,
  purpleGlow: ['rgba(123,92,255,0.35)', 'rgba(92,140,255,0.08)'] as const,
} as const;

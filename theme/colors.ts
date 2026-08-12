export const colors = {
  background: '#121217',
  backgroundElevated: '#18181F',
  surface: '#2A2A33',
  surfaceHover: '#32323C',
  surfacePressed: '#24242C',
  surfaceMuted: '#1E1E26',
  border: '#3A3A45',
  borderSubtle: '#2F2F38',
  overlay: 'rgba(8, 8, 12, 0.72)',

  primary: '#00FF85',
  primaryMuted: 'rgba(0, 255, 133, 0.16)',
  primaryPressed: '#00D970',
  primaryGlow: 'rgba(0, 255, 133, 0.28)',
  onPrimary: '#0A0A0D',

  secondary: '#7B5CFF',
  secondaryMuted: 'rgba(123, 92, 255, 0.18)',
  secondaryPressed: '#6A4AE6',
  secondaryGlow: 'rgba(123, 92, 255, 0.3)',
  onSecondary: '#FFFFFF',

  white: '#FFFFFF',
  text: '#FFFFFF',
  textSecondary: '#B0B0BC',
  textMuted: '#7A7A88',
  textDisabled: '#555561',

  success: '#00FF85',
  warning: '#FFB020',
  error: '#FF4D6A',
  errorMuted: 'rgba(255, 77, 106, 0.14)',
  info: '#5B8CFF',

  protein: '#00FF85',
  carbs: '#7B5CFF',
  fats: '#FF8A4C',
  water: '#5B8CFF',

  chartLine: '#7B5CFF',
  chartFill: 'rgba(123, 92, 255, 0.18)',
  streak: '#00FF85',
  disabled: '#3E3E48',

  tabActive: '#00FF85',
  tabInactive: '#7A7A88',

  // Compatibility aliases
  fat: '#FF8A4C',
  primarySoft: 'rgba(0, 255, 133, 0.12)',
  borderStrong: '#4A4A58',
  skeleton: '#2F2F38',
  skeletonHighlight: '#3A3A45',
  surfaceHighlight: '#3A3A46',
  surfaceElevated: '#32323C',
} as const;

export type ColorToken = keyof typeof colors;

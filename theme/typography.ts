import { TextStyle } from 'react-native';

/** Tipografia oficial: Sora */
export const fontFamily = {
  regular: 'Sora_400Regular',
  medium: 'Sora_500Medium',
  semibold: 'Sora_600SemiBold',
  bold: 'Sora_700Bold',
  extrabold: 'Sora_800ExtraBold',
} as const;

export const typography = {
  display: {
    fontFamily: fontFamily.extrabold,
    fontSize: 34,
    lineHeight: 37,
    letterSpacing: -0.6,
  } satisfies TextStyle,
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: -0.4,
  } satisfies TextStyle,
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.3,
  } satisfies TextStyle,
  h3: {
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.2,
  } satisfies TextStyle,
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  } satisfies TextStyle,
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 22,
  } satisfies TextStyle,
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  } satisfies TextStyle,
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  } satisfies TextStyle,
  metric: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.5,
  } satisfies TextStyle,
  metricLg: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -0.8,
  } satisfies TextStyle,
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    lineHeight: 20,
  } satisfies TextStyle,
  wordmark: {
    fontFamily: fontFamily.extrabold,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: 2.4,
    fontStyle: 'italic',
  } satisfies TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;

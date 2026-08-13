export * from './colors';
export * from './typography';
export * from './spacing';
export * from './motion';

import { colors, gradients } from './colors';
import { typography, fontFamily } from './typography';
import { spacing, radius, layout, hitSlop } from './spacing';
import { duration, easing, pressScale } from './motion';

/** Compatibility aliases used by older component drafts */
export const tokens = {
  colors: {
    ...colors,
    performanceGreen: colors.primary,
    performanceGreenMuted: colors.primaryMuted,
    performanceGreenGlow: colors.primaryGlow,
    electricPurple: colors.secondary,
    electricPurpleMuted: colors.secondaryMuted,
    electricPurpleGlow: colors.secondaryGlow,
    textPrimary: colors.text,
    danger: colors.error,
    dangerMuted: colors.errorMuted,
    fat: colors.fats,
    blackSoft: colors.backgroundElevated,
    surfaceElevated: colors.surfaceElevated,
  },
  gradients,
  spacing,
  radius,
  typography,
  hitSlop,
};

export const theme = {
  colors,
  gradients,
  typography,
  fontFamily,
  spacing,
  radius,
  layout,
  hitSlop,
  duration,
  easing,
  pressScale,
} as const;

export type Theme = typeof theme;

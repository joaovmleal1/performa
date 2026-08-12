import { colors as baseColors } from './colors';
import { spacing, radius, hitSlop } from './spacing';
import { typography } from './typography';

export const colors = {
  ...baseColors,
  performanceGreen: baseColors.primary,
  performanceGreenMuted: baseColors.primaryMuted,
  performanceGreenGlow: baseColors.primaryGlow,
  electricPurple: baseColors.secondary,
  electricPurpleMuted: baseColors.secondaryMuted,
  electricPurpleGlow: baseColors.secondaryGlow,
  textPrimary: baseColors.text,
  danger: baseColors.error,
  dangerMuted: baseColors.errorMuted,
  fat: baseColors.fats,
  blackSoft: baseColors.backgroundElevated,
  surfaceElevated: baseColors.surfaceHover,
} as const;

export { spacing, radius, typography, hitSlop };

export const shadows = {
  greenGlow: {
    shadowColor: baseColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  purpleGlow: {
    shadowColor: baseColors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
} as const;

export const motion = {
  fast: 150,
  normal: 220,
  slow: 320,
} as const;

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  motion,
  hitSlop,
} as const;

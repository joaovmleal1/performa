export const duration = {
  instant: 100,
  fast: 150,
  normal: 220,
  slow: 320,
  splash: 900,
} as const;

export const easing = {
  // Approximate cubic-bezier feelings for Reanimated
  out: 'ease-out' as const,
  in: 'ease-in' as const,
  inOut: 'ease-in-out' as const,
};

export const pressScale = 0.97;

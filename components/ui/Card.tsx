import { colors, radius, shadows, spacing } from '@/theme';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

type Glow = 'green' | 'purple' | 'none';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padded?: boolean;
  glow?: Glow;
  accent?: 'green' | 'purple';
  accessibilityLabel?: string;
  elevated?: boolean;
};

export function Card({
  children,
  style,
  onPress,
  padded = true,
  glow,
  accent,
  accessibilityLabel,
  elevated,
}: Props) {
  const resolvedGlow: Glow = glow ?? (accent ? accent : 'none');

  const content = (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        padded && styles.padded,
        resolvedGlow === 'green' && styles.glowGreen,
        resolvedGlow === 'purple' && styles.glowPurple,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    ...shadows.card,
  },
  padded: {
    padding: spacing.lg,
  },
  glowGreen: {
    borderColor: 'rgba(0,255,133,0.35)',
    ...shadows.glowGreen,
  },
  glowPurple: {
    borderColor: 'rgba(123,92,255,0.4)',
    ...shadows.glowPurple,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
});

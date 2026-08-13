import { colors, radius, spacing } from '@/theme';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

type Glow = 'green' | 'purple' | 'none';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padded?: boolean;
  glow?: Glow;
  /** Alias de glow — 'green' | 'purple' */
  accent?: 'green' | 'purple';
  accessibilityLabel?: string;
};

export function Card({
  children,
  style,
  onPress,
  padded = true,
  glow,
  accent,
  accessibilityLabel,
}: Props) {
  const resolvedGlow: Glow = glow ?? (accent ? accent : 'none');

  const content = (
    <View
      style={[
        styles.card,
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
    backgroundColor: colors.surfaceMedium,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.lg,
  },
  glowGreen: {
    shadowColor: colors.primary,
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    borderColor: 'rgba(0,255,133,0.28)',
  },
  glowPurple: {
    shadowColor: colors.secondary,
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    borderColor: 'rgba(123,92,255,0.32)',
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
});

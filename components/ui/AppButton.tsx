import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';

import { colors, gradients, layout, radius, shadows } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ai';
type Size = 'md' | 'lg' | 'sm';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  accessibilityLabel?: string;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled,
  loading,
  style,
  textStyle,
  fullWidth = true,
  accessibilityLabel,
}: Props) {
  const isDisabled = disabled || loading;

  const inner = loading ? (
    <ActivityIndicator
      color={variant === 'primary' || variant === 'ai' ? colors.onPrimary : colors.white}
    />
  ) : (
    <Text
      style={[
        styles.label,
        variant === 'primary' && styles.labelOnPrimary,
        variant === 'secondary' && styles.labelSecondary,
        variant === 'ghost' && styles.labelGhost,
        variant === 'danger' && styles.labelDanger,
        variant === 'ai' && styles.labelAi,
        textStyle,
      ]}
    >
      {label}
    </Text>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={isDisabled}
      onPress={() => {
        if (isDisabled) return;
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        variant === 'ai' && styles.aiShell,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {variant === 'ai' ? (
        <LinearGradient
          colors={[...gradients.ai]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiFill}
        >
          <View style={styles.aiContent}>{inner}</View>
        </LinearGradient>
      ) : (
        inner
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    overflow: 'hidden',
  },
  fullWidth: { width: '100%' },
  sm: { paddingVertical: 10, paddingHorizontal: 14, minHeight: 40 },
  md: { paddingVertical: 12, paddingHorizontal: 16, minHeight: 48 },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: layout.buttonHeight,
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.glowGreen,
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.errorMuted,
    borderWidth: 1,
    borderColor: colors.error,
  },
  aiShell: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    ...shadows.glowPurple,
  },
  aiFill: {
    width: '100%',
    minHeight: layout.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
  },
  aiContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.45 },
  label: {
    fontFamily: 'Sora_700Bold',
    fontSize: 16,
  },
  labelOnPrimary: { color: colors.onPrimary },
  labelSecondary: { color: colors.white },
  labelGhost: { color: colors.primary },
  labelDanger: { color: colors.error },
  labelAi: { color: colors.white },
});

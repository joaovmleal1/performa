import { Check } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';
import { AppText } from './AppText';

type Props = {
  label: string;
  description?: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  right?: ReactNode;
};

/** Card de opção — seleção com outline verde (não fill total) */
export function OptionCard({
  label,
  description,
  selected,
  onPress,
  icon,
  right,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.copy}>
        <AppText variant="bodyMedium" color={selected ? colors.white : colors.text}>
          {label}
        </AppText>
        {description ? (
          <AppText variant="caption" color={colors.textMuted}>
            {description}
          </AppText>
        ) : null}
      </View>
      {right}
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected ? <Check size={12} color={colors.onPrimary} strokeWidth={3} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 64,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0,255,133,0.06)',
  },
  pressed: { opacity: 0.88 },
  icon: { width: 28, alignItems: 'center' },
  copy: { flex: 1, gap: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});

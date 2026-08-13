import { colors, radius, spacing } from '@/theme';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';

type Option = {
  value: string;
  label: string;
  description?: string;
};

type Props = {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
};

export function RadioGroup({ options, value, onChange }: Props) {
  return (
    <View style={styles.list}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.item, selected && styles.itemSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected ? <View style={styles.dot} /> : null}
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMedium">{option.label}</AppText>
              {option.description ? (
                <AppText variant="caption" muted>
                  {option.description}
                </AppText>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <AppText
        variant="label"
        color={selected ? colors.onPrimary : colors.textSecondary}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
};

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  suffix,
  large: _large,
}: StepperProps & { large?: boolean }) {
  return (
    <View style={styles.stepper}>
      <Pressable
        style={styles.stepBtn}
        onPress={() => onChange(Math.max(min, value - step))}
        accessibilityLabel="Diminuir"
      >
        <AppText variant="h2">−</AppText>
      </Pressable>
      <View style={styles.stepValue}>
        <AppText variant="metricLg" center>
          {value}
          {suffix ? (
            <AppText variant="h3" color={colors.textSecondary}>
              {` ${suffix}`}
            </AppText>
          ) : null}
        </AppText>
      </View>
      <Pressable
        style={styles.stepBtn}
        onPress={() => onChange(Math.min(max, value + step))}
        accessibilityLabel="Aumentar"
      >
        <AppText variant="h2">+</AppText>
      </Pressable>
    </View>
  );
}

export function ProgressDots({ total, index }: { total: number; index: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dotSmall, i === index && styles.dotActive]} />
      ))}
    </View>
  );
}

export function ScreenProgress({ current, total }: { current: number; total: number }) {
  const progress = (current + 1) / total;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMedium,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 56,
  },
  itemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMedium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  stepBtn: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMedium,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: { flex: 1, alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  dotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.primary,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});

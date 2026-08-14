import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing } from '@/theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
};

/** Anotação de carga: digitar kg + steppers ± */
export function WeightLogger({
  value,
  onChange,
  min = 0,
  max = 500,
  step = 2.5,
  label = 'Carga (kg)',
}: Props) {
  const [draft, setDraft] = useState(formatKg(value));

  useEffect(() => {
    setDraft(formatKg(value));
  }, [value]);

  const commit = (raw: string) => {
    const normalized = raw.replace(',', '.').trim();
    if (!normalized) {
      setDraft(formatKg(value));
      return;
    }
    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      setDraft(formatKg(value));
      return;
    }
    const clamped = Math.min(max, Math.max(min, parsed));
    onChange(clamped);
    setDraft(formatKg(clamped));
  };

  return (
    <View style={styles.wrap}>
      <AppText variant="caption" color={colors.textMuted} center>
        {label}
      </AppText>
      <View style={styles.row}>
        <Pressable
          style={styles.stepBtn}
          onPress={() => onChange(Math.max(min, Math.round((value - step) * 4) / 4))}
          accessibilityLabel="Diminuir carga"
        >
          <AppText variant="h2">−</AppText>
        </Pressable>

        <View style={styles.inputWrap}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            onBlur={() => commit(draft)}
            onSubmitEditing={() => commit(draft)}
            keyboardType="decimal-pad"
            selectTextOnFocus
            style={styles.input}
            accessibilityLabel="Peso em quilogramas"
          />
          <AppText variant="h3" color={colors.textSecondary}>
            kg
          </AppText>
        </View>

        <Pressable
          style={styles.stepBtn}
          onPress={() => onChange(Math.min(max, Math.round((value + step) * 4) / 4))}
          accessibilityLabel="Aumentar carga"
        >
          <AppText variant="h2">+</AppText>
        </Pressable>
      </View>
      <AppText variant="caption" color={colors.textMuted} center>
        Digite o peso ou use ±{step} kg
      </AppText>
    </View>
  );
}

function formatKg(value: number) {
  if (Number.isInteger(value)) return String(value);
  return String(Math.round(value * 100) / 100);
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    minHeight: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderStrong ?? colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  input: {
    minWidth: 88,
    textAlign: 'center',
    color: colors.white,
    fontFamily: 'Sora_700Bold',
    fontSize: 36,
    lineHeight: 44,
    paddingVertical: 4,
  },
});

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AIOrb } from '@/components/brand/PerformaLogo';
import { AppText, Screen, ScreenHeader } from '@/components/ui';
import { useNutritionStore } from '@/stores/nutrition-store';
import { colors, spacing } from '@/theme';

const STEPS = [
  'Analisando sua rotina',
  'Calculando suas necessidades',
  'Selecionando melhores alimentos',
  'Montando seu plano',
];

export default function AiGeneratingScreen() {
  const router = useRouter();
  const generateDietFromInterview = useNutritionStore((s) => s.generateDietFromInterview);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 450);
    const timer = setTimeout(() => {
      generateDietFromInterview();
      router.replace('/nutrition/ai-result');
    }, 2000);
    return () => {
      clearInterval(tick);
      clearTimeout(timer);
    };
  }, [generateDietFromInterview, router]);

  return (
    <Screen>
      <ScreenHeader title="Gerando sua dieta" showBack={false} />
      <AppText variant="body" color={colors.textSecondary} style={{ marginBottom: spacing['2xl'] }}>
        Nossa IA está criando um plano alimentar personalizado para você.
      </AppText>

      <View style={styles.body}>
        <AIOrb size={140} />
        <AppText variant="caption" color={colors.secondary} style={{ marginTop: spacing.lg }}>
          PERFORMA AI
        </AppText>
        <AppText variant="h2" center style={{ marginTop: spacing.md }}>
          Analisando suas respostas
        </AppText>
      </View>

      <View style={styles.steps}>
        {STEPS.map((label, index) => {
          const done = index < step;
          const active = index === step;
          return (
            <View key={label} style={styles.stepRow}>
              <View
                style={[
                  styles.dot,
                  done && styles.dotDone,
                  active && styles.dotActive,
                ]}
              />
              <AppText
                variant="body"
                color={
                  done ? colors.primary : active ? colors.secondary : colors.textMuted
                }
              >
                {done ? '✓ ' : active ? '◌ ' : '○ '}
                {label}
              </AppText>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { alignItems: 'center', marginTop: spacing['2xl'] },
  steps: { marginTop: spacing['3xl'], gap: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surfaceElevated,
  },
  dotDone: { backgroundColor: colors.primary },
  dotActive: { backgroundColor: colors.secondary },
});

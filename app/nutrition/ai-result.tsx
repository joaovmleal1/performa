import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppText, Card, Screen } from '@/components/ui';
import { useNutritionStore } from '@/stores/nutrition-store';
import { colors, spacing } from '@/theme';

export default function AiResultScreen() {
  const router = useRouter();
  const dietPlan = useNutritionStore((s) => s.dietPlan);

  if (!dietPlan) {
    return (
      <Screen>
        <View style={styles.empty}>
          <AppText variant="h2" center>
            Plano não encontrado
          </AppText>
          <AppButton label="Gerar novamente" onPress={() => router.replace('/nutrition/ai-diet')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <AppText variant="h1">{dietPlan.title}</AppText>
      <AppText variant="body" muted style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}>
        Plano gerado em {dietPlan.createdAt}
      </AppText>

      <Card accent="green" style={styles.targets}>
        <AppText variant="caption" muted>
          Meta diária
        </AppText>
        <AppText variant="metric" color={colors.primary}>
          {dietPlan.targets?.calories ?? dietPlan.dailyCalories ?? 0} kcal
        </AppText>
        <View style={styles.macroRow}>
          <AppText variant="label">
            P {dietPlan.targets?.proteinG ?? dietPlan.macros?.proteinG ?? 0}g
          </AppText>
          <AppText variant="label">
            C {dietPlan.targets?.carbsG ?? dietPlan.macros?.carbsG ?? 0}g
          </AppText>
          <AppText variant="label">
            G {dietPlan.targets?.fatG ?? dietPlan.macros?.fatG ?? 0}g
          </AppText>
        </View>
      </Card>

      <AppButton
        label="Ver plano completo"
        onPress={() => router.replace('/nutrition/meal-plan')}
        style={{ marginTop: spacing.xl }}
      />
      <AppButton
        label="Ir para nutrição"
        variant="secondary"
        onPress={() => router.replace('/(tabs)/nutrition')}
        style={{ marginTop: spacing.sm }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  targets: { gap: spacing.sm },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
});

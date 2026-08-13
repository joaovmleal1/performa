import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AIOrb } from '@/components/brand/PerformaLogo';
import { AppButton, AppText, ProgressRing, Screen } from '@/components/ui';
import { useNutritionStore } from '@/stores/nutrition-store';
import { colors, spacing } from '@/theme';

/** Tela — dieta pronta */
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

  const calories = dietPlan.targets?.calories ?? dietPlan.dailyCalories ?? 2100;
  const protein = dietPlan.targets?.proteinG ?? dietPlan.macros?.proteinG ?? 150;
  const carbs = dietPlan.targets?.carbsG ?? dietPlan.macros?.carbsG ?? 200;
  const fat = dietPlan.targets?.fatG ?? dietPlan.macros?.fatG ?? 70;

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <AIOrb size={72} />
        <AppText variant="h1" center style={{ marginTop: spacing.lg }}>
          Sua dieta está pronta! 🎉
        </AppText>
        <AppText variant="body" color={colors.textSecondary} center style={{ marginTop: spacing.sm }}>
          Seu plano foi criado com base no seu objetivo, rotina e preferências.
        </AppText>
      </View>

      <AppText variant="metricLg" center color={colors.primary} style={{ marginTop: spacing['2xl'] }}>
        {calories.toLocaleString('pt-BR')}
      </AppText>
      <AppText variant="caption" color={colors.textMuted} center>
        kcal diárias
      </AppText>

      <View style={styles.rings}>
        <View style={styles.ringItem}>
          <ProgressRing
            progress={1}
            size={88}
            value={`${protein}g`}
            color={colors.protein}
            trackColor={colors.surfaceElevated}
          />
          <AppText variant="caption" color={colors.textSecondary} center>
            Proteínas
          </AppText>
        </View>
        <View style={styles.ringItem}>
          <ProgressRing
            progress={1}
            size={88}
            value={`${carbs}g`}
            color={colors.carbs}
            trackColor={colors.surfaceElevated}
          />
          <AppText variant="caption" color={colors.textSecondary} center>
            Carboidratos
          </AppText>
        </View>
        <View style={styles.ringItem}>
          <ProgressRing
            progress={1}
            size={88}
            value={`${fat}g`}
            color={colors.fats}
            trackColor={colors.surfaceElevated}
          />
          <AppText variant="caption" color={colors.textSecondary} center>
            Gorduras
          </AppText>
        </View>
      </View>

      <AppButton
        label="Ver plano completo"
        onPress={() => router.replace('/nutrition/meal-plan')}
        style={{ marginTop: spacing['2xl'] }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  hero: { alignItems: 'center', marginTop: spacing.xl },
  rings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing['2xl'],
    gap: spacing.sm,
  },
  ringItem: { flex: 1, alignItems: 'center', gap: spacing.sm },
});

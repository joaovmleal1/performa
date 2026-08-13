import { useRouter } from 'expo-router';
import { Droplets, Lock, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  MacroProgress,
  PageHeading,
  ProgressBar,
  ProgressRing,
  Screen,
  StatusPill,
} from '@/components/ui';
import { useAuthStore } from '@/stores/auth-store';
import { useNutritionStore } from '@/stores/nutrition-store';
import { colors, spacing } from '@/theme';

export default function NutritionTabScreen() {
  const router = useRouter();
  const daily = useNutritionStore((s) => s.daily);
  const hasDietPlan = useNutritionStore((s) => s.hasDietPlan);
  const addWater = useNutritionStore((s) => s.addWater);
  const user = useAuthStore((s) => s.user);
  const unlockDietBuilder = useAuthStore((s) => s.unlockDietBuilder);

  const dietUnlocked = Boolean(user?.dietBuilderUnlocked || hasDietPlan);
  const calorieProgress =
    daily.target.calories > 0 ? daily.consumed.calories / daily.target.calories : 0;

  return (
    <Screen scroll>
      <PageHeading
        eyebrow="Resumo de hoje"
        title="Nutrição"
        subtitle="Acompanhe macros, hidratação e seu plano alimentar."
      />

      <Card style={styles.caloriesCard}>
        <ProgressRing
          progress={calorieProgress}
          size={120}
          value={`${daily.consumed.calories}`}
          label="kcal"
          color={colors.primary}
        />
        <View style={{ flex: 1, gap: 8 }}>
          <AppText variant="h3">Hoje</AppText>
          <AppText variant="caption" muted>
            Meta {daily.target.calories} kcal
          </AppText>
          <AppText variant="caption" muted>
            Restam {Math.max(0, daily.target.calories - daily.consumed.calories)} kcal
          </AppText>
        </View>
      </Card>

      <Card style={styles.section}>
        <MacroProgress
          label="Proteína"
          current={daily.consumed.proteinG}
          target={daily.target.proteinG}
          color={colors.protein}
        />
        <MacroProgress
          label="Carboidratos"
          current={daily.consumed.carbsG}
          target={daily.target.carbsG}
          color={colors.carbs}
        />
        <MacroProgress
          label="Gorduras"
          current={daily.consumed.fatG}
          target={daily.target.fatG}
          color={colors.fats}
        />
      </Card>

      <Card style={styles.section}>
        <View style={styles.waterRow}>
          <View style={styles.waterLeft}>
            <Droplets size={18} color={colors.water} />
            <AppText variant="h3">Água</AppText>
          </View>
          <AppText variant="label" color={colors.water}>
            {daily.waterLiters.toFixed(1)} / {daily.waterGoalLiters.toFixed(1)} L
          </AppText>
        </View>
        <ProgressBar
          progress={daily.waterGoalLiters ? daily.waterLiters / daily.waterGoalLiters : 0}
          color={colors.water}
          height={6}
        />
        <Pressable
          onPress={() => addWater(0.25)}
          style={styles.waterBtn}
          accessibilityRole="button"
        >
          <AppText variant="label" color={colors.onPrimary}>
            + 250 ml
          </AppText>
        </Pressable>
      </Card>

      <Card style={styles.section}>
        <AppText variant="h3">Refeições</AppText>
        {daily.meals.map((meal) => (
          <View key={meal.id} style={styles.mealRow}>
            <View>
              <AppText variant="bodyMedium">{meal.name}</AppText>
              <AppText variant="caption" muted>
                {meal.time} · {meal.items.reduce((sum, i) => sum + i.calories, 0)} kcal
              </AppText>
            </View>
            <StatusPill
              label={meal.logged ? 'Registrada' : 'Pendente'}
              tone={meal.logged ? 'success' : 'neutral'}
            />
          </View>
        ))}
      </Card>

      {hasDietPlan ? (
        <AppButton
          label="Ver plano alimentar"
          onPress={() => router.push('/nutrition/meal-plan')}
        />
      ) : dietUnlocked ? (
        <Card accent="purple" style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={18} color={colors.secondary} />
            <AppText variant="h3">Dieta com IA</AppText>
          </View>
          <AppText variant="body" muted>
            Montagem desbloqueada. Gere um plano personalizado com base na sua rotina e
            preferências.
          </AppText>
          <AppButton
            label="Montar minha dieta"
            variant="ai"
            onPress={() => router.push('/nutrition/ai-diet')}
          />
        </Card>
      ) : (
        <Card style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Lock size={18} color={colors.textMuted} />
            <AppText variant="h3">Montagem de dieta</AppText>
          </View>
          <AppText variant="body" muted>
            {user?.dietInterest === 'already_doing'
              ? 'Você indicou que já faz dieta. Se quiser, pode montar um plano com a gente a qualquer momento.'
              : 'Na entrevista inicial você optou por não montar a dieta agora. Libere quando quiser.'}
          </AppText>
          <AppButton
            label="Quero montar minha dieta"
            variant="secondary"
            onPress={() => {
              unlockDietBuilder();
              router.push('/nutrition/ai-diet');
            }}
          />
        </Card>
      )}

      <AppButton
        label="Lista de compras"
        variant="secondary"
        onPress={() => router.push('/nutrition/shopping-list')}
        style={{ marginTop: spacing.md }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  caloriesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  section: { gap: spacing.md, marginTop: spacing.lg },
  waterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waterLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  waterBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 54,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  aiCard: { gap: spacing.md, marginTop: spacing.lg },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

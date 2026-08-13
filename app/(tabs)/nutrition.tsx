import { useRouter } from 'expo-router';
import { Droplets, Lock } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AIOrb } from '@/components/brand/PerformaLogo';
import {
  AppButton,
  AppText,
  Card,
  MacroProgress,
  ProgressBar,
  ProgressRing,
  Screen,
  ScreenTitle,
  StatusPill,
} from '@/components/ui';
import { useAuthStore } from '@/stores/auth-store';
import { useNutritionStore } from '@/stores/nutrition-store';
import { colors, radius, spacing } from '@/theme';

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
      <ScreenTitle title="Nutrição" subtitle="Macros, hidratação e plano do dia." />

      <Card style={styles.caloriesCard}>
        <ProgressRing
          progress={calorieProgress}
          size={112}
          value={`${daily.consumed.calories}`}
          label="kcal"
          color={colors.primary}
          trackColor={colors.surfaceMedium}
        />
        <View style={{ flex: 1, gap: 6 }}>
          <AppText variant="h3">Hoje</AppText>
          <AppText variant="caption" color={colors.textMuted}>
            Meta {daily.target.calories} kcal
          </AppText>
          <AppText variant="bodyMedium" color={colors.primary}>
            Restam {Math.max(0, daily.target.calories - daily.consumed.calories)} kcal
          </AppText>
        </View>
      </Card>

      <Card style={styles.section}>
        <AppText variant="h3">Macros</AppText>
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
            <Droplets size={18} color={colors.water} strokeWidth={1.85} />
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
          trackColor={colors.surfaceMedium}
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
        {daily.meals.map((meal, index) => (
          <View
            key={meal.id}
            style={[
              styles.mealRow,
              index === daily.meals.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View>
              <AppText variant="bodyMedium">{meal.name}</AppText>
              <AppText variant="caption" color={colors.textMuted}>
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
          style={{ marginTop: spacing.lg }}
        />
      ) : dietUnlocked ? (
        <Card accent="purple" style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <AIOrb size={48} />
            <View style={{ flex: 1, gap: 4 }}>
              <AppText variant="h3">Dieta com IA</AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Gere um plano personalizado com base na sua rotina.
              </AppText>
            </View>
          </View>
          <AppButton
            label="Montar minha dieta"
            variant="ai"
            onPress={() => router.push('/nutrition/ai-diet')}
          />
        </Card>
      ) : (
        <Card style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.lockBubble}>
              <Lock size={18} color={colors.textMuted} strokeWidth={1.85} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <AppText variant="h3">Montagem de dieta</AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {user?.dietInterest === 'already_doing'
                  ? 'Você já faz dieta. Libere a montagem quando quiser.'
                  : 'Libere quando quiser montar um plano com a gente.'}
              </AppText>
            </View>
          </View>
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
    borderRadius: radius.md,
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
  aiCard: { gap: spacing.lg, marginTop: spacing.lg },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lockBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

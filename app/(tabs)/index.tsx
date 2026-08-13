import { Droplets, Flame } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { TechniquePromoCard } from '@/components/technique/TechniquePromoCard';
import {
  AIInsightCard,
  AppText,
  Card,
  Greeting,
  MacroProgress,
  MetricCard,
  ProgressBar,
  Screen,
  WorkoutCard,
} from '@/components/ui';
import { mockInsights, mockTodayWorkout } from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuthStore } from '@/stores/auth-store';
import { useNutritionStore } from '@/stores/nutrition-store';
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { colors, radius, spacing } from '@/theme';

export default function DashboardScreen() {
  const router = useAppRouter();
  const user = useAuthStore((s) => s.user);
  const daily = useNutritionStore((s) => s.daily);
  const addWater = useNutritionStore((s) => s.addWater);
  const startSession = useWorkoutSessionStore((s) => s.startSession);

  const firstName = (user?.name ?? user?.fullName ?? 'atleta').split(' ')[0];
  const caloriesRemaining = Math.max(0, daily.target.calories - daily.consumed.calories);

  const handleStartWorkout = () => {
    startSession();
    router.push('/workout/session');
  };

  return (
    <Screen scroll>
      <Greeting name={firstName} />

      <WorkoutCard workout={mockTodayWorkout} onStart={handleStartWorkout} />

      <View style={styles.technique}>
        <TechniquePromoCard />
      </View>

      <View style={styles.row}>
        <MetricCard
          label="Calorias restantes"
          value={`${caloriesRemaining}`}
          hint={`${daily.consumed.calories} / ${daily.target.calories} kcal`}
          accent="green"
        />
        <MetricCard
          label="Série em andamento"
          value={`${user?.streakDays ?? 7}`}
          hint="dias seguidos"
          accent="green"
          icon={<Flame size={16} color={colors.primary} strokeWidth={1.85} />}
        />
      </View>

      <Card style={styles.section}>
        <AppText variant="h3">Macros de hoje</AppText>
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
          accessibilityLabel="Adicionar 250 ml de água"
        >
          <AppText variant="label" color={colors.onPrimary}>
            + 250 ml
          </AppText>
        </Pressable>
      </Card>

      <View style={styles.insights}>
        <AppText variant="h3">Para você</AppText>
        {mockInsights.slice(0, 2).map((insight) => (
          <AIInsightCard
            key={insight.id}
            title={insight.title}
            message={insight.message}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  technique: { marginTop: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
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
  insights: { gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.xl },
});

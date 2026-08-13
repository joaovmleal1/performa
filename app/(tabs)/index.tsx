import { Droplets, Flame } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { TechniquePromoCard } from '@/components/technique/TechniquePromoCard';
import {
  AIInsightCard,
  AppText,
  Avatar,
  Card,
  MacroProgress,
  ProgressBar,
  ProgressRing,
  Screen,
  WorkoutCard,
} from '@/components/ui';
import { mockInsights, mockTodayWorkout } from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuthStore } from '@/stores/auth-store';
import { useNutritionStore } from '@/stores/nutrition-store';
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { colors, radius, spacing } from '@/theme';

/** Tela 04 — Dashboard */
export default function DashboardScreen() {
  const router = useAppRouter();
  const user = useAuthStore((s) => s.user);
  const daily = useNutritionStore((s) => s.daily);
  const addWater = useNutritionStore((s) => s.addWater);
  const startSession = useWorkoutSessionStore((s) => s.startSession);

  const firstName = (user?.name ?? user?.fullName ?? 'Amanda').split(' ')[0];
  const caloriesRemaining = Math.max(0, daily.target.calories - daily.consumed.calories);
  const calorieProgress =
    daily.target.calories > 0 ? daily.consumed.calories / daily.target.calories : 0;

  const handleStartWorkout = () => {
    startSession();
    router.push('/workout/session');
  };

  return (
    <Screen scroll>
      <View style={styles.helloRow}>
        <View style={{ flex: 1, gap: 4 }}>
          <AppText variant="h1">Olá, {firstName}! 👋</AppText>
          <AppText variant="body" color={colors.textSecondary}>
            Pronta para superar seus limites hoje?
          </AppText>
        </View>
        <Avatar name={user?.fullName ?? user?.name ?? 'Amanda Silva'} size={44} />
      </View>

      <WorkoutCard workout={mockTodayWorkout} onStart={handleStartWorkout} />

      <Card style={styles.caloriesCard}>
        <ProgressRing
          progress={calorieProgress}
          size={96}
          stroke={9}
          value={`${daily.consumed.calories.toLocaleString('pt-BR')}`}
          label={`/ ${daily.target.calories.toLocaleString('pt-BR')}`}
          color={colors.primary}
          trackColor={colors.surfaceElevated}
        />
        <View style={{ flex: 1, gap: 4 }}>
          <AppText variant="caption" color={colors.textMuted}>
            Calorias
          </AppText>
          <AppText variant="metric" color={colors.primary}>
            {caloriesRemaining.toLocaleString('pt-BR')}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            kcal restantes
          </AppText>
        </View>
      </Card>

      <View style={styles.row}>
        <Card style={styles.half}>
          <View style={styles.streakHead}>
            <Flame size={16} color={colors.primary} strokeWidth={1.85} />
            <AppText variant="caption" color={colors.textMuted}>
              Sequência
            </AppText>
          </View>
          <AppText variant="metric" color={colors.primary}>
            {user?.streakDays ?? 7} dias
          </AppText>
        </Card>
        <Card style={styles.half}>
          <View style={styles.streakHead}>
            <Droplets size={16} color={colors.water} strokeWidth={1.85} />
            <AppText variant="caption" color={colors.textMuted}>
              Água
            </AppText>
          </View>
          <AppText variant="h3">
            {daily.waterLiters.toFixed(1).replace('.', ',')} /{' '}
            {daily.waterGoalLiters.toFixed(1).replace('.', ',')} L
          </AppText>
          <ProgressBar
            progress={daily.waterGoalLiters ? daily.waterLiters / daily.waterGoalLiters : 0}
            color={colors.water}
            height={5}
            trackColor={colors.surfaceElevated}
          />
          <Pressable onPress={() => addWater(0.25)} style={styles.waterBtn}>
            <AppText variant="caption" color={colors.onPrimary}>
              + 250 ml
            </AppText>
          </Pressable>
        </Card>
      </View>

      <Card style={styles.section}>
        <AppText variant="h3">Macros</AppText>
        <MacroProgress
          label="Proteínas"
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

      <View style={styles.insights}>
        <AIInsightCard
          title="Insight da IA"
          message={
            mockInsights[0]?.message ??
            'Você aumentou seu volume de treino em 8% esta semana.'
          }
        />
      </View>

      <TechniquePromoCard compact />
    </Screen>
  );
}

const styles = StyleSheet.create({
  helloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  caloriesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  half: { flex: 1, gap: spacing.sm, minHeight: 120 },
  streakHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  waterBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  section: { gap: spacing.md, marginTop: spacing.lg },
  insights: { marginTop: spacing.lg, marginBottom: spacing.md },
});

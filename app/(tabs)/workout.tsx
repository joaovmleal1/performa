import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { TechniquePromoCard } from '@/components/technique/TechniquePromoCard';
import {
  AppButton,
  AppText,
  ExerciseCard,
  Screen,
} from '@/components/ui';
import { getExerciseGifUrl } from '@/data/exercises';
import { mockTodayWorkout } from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { coachDecideWorkoutLoads } from '@/services/coach-agent';
import { useAuthStore } from '@/stores/auth-store';
import { useLiftHistoryStore } from '@/stores/lift-history-store';
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { colors, spacing } from '@/theme';

/** Tela 05 — Treino de hoje */
export default function WorkoutTabScreen() {
  const router = useAppRouter();
  const startSession = useWorkoutSessionStore((s) => s.startSession);
  const sessions = useLiftHistoryStore((s) => s.sessions);
  const user = useAuthStore((s) => s.user);
  const workout = mockTodayWorkout;

  const coachPlans = useMemo(() => {
    const history = useLiftHistoryStore.getState();
    return coachDecideWorkoutLoads({
      user,
      exercises: workout.exercises.map((ex) => {
        const recent = history.getExerciseHistory(ex.exerciseId).slice(0, 3);
        return {
          exerciseId: ex.exerciseId,
          exerciseName: ex.exercise.name,
          sets: ex.sets,
          reps: ex.reps,
          fallbackWeightKg: ex.suggestedWeightKg || ex.previousWeightKg || 20,
          lastSets: history.getLastSetsForExercise(ex.exerciseId).map((s) => ({
            setNumber: s.setNumber,
            weightKg: s.weightKg,
            reps: s.reps,
          })),
          recentSessions: recent.map((entry) => ({
            sets: entry.sets.map((s) => ({
              setNumber: s.setNumber,
              weightKg: s.weightKg,
              reps: s.reps,
            })),
          })),
        };
      }),
    });
  }, [sessions, user, workout.exercises]);

  const handleStart = () => {
    startSession();
    router.push('/workout/session');
  };

  const increaseCount = Object.values(coachPlans).reduce(
    (n, plan) => n + plan.sets.filter((s) => s.action === 'increase').length,
    0,
  );

  return (
    <Screen scroll tabBarInset>
      <View style={styles.header}>
        <AppText variant="caption" color={colors.textMuted}>
          Treino de hoje
        </AppText>
        <AppText variant="h1">{workout.name}</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          {workout.estimatedMinutes} min · {workout.exercises.length} exercícios
        </AppText>
        {sessions.length > 0 ? (
          <AppText variant="caption" color={colors.secondary} style={{ marginTop: 6 }}>
            {increaseCount > 0
              ? `Coach: aumento indicado em ${increaseCount} série(s) com base no seu histórico`
              : 'Coach: manter cargas nesta sessão — estabilize as reps'}
          </AppText>
        ) : (
          <AppText variant="caption" color={colors.textMuted} style={{ marginTop: 6 }}>
            Coach: anote as cargas hoje para indicar progressão nas próximas sessões
          </AppText>
        )}
      </View>

      <View style={styles.list}>
        {workout.exercises.map((item) => {
          const plan = coachPlans[item.exerciseId];
          const lastSets = useLiftHistoryStore
            .getState()
            .getLastSetsForExercise(item.exerciseId);
          const lastTop = lastSets.length
            ? lastSets.reduce((max, s) => Math.max(max, s.weightKg), 0)
            : item.previousWeightKg;
          const suggested =
            plan?.sets.find((s) => s.action === 'increase')?.suggestedWeightKg ??
            plan?.sets[0]?.suggestedWeightKg ??
            item.suggestedWeightKg;
          const coachTag =
            plan?.sets.some((s) => s.action === 'increase')
              ? '↑ Coach'
              : plan?.sets.some((s) => s.action === 'decrease')
                ? '↓ Coach'
                : sessions.length > 0
                  ? 'Coach'
                  : undefined;

          return (
            <ExerciseCard
              key={`${item.exerciseId}-${sessions.length}`}
              name={item.exercise.name}
              sets={item.sets}
              reps={item.reps}
              suggestedWeightKg={suggested}
              previousWeightKg={lastTop}
              coachTag={coachTag}
              completed={item.completed}
              color={item.exercise.thumbnailColor ?? '#161A22'}
              gifUrl={getExerciseGifUrl(item.exercise)}
              onPress={() => router.push(`/exercises/${item.exerciseId}`)}
            />
          );
        })}
      </View>

      <AppButton label="Iniciar treino" onPress={handleStart} />

      <View style={styles.technique}>
        <TechniquePromoCard compact />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 4, marginTop: spacing.md, marginBottom: spacing.xl },
  list: { gap: spacing.sm, marginBottom: spacing.xl },
  technique: { marginTop: spacing.xl, marginBottom: spacing.lg },
});

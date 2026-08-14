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
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { colors, spacing } from '@/theme';

/** Tela 05 — Treino de hoje */
export default function WorkoutTabScreen() {
  const router = useAppRouter();
  const startSession = useWorkoutSessionStore((s) => s.startSession);
  const workout = mockTodayWorkout;

  const handleStart = () => {
    startSession();
    router.push('/workout/session');
  };

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
      </View>

      <View style={styles.list}>
        {workout.exercises.map((item) => (
          <ExerciseCard
            key={item.exerciseId}
            name={item.exercise.name}
            sets={item.sets}
            reps={item.reps}
            suggestedWeightKg={item.suggestedWeightKg}
            previousWeightKg={item.previousWeightKg}
            completed={item.completed}
            color={item.exercise.thumbnailColor ?? '#161A22'}
            gifUrl={getExerciseGifUrl(item.exercise)}
            onPress={() => router.push(`/exercises/${item.exerciseId}`)}
          />
        ))}
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

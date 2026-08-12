import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  ExerciseCard,
  Screen,
  WorkoutCard,
} from '@/components/ui';
import { getExerciseGifUrl } from '@/data/exercises';
import { mockTodayWorkout } from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { spacing } from '@/theme';

export default function WorkoutTabScreen() {
  const router = useAppRouter();
  const startSession = useWorkoutSessionStore((s) => s.startSession);
  const workout = mockTodayWorkout;

  const handleStart = () => {
    startSession();
    router.push('/workout/session');
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="h1">Treino</AppText>
        <AppText variant="body" muted>
          Seu plano de hoje está pronto.
        </AppText>
      </View>

      <WorkoutCard workout={workout} onStart={handleStart} />

      <View style={styles.list}>
        <AppText variant="h3">Exercícios</AppText>
        {workout.exercises.map((item) => (
          <ExerciseCard
            key={item.exerciseId}
            name={item.exercise.name}
            sets={item.sets}
            reps={item.reps}
            suggestedWeightKg={item.suggestedWeightKg}
            previousWeightKg={item.previousWeightKg}
            completed={item.completed}
            color={item.exercise.thumbnailColor ?? '#2A2A33'}
            gifUrl={getExerciseGifUrl(item.exercise)}
            onPress={() => router.push(`/exercises/${item.exerciseId}`)}
          />
        ))}
      </View>

      <AppButton label="Iniciar sessão" onPress={handleStart} />
      <AppButton
        label="Biblioteca de exercícios"
        variant="secondary"
        onPress={() => router.push('/exercises')}
        style={{ marginTop: spacing.sm }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginBottom: spacing.xl, marginTop: spacing.md },
  list: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.xl },
});

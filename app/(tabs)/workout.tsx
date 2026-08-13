import { Flag } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  ExerciseCard,
  Screen,
  ScreenTitle,
  SectionHeading,
  WorkoutCard,
} from '@/components/ui';
import { getExerciseGifUrl } from '@/data/exercises';
import { mockTodayWorkout } from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { loadLabels, phaseKindLabels } from '@/lib/periodization';
import { useAuthStore } from '@/stores/auth-store';
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { colors, spacing } from '@/theme';

export default function WorkoutTabScreen() {
  const router = useAppRouter();
  const startSession = useWorkoutSessionStore((s) => s.startSession);
  const user = useAuthStore((s) => s.user);
  const workout = mockTodayWorkout;
  const plan = user?.preparationMode ? user.periodization : null;

  const handleStart = () => {
    startSession();
    router.push('/workout/session');
  };

  return (
    <Screen scroll>
      <ScreenTitle title="Treino" subtitle="Foque em uma série de cada vez." />

      <WorkoutCard workout={workout} onStart={handleStart} />

      {plan ? (
        <Card accent="purple" style={styles.prepCard}>
          <View style={styles.prepHeader}>
            <Flag size={18} color={colors.secondary} strokeWidth={1.85} />
            <AppText variant="h3">Periodização</AppText>
          </View>
          <AppText variant="bodyMedium">
            {plan.sport} · {plan.totalWeeks} semanas até {plan.competitionDate}
          </AppText>
          <View style={styles.phaseList}>
            {plan.phases.slice(0, 3).map((phase, index) => (
              <View key={phase.id} style={styles.phaseRow}>
                <AppText variant="caption" color={colors.primary}>
                  {index + 1}. {phaseKindLabels[phase.kind]}
                </AppText>
                <AppText variant="caption" color={colors.textMuted}>
                  {phase.weeks} sem · vol. {loadLabels[phase.volume]} · int.{' '}
                  {loadLabels[phase.intensity]}
                </AppText>
              </View>
            ))}
          </View>
          <AppButton
            label="Ver periodização completa"
            variant="secondary"
            onPress={() => router.push('/preparation')}
          />
        </Card>
      ) : null}

      <View style={styles.list}>
        <SectionHeading
          title="Exercícios de hoje"
          actionLabel="Biblioteca"
          onAction={() => router.push('/exercises')}
        />
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

      <AppButton
        label="Técnica de execução"
        variant="secondary"
        onPress={() => router.push('/technique')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  prepCard: { gap: spacing.md, marginTop: spacing.lg },
  prepHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  phaseList: { gap: 6 },
  phaseRow: { gap: 2 },
  list: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.lg },
});

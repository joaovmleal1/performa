import { Flag } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  ExerciseCard,
  Screen,
  WorkoutCard,
} from '@/components/ui';
import { getExerciseGifUrl } from '@/data/exercises';
import { mockTodayWorkout } from '@/data/mock';
import { loadLabels, phaseKindLabels } from '@/lib/periodization';
import { useAppRouter } from '@/hooks/useAppRouter';
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
      <View style={styles.header}>
        <AppText variant="h1">Treino</AppText>
        <AppText variant="body" muted>
          {plan
            ? `Modo preparação · ${plan.competitionName}`
            : 'Seu plano de hoje está pronto.'}
        </AppText>
      </View>

      {plan ? (
        <Card accent="purple" style={styles.prepCard}>
          <View style={styles.prepHeader}>
            <Flag size={18} color={colors.secondary} />
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
                <AppText variant="caption" muted>
                  {phase.weeks} sem · vol. {loadLabels[phase.volume]} · int.{' '}
                  {loadLabels[phase.intensity]}
                </AppText>
              </View>
            ))}
            {plan.phases.length > 3 ? (
              <AppText variant="caption" muted>
                + {plan.phases.length - 3} fases na visão completa
              </AppText>
            ) : null}
          </View>
          <AppButton
            label="Ver periodização completa"
            variant="secondary"
            onPress={() => router.push('/preparation')}
          />
        </Card>
      ) : (
        <Card style={styles.prepCard}>
          <AppText variant="h3">Modo preparação</AppText>
          <AppText variant="body" muted>
            Vai competir? Ative o modo e monte a periodização completa para o seu esporte.
          </AppText>
          <AppButton
            label="Ativar modo preparação"
            variant="secondary"
            onPress={() => router.push('/preparation')}
          />
        </Card>
      )}

      <WorkoutCard workout={workout} onStart={handleStart} />

      <View style={styles.list}>
        <AppText variant="h3">Exercícios de hoje</AppText>
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
      <AppButton
        label="Como fazer e como não fazer"
        variant="secondary"
        onPress={() => router.push('/technique')}
        style={{ marginTop: spacing.sm }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginBottom: spacing.xl, marginTop: spacing.md },
  prepCard: { gap: spacing.md, marginBottom: spacing.lg },
  prepHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  phaseList: { gap: 6 },
  phaseRow: { gap: 2 },
  list: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing.xl },
});

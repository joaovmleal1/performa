import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  NumberStepper,
  ProgressRing,
  Screen,
} from '@/components/ui';
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { colors, spacing } from '@/theme';

export default function WorkoutSessionScreen() {
  const router = useRouter();
  const {
    workout,
    exerciseIndex,
    setIndex,
    currentWeight,
    currentReps,
    isResting,
    restSecondsLeft,
    setWeight,
    setReps,
    completeSet,
    skipRest,
    addRestTime,
    tickRest,
    pauseRest,
    resumeRest,
    restPaused,
  } = useWorkoutSessionStore();

  const exercise = workout.exercises[exerciseIndex];
  const isDone =
    !exercise ||
    (exerciseIndex >= workout.exercises.length - 1 &&
      exercise.completed &&
      !isResting);

  useEffect(() => {
    if (!isResting || restPaused) return;
    const id = setInterval(() => tickRest(), 1000);
    return () => clearInterval(id);
  }, [isResting, restPaused, tickRest]);

  if (!exercise || isDone) {
    return (
      <Screen>
        <View style={styles.done}>
          <AppText variant="h1" center>
            Treino concluído!
          </AppText>
          <AppText variant="body" muted center>
            Ótimo trabalho. Seu progresso foi registrado.
          </AppText>
          <AppButton label="Voltar" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <AppButton label="Fechar" variant="ghost" onPress={() => router.back()} />

      <AppText variant="caption" muted>
        Exercício {exerciseIndex + 1} de {workout.exercises.length}
      </AppText>
      <AppText variant="h1">{exercise.exercise.name}</AppText>
      <AppText variant="body" muted>
        Série {setIndex + 1} de {exercise.sets} · {exercise.reps} reps
      </AppText>

      {isResting ? (
        <Card accent="purple" style={styles.restCard}>
          <AppText variant="h3" center>
            Descanso
          </AppText>
          <ProgressRing
            progress={
              exercise.restSeconds
                ? restSecondsLeft / exercise.restSeconds
                : 0
            }
            size={140}
            value={`${restSecondsLeft}s`}
            color={colors.secondary}
          />
          <View style={styles.restActions}>
            <AppButton
              label={restPaused ? 'Retomar' : 'Pausar'}
              variant="secondary"
              onPress={restPaused ? resumeRest : pauseRest}
            />
            <AppButton label="+30s" variant="secondary" onPress={() => addRestTime(30)} />
            <AppButton label="Pular descanso" onPress={skipRest} />
          </View>
        </Card>
      ) : (
        <Card style={styles.logger}>
          <AppText variant="label" muted>
            Carga (kg)
          </AppText>
          <NumberStepper
            value={currentWeight}
            min={0}
            max={400}
            step={2.5}
            onChange={setWeight}
          />
          <AppText variant="label" muted style={{ marginTop: spacing.lg }}>
            Repetições
          </AppText>
          <NumberStepper
            value={currentReps}
            min={1}
            max={50}
            onChange={setReps}
          />
          <AppButton
            label="Concluir série"
            onPress={completeSet}
            style={{ marginTop: spacing.xl }}
          />
        </Card>
      )}

      <Card style={styles.tips}>
        <AppText variant="h3">Como executar</AppText>
        {exercise.exercise.instructions.map((tip) => (
          <AppText key={tip} variant="body" muted>
            • {tip}
          </AppText>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  done: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  restCard: {
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  restActions: { width: '100%', gap: spacing.sm },
  logger: { gap: spacing.sm, marginTop: spacing.xl },
  tips: { gap: spacing.sm, marginTop: spacing.lg },
});

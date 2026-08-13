import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ExerciseGif } from '@/components/exercises/ExerciseGif';
import {
  AppButton,
  AppText,
  Card,
  NumberStepper,
  ProgressRing,
  Screen,
  ScreenProgress,
} from '@/components/ui';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { colors, radius, spacing } from '@/theme';

/** Telas 06 + Descanso */
export default function WorkoutSessionScreen() {
  const router = useRouter();
  const appRouter = useAppRouter();
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
  const nextExercise = workout.exercises[exerciseIndex + 1];
  const isDone =
    !exercise ||
    (exerciseIndex >= workout.exercises.length - 1 && exercise.completed && !isResting);

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
          <AppText variant="body" color={colors.textSecondary} center>
            Ótimo trabalho. Seu progresso foi registrado.
          </AppText>
          <AppButton label="Voltar" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  if (isResting) {
    const mm = String(Math.floor(restSecondsLeft / 60)).padStart(2, '0');
    const ss = String(restSecondsLeft % 60).padStart(2, '0');
    return (
      <Screen edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.restWrap}>
          <AppText variant="h1" center>
            Descanso
          </AppText>
          <ProgressRing
            progress={
              exercise.restSeconds ? restSecondsLeft / exercise.restSeconds : 0
            }
            size={180}
            stroke={12}
            value={`${mm}:${ss}`}
            color={colors.secondary}
            trackColor={colors.surfaceElevated}
          />
          {nextExercise ? (
            <AppText variant="body" color={colors.textSecondary} center>
              Próximo: {nextExercise.exercise.name}
            </AppText>
          ) : null}
          <View style={styles.restActions}>
            <AppButton
              label="-30s"
              variant="secondary"
              onPress={() => addRestTime(-30)}
              style={{ flex: 1 }}
              fullWidth={false}
            />
            <AppButton
              label={restPaused ? 'Retomar' : 'Pausar'}
              variant="secondary"
              onPress={restPaused ? resumeRest : pauseRest}
              style={{ flex: 1 }}
              fullWidth={false}
            />
            <AppButton
              label="+30s"
              variant="secondary"
              onPress={() => addRestTime(30)}
              style={{ flex: 1 }}
              fullWidth={false}
            />
          </View>
          <AppButton label="Pular descanso" onPress={skipRest} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <AppText variant="h1">{exercise.exercise.name}</AppText>
          <AppText variant="body" color={colors.textSecondary}>
            Série {setIndex + 1} de {exercise.sets}
          </AppText>
        </View>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <X size={20} color={colors.text} strokeWidth={1.85} />
        </Pressable>
      </View>
      <ScreenProgress current={exerciseIndex} total={workout.exercises.length} />

      <ExerciseGif exercise={exercise.exercise} style={styles.gif} />

      <Card style={styles.logger}>
        <AppText variant="caption" color={colors.textMuted} center>
          Carga
        </AppText>
        <AppText variant="metricLg" center>
          {currentWeight} kg
        </AppText>
        <NumberStepper
          value={currentWeight}
          min={0}
          max={400}
          step={2.5}
          onChange={setWeight}
        />

        <AppText
          variant="caption"
          color={colors.textMuted}
          center
          style={{ marginTop: spacing.xl }}
        >
          Repetições
        </AppText>
        <AppText variant="metricLg" center color={colors.primary}>
          {currentReps}
        </AppText>
        <NumberStepper value={currentReps} min={1} max={50} onChange={setReps} />

        {exercise.previousWeightKg != null ? (
          <AppText variant="caption" color={colors.textMuted} center style={{ marginTop: spacing.md }}>
            Série anterior · {exercise.previousWeightKg} kg × {exercise.reps} reps
          </AppText>
        ) : null}

        <AppButton
          label="Concluir série"
          onPress={completeSet}
          style={{ marginTop: spacing.xl }}
        />
      </Card>

      <AppButton
        label="Ver certo × errado em vídeo"
        variant="ghost"
        onPress={() => appRouter.push('/technique')}
        style={{ marginTop: spacing.md }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gif: {
    height: 220,
    marginTop: spacing.md,
    backgroundColor: '#0B0E14',
    borderRadius: radius.lg,
  },
  logger: { gap: spacing.sm, marginTop: spacing.xl },
  restWrap: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  restActions: { flexDirection: 'row', gap: spacing.sm },
  done: { flex: 1, justifyContent: 'center', gap: spacing.lg },
});

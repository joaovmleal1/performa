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
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { colors, radius, spacing } from '@/theme';
import { useAppRouter } from '@/hooks/useAppRouter';

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
          <AppText variant="body" color={colors.textSecondary} center>
            Ótimo trabalho. Seu progresso foi registrado.
          </AppText>
          <AppButton label="Voltar" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color={colors.primary} style={styles.eyebrow}>
            TREINO EM ANDAMENTO
          </AppText>
          <AppText variant="label" color={colors.textSecondary}>
            Exercício {exerciseIndex + 1} de {workout.exercises.length}
          </AppText>
        </View>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Fechar treino"
          style={styles.closeBtn}
        >
          <X size={20} color={colors.text} strokeWidth={1.85} />
        </Pressable>
      </View>
      <ScreenProgress current={exerciseIndex} total={workout.exercises.length} />

      <View style={styles.exerciseHeader}>
        <AppText variant="h1">{exercise.exercise.name}</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Série {setIndex + 1}/{exercise.sets}
        </AppText>
      </View>

      <ExerciseGif exercise={exercise.exercise} style={styles.gif} />

      {isResting ? (
        <Card accent="purple" style={styles.restCard}>
          <AppText variant="h3" center>
            Descanso
          </AppText>
          <ProgressRing
            progress={
              exercise.restSeconds ? restSecondsLeft / exercise.restSeconds : 0
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
          <AppText variant="metricLg" center color={colors.primary}>
            {currentReps}
          </AppText>
          <AppText variant="caption" color={colors.textMuted} center>
            repetições · {currentWeight} kg
          </AppText>

          <AppText variant="label" color={colors.textMuted} style={{ marginTop: spacing.lg }}>
            Carga (kg)
          </AppText>
          <NumberStepper
            value={currentWeight}
            min={0}
            max={400}
            step={2.5}
            onChange={setWeight}
          />
          <AppText variant="label" color={colors.textMuted} style={{ marginTop: spacing.lg }}>
            Repetições
          </AppText>
          <NumberStepper value={currentReps} min={1} max={50} onChange={setReps} />
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
          <AppText key={tip} variant="body" color={colors.textSecondary}>
            • {tip}
          </AppText>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  eyebrow: {
    letterSpacing: 1.2,
    fontFamily: 'Sora_600SemiBold',
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
  exerciseHeader: { gap: 4, marginTop: spacing.xl },
  done: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  gif: {
    height: 220,
    marginTop: spacing.md,
    backgroundColor: '#fff',
    borderRadius: radius.lg,
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

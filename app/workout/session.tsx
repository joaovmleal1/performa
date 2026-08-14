import { useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ExerciseGif } from '@/components/exercises/ExerciseGif';
import { WeightLogger } from '@/components/workout/WeightLogger';
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
import { useLiftHistoryStore } from '@/stores/lift-history-store';
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { colors, radius, spacing } from '@/theme';

/** Telas 06 + Descanso — anotação de carga por série */
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
    logs,
    sessionFinished,
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

  const getLastWeightForSet = useLiftHistoryStore((s) => s.getLastWeightForSet);
  const getLastSetsForExercise = useLiftHistoryStore((s) => s.getLastSetsForExercise);

  const exercise = workout.exercises[exerciseIndex];
  const nextExercise = workout.exercises[exerciseIndex + 1];
  const isDone = sessionFinished || !exercise;

  useEffect(() => {
    if (!isResting || restPaused) return;
    const id = setInterval(() => tickRest(), 1000);
    return () => clearInterval(id);
  }, [isResting, restPaused, tickRest]);

  if (isDone) {
    const loggedExercises = workout.exercises
      .map((ex) => ({
        name: ex.exercise.name,
        sets: logs[ex.exerciseId] ?? [],
      }))
      .filter((ex) => ex.sets.length > 0);

    return (
      <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.done}>
          <AppText variant="h1" center>
            Treino concluído!
          </AppText>
          <AppText variant="body" color={colors.textSecondary} center>
            Cargas registradas. A progressão fica salva no histórico de cada exercício.
          </AppText>

          {loggedExercises.map((ex) => (
            <Card key={ex.name} style={styles.summaryCard}>
              <AppText variant="h3">{ex.name}</AppText>
              {ex.sets.map((set) => (
                <View key={set.setNumber} style={styles.summaryRow}>
                  <AppText variant="body" color={colors.textSecondary}>
                    Série {set.setNumber}
                  </AppText>
                  <AppText variant="label" color={colors.primary}>
                    {formatLoad(set.weightKg)} kg × {set.reps}
                  </AppText>
                </View>
              ))}
            </Card>
          ))}

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

  const completedSets = logs[exercise.exerciseId] ?? [];
  const lastSessionSets = getLastSetsForExercise(exercise.exerciseId);
  const lastSameSet = getLastWeightForSet(exercise.exerciseId, setIndex + 1);
  const lastSameSetReps = lastSessionSets.find((s) => s.setNumber === setIndex + 1)?.reps;
  const currentCoachSet = exercise.coachLoad?.sets.find((s) => s.setNumber === setIndex + 1);

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

      <Card style={styles.setMap}>
        <AppText variant="h3">Mapa de séries</AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {exercise.coachLoad?.summary ??
            'Anote a carga de cada série para o Coach ajustar a progressão.'}
        </AppText>
        {Array.from({ length: exercise.sets }).map((_, i) => {
          const setNumber = i + 1;
          const logged = completedSets.find((s) => s.setNumber === setNumber);
          const prev = lastSessionSets.find((s) => s.setNumber === setNumber);
          const coachSet = exercise.coachLoad?.sets.find((s) => s.setNumber === setNumber);
          const isCurrent = setNumber === setIndex + 1;

          return (
            <View
              key={setNumber}
              style={[styles.setRow, isCurrent && styles.setRowActive]}
            >
              <View style={styles.setLeft}>
                <View
                  style={[
                    styles.setBadge,
                    logged && styles.setBadgeDone,
                    isCurrent && styles.setBadgeCurrent,
                  ]}
                >
                  {logged ? (
                    <Check size={14} color={colors.onPrimary} strokeWidth={2.4} />
                  ) : (
                    <AppText
                      variant="caption"
                      color={isCurrent ? colors.onPrimary : colors.textSecondary}
                    >
                      {setNumber}
                    </AppText>
                  )}
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText variant="bodyMedium">
                    Série {setNumber}
                    {isCurrent ? ' · agora' : ''}
                    {coachSet?.action === 'increase' && !logged ? ' · subir' : ''}
                    {coachSet?.action === 'decrease' && !logged ? ' · reduzir' : ''}
                  </AppText>
                  {coachSet ? (
                    <AppText variant="caption" color={colors.textMuted}>
                      Coach · {formatLoad(coachSet.suggestedWeightKg)} kg
                      {coachSet.deltaKg > 0
                        ? ` (+${formatLoad(coachSet.deltaKg)})`
                        : coachSet.deltaKg < 0
                          ? ` (${formatLoad(coachSet.deltaKg)})`
                          : ''}
                      {prev
                        ? ` · último ${formatLoad(prev.weightKg)}×${prev.reps}`
                        : ''}
                    </AppText>
                  ) : prev ? (
                    <AppText variant="caption" color={colors.textMuted}>
                      Último treino · {formatLoad(prev.weightKg)} kg × {prev.reps}
                    </AppText>
                  ) : (
                    <AppText variant="caption" color={colors.textMuted}>
                      Sem histórico nesta série
                    </AppText>
                  )}
                </View>
              </View>
              <AppText
                variant="label"
                color={
                  logged
                    ? colors.primary
                    : coachSet?.action === 'increase'
                      ? colors.primary
                      : colors.textMuted
                }
              >
                {logged
                  ? `${formatLoad(logged.weightKg)} kg × ${logged.reps}`
                  : isCurrent
                    ? `${formatLoad(currentWeight)} kg`
                    : coachSet
                      ? `${formatLoad(coachSet.suggestedWeightKg)} kg`
                      : '—'}
              </AppText>
            </View>
          );
        })}
      </Card>

      <Card style={styles.logger}>
        <WeightLogger value={currentWeight} onChange={setWeight} />

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

        {currentCoachSet ? (
          <View style={styles.coachHint}>
            <AppText variant="caption" color={colors.secondary} center>
              Coach ·{' '}
              {currentCoachSet.action === 'increase'
                ? `aumentar para ${formatLoad(currentCoachSet.suggestedWeightKg)} kg`
                : currentCoachSet.action === 'decrease'
                  ? `reduzir para ${formatLoad(currentCoachSet.suggestedWeightKg)} kg`
                  : currentCoachSet.action === 'hold'
                    ? `manter ${formatLoad(currentCoachSet.suggestedWeightKg)} kg`
                    : `começar em ${formatLoad(currentCoachSet.suggestedWeightKg)} kg`}
            </AppText>
            <AppText variant="caption" color={colors.textMuted} center>
              {currentCoachSet.rationale}
            </AppText>
            {currentCoachSet.suggestedWeightKg !== currentWeight ? (
              <AppButton
                label={`Usar ${formatLoad(currentCoachSet.suggestedWeightKg)} kg`}
                variant="secondary"
                size="md"
                onPress={() => setWeight(currentCoachSet.suggestedWeightKg)}
                style={{ marginTop: spacing.sm }}
              />
            ) : null}
          </View>
        ) : lastSameSet != null ? (
          <AppText
            variant="caption"
            color={colors.textMuted}
            center
            style={{ marginTop: spacing.md }}
          >
            Referência · série {setIndex + 1} no último treino:{' '}
            {formatLoad(lastSameSet)} kg
            {lastSameSetReps != null ? ` × ${lastSameSetReps}` : ''}
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

function formatLoad(kg: number) {
  return Number.isInteger(kg) ? String(kg) : String(Math.round(kg * 10) / 10);
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
    height: 180,
    marginTop: spacing.md,
    backgroundColor: '#0B0E14',
    borderRadius: radius.lg,
  },
  setMap: { gap: spacing.sm, marginTop: spacing.lg },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  setRowActive: {
    backgroundColor: colors.surfaceLight,
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderBottomWidth: 0,
  },
  setLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  setBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setBadgeDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  setBadgeCurrent: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  logger: { gap: spacing.sm, marginTop: spacing.lg },
  restWrap: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  restActions: { flexDirection: 'row', gap: spacing.sm },
  done: { gap: spacing.lg, paddingVertical: spacing.xl },
  summaryCard: { gap: spacing.sm },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coachHint: {
    marginTop: spacing.md,
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

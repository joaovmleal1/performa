import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExerciseGif } from '@/components/exercises/ExerciseGif';
import { AppText, Card, Screen, ScreenHeader } from '@/components/ui';
import { resolveExercise } from '@/data/exercises';
import { equipmentLabels, mockExerciseHistory, muscleGroupLabels } from '@/data/mock';
import { useLiftHistoryStore } from '@/stores/lift-history-store';
import { colors, radius, spacing } from '@/theme';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = resolveExercise(id);
  const sessions = useLiftHistoryStore((s) => s.sessions);
  const liveHistory = useMemo(
    () => (id ? useLiftHistoryStore.getState().getExerciseHistory(id) : []),
    [id, sessions],
  );
  const mockHistory =
    (id && (mockExerciseHistory[id] || mockExerciseHistory[exercise?.id ?? ''])) || [];

  if (!exercise) {
    return (
      <Screen>
        <ScreenHeader title="Exercício" showBack />
        <AppText muted center>
          Exercício não encontrado.
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <ScreenHeader title={exercise.name} showBack />

      <AppText variant="label" muted style={styles.gifLabel}>
        Execução
      </AppText>
      <ExerciseGif exercise={exercise} style={styles.hero} contentFit="contain" />

      <View style={styles.meta}>
        <Pill label={muscleGroupLabels[exercise.muscleGroup]} />
        <Pill label={equipmentLabels[exercise.equipment]} />
      </View>

      <Card style={styles.section}>
        <AppText variant="h3">Passo a passo</AppText>
        <AppText variant="caption" muted>
          Acompanhe o GIF de execução acima:
        </AppText>
        {exercise.instructions.map((step, index) => (
          <AppText key={step} variant="body" muted>
            {index + 1}. {step}
          </AppText>
        ))}
      </Card>

      <Card style={styles.section}>
        <AppText variant="h3">Músculos</AppText>
        <AppText variant="body" muted>
          Principal: {muscleGroupLabels[exercise.muscleGroup]}
        </AppText>
        <AppText variant="body" muted>
          Secundários:{' '}
          {exercise.secondaryMuscles.length
            ? exercise.secondaryMuscles.map((m) => muscleGroupLabels[m]).join(', ')
            : '—'}
        </AppText>
      </Card>

      <Card style={styles.section}>
        <AppText variant="h3">Erros comuns</AppText>
        {exercise.commonMistakes.map((item) => (
          <AppText key={item} variant="body" muted>
            • {item}
          </AppText>
        ))}
      </Card>

      <Card style={styles.section}>
        <AppText variant="h3">Progressão de carga</AppText>
        <AppText variant="caption" muted>
          Cada série anotada no treino entra aqui.
        </AppText>
        {liveHistory.length === 0 && mockHistory.length === 0 ? (
          <AppText muted>Ainda sem registros neste exercício.</AppText>
        ) : (
          <>
            {liveHistory.map((entry) => (
              <View key={entry.sessionId} style={styles.historyBlock}>
                <View style={styles.historyRow}>
                  <AppText variant="bodyMedium">{formatDate(entry.date)}</AppText>
                  <AppText variant="label" color={colors.primary}>
                    topo {formatKg(entry.topWeightKg)} kg
                  </AppText>
                </View>
                {entry.sets.map((set) => (
                  <View key={set.setNumber} style={styles.setLine}>
                    <AppText variant="caption" color={colors.textMuted}>
                      Série {set.setNumber}
                    </AppText>
                    <AppText variant="caption" color={colors.textSecondary}>
                      {formatKg(set.weightKg)} kg × {set.reps}
                    </AppText>
                  </View>
                ))}
              </View>
            ))}
            {liveHistory.length === 0
              ? mockHistory.map((entry) => (
                  <View key={`${entry.date}-${entry.weightKg}`} style={styles.historyRow}>
                    <AppText variant="bodyMedium">{formatDate(entry.date)}</AppText>
                    <AppText variant="label" color={colors.primary}>
                      {entry.sets}×{entry.reps} · {entry.weightKg} kg
                    </AppText>
                  </View>
                ))
              : null}
          </>
        )}
      </Card>
    </Screen>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <AppText variant="caption" color={colors.primary}>
        {label}
      </AppText>
    </View>
  );
}

function formatKg(kg: number) {
  return Number.isInteger(kg) ? String(kg) : String(Math.round(kg * 10) / 10);
}

function formatDate(isoDate: string) {
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
  gifLabel: { marginBottom: spacing.xs },
  hero: {
    height: 280,
    marginBottom: spacing.lg,
    backgroundColor: '#fff',
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryMuted,
  },
  section: { gap: spacing.sm, marginBottom: spacing.lg },
  historyBlock: {
    gap: 4,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  setLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: spacing.sm,
  },
});

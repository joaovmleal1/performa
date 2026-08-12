import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ExerciseGif } from '@/components/exercises/ExerciseGif';
import { AppText, Card, Screen, ScreenHeader } from '@/components/ui';
import { resolveExercise } from '@/data/exercises';
import { equipmentLabels, mockExerciseHistory, muscleGroupLabels } from '@/data/mock';
import { colors, radius, spacing } from '@/theme';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = resolveExercise(id);
  const history =
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

      <ExerciseGif exercise={exercise} style={styles.hero} />

      <View style={styles.meta}>
        <Pill label={muscleGroupLabels[exercise.muscleGroup]} />
        <Pill label={equipmentLabels[exercise.equipment]} />
      </View>

      <Card style={styles.section}>
        <AppText variant="h3">Como executar</AppText>
        <AppText variant="caption" muted>
          Veja o GIF acima e siga os passos:
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
        <AppText variant="h3">Seu histórico</AppText>
        {history.length === 0 ? (
          <AppText muted>Ainda sem registros neste exercício.</AppText>
        ) : (
          history.map((entry) => (
            <View key={`${entry.date}-${entry.weightKg}`} style={styles.historyRow}>
              <AppText variant="bodyMedium">{entry.date}</AppText>
              <AppText variant="label" color={colors.primary}>
                {entry.sets}×{entry.reps} · {entry.weightKg} kg
              </AppText>
            </View>
          ))
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

const styles = StyleSheet.create({
  hero: {
    height: 240,
    marginBottom: spacing.lg,
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
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
});

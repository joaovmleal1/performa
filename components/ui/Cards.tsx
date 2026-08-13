import { Image } from 'expo-image';
import { Check, Flame, Zap } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AIOrb } from '@/components/brand/PerformaLogo';
import { colors, radius, spacing } from '@/theme';
import type { WorkoutPlan } from '@/types';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { Card } from './Card';

type MetricProps = {
  label: string;
  value: string;
  hint?: string;
  accent?: 'green' | 'purple' | 'default';
  icon?: React.ReactNode;
};

export function MetricCard({ label, value, hint, accent = 'default', icon }: MetricProps) {
  return (
    <Card style={styles.metric}>
      <View style={styles.metricTop}>
        <AppText variant="caption" color={colors.textMuted}>
          {label}
        </AppText>
        {icon}
      </View>
      <AppText
        variant="metric"
        color={
          accent === 'green'
            ? colors.primary
            : accent === 'purple'
              ? colors.secondary
              : colors.white
        }
      >
        {value}
      </AppText>
      {hint ? (
        <AppText variant="caption" color={colors.textSecondary}>
          {hint}
        </AppText>
      ) : null}
    </Card>
  );
}

type WorkoutCardProps = {
  workout: WorkoutPlan;
  onStart: () => void;
};

/** Card “Treino de hoje” — board 04/05, com orb de IA */
export function WorkoutCard({ workout, onStart }: WorkoutCardProps) {
  return (
    <Card accent="purple" style={styles.workout}>
      <View style={styles.row}>
        <AIOrb size={52} />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="caption" color={colors.secondary}>
            Treino de hoje
          </AppText>
          <AppText variant="h2">{workout.name}</AppText>
        </View>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Flame size={14} color={colors.primary} strokeWidth={1.85} />
          <AppText variant="caption">{workout.estimatedMinutes} min</AppText>
        </View>
        <View style={styles.meta}>
          <Zap size={14} color={colors.secondary} strokeWidth={1.85} />
          <AppText variant="caption">{workout.exercises.length} exercícios</AppText>
        </View>
      </View>
      {(workout.muscleFocus?.length ?? 0) > 0 ? (
        <AppText variant="caption" color={colors.textMuted}>
          {(workout.muscleFocus ?? []).join(' • ')}
        </AppText>
      ) : null}
      <AppButton label="Iniciar treino" onPress={onStart} size="md" />
    </Card>
  );
}

type ExerciseCardProps = {
  name: string;
  sets: number;
  reps: number;
  suggestedWeightKg?: number;
  previousWeightKg?: number;
  completed?: boolean;
  color: string;
  gifUrl?: string;
  onPress?: () => void;
};

export function ExerciseCard({
  name,
  sets,
  reps,
  suggestedWeightKg,
  previousWeightKg,
  completed,
  color,
  gifUrl,
  onPress,
}: ExerciseCardProps) {
  return (
    <Card onPress={onPress} style={styles.exercise} padded={false}>
      <View style={styles.exerciseRow}>
        {gifUrl ? (
          <Image
            source={{ uri: gifUrl }}
            style={[styles.thumb, styles.thumbMedia]}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.thumb, { backgroundColor: color }]} />
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="bodyMedium">{name}</AppText>
          <AppText variant="caption" color={colors.textMuted}>
            {sets}×{reps}
            {previousWeightKg != null ? ` · anterior ${previousWeightKg} kg` : ''}
            {suggestedWeightKg != null ? ` · sugestão ${suggestedWeightKg} kg` : ''}
          </AppText>
        </View>
        <View
          style={[
            styles.check,
            completed && { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
        >
          {completed ? <Check size={14} color={colors.onPrimary} strokeWidth={3} /> : null}
        </View>
      </View>
    </Card>
  );
}

type InsightProps = {
  title: string;
  message: string;
};

export function AIInsightCard({ title, message }: InsightProps) {
  return (
    <Card accent="purple" style={styles.insight}>
      <View style={styles.insightHeader}>
        <AIOrb size={36} />
        <AppText variant="caption" color={colors.secondary}>
          {title}
        </AppText>
      </View>
      <AppText variant="body" color={colors.textSecondary}>
        {message}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  metric: { flex: 1, gap: 6, minHeight: 108 },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workout: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metaRow: { flexDirection: 'row', gap: 16 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  exercise: { padding: 12 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMedium,
  },
  thumbMedia: { backgroundColor: '#fff' },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insight: { gap: 10 },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

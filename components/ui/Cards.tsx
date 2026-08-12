import { Image } from 'expo-image';
import { Dumbbell, Flame, Zap } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';
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
        <AppText variant="caption" muted>
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
        <AppText variant="caption" muted>
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

export function WorkoutCard({ workout, onStart }: WorkoutCardProps) {
  return (
    <Card glow="purple" style={styles.workout}>
      <View style={styles.row}>
        <View style={styles.iconBubble}>
          <Dumbbell size={20} color={colors.secondary} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" muted>
            Treino de hoje
          </AppText>
          <AppText variant="h2">{workout.name}</AppText>
        </View>
      </View>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Flame size={14} color={colors.primary} />
          <AppText variant="caption">{workout.estimatedMinutes} min</AppText>
        </View>
        <View style={styles.meta}>
          <Zap size={14} color={colors.secondary} />
          <AppText variant="caption">{workout.exercises.length} exercícios</AppText>
        </View>
      </View>
      <AppText variant="caption" muted>
        {(workout.muscleFocus ?? []).join(' • ')}
      </AppText>
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
            style={styles.thumb}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={[styles.thumb, { backgroundColor: color }]} />
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="bodyMedium">{name}</AppText>
          <AppText variant="caption" muted>
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
        />
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
    <Card glow="purple" style={styles.insight}>
      <View style={styles.insightBadge}>
        <AppText variant="caption" color={colors.secondary}>
          {title}
        </AppText>
      </View>
      <AppText variant="body">{message}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  metric: { flex: 1, gap: 6, minHeight: 110 },
  metricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workout: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.secondaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', gap: 16 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  exercise: { padding: 12 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.surfaceMuted },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
  },
  insight: { gap: 10 },
  insightBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.secondaryMuted,
  },
});

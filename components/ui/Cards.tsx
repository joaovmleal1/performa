import { Image } from 'expo-image';
import { Check, ChevronRight, Clock, Layers } from 'lucide-react-native';
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

export function WorkoutCard({ workout, onStart }: WorkoutCardProps) {
  return (
    <Card accent="purple" style={styles.workout}>
      <AppText variant="caption" color={colors.secondary}>
        Treino de hoje
      </AppText>
      <AppText variant="h2">{workout.name}</AppText>
      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Layers size={14} color={colors.textSecondary} strokeWidth={1.85} />
          <AppText variant="caption" color={colors.textSecondary}>
            {workout.exercises.length} exercícios
          </AppText>
        </View>
        <View style={styles.meta}>
          <Clock size={14} color={colors.textSecondary} strokeWidth={1.85} />
          <AppText variant="caption" color={colors.textSecondary}>
            {workout.estimatedMinutes} min
          </AppText>
        </View>
      </View>
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
  coachTag?: string;
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
  coachTag,
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
            {sets} séries • {reps} reps
            {previousWeightKg != null ? ` · ant. ${previousWeightKg} kg` : ''}
            {suggestedWeightKg != null ? ` · sug. ${suggestedWeightKg} kg` : ''}
            {coachTag ? ` · ${coachTag}` : ''}
          </AppText>
        </View>
        {completed ? (
          <View style={styles.checkOn}>
            <Check size={14} color={colors.onPrimary} strokeWidth={3} />
          </View>
        ) : (
          <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.85} />
        )}
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
        <AIOrb size={32} />
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
  metaRow: { flexDirection: 'row', gap: 16 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  exercise: { padding: 12 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
  },
  thumbMedia: { backgroundColor: '#0B0E14' },
  checkOn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
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

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

import { PerformaMark } from '@/components/brand/PerformaLogo';
import { colors, radius, spacing } from '@/theme';

import { Card } from './Card';
import { AppText } from './AppText';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const mark = size === 'lg' ? 64 : size === 'sm' ? 28 : 40;
  return (
    <View style={styles.logoRow}>
      <PerformaMark size={mark} />
      {size !== 'sm' ? (
        <View>
          <AppText variant="h2" style={{ fontStyle: 'italic', letterSpacing: 1.6 }}>
            PERFORMA
          </AppText>
          <AppText variant="caption" color={colors.primary} style={{ letterSpacing: 1.1 }}>
            TREINO • NUTRIÇÃO • RESULTADOS
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

export function ChartCard({
  title,
  points,
  valueLabel,
  changeLabel,
}: {
  title: string;
  points: number[];
  valueLabel: string;
  changeLabel?: string;
}) {
  const width = 280;
  const height = 100;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points
    .map((p, i) => {
      const x = (i / Math.max(points.length - 1, 1)) * (width - 8) + 4;
      const y = height - ((p - min) / range) * (height - 16) - 8;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card>
      <AppText variant="label" tone="muted">
        {title}
      </AppText>
      <View style={styles.chartHeader}>
        <AppText variant="h1">{valueLabel}</AppText>
        {changeLabel ? (
          <AppText variant="bodyMedium" tone="primary">
            {changeLabel}
          </AppText>
        ) : null}
      </View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Polyline
          points={coords}
          fill="none"
          stroke={colors.secondary}
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={styles.empty}>
      <AppText variant="h3" center>
        {title}
      </AppText>
      {description ? (
        <AppText variant="body" tone="muted" center style={{ marginTop: spacing.sm }}>
          {description}
        </AppText>
      ) : null}
      {action ? <View style={{ marginTop: spacing.xl }}>{action}</View> : null}
    </View>
  );
}

export function Skeleton({
  height = 16,
  width = '100%' as number | `${number}%`,
}: {
  height?: number;
  width?: number | `${number}%`;
}) {
  return <View style={[styles.skeleton, { height, width }]} />;
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <AppText variant="label" tone="onPrimary">
        {initials}
      </AppText>
    </View>
  );
}

export function AiBanner({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={['rgba(123,92,255,0.32)', 'rgba(92,140,255,0.16)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.aiBanner}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'] ?? 40,
    paddingHorizontal: spacing.xl,
  },
  skeleton: {
    backgroundColor: colors.borderSubtle,
    borderRadius: radius.sm,
  },
  avatar: {
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBanner: {
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(123,92,255,0.35)',
    opacity: 0.95,
  },
});

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  ChartCard,
  MetricCard,
  Screen,
} from '@/components/ui';
import { mockPRs, mockWeightHistory } from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { colors, radius, spacing } from '@/theme';

type TabKey = 'geral' | 'treinos' | 'medidas' | 'fotos';

/** Tela 12 — Progresso */
export default function ProgressScreen() {
  const router = useAppRouter();
  const [tab, setTab] = useState<TabKey>('geral');
  const latest = mockWeightHistory[mockWeightHistory.length - 1];
  const first = mockWeightHistory[0];
  const delta = latest && first ? latest.weightKg - first.weightKg : -5.2;

  return (
    <Screen scroll>
      <AppText variant="h1" style={styles.title}>
        Progresso
      </AppText>

      <View style={styles.tabs}>
        {(
          [
            ['geral', 'Geral'],
            ['treinos', 'Treinos'],
            ['medidas', 'Medidas'],
            ['fotos', 'Fotos'],
          ] as const
        ).map(([key, label]) => {
          const active = tab === key;
          return (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <AppText
                variant="caption"
                color={active ? colors.onPrimary : colors.textSecondary}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <Card style={styles.weightCard}>
        <View style={styles.weightRow}>
          <View style={{ gap: 4 }}>
            <AppText variant="caption" color={colors.textMuted}>
              Peso
            </AppText>
            <AppText variant="metricLg">
              {(latest?.weightKg ?? 72).toFixed(1).replace('.', ',')} kg
            </AppText>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <AppText variant="h3" color={colors.primary}>
              {delta > 0 ? '+' : ''}
              {delta.toFixed(1).replace('.', ',')} kg
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              Últimos 30 dias
            </AppText>
          </View>
        </View>
      </Card>

      <View style={styles.section}>
        <ChartCard
          title="Evolução de peso"
          points={mockWeightHistory.map((point) => point.weightKg)}
          valueLabel={`${(latest?.weightKg ?? 72).toFixed(1)} kg`}
          changeLabel={`${delta > 0 ? '+' : ''}${delta.toFixed(1)} kg`}
        />
      </View>

      <View style={styles.row}>
        <MetricCard
          label="Treinos"
          value="24"
          hint="concluídos"
          accent="green"
        />
        <MetricCard
          label="Calorias médias"
          value="1.950"
          hint="kcal / dia"
          accent="purple"
        />
      </View>

      {(tab === 'medidas' || tab === 'geral') && (
        <Card style={styles.section}>
          <AppText variant="h3">Medidas</AppText>
          {[
            ['Peso', `${(latest?.weightKg ?? 72).toFixed(1)} kg`],
            ['Cintura', '78 cm'],
            ['Peito', '98 cm'],
            ['Braço', '33 cm'],
            ['Coxa', '57 cm'],
            ['Quadril', '98 cm'],
          ].map(([label, value], i, arr) => (
            <View
              key={label}
              style={[styles.measureRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}
            >
              <AppText variant="body">{label}</AppText>
              <AppText variant="bodyMedium" color={colors.primary}>
                {value}
              </AppText>
            </View>
          ))}
        </Card>
      )}

      {tab === 'treinos' && (
        <Card style={styles.section}>
          <AppText variant="h3">Recordes</AppText>
          {mockPRs.map((pr) => (
            <View key={pr.id} style={styles.measureRow}>
              <AppText variant="body">{pr.exerciseName}</AppText>
              <AppText variant="label" color={colors.textSecondary}>
                {pr.weightKg} kg × {pr.reps}
              </AppText>
            </View>
          ))}
        </Card>
      )}

      <View style={styles.actions}>
        <AppButton label="Registrar medidas" onPress={() => setTab('medidas')} />
        <AppButton
          label="Fotos de progresso"
          variant="secondary"
          onPress={() => router.push('/progress-photos')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.md, marginBottom: spacing.lg },
  tabs: { flexDirection: 'row', gap: 6, marginBottom: spacing.lg },
  tab: {
    flex: 1,
    minHeight: 34,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 4,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weightCard: { marginBottom: spacing.md },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  section: { gap: spacing.md, marginTop: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  measureRow: {
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  actions: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing['2xl'] },
});

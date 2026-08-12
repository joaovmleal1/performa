import { StyleSheet, View } from 'react-native';

import {
  AIInsightCard,
  AppButton,
  AppText,
  Card,
  MetricCard,
  Screen,
} from '@/components/ui';
import {
  mockInsights,
  mockPRs,
  mockWeightHistory,
} from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { colors, spacing } from '@/theme';

export default function ProgressScreen() {
  const router = useAppRouter();
  const latest = mockWeightHistory[mockWeightHistory.length - 1];
  const first = mockWeightHistory[0];
  const delta = latest && first ? latest.weightKg - first.weightKg : 0;
  const maxW = Math.max(...mockWeightHistory.map((p) => p.weightKg));
  const minW = Math.min(...mockWeightHistory.map((p) => p.weightKg));

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="h1">Progresso</AppText>
        <AppText variant="body" muted>
          Peso, recordes e insights da sua evolução.
        </AppText>
      </View>

      <View style={styles.row}>
        <MetricCard
          label="Peso atual"
          value={`${latest?.weightKg ?? 72} kg`}
          hint={delta <= 0 ? `${delta.toFixed(1)} kg no período` : `+${delta.toFixed(1)} kg`}
          accent="green"
        />
        <MetricCard
          label="Recordes"
          value={`${mockPRs.length}`}
          hint="PRs registrados"
          accent="purple"
        />
      </View>

      <Card style={styles.section}>
        <AppText variant="h3">Histórico de peso</AppText>
        <View style={styles.chart}>
          {mockWeightHistory.map((point) => {
            const range = maxW - minW || 1;
            const height = 24 + ((point.weightKg - minW) / range) * 80;
            return (
              <View key={point.date} style={styles.chartCol}>
                <View style={[styles.chartBar, { height }]} />
                <AppText variant="caption" muted>
                  {point.date.slice(5)}
                </AppText>
              </View>
            );
          })}
        </View>
      </Card>

      <Card style={styles.section}>
        <AppText variant="h3">Recordes pessoais</AppText>
        {mockPRs.map((pr) => (
          <View key={pr.id} style={styles.prRow}>
            <View>
              <AppText variant="bodyMedium">{pr.exerciseName}</AppText>
              <AppText variant="caption" muted>
                {pr.date}
              </AppText>
            </View>
            <AppText variant="label" color={colors.primary}>
              {pr.weightKg} kg × {pr.reps}
            </AppText>
          </View>
        ))}
      </Card>

      <View style={styles.insights}>
        <AppText variant="h3">Insights</AppText>
        {mockInsights.map((insight) => (
          <AIInsightCard
            key={insight.id}
            title={insight.title}
            message={insight.message}
          />
        ))}
      </View>

      <View style={styles.actions}>
        <AppButton
          label="Calendário"
          variant="secondary"
          onPress={() => router.push('/calendar')}
        />
        <AppButton
          label="Fotos de progresso"
          variant="secondary"
          onPress={() => router.push('/progress-photos')}
        />
        <AppButton
          label="Perguntar ao PERFORMA AI"
          variant="ai"
          onPress={() => router.push('/ai')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginBottom: spacing.xl, marginTop: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  section: { gap: spacing.md, marginTop: spacing.lg },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    gap: 6,
  },
  chartCol: { flex: 1, alignItems: 'center', gap: 6 },
  chartBar: {
    width: '70%',
    borderRadius: 6,
    backgroundColor: colors.secondary,
    minHeight: 12,
  },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  insights: { gap: spacing.md, marginTop: spacing.xl },
  actions: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing['2xl'] },
});

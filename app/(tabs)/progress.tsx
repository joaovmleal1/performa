import { Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import {
  AIInsightCard,
  AppButton,
  AppText,
  Card,
  ChartCard,
  ListRow,
  MetricCard,
  Screen,
  ScreenTitle,
} from '@/components/ui';
import { mockInsights, mockPRs, mockWeightHistory } from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { colors, spacing } from '@/theme';

export default function ProgressScreen() {
  const router = useAppRouter();
  const latest = mockWeightHistory[mockWeightHistory.length - 1];
  const first = mockWeightHistory[0];
  const delta = latest && first ? latest.weightKg - first.weightKg : 0;

  return (
    <Screen scroll>
      <ScreenTitle title="Progresso" subtitle="Peso, composição e recordes." />

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

      <View style={styles.section}>
        <ChartCard
          title="Evolução de peso"
          points={mockWeightHistory.map((point) => point.weightKg)}
          valueLabel={`${latest?.weightKg ?? 72} kg`}
          changeLabel={`${delta > 0 ? '+' : ''}${delta.toFixed(1)} kg`}
        />
      </View>

      <Card style={styles.section}>
        <AppText variant="h3">Composição corporal</AppText>
        <View style={styles.compRow}>
          <View style={styles.compItem}>
            <AppText variant="caption" color={colors.textMuted}>
              Gordura
            </AppText>
            <AppText variant="h2" color={colors.warning}>
              18%
            </AppText>
          </View>
          <View style={styles.compItem}>
            <AppText variant="caption" color={colors.textMuted}>
              Músculo
            </AppText>
            <AppText variant="h2" color={colors.primary}>
              42%
            </AppText>
          </View>
          <View style={styles.compItem}>
            <AppText variant="caption" color={colors.textMuted}>
              Água
            </AppText>
            <AppText variant="h2" color={colors.info}>
              55%
            </AppText>
          </View>
        </View>
      </Card>

      <Card style={styles.section}>
        <AppText variant="h3">Recordes pessoais</AppText>
        {mockPRs.map((pr, index) => (
          <ListRow
            key={pr.id}
            icon={<Trophy size={17} color={colors.warning} strokeWidth={1.85} />}
            title={pr.exerciseName}
            subtitle={pr.date}
            value={`${pr.weightKg} kg × ${pr.reps}`}
            last={index === mockPRs.length - 1}
          />
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  section: { gap: spacing.md, marginTop: spacing.lg },
  compRow: { flexDirection: 'row', gap: spacing.md },
  compItem: { flex: 1, gap: 4 },
  insights: { gap: spacing.md, marginTop: spacing.xl },
  actions: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing['2xl'] },
});

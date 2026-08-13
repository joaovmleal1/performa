import { StyleSheet, View } from 'react-native';
import { Trophy } from 'lucide-react-native';

import {
  AIInsightCard,
  AppButton,
  AppText,
  Card,
  ChartCard,
  ListRow,
  MetricCard,
  PageHeading,
  Screen,
  SectionHeading,
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

  return (
    <Screen scroll>
      <PageHeading
        eyebrow="Sua evolução"
        title="Progresso"
        subtitle="Acompanhe tendências, consistência e novos recordes."
      />

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
          title="Histórico de peso"
          points={mockWeightHistory.map((point) => point.weightKg)}
          valueLabel={`${latest?.weightKg ?? 72} kg`}
          changeLabel={`${delta > 0 ? '+' : ''}${delta.toFixed(1)} kg`}
        />
      </View>

      <Card style={styles.section}>
        <SectionHeading title="Recordes pessoais" />
        {mockPRs.map((pr, index) => (
          <ListRow
            key={pr.id}
            icon={<Trophy size={17} color={colors.warning} />}
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
        <AppButton
          label="Tirar uma dúvida"
          variant="ai"
          onPress={() => router.push('/ai')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  section: { gap: spacing.md, marginTop: spacing.lg },
  insights: { gap: spacing.md, marginTop: spacing.xl },
  actions: { gap: spacing.sm, marginTop: spacing.xl, marginBottom: spacing['2xl'] },
});

import { Droplets, Flame } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AIInsightCard,
  AppText,
  Card,
  MacroProgress,
  MetricCard,
  Screen,
  WorkoutCard,
} from '@/components/ui';
import { mockInsights, mockTodayWorkout } from '@/data/mock';
import { useAppRouter } from '@/hooks/useAppRouter';
import { useAuthStore } from '@/stores/auth-store';
import { useNutritionStore } from '@/stores/nutrition-store';
import { useWorkoutSessionStore } from '@/stores/workout-store';
import { colors, spacing } from '@/theme';

const WEEKLY_BARS = [
  { label: 'S', value: 0.55 },
  { label: 'T', value: 0.7 },
  { label: 'Q', value: 0.85 },
  { label: 'Q', value: 0.6 },
  { label: 'S', value: 0.9 },
  { label: 'S', value: 1 },
  { label: 'D', value: 0.45 },
];

export default function DashboardScreen() {
  const router = useAppRouter();
  const user = useAuthStore((s) => s.user);
  const daily = useNutritionStore((s) => s.daily);
  const addWater = useNutritionStore((s) => s.addWater);
  const startSession = useWorkoutSessionStore((s) => s.startSession);

  const firstName = (user?.name ?? user?.fullName ?? 'atleta').split(' ')[0];
  const caloriesRemaining = Math.max(0, daily.target.calories - daily.consumed.calories);

  const handleStartWorkout = () => {
    startSession();
    router.push('/workout/session');
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <AppText variant="h1">Olá, {firstName}!</AppText>
        <AppText variant="body" muted>
          Pronta para superar seus limites hoje?
        </AppText>
      </View>

      <WorkoutCard workout={mockTodayWorkout} onStart={handleStartWorkout} />

      <View style={styles.row}>
        <MetricCard
          label="Calorias restantes"
          value={`${caloriesRemaining}`}
          hint={`${daily.consumed.calories} / ${daily.target.calories} kcal`}
          accent="green"
        />
        <MetricCard
          label="Sequência"
          value={`${user?.streakDays ?? 7} dias`}
          hint="Série em andamento"
          accent="green"
          icon={<Flame size={16} color={colors.primary} />}
        />
      </View>

      <Card style={styles.section}>
        <AppText variant="h3">Macros de hoje</AppText>
        <MacroProgress
          label="Proteína"
          current={daily.consumed.proteinG}
          target={daily.target.proteinG}
          color={colors.protein}
        />
        <MacroProgress
          label="Carboidratos"
          current={daily.consumed.carbsG}
          target={daily.target.carbsG}
          color={colors.carbs}
        />
        <MacroProgress
          label="Gorduras"
          current={daily.consumed.fatG}
          target={daily.target.fatG}
          color={colors.fats}
        />
      </Card>

      <Card style={styles.section}>
        <View style={styles.waterRow}>
          <View style={styles.waterLeft}>
            <Droplets size={18} color={colors.water} />
            <AppText variant="h3">Água</AppText>
          </View>
          <AppText variant="label" color={colors.water}>
            {daily.waterLiters.toFixed(1)} / {daily.waterGoalLiters.toFixed(1)} L
          </AppText>
        </View>
        <Pressable
          onPress={() => addWater(0.25)}
          style={styles.waterBtn}
          accessibilityRole="button"
          accessibilityLabel="Adicionar 250 ml de água"
        >
          <AppText variant="label" color={colors.onPrimary}>
            + 250 ml
          </AppText>
        </Pressable>
      </Card>

      <Card style={styles.section}>
        <AppText variant="h3">Volume da semana</AppText>
        <View style={styles.bars}>
          {WEEKLY_BARS.map((bar, i) => (
            <View key={`${bar.label}-${i}`} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${Math.round(bar.value * 100)}%` },
                  ]}
                />
              </View>
              <AppText variant="caption" muted>
                {bar.label}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.insights}>
        <AppText variant="h3">Insights PERFORMA AI</AppText>
        {mockInsights.slice(0, 2).map((insight) => (
          <AIInsightCard
            key={insight.id}
            title={insight.title}
            message={insight.message}
          />
        ))}
      </View>

      <Card
        accent="purple"
        onPress={() => router.push('/technique')}
        accessibilityLabel="Abrir técnica de execução"
      >
        <AppText variant="h3">Como fazer e como não fazer</AppText>
        <AppText variant="caption" muted>
          400+ vídeos de técnica certa e erros comuns
        </AppText>
      </Card>

      <Card
        accent="purple"
        onPress={() => router.push('/habits')}
        accessibilityLabel="Abrir hábitos"
        style={{ marginTop: spacing.md }}
      >
        <AppText variant="h3">Hábitos diários</AppText>
        <AppText variant="caption" muted>
          Toque para acompanhar sua rotina
        </AppText>
      </Card>

      <Card
        accent="purple"
        onPress={() => router.push('/ai')}
        accessibilityLabel="Abrir PERFORMA AI"
        style={{ marginTop: spacing.md }}
      >
        <AppText variant="h3">PERFORMA AI</AppText>
        <AppText variant="caption" muted>
          Perguntas sobre treino, nutrição e evolução
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, marginBottom: spacing.xl, marginTop: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  section: { gap: spacing.md, marginTop: spacing.lg },
  waterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waterLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  waterBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    alignItems: 'flex-end',
    gap: 8,
  },
  barCol: { flex: 1, alignItems: 'center', gap: 6, height: '100%' },
  barTrack: {
    flex: 1,
    width: '70%',
    backgroundColor: colors.borderSubtle,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 8,
  },
  insights: { gap: spacing.md, marginTop: spacing.lg, marginBottom: spacing.lg },
});

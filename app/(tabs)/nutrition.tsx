import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AIOrb } from '@/components/brand/PerformaLogo';
import {
  AppButton,
  AppText,
  Card,
  MacroProgress,
  ProgressRing,
  Screen,
  StatusPill,
} from '@/components/ui';
import { useAuthStore } from '@/stores/auth-store';
import { useNutritionStore } from '@/stores/nutrition-store';
import { colors, radius, spacing } from '@/theme';

type TabKey = 'resumo' | 'refeicoes' | 'macros';

/** Tela 07 — Nutrição */
export default function NutritionTabScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>('resumo');
  const daily = useNutritionStore((s) => s.daily);
  const hasDietPlan = useNutritionStore((s) => s.hasDietPlan);
  const user = useAuthStore((s) => s.user);
  const unlockDietBuilder = useAuthStore((s) => s.unlockDietBuilder);
  const dietUnlocked = Boolean(user?.dietBuilderUnlocked || hasDietPlan);

  const calorieProgress =
    daily.target.calories > 0 ? daily.consumed.calories / daily.target.calories : 0;
  const remaining = Math.max(0, daily.target.calories - daily.consumed.calories);

  return (
    <Screen scroll>
      <AppText variant="h1" style={styles.title}>
        Nutrição
      </AppText>

      <View style={styles.tabs}>
        {(
          [
            ['resumo', 'Resumo'],
            ['refeicoes', 'Refeições'],
            ['macros', 'Macros'],
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
                variant="label"
                color={active ? colors.onPrimary : colors.textSecondary}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {(tab === 'resumo' || tab === 'macros') && (
        <Card style={styles.summary}>
          <AppText variant="h3">Resumo do dia</AppText>
          <View style={styles.summaryRow}>
            <ProgressRing
              progress={calorieProgress}
              size={120}
              stroke={10}
              value={daily.consumed.calories.toLocaleString('pt-BR')}
              label={`/ ${daily.target.calories.toLocaleString('pt-BR')} kcal`}
              color={colors.primary}
              trackColor={colors.surfaceElevated}
            />
            <View style={{ flex: 1, gap: 4 }}>
              <AppText variant="metric" color={colors.primary}>
                {remaining.toLocaleString('pt-BR')}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                kcal restantes
              </AppText>
            </View>
          </View>
        </Card>
      )}

      {(tab === 'resumo' || tab === 'macros') && (
        <Card style={styles.section}>
          <MacroProgress
            label="Proteínas"
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
      )}

      {(tab === 'resumo' || tab === 'refeicoes') && (
        <Card style={styles.section}>
          <AppText variant="h3">Refeições</AppText>
          {daily.meals.map((meal, index) => (
            <View
              key={meal.id}
              style={[
                styles.mealRow,
                index === daily.meals.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View>
                <AppText variant="bodyMedium">{meal.name}</AppText>
                <AppText variant="caption" color={colors.textMuted}>
                  {meal.time} · {meal.items.reduce((sum, i) => sum + i.calories, 0)} kcal
                </AppText>
              </View>
              <StatusPill
                label={meal.logged ? 'Registrada' : 'Pendente'}
                tone={meal.logged ? 'success' : 'neutral'}
              />
            </View>
          ))}
        </Card>
      )}

      {hasDietPlan ? (
        <AppButton
          label="Ver plano alimentar"
          onPress={() => router.push('/nutrition/meal-plan')}
          style={{ marginTop: spacing.lg }}
        />
      ) : (
        <Card accent="purple" style={styles.aiCard}>
          <View style={styles.aiBadge}>
            <AppText variant="caption" color={colors.secondary}>
              BETA
            </AppText>
          </View>
          <View style={{ alignItems: 'center', gap: spacing.md }}>
            <AIOrb size={88} />
            <AppText variant="h2" center>
              Uma dieta criada para a sua{' '}
              <AppText variant="h2" color={colors.primary}>
                rotina
              </AppText>
              .
            </AppText>
            <AppText variant="body" color={colors.textSecondary} center>
              Responda algumas perguntas e o PERFORMA IA criará um plano alimentar
              personalizado para você.
            </AppText>
          </View>
          <AppButton
            label="Criar minha dieta"
            variant="ai"
            onPress={() => {
              if (!dietUnlocked) unlockDietBuilder();
              router.push('/nutrition/ai-diet');
            }}
          />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.md, marginBottom: spacing.lg },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    minHeight: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  summary: { gap: spacing.lg },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  section: { gap: spacing.md, marginTop: spacing.lg },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 54,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  aiCard: { gap: spacing.lg, marginTop: spacing.xl },
  aiBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryMuted,
  },
});

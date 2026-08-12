import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppButton, AppText, Card, Screen, ScreenHeader } from '@/components/ui';
import { mockDietPlan } from '@/data/mock';
import { foodAlternatives } from '@/data/mock/library';
import { useNutritionStore } from '@/stores/nutrition-store';
import type { FoodItem } from '@/types';
import { colors, radius, spacing } from '@/theme';

export default function MealPlanScreen() {
  const router = useRouter();
  const dietPlan = useNutritionStore((s) => s.dietPlan) ?? mockDietPlan;
  const replaceFood = useNutritionStore((s) => s.replaceFood);
  const [selected, setSelected] = useState<{ mealId: string; food: FoodItem } | null>(
    null,
  );

  const alternatives = useMemo(() => {
    if (!selected) return [];
    const exact = foodAlternatives[selected.food.name];
    if (exact) return exact;
    const key = Object.keys(foodAlternatives).find((k) =>
      selected.food.name.toLowerCase().includes(k.toLowerCase()),
    );
    return key ? foodAlternatives[key] : [];
  }, [selected]);

  return (
    <Screen scroll>
      <ScreenHeader showBack title="Plano alimentar" />
      <AppText variant="body" muted style={{ marginBottom: spacing.xl }}>
        {dietPlan.targets?.calories ?? dietPlan.dailyCalories ?? 0} kcal · toque em um
        alimento para substituir
      </AppText>

      {dietPlan.meals.map((meal) => {
        const calories = meal.items.reduce((sum, item) => sum + item.calories, 0);
        return (
          <Card key={meal.id} style={styles.meal}>
            <View style={styles.mealHeader}>
              <AppText variant="h3">{meal.name}</AppText>
              <AppText variant="caption" color={colors.primary}>
                {calories} kcal
              </AppText>
            </View>
            <AppText variant="caption" muted>
              {meal.time}
            </AppText>
            {meal.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setSelected({ mealId: meal.id, food: item })}
                style={styles.foodRow}
                accessibilityRole="button"
                accessibilityLabel={`Substituir ${item.name}`}
              >
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyMedium">{item.name}</AppText>
                  <AppText variant="caption" muted>
                    {item.quantity}
                    {item.unit} · {item.calories} kcal · P {item.proteinG}g
                  </AppText>
                </View>
                <AppText variant="caption" color={colors.secondary}>
                  Substituir
                </AppText>
              </Pressable>
            ))}
          </Card>
        );
      })}

      <AppButton
        label="Lista de compras"
        variant="secondary"
        onPress={() => router.push('/nutrition/shopping-list')}
        style={{ marginTop: spacing.lg }}
      />

      <Modal visible={!!selected} transparent animationType="fade">
        <View style={styles.backdrop}>
          <Card style={styles.sheet}>
            <AppText variant="h3">Substituir alimento</AppText>
            <AppText variant="body" muted>
              {selected?.food.name} — alternativas PERFORMA AI com macros próximos
            </AppText>

            {alternatives.length === 0 ? (
              <AppText variant="body" muted>
                Sem alternativas cadastradas para este item ainda.
              </AppText>
            ) : (
              alternatives.map((alt) => (
                <Pressable
                  key={alt.name}
                  style={styles.alt}
                  onPress={() => {
                    if (!selected) return;
                    replaceFood(selected.mealId, selected.food.id, {
                      name: alt.name,
                      calories: alt.calories,
                      proteinG: alt.proteinG,
                      carbsG: alt.carbsG,
                      fatG: alt.fatG,
                    });
                    setSelected(null);
                  }}
                >
                  <AppText variant="bodyMedium">{alt.name}</AppText>
                  <AppText variant="caption" muted>
                    {alt.reason} · {alt.calories} kcal · P {alt.proteinG}g
                  </AppText>
                </Pressable>
              ))
            )}

            <AppButton
              label="Não tenho esse alimento"
              variant="secondary"
              onPress={() => {
                if (!selected || !alternatives[0]) {
                  setSelected(null);
                  return;
                }
                const alt = alternatives[0];
                replaceFood(selected.mealId, selected.food.id, {
                  name: alt.name,
                  calories: alt.calories,
                  proteinG: alt.proteinG,
                  carbsG: alt.carbsG,
                  fatG: alt.fatG,
                });
                setSelected(null);
              }}
            />
            <AppButton label="Cancelar" variant="ghost" onPress={() => setSelected(null)} />
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meal: { gap: spacing.xs, marginBottom: spacing.md },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    paddingVertical: spacing.xs,
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  sheet: { gap: spacing.md },
  alt: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    gap: 2,
  },
});

import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

import { Card } from './Card';
import { AppText } from './AppText';

export function MealCard({
  title,
  time,
  calories,
  itemsPreview,
  onPress,
}: {
  title: string;
  time: string;
  calories: number;
  itemsPreview: string;
  onPress?: () => void;
}) {
  return (
    <Card onPress={onPress} accessibilityLabel={title}>
      <View style={styles.mealHeader}>
        <View>
          <AppText variant="bodyMedium">{title}</AppText>
          <AppText variant="caption" tone="muted">
            {time}
          </AppText>
        </View>
        <AppText variant="label" tone="primary">
          {calories} kcal
        </AppText>
      </View>
      <AppText variant="caption" tone="secondary" style={{ marginTop: spacing.sm }}>
        {itemsPreview}
      </AppText>
    </Card>
  );
}

export function NutritionCard({
  consumed,
  remaining,
  target,
}: {
  consumed: number;
  remaining: number;
  target: number;
}) {
  return (
    <Card>
      <AppText variant="label" tone="muted">
        Resumo do dia
      </AppText>
      <View style={styles.nutritionRow}>
        <View style={styles.nutritionCol}>
          <AppText variant="caption" tone="muted">
            Consumidas
          </AppText>
          <AppText variant="h3">{consumed}</AppText>
        </View>
        <View style={styles.nutritionCol}>
          <AppText variant="caption" tone="muted">
            Restantes
          </AppText>
          <AppText variant="h3" tone="primary">
            {remaining}
          </AppText>
        </View>
        <View style={styles.nutritionCol}>
          <AppText variant="caption" tone="muted">
            Meta
          </AppText>
          <AppText variant="h3">{target}</AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  nutritionCol: { gap: spacing.xs },
});

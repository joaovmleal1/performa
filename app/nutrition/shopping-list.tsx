import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Card, Screen } from '@/components/ui';
import { shoppingList as initialList } from '@/data/mock';
import { shoppingCategoryLabels } from '@/lib/format';
import { colors, spacing } from '@/theme';

export default function ShoppingListScreen() {
  const router = useRouter();
  const [items, setItems] = useState(initialList);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const item of items) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return Array.from(map.entries());
  }, [items]);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  return (
    <Screen scroll>
      <AppButton label="Voltar" variant="ghost" onPress={() => router.back()} />
      <AppText variant="h1">Lista de compras</AppText>
      <AppText variant="body" muted style={{ marginBottom: spacing.xl }}>
        Toque nos itens para marcar como comprados.
      </AppText>

      {grouped.map(([category, list]) => (
        <View key={category} style={styles.group}>
          <AppText variant="h3">
            {shoppingCategoryLabels[category] ?? category}
          </AppText>
          {list.map((item) => (
            <Pressable key={item.id} onPress={() => toggle(item.id)}>
              <Card style={styles.item}>
                <View style={styles.itemRow}>
                  <View
                    style={[
                      styles.check,
                      item.checked && styles.checkDone,
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <AppText
                      variant="bodyMedium"
                      style={item.checked ? styles.struck : undefined}
                    >
                      {item.name}
                    </AppText>
                    <AppText variant="caption" muted>
                      {item.qty}
                    </AppText>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm, marginBottom: spacing.xl },
  item: { paddingVertical: spacing.md },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
  },
  checkDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  struck: { textDecorationLine: 'line-through', opacity: 0.6 },
});

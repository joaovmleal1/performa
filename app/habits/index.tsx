import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  Apple,
  Brain,
  Check,
  Droplets,
  Dumbbell,
  Footprints,
  Moon,
} from 'lucide-react-native';

import {
  AppButton,
  AppText,
  Card,
  Input,
  Screen,
} from '@/components/ui';
import { useHabitsStore } from '@/stores/habits-store';
import { colors, spacing } from '@/theme';
import type { Habit } from '@/types';

const iconMap = {
  droplet: Droplets,
  dumbbell: Dumbbell,
  moon: Moon,
  brain: Brain,
  apple: Apple,
  footprints: Footprints,
} as const;

export default function HabitsScreen() {
  const router = useRouter();
  const habits = useHabitsStore((s) => s.habits);
  const toggleHabit = useHabitsStore((s) => s.toggleHabit);
  const addHabit = useHabitsStore((s) => s.addHabit);
  const [title, setTitle] = useState('');

  const doneCount = habits.filter((h) => h.completed).length;

  return (
    <Screen scroll>
      <AppButton label="Voltar" variant="ghost" onPress={() => router.back()} />
      <AppText variant="h1">Hábitos</AppText>
      <AppText variant="body" muted style={{ marginBottom: spacing.xl }}>
        {doneCount} de {habits.length} concluídos hoje
      </AppText>

      <View style={styles.list}>
        {habits.map((habit) => (
          <HabitRow key={habit.id} habit={habit} onToggle={() => toggleHabit(habit.id)} />
        ))}
      </View>

      <Card style={styles.add}>
        <AppText variant="h3">Novo hábito</AppText>
        <Input
          placeholder="Ex.: Alongar 5 min"
          value={title}
          onChangeText={setTitle}
        />
        <AppButton
          label="Adicionar"
          disabled={!title.trim()}
          onPress={() => {
            addHabit(title.trim());
            setTitle('');
          }}
        />
      </Card>
    </Screen>
  );
}

function HabitRow({ habit, onToggle }: { habit: Habit; onToggle: () => void }) {
  const Icon =
    iconMap[habit.icon as keyof typeof iconMap] ?? Brain;
  return (
    <Pressable onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked: habit.completed }}>
      <Card style={styles.habit}>
        <View style={styles.habitLeft}>
          <View style={[styles.icon, habit.completed && styles.iconDone]}>
            {habit.completed ? (
              <Check size={18} color={colors.onPrimary} />
            ) : (
              <Icon size={18} color={colors.primary} />
            )}
          </View>
          <View>
            <AppText variant="bodyMedium">{habit.title}</AppText>
            <AppText variant="caption" muted>
              {habit.targetLabel} · {habit.streak} dias
            </AppText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  habit: { paddingVertical: spacing.md },
  habitLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDone: { backgroundColor: colors.primary },
  add: { gap: spacing.md, marginTop: spacing.xl },
});

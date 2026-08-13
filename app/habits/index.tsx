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
  ScreenHeader,
} from '@/components/ui';
import { useHabitsStore } from '@/stores/habits-store';
import { colors, radius, spacing } from '@/theme';
import type { Habit } from '@/types';

const iconMap = {
  droplet: Droplets,
  dumbbell: Dumbbell,
  moon: Moon,
  brain: Brain,
  apple: Apple,
  footprints: Footprints,
} as const;

/** Tela 13 — Hábitos */
export default function HabitsScreen() {
  const router = useRouter();
  const habits = useHabitsStore((s) => s.habits);
  const toggleHabit = useHabitsStore((s) => s.toggleHabit);
  const addHabit = useHabitsStore((s) => s.addHabit);
  const [title, setTitle] = useState('');
  const [adding, setAdding] = useState(false);

  return (
    <Screen scroll>
      <ScreenHeader title="Hábitos" showBack onBack={() => router.back()} />
      <AppText variant="body" color={colors.textSecondary} style={styles.sub}>
        Seus hábitos diários constroem sua melhor versão.
      </AppText>

      <View style={styles.list}>
        {habits.map((habit) => (
          <HabitRow key={habit.id} habit={habit} onToggle={() => toggleHabit(habit.id)} />
        ))}
      </View>

      {adding ? (
        <Card style={styles.add}>
          <Input
            placeholder="Ex.: Alongar 5 min"
            value={title}
            onChangeText={setTitle}
          />
          <AppButton
            label="Salvar hábito"
            disabled={!title.trim()}
            onPress={() => {
              addHabit(title.trim());
              setTitle('');
              setAdding(false);
            }}
          />
          <AppButton label="Cancelar" variant="ghost" onPress={() => setAdding(false)} />
        </Card>
      ) : (
        <AppButton label="+ Novo hábito" onPress={() => setAdding(true)} style={{ marginTop: spacing.xl }} />
      )}
    </Screen>
  );
}

function HabitRow({ habit, onToggle }: { habit: Habit; onToggle: () => void }) {
  const Icon = iconMap[habit.icon as keyof typeof iconMap] ?? Brain;
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: habit.completed }}
    >
      <Card style={styles.habit}>
        <View style={styles.habitLeft}>
          <Icon size={20} color={colors.secondary} strokeWidth={1.85} />
          <View style={{ flex: 1 }}>
            <AppText variant="bodyMedium">{habit.title}</AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {habit.targetLabel}
            </AppText>
          </View>
          <View style={[styles.check, habit.completed && styles.checkOn]}>
            {habit.completed ? (
              <Check size={14} color={colors.onPrimary} strokeWidth={3} />
            ) : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sub: { marginBottom: spacing.xl },
  list: { gap: spacing.sm },
  habit: { paddingVertical: spacing.md },
  habitLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  add: { gap: spacing.md, marginTop: spacing.xl },
});

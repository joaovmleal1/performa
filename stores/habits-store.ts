import { create } from 'zustand';

import { mockHabits } from '@/data/mock';
import type { Habit } from '@/types';

type HabitsState = {
  habits: Habit[];
  toggleHabit: (id: string) => void;
  addHabit: (title: string) => void;
};

export const useHabitsStore = create<HabitsState>((set) => ({
  habits: mockHabits,
  toggleHabit: (id) =>
    set((s) => ({
      habits: s.habits.map((h) => {
        if (h.id !== id) return h;
        const completed = !h.completed;
        return {
          ...h,
          completed,
          streak: completed ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      }),
    })),
  addHabit: (title) =>
    set((s) => ({
      habits: [
        ...s.habits,
        {
          id: `h_${Date.now()}`,
          title,
          icon: 'brain',
          targetLabel: 'Diário',
          completed: false,
          streak: 0,
        },
      ],
    })),
}));

import { create } from 'zustand';

import { mockDailyNutrition, mockDietPlan } from '@/data/mock';
import type { DailyNutrition, DietInterviewAnswers, DietPlan, FoodItem } from '@/types';

type FoodPatch = Partial<Pick<FoodItem, 'name' | 'calories' | 'proteinG' | 'carbsG' | 'fatG'>>;

type NutritionState = {
  daily: DailyNutrition;
  hasDietPlan: boolean;
  dietPlan: DietPlan | null;
  interview: DietInterviewAnswers;
  interviewStep: number;
  addWater: (amount: number) => void;
  setHasDietPlan: (value: boolean) => void;
  setDietPlan: (plan: DietPlan) => void;
  patchInterview: (partial: DietInterviewAnswers) => void;
  setInterviewStep: (step: number) => void;
  resetInterview: () => void;
  generateDietFromInterview: () => DietPlan;
  replaceFood: (mealId: string, foodId: string, patch: FoodPatch) => void;
};

export const DIET_INTERVIEW_STEPS = 10;

export const useNutritionStore = create<NutritionState>((set, get) => ({
  daily: mockDailyNutrition,
  hasDietPlan: false,
  dietPlan: null,
  interview: {},
  interviewStep: 0,
  addWater: (amount) =>
    set((s) => ({
      daily: {
        ...s.daily,
        waterLiters: Math.min(
          s.daily.waterGoalLiters + 0.5,
          Math.round((s.daily.waterLiters + amount) * 10) / 10,
        ),
      },
    })),
  setHasDietPlan: (value) => set({ hasDietPlan: value }),
  setDietPlan: (plan) => set({ dietPlan: plan, hasDietPlan: true }),
  patchInterview: (partial) =>
    set((s) => ({ interview: { ...s.interview, ...partial } })),
  setInterviewStep: (step) => set({ interviewStep: step }),
  resetInterview: () => set({ interview: {}, interviewStep: 0 }),
  generateDietFromInterview: () => {
    const answers = get().interview;
    const goal = answers.goal ?? 'definition';
    const targets =
      goal === 'gain_muscle'
        ? { calories: 2400, proteinG: 160, carbsG: 260, fatG: 75 }
        : goal === 'lose_fat'
          ? { calories: 1900, proteinG: 145, carbsG: 170, fatG: 60 }
          : mockDietPlan.targets;

    const plan: DietPlan = {
      ...mockDietPlan,
      id: `diet_${Date.now()}`,
      title:
        goal === 'gain_muscle'
          ? 'Plano de ganho de massa'
          : goal === 'lose_fat'
            ? 'Plano de perda de gordura'
            : 'Plano de definição',
      targets,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set({ dietPlan: plan, hasDietPlan: true });
    return plan;
  },
  replaceFood: (mealId, foodId, patch) =>
    set((s) => {
      const plan = s.dietPlan ?? mockDietPlan;
      const meals = plan.meals.map((meal) => {
        if (meal.id !== mealId) return meal;
        return {
          ...meal,
          items: meal.items.map((item) =>
            item.id === foodId ? { ...item, ...patch } : item,
          ),
        };
      });
      return { dietPlan: { ...plan, meals }, hasDietPlan: true };
    }),
}));

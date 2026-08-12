import { mockDailyNutrition, mockTodayWorkout, mockUser, mockInsights } from '@/data/mock';

/** Feature services with mock implementations ready to swap for Supabase queries. */

export async function fetchDashboard() {
  await delay(250);
  return {
    user: mockUser,
    workout: mockTodayWorkout,
    nutrition: mockDailyNutrition,
    insight: mockInsights[0],
  };
}

export async function fetchTodayWorkout() {
  await delay(200);
  return mockTodayWorkout;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

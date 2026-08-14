import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  CompletedExerciseLog,
  CompletedWorkoutSession,
  ExerciseLoadHistoryEntry,
  LoggedSet,
} from '@/types';

type LiftHistoryState = {
  sessions: CompletedWorkoutSession[];
  saveSession: (session: CompletedWorkoutSession) => void;
  getExerciseHistory: (exerciseId: string) => ExerciseLoadHistoryEntry[];
  getLastSetsForExercise: (exerciseId: string) => LoggedSet[];
  getLastWeightForSet: (exerciseId: string, setNumber: number) => number | null;
  getSuggestedWeight: (exerciseId: string) => number | null;
  getPersonalBests: () => { exerciseId: string; exerciseName: string; weightKg: number; reps: number; date: string }[];
  clearHistory: () => void;
};

function volumeOf(sets: LoggedSet[]) {
  return sets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);
}

function topWeightOf(sets: LoggedSet[]) {
  return sets.reduce((max, s) => Math.max(max, s.weightKg), 0);
}

export const useLiftHistoryStore = create<LiftHistoryState>()(
  persist(
    (set, get) => ({
      sessions: [],
      saveSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions].slice(0, 120),
        })),
      getExerciseHistory: (exerciseId) => {
        const entries: ExerciseLoadHistoryEntry[] = [];
        for (const session of get().sessions) {
          const ex = session.exercises.find((e) => e.exerciseId === exerciseId);
          if (!ex || ex.sets.length === 0) continue;
          entries.push({
            date: session.completedAt.slice(0, 10),
            sessionId: session.id,
            sets: ex.sets,
            topWeightKg: topWeightOf(ex.sets),
            volumeKg: volumeOf(ex.sets),
          });
        }
        return entries;
      },
      getLastSetsForExercise: (exerciseId) => {
        for (const session of get().sessions) {
          const ex = session.exercises.find((e) => e.exerciseId === exerciseId);
          if (ex?.sets.length) return ex.sets;
        }
        return [];
      },
      getLastWeightForSet: (exerciseId, setNumber) => {
        const sets = get().getLastSetsForExercise(exerciseId);
        const match = sets.find((s) => s.setNumber === setNumber);
        if (match) return match.weightKg;
        if (sets.length) return sets[sets.length - 1]!.weightKg;
        return null;
      },
      getSuggestedWeight: (exerciseId) => {
        // Fallback simples; a decisão oficial fica no Coach (coachDecideSetLoads)
        const sets = get().getLastSetsForExercise(exerciseId);
        if (!sets.length) return null;
        return sets.reduce((max, s) => Math.max(max, s.weightKg), 0);
      },
      getPersonalBests: () => {
        const bestByExercise = new Map<
          string,
          { exerciseId: string; exerciseName: string; weightKg: number; reps: number; date: string }
        >();
        for (const session of get().sessions) {
          for (const ex of session.exercises) {
            for (const logged of ex.sets) {
              const prev = bestByExercise.get(ex.exerciseId);
              if (!prev || logged.weightKg > prev.weightKg) {
                bestByExercise.set(ex.exerciseId, {
                  exerciseId: ex.exerciseId,
                  exerciseName: ex.exerciseName,
                  weightKg: logged.weightKg,
                  reps: logged.reps,
                  date: logged.completedAt.slice(0, 10),
                });
              }
            }
          }
        }
        return Array.from(bestByExercise.values()).sort((a, b) => b.weightKg - a.weightKg);
      },
      clearHistory: () => set({ sessions: [] }),
    }),
    {
      name: 'performa-lift-history',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ sessions: state.sessions }),
    },
  ),
);

export function buildSessionFromLogs(input: {
  workoutId: string;
  workoutName: string;
  exercises: { exerciseId: string; exerciseName: string }[];
  logs: Record<string, LoggedSet[]>;
}): CompletedWorkoutSession | null {
  const completed: CompletedExerciseLog[] = input.exercises
    .map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      sets: input.logs[ex.exerciseId] ?? [],
    }))
    .filter((ex) => ex.sets.length > 0);

  if (!completed.length) return null;

  return {
    id: `session_${Date.now()}`,
    workoutId: input.workoutId,
    workoutName: input.workoutName,
    completedAt: new Date().toISOString(),
    exercises: completed,
  };
}

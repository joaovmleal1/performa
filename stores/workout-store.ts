import { create } from 'zustand';

import { mockTodayWorkout } from '@/data/mock';
import type { LoggedSet, WorkoutPlan } from '@/types';

type WorkoutSessionState = {
  workout: WorkoutPlan;
  exerciseIndex: number;
  setIndex: number;
  currentWeight: number;
  currentReps: number;
  isResting: boolean;
  restSecondsLeft: number;
  logs: Record<string, LoggedSet[]>;
  startSession: () => void;
  setWeight: (value: number) => void;
  setReps: (value: number) => void;
  completeSet: () => void;
  skipRest: () => void;
  addRestTime: (seconds: number) => void;
  tickRest: () => void;
  pauseRest: () => void;
  resumeRest: () => void;
  restPaused: boolean;
};

export const useWorkoutSessionStore = create<WorkoutSessionState>((set, get) => ({
  workout: structuredClone(mockTodayWorkout),
  exerciseIndex: 0,
  setIndex: 0,
  currentWeight: mockTodayWorkout.exercises[0]?.suggestedWeightKg ?? 20,
  currentReps: mockTodayWorkout.exercises[0]?.reps ?? 10,
  isResting: false,
  restSecondsLeft: 0,
  restPaused: false,
  logs: {},
  startSession: () => {
    const workout = structuredClone(mockTodayWorkout);
    const first = workout.exercises[0];
    set({
      workout,
      exerciseIndex: 0,
      setIndex: 0,
      currentWeight: first?.suggestedWeightKg ?? first?.previousWeightKg ?? 20,
      currentReps: first?.reps ?? 10,
      isResting: false,
      restSecondsLeft: 0,
      restPaused: false,
      logs: {},
    });
  },
  setWeight: (value) => set({ currentWeight: Math.max(0, value) }),
  setReps: (value) => set({ currentReps: Math.max(1, value) }),
  completeSet: () => {
    const state = get();
    const exercise = state.workout.exercises[state.exerciseIndex];
    if (!exercise) return;

    const key = exercise.exerciseId;
    const prevLogs = state.logs[key] ?? [];
    const nextLogs = {
      ...state.logs,
      [key]: [
        ...prevLogs,
        {
          setNumber: state.setIndex + 1,
          weightKg: state.currentWeight,
          reps: state.currentReps,
          completedAt: new Date().toISOString(),
        },
      ],
    };

    const isLastSet = state.setIndex + 1 >= exercise.sets;
    const isLastExercise = state.exerciseIndex + 1 >= state.workout.exercises.length;

    if (isLastSet && isLastExercise) {
      const updated = { ...state.workout };
      updated.exercises = updated.exercises.map((ex, i) =>
        i === state.exerciseIndex ? { ...ex, completed: true } : ex,
      );
      set({
        logs: nextLogs,
        workout: updated,
        isResting: false,
        restSecondsLeft: 0,
      });
      return;
    }

    if (isLastSet) {
      const nextIndex = state.exerciseIndex + 1;
      const nextExercise = state.workout.exercises[nextIndex];
      const updated = { ...state.workout };
      updated.exercises = updated.exercises.map((ex, i) =>
        i === state.exerciseIndex ? { ...ex, completed: true } : ex,
      );
      set({
        logs: nextLogs,
        workout: updated,
        exerciseIndex: nextIndex,
        setIndex: 0,
        currentWeight: nextExercise?.suggestedWeightKg ?? nextExercise?.previousWeightKg ?? 20,
        currentReps: nextExercise?.reps ?? 10,
        isResting: true,
        restSecondsLeft: exercise.restSeconds,
        restPaused: false,
      });
      return;
    }

    set({
      logs: nextLogs,
      setIndex: state.setIndex + 1,
      isResting: true,
      restSecondsLeft: exercise.restSeconds,
      restPaused: false,
    });
  },
  skipRest: () => set({ isResting: false, restSecondsLeft: 0, restPaused: false }),
  addRestTime: (seconds) =>
    set((s) => ({ restSecondsLeft: s.restSecondsLeft + seconds, isResting: true })),
  tickRest: () => {
    const { isResting, restPaused, restSecondsLeft } = get();
    if (!isResting || restPaused) return;
    if (restSecondsLeft <= 1) {
      set({ isResting: false, restSecondsLeft: 0 });
      return;
    }
    set({ restSecondsLeft: restSecondsLeft - 1 });
  },
  pauseRest: () => set({ restPaused: true }),
  resumeRest: () => set({ restPaused: false }),
}));

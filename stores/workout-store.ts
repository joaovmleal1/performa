import { create } from 'zustand';

import { mockTodayWorkout } from '@/data/mock';
import {
  buildSessionFromLogs,
  useLiftHistoryStore,
} from '@/stores/lift-history-store';
import type { LoggedSet, WorkoutPlan } from '@/types';

type WorkoutSessionState = {
  workout: WorkoutPlan;
  exerciseIndex: number;
  setIndex: number;
  currentWeight: number;
  currentReps: number;
  isResting: boolean;
  restSecondsLeft: number;
  restPaused: boolean;
  logs: Record<string, LoggedSet[]>;
  sessionFinished: boolean;
  startSession: () => void;
  setWeight: (value: number) => void;
  setReps: (value: number) => void;
  completeSet: () => void;
  skipRest: () => void;
  addRestTime: (seconds: number) => void;
  tickRest: () => void;
  pauseRest: () => void;
  resumeRest: () => void;
};

function seedWorkoutFromHistory(): WorkoutPlan {
  const workout = structuredClone(mockTodayWorkout);
  const history = useLiftHistoryStore.getState();

  workout.exercises = workout.exercises.map((ex) => {
    const lastSets = history.getLastSetsForExercise(ex.exerciseId);
    const lastWeight =
      lastSets.length > 0
        ? lastSets.reduce((max, s) => Math.max(max, s.weightKg), 0)
        : ex.previousWeightKg;
    const suggested =
      history.getSuggestedWeight(ex.exerciseId) ??
      ex.suggestedWeightKg ??
      lastWeight;

    return {
      ...ex,
      previousWeightKg: lastWeight,
      suggestedWeightKg: suggested,
      completed: false,
    };
  });

  return workout;
}

function persistFinishedSession(workout: WorkoutPlan, logs: Record<string, LoggedSet[]>) {
  const session = buildSessionFromLogs({
    workoutId: workout.id,
    workoutName: workout.name,
    exercises: workout.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exercise.name,
    })),
    logs,
  });
  if (session) {
    useLiftHistoryStore.getState().saveSession(session);
  }
}

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
  sessionFinished: false,
  startSession: () => {
    const workout = seedWorkoutFromHistory();
    const first = workout.exercises[0];
    const history = useLiftHistoryStore.getState();
    const setOneWeight =
      (first && history.getLastWeightForSet(first.exerciseId, 1)) ??
      first?.suggestedWeightKg ??
      first?.previousWeightKg ??
      20;

    set({
      workout,
      exerciseIndex: 0,
      setIndex: 0,
      currentWeight: setOneWeight,
      currentReps: first?.reps ?? 10,
      isResting: false,
      restSecondsLeft: 0,
      restPaused: false,
      logs: {},
      sessionFinished: false,
    });
  },
  setWeight: (value) => {
    const rounded = Math.round(Math.max(0, value) * 4) / 4;
    set({ currentWeight: rounded });
  },
  setReps: (value) => set({ currentReps: Math.max(1, Math.round(value)) }),
  completeSet: () => {
    const state = get();
    const exercise = state.workout.exercises[state.exerciseIndex];
    if (!exercise || state.sessionFinished) return;

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
      persistFinishedSession(updated, nextLogs);
      set({
        logs: nextLogs,
        workout: updated,
        isResting: false,
        restSecondsLeft: 0,
        sessionFinished: true,
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
      const history = useLiftHistoryStore.getState();
      const nextWeight =
        (nextExercise && history.getLastWeightForSet(nextExercise.exerciseId, 1)) ??
        nextExercise?.suggestedWeightKg ??
        nextExercise?.previousWeightKg ??
        20;

      set({
        logs: nextLogs,
        workout: updated,
        exerciseIndex: nextIndex,
        setIndex: 0,
        currentWeight: nextWeight,
        currentReps: nextExercise?.reps ?? 10,
        isResting: true,
        restSecondsLeft: exercise.restSeconds,
        restPaused: false,
      });
      return;
    }

    const nextSetNumber = state.setIndex + 2;
    const history = useLiftHistoryStore.getState();
    const nextSetWeight =
      history.getLastWeightForSet(exercise.exerciseId, nextSetNumber) ??
      state.currentWeight;

    set({
      logs: nextLogs,
      setIndex: state.setIndex + 1,
      currentWeight: nextSetWeight,
      isResting: true,
      restSecondsLeft: exercise.restSeconds,
      restPaused: false,
    });
  },
  skipRest: () => set({ isResting: false, restSecondsLeft: 0, restPaused: false }),
  addRestTime: (seconds) =>
    set((s) => ({ restSecondsLeft: Math.max(0, s.restSecondsLeft + seconds), isResting: true })),
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

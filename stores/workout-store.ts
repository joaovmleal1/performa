import { create } from 'zustand';

import { mockTodayWorkout } from '@/data/mock';
import { coachDecideWorkoutLoads } from '@/services/coach-agent';
import { useAuthStore } from '@/stores/auth-store';
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

function coachWeightForSet(
  exercise: WorkoutPlan['exercises'][number] | undefined,
  setNumber: number,
  fallback: number,
) {
  const decision = exercise?.coachLoad?.sets.find((s) => s.setNumber === setNumber);
  return decision?.suggestedWeightKg ?? fallback;
}

/** Monta o treino com decisão individual do Coach por série/usuário */
function seedWorkoutFromCoach(): WorkoutPlan {
  const workout = structuredClone(mockTodayWorkout);
  const history = useLiftHistoryStore.getState();
  const user = useAuthStore.getState().user;

  const plans = coachDecideWorkoutLoads({
    user,
    exercises: workout.exercises.map((ex) => {
      const recent = history.getExerciseHistory(ex.exerciseId).slice(0, 3);
      return {
        exerciseId: ex.exerciseId,
        exerciseName: ex.exercise.name,
        sets: ex.sets,
        reps: ex.reps,
        fallbackWeightKg: ex.suggestedWeightKg || ex.previousWeightKg || 20,
        lastSets: history.getLastSetsForExercise(ex.exerciseId).map((s) => ({
          setNumber: s.setNumber,
          weightKg: s.weightKg,
          reps: s.reps,
        })),
        recentSessions: recent.map((entry) => ({
          sets: entry.sets.map((s) => ({
            setNumber: s.setNumber,
            weightKg: s.weightKg,
            reps: s.reps,
          })),
        })),
      };
    }),
  });

  workout.exercises = workout.exercises.map((ex) => {
    const coachLoad = plans[ex.exerciseId];
    const lastSets = history.getLastSetsForExercise(ex.exerciseId);
    const lastWeight =
      lastSets.length > 0
        ? lastSets.reduce((max, s) => Math.max(max, s.weightKg), 0)
        : ex.previousWeightKg;
    const suggested =
      coachLoad?.sets[0]?.suggestedWeightKg ??
      coachLoad?.sets.find((s) => s.action === 'increase')?.suggestedWeightKg ??
      ex.suggestedWeightKg ??
      lastWeight;

    return {
      ...ex,
      previousWeightKg: lastWeight,
      suggestedWeightKg: suggested,
      coachLoad,
      completed: false,
      notes: coachLoad?.summary,
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
    const workout = seedWorkoutFromCoach();
    const first = workout.exercises[0];
    const setOneWeight = coachWeightForSet(
      first,
      1,
      first?.suggestedWeightKg ?? first?.previousWeightKg ?? 20,
    );

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
      const nextWeight = coachWeightForSet(
        nextExercise,
        1,
        nextExercise?.suggestedWeightKg ?? nextExercise?.previousWeightKg ?? 20,
      );

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
    const nextSetWeight = coachWeightForSet(exercise, nextSetNumber, state.currentWeight);

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

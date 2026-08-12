import { create } from 'zustand';

import type { EvaluationAnswers } from '@/types';

type EvaluationState = {
  step: number;
  answers: EvaluationAnswers;
  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  patch: (partial: EvaluationAnswers) => void;
  reset: () => void;
};

export const EVALUATION_TOTAL_STEPS = 8;

export const useEvaluationStore = create<EvaluationState>((set) => ({
  step: 0,
  answers: {},
  setStep: (step) => set({ step }),
  next: () => set((s) => ({ step: Math.min(s.step + 1, EVALUATION_TOTAL_STEPS - 1) })),
  back: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),
  patch: (partial) => set((s) => ({ answers: { ...s.answers, ...partial } })),
  reset: () => set({ step: 0, answers: {} }),
}));

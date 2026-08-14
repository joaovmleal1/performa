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
  totalSteps: () => number;
};

/** Passos fixos: 0–7 perfil/treino, 8 dieta, 9 modo preparação. +1 se preparação ativa. */
export const EVALUATION_FIXED_STEPS = 10;

export function getEvaluationTotalSteps(answers: EvaluationAnswers): number {
  return answers.preparationMode ? EVALUATION_FIXED_STEPS + 1 : EVALUATION_FIXED_STEPS;
}

/** @deprecated use getEvaluationTotalSteps(answers) — mantido para imports existentes */
export const EVALUATION_TOTAL_STEPS = EVALUATION_FIXED_STEPS;

export const useEvaluationStore = create<EvaluationState>((set, get) => ({
  step: 0,
  answers: {},
  setStep: (step) => set({ step }),
  next: () =>
    set((s) => ({
      step: Math.min(s.step + 1, getEvaluationTotalSteps(s.answers) - 1),
    })),
  back: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),
  patch: (partial) =>
    set((s) => {
      const answers = { ...s.answers, ...partial };
      // Se desligar preparação, volta do passo extra se necessário
      const total = getEvaluationTotalSteps(answers);
      const step = Math.min(s.step, total - 1);
      return { answers, step };
    }),
  reset: () => set({ step: 0, answers: {} }),
  totalSteps: () => getEvaluationTotalSteps(get().answers),
}));

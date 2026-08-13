import { create } from 'zustand';

import { coachAnswer, coachSuggestedPrompts } from '@/services/coach-agent';
import { useAuthStore } from '@/stores/auth-store';
import { useNutritionStore } from '@/stores/nutrition-store';

export type AIMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  createdAt: string;
};

type AIState = {
  messages: AIMessage[];
  isTyping: boolean;
  send: (text: string) => Promise<void>;
  clear: () => void;
  suggestions: () => string[];
};

function buildWelcome(): AIMessage {
  const user = useAuthStore.getState().user;
  const name = user?.name?.split(' ')[0] ?? 'Aluno';
  const prep = user?.preparationMode
    ? ` Vi que você está em modo preparação para ${user?.competitionName ?? 'sua prova'} — posso revisar a periodização.`
    : '';
  return {
    id: 'ai_welcome',
    role: 'assistant',
    content: `Olá, ${name}. Sou o PERFORMA Coach — especialista em periodização, musculação, prevenção e suporte ao aluno. Fui treinado com literatura de educação física/fisioterapia/musculação e estudos carregados (InVictus/V Athlete e treino em casa/postura).${prep} Como posso ajudar?`,
    sources: [
      'Cânone PERFORMA — educação física, musculação e fisioterapia esportiva',
      'Guida Completa Massa Muscolare — Massimo Brunaccioni (V Athlete / InVictus)',
      'Allenamento a Casa — Fisico Spartano (via Dhoze / postura & corpo livre)',
    ],
    createdAt: new Date().toISOString(),
  };
}

export const useAIStore = create<AIState>((set, get) => ({
  messages: [buildWelcome()],
  isTyping: false,
  suggestions: () => coachSuggestedPrompts(useAuthStore.getState().user),
  clear: () => set({ messages: [buildWelcome()], isTyping: false }),
  send: async (text) => {
    const trimmed = text.trim();
    if (!trimmed || get().isTyping) return;

    const userMsg: AIMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    set((s) => ({ messages: [...s.messages, userMsg], isTyping: true }));
    await new Promise((r) => setTimeout(r, 650));

    const user = useAuthStore.getState().user;
    const hasDietPlan = useNutritionStore.getState().hasDietPlan;
    const answer = coachAnswer(trimmed, { user, hasDietPlan });

    const reply: AIMessage = {
      id: `a_${Date.now()}`,
      role: 'assistant',
      content: answer.content,
      sources: answer.sources,
      createdAt: new Date().toISOString(),
    };

    set((s) => ({ messages: [...s.messages, reply], isTyping: false }));
  },
}));

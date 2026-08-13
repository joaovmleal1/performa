import { create } from 'zustand';

import { coachAnswerAsync, coachSuggestedPrompts } from '@/services/coach-agent';
import { useAuthStore } from '@/stores/auth-store';
import { useNutritionStore } from '@/stores/nutrition-store';

export type AIMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  provider?: 'openrouter' | 'local';
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
    content: `Olá, ${name}. Como posso ajudar com seu treino hoje? Posso tirar dúvidas, explicar exercícios e orientar ajustes no seu planejamento.${prep}`,
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

    const user = useAuthStore.getState().user;
    const hasDietPlan = useNutritionStore.getState().hasDietPlan;

    const answer = await coachAnswerAsync(trimmed, {
      user,
      hasDietPlan,
      preferCloud: true,
    });

    const reply: AIMessage = {
      id: `a_${Date.now()}`,
      role: 'assistant',
      content: answer.content,
      sources: answer.sources,
      provider: answer.provider,
      createdAt: new Date().toISOString(),
    };

    set((s) => ({ messages: [...s.messages, reply], isTyping: false }));
  },
}));

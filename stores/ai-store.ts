import { create } from 'zustand';

import { coachAnswerAsync, coachSuggestedPrompts } from '@/services/coach-agent';
import { useAuthStore } from '@/stores/auth-store';
import { useNutritionStore } from '@/stores/nutrition-store';
import { useSettingsStore } from '@/stores/settings-store';

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
  const hasKey = useSettingsStore.getState().hasOpenRouterKey();
  const name = user?.name?.split(' ')[0] ?? 'Aluno';
  const prep = user?.preparationMode
    ? ` Vi que você está em modo preparação para ${user?.competitionName ?? 'sua prova'} — posso revisar a periodização.`
    : '';
  const mode = hasKey
    ? ' OpenRouter ativo: respostas com modelo LLM + base científica local.'
    : ' Sem API key ainda: estou no modo local (RAG). Configure a chave OpenRouter em Perfil → OpenRouter.';
  return {
    id: 'ai_welcome',
    role: 'assistant',
    content: `Olá, ${name}. Sou o PERFORMA Coach — especialista em periodização, musculação, prevenção e suporte ao aluno. Base: ACSM/NSCA/Schoenfeld/IOC + estudos InVictus e treino em casa.${prep}${mode}`,
    sources: [
      'ACSM 2026 Position Stand — Resistance Training',
      'NSCA / taper & periodização',
      'Schoenfeld — volume e frequência',
      'Estudos InVictus + Fisico Spartano',
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

    const user = useAuthStore.getState().user;
    const hasDietPlan = useNutritionStore.getState().hasDietPlan;
    const settings = useSettingsStore.getState();

    const answer = await coachAnswerAsync(trimmed, {
      user,
      hasDietPlan,
      openRouterApiKey: settings.resolveApiKey(),
      openRouterModel: settings.openRouterModel,
      preferCloud: settings.preferCloudCoach,
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

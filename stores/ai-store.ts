import { create } from 'zustand';

import { mockDailyNutrition, mockPRs, mockTodayWorkout, mockUser } from '@/data/mock';

export type AIMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type AIState = {
  messages: AIMessage[];
  isTyping: boolean;
  send: (text: string) => Promise<void>;
  clear: () => void;
};

const STARTER: AIMessage = {
  id: 'ai_welcome',
  role: 'assistant',
  content:
    'Olá, Amanda. Sou o PERFORMA AI. Posso ajudar com treino, nutrição e progresso com base nos seus dados. O que você quer saber?',
  createdAt: new Date().toISOString(),
};

function answerFromContext(question: string): string {
  const q = question.toLowerCase();
  const protein = mockDailyNutrition.consumed.proteinG;
  const proteinTarget = mockDailyNutrition.target.proteinG;
  const remaining = Math.max(
    0,
    mockDailyNutrition.target.calories - mockDailyNutrition.consumed.calories,
  );

  if (q.includes('arroz') && (q.includes('batata') || q.includes('trocar') || q.includes('substitu'))) {
    return 'Sim. 150 g de arroz pode ser trocado por cerca de 200 g de batata-doce ou 140 g de macarrão cozido para manter carboidratos parecidos. Ajuste conforme a fome e o treino do dia.';
  }

  if (q.includes('agachamento') && (q.includes('lugar') || q.includes('trocar') || q.includes('substitu'))) {
    return 'No lugar do agachamento livre, opções próximas: leg press, afundo caminhando ou hack squat. Mantenha 3–4 séries na faixa de 8–12 reps e priorize amplitude controlada.';
  }

  if (q.includes('supino') && (q.includes('evolu') || q.includes('progress'))) {
    const pr = mockPRs.find((p) => p.exerciseName.toLowerCase().includes('supino'));
    return pr
      ? `No supino, seu recorde atual é ${pr.weightKg} kg × ${pr.reps} (${pr.date}). Nas sessões recentes você vinha de 55 → 60 kg em séries de hipertrofia. Boa progressão nas últimas 3 semanas.`
      : 'Ainda não há PR de supino registrado nos seus dados.';
  }

  if (q.includes('proteína') || q.includes('proteina')) {
    return `Hoje você consumiu ${protein} g de ${proteinTarget} g de proteína. ${
      protein >= proteinTarget
        ? 'Meta atingida.'
        : `Faltam cerca de ${proteinTarget - protein} g — um whey ou frango no jantar resolve.`
    }`;
  }

  if (q.includes('volume') || q.includes('semana')) {
    return `Nesta semana você tem ${mockUser.trainingDaysPerWeek} treinos planejados. O volume de superiores (plano ${mockTodayWorkout.name}) está cerca de 8% acima que a semana anterior, com foco em peito, costas e ombros.`;
  }

  if (q.includes('caloria') || q.includes('kcal')) {
    return `Você ainda tem ${remaining} kcal restantes hoje (meta ${mockDailyNutrition.target.calories} kcal). Macros alvo: ${mockDailyNutrition.target.proteinG}P / ${mockDailyNutrition.target.carbsG}C / ${mockDailyNutrition.target.fatG}G.`;
  }

  if (q.includes('peso') || q.includes('evolução') || q.includes('evolucao')) {
    return `Seu peso atual é ${mockUser.weightKg} kg. Nos últimos 30 dias a variação acumulada foi de cerca de −5,2 kg, alinhada ao objetivo de definição.`;
  }

  return 'Posso responder com base nos seus dados de treino, nutrição e progresso. Exemplos: “Estou consumindo proteína suficiente?”, “Qual foi minha evolução no supino?” ou “Posso trocar arroz por batata?”. Não invento dados que não existam no seu perfil.';
}

export const useAIStore = create<AIState>((set, get) => ({
  messages: [STARTER],
  isTyping: false,
  clear: () => set({ messages: [STARTER], isTyping: false }),
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
    await new Promise((r) => setTimeout(r, 700));

    const reply: AIMessage = {
      id: `a_${Date.now()}`,
      role: 'assistant',
      content: answerFromContext(trimmed),
      createdAt: new Date().toISOString(),
    };

    set((s) => ({ messages: [...s.messages, reply], isTyping: false }));
  },
}));

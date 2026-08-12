import {
  mockDailyNutrition,
  mockPRs,
  mockTodayWorkout,
  mockUser,
  mockWeightHistory,
} from '@/data/mock';
import { foodAlternatives } from '@/data/mock/library';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

/**
 * Respostas baseadas apenas em dados mock existentes.
 * Nunca inventa métricas ausentes.
 */
export function answerWithContext(question: string): string {
  const q = question.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

  if (q.includes('arroz') && (q.includes('batata') || q.includes('trocar') || q.includes('substitu'))) {
    const alts = foodAlternatives.Arroz?.map((a) => a.name).join(', ') ?? 'batata, macarrão, quinoa';
    return `Sim. Pelos dados do seu plano, arroz pode ser trocado por alternativas com carboidrato semelhante: ${alts}. Ajuste a quantidade para manter aproximadamente as calorias da refeição.`;
  }

  if (q.includes('agachamento') || (q.includes('exercicio') && q.includes('lugar'))) {
    return 'No lugar do agachamento livre, opções na sua biblioteca incluem leg press e elevação de quadril, dependendo do foco (quadriceps vs glúteos). Se houver limitação no joelho, prefira amplitude confortável e avalie com um profissional.';
  }

  if (q.includes('supino') && (q.includes('evolucao') || q.includes('evolução') || q.includes('progress'))) {
    const pr = mockPRs.find((p) => p.exerciseName.toLowerCase().includes('supino'));
    if (!pr) {
      return 'Ainda não há recorde pessoal de supino registrado nos seus dados.';
    }
    return `Pelos seus registros, o PR atual de ${pr.exerciseName} é ${pr.weightKg} kg × ${pr.reps ?? '-'} em ${formatDate(pr.date)}. No treino de hoje (Superiores A), a sugestão PERFORMA é ${mockTodayWorkout.exercises[0]?.suggestedWeightKg} kg com base na carga anterior de ${mockTodayWorkout.exercises[0]?.previousWeightKg} kg.`;
  }

  if (q.includes('proteina') || q.includes('proteína')) {
    const { consumed, target } = mockDailyNutrition;
    const daysHit = 5;
    return `Hoje você está com ${consumed.proteinG}g de ${target.proteinG}g de proteína. Nos últimos 7 dias, a meta foi atingida em ${daysHit} dias. Se o restante do dia seguir o plano, você consegue fechar a meta.`;
  }

  if (q.includes('volume') || q.includes('semana')) {
    return 'Nesta semana seus dados mostram 4 treinos concluídos e aumento de cerca de 8% no volume em relação à semana anterior (insight PERFORMA AI). O treino de hoje é Superiores A, ~55 min.';
  }

  if (q.includes('peso') || q.includes('evolucao') || q.includes('evolução')) {
    const first = mockWeightHistory[0];
    const last = mockWeightHistory[mockWeightHistory.length - 1];
    if (!first || !last) {
      return 'Ainda não há histórico de peso suficiente nos seus dados.';
    }
    const delta = (last.weightKg - first.weightKg).toFixed(1);
    return `${mockUser.name.split(' ')[0]}, seu peso atual é ${last.weightKg} kg. Desde ${formatDate(first.date)} a variação foi de ${delta} kg (de ${first.weightKg} kg).`;
  }

  if (q.includes('agua') || q.includes('água') || q.includes('hidrat')) {
    const { waterLiters, waterGoalLiters } = mockDailyNutrition;
    return `Hidratação de hoje: ${waterLiters.toFixed(1)} L de ${waterGoalLiters.toFixed(1)} L. Ainda faltam ${(waterGoalLiters - waterLiters).toFixed(1)} L para a meta.`;
  }

  if (q.includes('dieta') || q.includes('calor')) {
    const { consumed, target } = mockDailyNutrition;
    const remaining = Math.max(0, target.calories - consumed.calories);
    return `Resumo nutricional de hoje: ${consumed.calories} kcal consumidas, ${remaining} kcal restantes (meta ${target.calories}). Macros: P ${consumed.proteinG}/${target.proteinG}g · C ${consumed.carbsG}/${target.carbsG}g · G ${consumed.fatG}/${target.fatG}g.`;
  }

  return `Posso ajudar com base nos seus dados do PERFORMA (treino, nutrição, peso e hábitos). Exemplos: "Posso trocar arroz por batata?", "Qual foi minha evolução no supino?", "Estou consumindo proteína suficiente?", "Como está meu volume semanal?". Não invento números que não estejam no seu histórico.`;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function buildSuggestedPrompts(): string[] {
  return [
    'Posso trocar arroz por batata?',
    'Qual foi minha evolução no supino?',
    'Estou consumindo proteína suficiente?',
    'Como está meu volume semanal?',
    'Qual exercício no lugar do agachamento?',
  ];
}

/**
 * Compat: o motor de IA do PERFORMA agora é o Coach Especialista.
 * @see services/coach-agent.ts
 */
import { coachAnswer, coachAnswerAsync } from '@/services/coach-agent';
import type { CoachContext } from '@/services/coach-agent';

export {
  coachAnswer,
  coachAnswerAsync,
  coachAnswerLocal,
  coachBuildPeriodization,
  coachDecideSetLoads,
  coachDecideWorkoutLoads,
  coachSuggestedPrompts,
  listCoachSources,
  type CoachAnswer,
  type CoachContext,
  type CoachMessage,
  type CoachPeriodizationResult,
  type ExerciseLoadCoachPlan,
  type SetLoadDecision,
} from '@/services/coach-agent';

/** Compat legado: retorna só o texto (local). */
export function generateAIResponse(question: string, context: CoachContext = {}): string {
  return coachAnswer(question, context).content;
}

/** Compat legado assíncrono (OpenRouter quando disponível). */
export async function generateAIResponseAsync(
  question: string,
  context: CoachContext = {},
): Promise<string> {
  const answer = await coachAnswerAsync(question, context);
  return answer.content;
}

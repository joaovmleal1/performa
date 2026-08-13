/**
 * Compat: o motor de IA do PERFORMA agora é o Coach Especialista.
 * @see services/coach-agent.ts
 */
import { coachAnswer } from '@/services/coach-agent';
import type { CoachContext } from '@/services/coach-agent';

export {
  coachAnswer,
  coachBuildPeriodization,
  coachSuggestedPrompts,
  listCoachSources,
  type CoachAnswer,
  type CoachContext,
  type CoachMessage,
  type CoachPeriodizationResult,
} from '@/services/coach-agent';

/** Compat legado: retorna só o texto da resposta. */
export function generateAIResponse(question: string, context: CoachContext = {}): string {
  return coachAnswer(question, context).content;
}

import { retrieveKnowledge, knowledgeSources } from '@/data/knowledge';
import { buildPeriodization } from '@/lib/periodization';
import { openRouterChat } from '@/services/openrouter';
import type {
  ExerciseLoadCoachPlan,
  PeriodizationPlan,
  SetLoadDecision,
  UserProfile,
} from '@/types';

export type CoachContext = {
  user?: UserProfile | null;
  hasDietPlan?: boolean;
  preferCloud?: boolean;
};

export type CoachAnswer = {
  content: string;
  sources: string[];
  provider?: 'openrouter' | 'local';
  model?: string;
};

export type CoachMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  createdAt: string;
};

export type CoachPeriodizationResult = PeriodizationPlan & { coachNotes: string[] };

const DISCLAIMER =
  'Sou o PERFORMA Coach (especialista em periodização, musculação e suporte ao aluno). Não substituo médico/fisioterapeuta.';

function profileSummary(user?: UserProfile | null): string {
  if (!user) return 'Perfil ainda incompleto.';
  const bits = [
    `${user.name.split(' ')[0] ?? 'Aluno'}`,
    `${user.age} anos`,
    `objetivo ${user.goal}`,
    `experiência ${user.experience}`,
    `${user.trainingDaysPerWeek}x/semana`,
    `${user.sessionDurationMin} min`,
    user.environment,
  ];
  if (user.preparationMode && user.competitionName) {
    bits.push(
      `modo preparação: ${user.preparationSport ?? 'esporte'} → ${user.competitionName} em ${user.competitionDate}`,
    );
  }
  if (user.dietInterest) bits.push(`dieta: ${user.dietInterest}`);
  return bits.join(' · ');
}

function sourceLabels(chunks: { source: string; title: string }[]): string[] {
  const titles = new Set<string>();
  for (const chunk of chunks) {
    const known = knowledgeSources.find((s) => s.id === chunk.source);
    titles.add(known?.title ?? chunk.title);
  }
  return [...titles];
}

function synthesizeFromChunks(question: string, chunkTexts: string[], user?: UserProfile | null): string {
  const q = question.toLowerCase();
  const name = user?.name?.split(' ')[0] ?? 'Aluno';
  const joined = chunkTexts.join('\n\n').slice(0, 3500);

  if (q.includes('periodiz') || q.includes('mesociclo') || q.includes('macrociclo') || q.includes('prepar')) {
    const plan = user?.periodization;
    const planLine = plan
      ? `Sua periodização atual: ${plan.totalWeeks} semanas para ${plan.competitionName} (${plan.sport}). Fases: ${plan.phases
          .map((p) => `${p.name} ${p.weeks}sem`)
          .join(' → ')}.`
      : 'Você ainda não tem periodização ativa — ative o modo preparação com esporte, prova e data.';
    return [
      `${name}, vamos organizar a periodização com base em evidências e no seu calendário.`,
      planLine,
      '',
      'Diretrizes do Coach:',
      '• Base/acumulação: volume e técnica, intensidade controlada.',
      '• Construção/intensificação: sobe carga e especificidade, volume mais seletivo.',
      '• Pico + taper: corta fadiga (volume ↓), mantém sharpness técnico.',
      '• Semana da prova: ativações leves e recuperação.',
      '',
      'Fundamentos recuperados da base de conhecimento:',
      summarizeBullets(joined, 4),
      '',
      DISCLAIMER,
    ].join('\n');
  }

  if (q.includes('hipertrof') || q.includes('massa') || q.includes('volume') || q.includes('serie') || q.includes('série')) {
    return [
      `${name}, para hipertrofia o Coach prioriza tensão mecânica + volume semanal recuperável.`,
      `No seu perfil: ${user?.trainingDaysPerWeek ?? 4} sessões/semana, ${user?.sessionDurationMin ?? 60} min, experiência ${user?.experience ?? 'a definir'}.`,
      '',
      'Aplicação prática:',
      '• 6–20 reps com 0–3 RIR na maioria das séries duras.',
      '• Frequência ~2×/músculo quando possível.',
      '• Progrida carga ou reps a cada microciclo; deload quando a fadiga subir.',
      '• Compostos na base + isoladores para fechar volume.',
      '',
      'Base científica/estudos carregados:',
      summarizeBullets(joined, 4),
      '',
      DISCLAIMER,
    ].join('\n');
  }

  if (q.includes('forca') || q.includes('força') || q.includes('1rm') || q.includes('potenc')) {
    return [
      `${name}, bloco de força/potência pede técnica limpa e recuperação entre séries.`,
      '• Força: ≥80% 1RM, poucas reps, descanso 2–5 min, buffer técnico.',
      '• Potência: intenção máxima de aceleração, qualidade > fadiga.',
      '• Perto da prova: preserve específicos e reduza acessórios exaustivos.',
      '',
      summarizeBullets(joined, 3),
      '',
      DISCLAIMER,
    ].join('\n');
  }

  if (
    q.includes('dor') ||
    q.includes('lesao') ||
    q.includes('lesão') ||
    q.includes('fisioterap') ||
    q.includes('postura')
  ) {
    return [
      `${name}, segurança primeiro.`,
      '• Dor aguda intensa, irradiada, inchaço ou perda de força → pare e busque avaliação profissional.',
      '• DOMS (24–72h) é diferente de dor articular/aguda.',
      '• Ajuste amplitude, volume e escolha de exercício antes de “forçar por cima da dor”.',
      '• Core/anti-rotação e mobilidade de tórax/quadril ajudam a qualidade do movimento.',
      '',
      summarizeBullets(joined, 3),
      '',
      DISCLAIMER,
    ].join('\n');
  }

  if (q.includes('dieta') || q.includes('proteina') || q.includes('proteína') || q.includes('calor')) {
    return [
      `${name}, nutrição sustenta a periodização — não compete com ela.`,
      '• Proteína frequentemente em faixas ~1,6–2,2 g/kg (individualizar).',
      '• Superávit moderado para massa; déficit moderado para definição.',
      '• Carboidrato perto do treino ajuda performance; sono é parte do programa.',
      user?.dietBuilderUnlocked
        ? 'Sua montagem de dieta está desbloqueada na aba Nutrição.'
        : 'Se quiser, libere a montagem de dieta na aba Nutrição.',
      '',
      summarizeBullets(joined, 3),
      '',
      DISCLAIMER,
    ].join('\n');
  }

  if (q.includes('casa') || q.includes('corpo livre') || q.includes('hiit') || q.includes('sem academia')) {
    return [
      `${name}, treino em casa funciona com progressão de alavanca, unilateralidade e densidade.`,
      '• Empurrar/puxar/agachar/hinge/core mesmo sem equipamentos.',
      '• HIIT melhora conditioning; hipertrofia ainda precisa de sobrecarga progressiva.',
      '• Rotinas curtas de postura/mobilidade diárias > sessões longas irregulares.',
      '',
      summarizeBullets(joined, 3),
      '',
      DISCLAIMER,
    ].join('\n');
  }

  return [
    `${name}, aqui vai uma orientação do PERFORMA Coach com base no seu perfil e na literatura carregada.`,
    `Perfil: ${profileSummary(user)}`,
    '',
    'Posso ajudar a montar periodização, ajustar volume/intensidade, trocar exercícios, prevenir erros técnicos e alinhar dieta ao treino.',
    'Pergunte de forma específica, por exemplo: “Monte a periodização para minha prova”, “Como subir volume de peito sem dor no ombro?”, “Como fazer taper em 10 dias?”.',
    '',
    'Trechos relevantes da base:',
    summarizeBullets(joined, 4),
    '',
    DISCLAIMER,
  ].join('\n');
}

function summarizeBullets(text: string, max = 4): string {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 40 && s.length < 260);
  const unique: string[] = [];
  for (const s of sentences) {
    if (unique.length >= max) break;
    if (!unique.some((u) => u.slice(0, 40) === s.slice(0, 40))) unique.push(s);
  }
  if (unique.length === 0) {
    return '• Princípios-chave: especificidade, sobrecarga progressiva, recuperação e individualização.';
  }
  return unique.map((s) => `• ${s}`).join('\n');
}

function buildRetrieval(question: string, context: CoachContext) {
  const enrichedQuery = [
    question,
    context.user?.goal,
    context.user?.preparationSport,
    context.user?.preparationMode ? 'periodization preparation sport' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const chunks = retrieveKnowledge(enrichedQuery, 8);
  const texts = chunks.map((c) => `[${c.title}] ${c.content}`);
  return { chunks, texts };
}

function systemPromptForCloud(user?: UserProfile | null): string {
  return [
    'Você é o PERFORMA Coach, especialista em educação física, fisioterapia esportiva, musculação e periodização.',
    'Responda em português do Brasil, de forma prática e segura.',
    'Use PRIORITARIAMENTE o contexto científico fornecido (RAG). Se faltar dado do aluno, peça ou declare premissa.',
    'Não diagnostique doenças nem substitua médico/fisioterapeuta.',
    'Estruture com bullets curtos quando útil. Inclua aplicação prática ao perfil do aluno.',
    `Perfil do aluno: ${profileSummary(user)}`,
  ].join('\n');
}

/** Resposta local (RAG + templates) — funciona sem API. */
export function coachAnswerLocal(question: string, context: CoachContext = {}): CoachAnswer {
  const { chunks, texts } = buildRetrieval(question, context);
  return {
    content: synthesizeFromChunks(question, texts, context.user),
    sources: sourceLabels(chunks),
    provider: 'local',
  };
}

/** Compat síncrona. */
export function coachAnswer(question: string, context: CoachContext = {}): CoachAnswer {
  return coachAnswerLocal(question, context);
}

/**
 * Resposta do agente interno + contexto RAG, com fallback local.
 */
export async function coachAnswerAsync(
  question: string,
  context: CoachContext = {},
): Promise<CoachAnswer> {
  const { chunks, texts } = buildRetrieval(question, context);
  const sources = sourceLabels(chunks);
  const preferCloud = context.preferCloud !== false;

  if (preferCloud) {
    const knowledgeBlock = texts
      .map((t, i) => `(${i + 1}) ${t}`)
      .join('\n\n')
      .slice(0, 9000);

    const cloud = await openRouterChat({
      messages: [
        { role: 'system', content: systemPromptForCloud(context.user) },
        {
          role: 'user',
          content: [
            'CONTEXTO CIENTÍFICO (use como base):',
            knowledgeBlock,
            '',
            `PERGUNTA DO ALUNO: ${question}`,
            '',
            'Responda como assistente PERFORMA, sem mencionar modelo, API, RAG ou configuração interna.',
          ].join('\n'),
        },
      ],
    });

    if (cloud.ok) {
      return {
        content: `${cloud.content}\n\n${DISCLAIMER}`,
        sources,
        provider: 'openrouter',
        model: cloud.model,
      };
    }

    const local = coachAnswerLocal(question, context);
    return {
      ...local,
    };
  }

  return coachAnswerLocal(question, context);
}

/** Periodização enriquecida com notas do Coach a partir da base de conhecimento. */
export function coachBuildPeriodization(input: {
  sport: string;
  competitionName: string;
  competitionDate: string;
  user?: UserProfile | null;
}): CoachPeriodizationResult {
  const plan = buildPeriodization(input);
  const chunks = retrieveKnowledge(
    `periodization ${input.sport} taper peak volume intensity ${input.competitionName}`,
    5,
  );

  const coachNotes = [
    `Plano gerado para ${input.sport} → ${input.competitionName} (${plan.totalWeeks} semanas).`,
    'Distribuição baseada em modelos de periodização (linear/blocos) adaptados ao tempo de prova.',
    ...chunks
      .slice(0, 3)
      .map((c) => c.content.split(/(?<=[.!?])\s+/)[0]?.slice(0, 180))
      .filter((n): n is string => Boolean(n)),
    'Ajuste semanal conforme RPE, sono e dor. Em sinal de alerta clínico, procure profissional.',
  ];

  const sport = input.sport.toLowerCase();
  plan.phases = plan.phases.map((phase) => {
    const extra: string[] = [];
    if (sport.includes('corr') || sport.includes('marat') || sport.includes('triathlon')) {
      if (phase.kind === 'base') extra.push('Priorize volume aeróbio de baixa intensidade e força de suporte.');
      if (phase.kind === 'taper') extra.push('Reduza quilometragem mantendo alguns trechos em ritmo de prova.');
    } else if (sport.includes('jiu') || sport.includes('luta') || sport.includes('boxe')) {
      if (phase.kind === 'intensification') extra.push('Inclua potência e densidades específicas de combate.');
      if (phase.kind === 'competition') extra.push('Faça apenas ativações e gestão de peso/rotina.');
    } else if (sport.includes('muscul') || sport.includes('body')) {
      if (phase.kind === 'build') extra.push('Suba volume regional com 0–3 RIR e frequência ≥2×/músculo.');
      if (phase.kind === 'peak') extra.push('Preserve densidade estética e conditioning leve.');
    } else if (sport.includes('cross')) {
      if (phase.kind === 'build') extra.push('Equilibre força nos básicos com metcons controlados.');
    }
    return { ...phase, notes: [...phase.notes, ...extra] };
  });

  return { ...plan, coachNotes };
}

export type { ExerciseLoadCoachPlan, SetLoadDecision };

type DecideLoadsInput = {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: number;
  fallbackWeightKg: number;
  /** Séries do último treino deste exercício */
  lastSets: { setNumber: number; weightKg: number; reps: number }[];
  /** Histórico recente (mais novo → mais antigo), opcional */
  recentSessions?: { sets: { setNumber: number; weightKg: number; reps: number }[] }[];
  user?: UserProfile | null;
};

function roundToStep(kg: number, step = 0.25) {
  return Math.round(kg / step) * step;
}

function progressionStepKg(user: UserProfile | null | undefined, weightKg: number): number {
  const experience = user?.experience ?? 'beginner';
  const goal = user?.goal ?? 'gain_muscle';

  let step = experience === 'beginner' ? 1.25 : 2.5;
  // Cargas leves (halteres/isoladores): passos menores
  if (weightKg > 0 && weightKg < 20) step = 1.25;
  if (weightKg >= 100 && experience === 'advanced') step = 2.5;

  if (goal === 'lose_fat' || goal === 'health' || goal === 'maintain') {
    step = Math.min(step, 1.25);
  }
  if (goal === 'conditioning') {
    step = Math.min(step, 1.25);
  }
  return step;
}

function isConservativePhase(user?: UserProfile | null): boolean {
  if (!user?.preparationMode || !user.competitionDate) return false;
  const diffMs = new Date(user.competitionDate).getTime() - Date.now();
  const weeksLeft = diffMs / (7 * 24 * 60 * 60 * 1000);
  return weeksLeft <= 3;
}

/**
 * Agente Coach decide a carga de cada série para o próximo treino,
 * individualmente com base no perfil + histórico do aluno.
 */
export function coachDecideSetLoads(input: DecideLoadsInput): ExerciseLoadCoachPlan {
  const user = input.user ?? null;
  const name = user?.name?.split(' ')[0] ?? 'Aluno';
  const experience = user?.experience ?? 'beginner';
  const goal = user?.goal ?? 'gain_muscle';
  const conservative = isConservativePhase(user);
  const stepBase = progressionStepKg(user, input.fallbackWeightKg);

  const decisions: SetLoadDecision[] = [];

  for (let setNumber = 1; setNumber <= input.targetSets; setNumber++) {
    const last =
      input.lastSets.find((s) => s.setNumber === setNumber) ??
      input.lastSets[input.lastSets.length - 1];

    if (!last) {
      const startKg = roundToStep(input.fallbackWeightKg);
      decisions.push({
        setNumber,
        previousWeightKg: null,
        suggestedWeightKg: startKg,
        deltaKg: 0,
        action: 'start',
        rationale: `${name}, sem histórico nesta série — comece em ${startKg} kg e anote o resultado.`,
      });
      continue;
    }

    const hitTarget = last.reps >= input.targetReps;
    const crushed = last.reps >= input.targetReps + 2;
    const missedHard = last.reps <= Math.max(1, Math.floor(input.targetReps * 0.7));
    const missedSoft = last.reps < input.targetReps;

    let action: SetLoadDecision['action'] = 'hold';
    let delta = 0;
    let rationale = '';

    if (conservative) {
      action = 'hold';
      delta = 0;
      rationale = `Fase de preparação/pico — mantenha ${last.weightKg} kg e priorize qualidade técnica.`;
    } else if (missedHard) {
      action = 'decrease';
      delta = -progressionStepKg(user, last.weightKg);
      rationale = `Série ${setNumber}: só ${last.reps}/${input.targetReps} reps a ${last.weightKg} kg — reduza ${Math.abs(delta)} kg para recuperar a faixa.`;
    } else if (missedSoft) {
      action = 'hold';
      delta = 0;
      rationale = `Série ${setNumber}: ${last.reps}/${input.targetReps} reps — mantenha ${last.weightKg} kg até fechar as reps.`;
    } else if (crushed && experience !== 'beginner') {
      action = 'increase';
      delta = progressionStepKg(user, last.weightKg);
      // Hipertrofia/definição: pode ser um pouco mais agressivo em compostos pesados
      if ((goal === 'gain_muscle' || goal === 'definition') && last.weightKg >= 40) {
        delta = progressionStepKg(user, last.weightKg);
      }
      rationale = `Série ${setNumber}: fechou ${last.reps} reps com folga a ${last.weightKg} kg — aumente +${delta} kg.`;
    } else if (hitTarget) {
      if (experience === 'beginner' && setNumber > 1) {
        // Iniciante: sobe só na 1ª série se o restante também foi ok; senão segura
        const allHit = input.lastSets.every((s) => s.reps >= input.targetReps);
        if (allHit && setNumber === 1) {
          action = 'increase';
          delta = stepBase;
          rationale = `Perfil iniciante: todas as séries bateram as reps — suba +${delta} kg com cautela.`;
        } else if (allHit) {
          action = 'increase';
          delta = stepBase;
          rationale = `Série ${setNumber}: reps ok no último treino — progressão +${delta} kg.`;
        } else {
          action = 'hold';
          delta = 0;
          rationale = `Iniciante: estabilize a técnica em ${last.weightKg} kg antes de subir.`;
        }
      } else {
        action = 'increase';
        delta = progressionStepKg(user, last.weightKg);
        const goalHint =
          goal === 'gain_muscle'
            ? 'foco em hipertrofia'
            : goal === 'lose_fat'
              ? 'progressão conservadora (emagrecimento)'
              : `objetivo ${goal}`;
        rationale = `Série ${setNumber}: ${last.reps}/${input.targetReps} a ${last.weightKg} kg · ${experience} · ${goalHint} → +${delta} kg.`;
      }
    } else {
      action = 'hold';
      delta = 0;
      rationale = `Mantenha ${last.weightKg} kg nesta série.`;
    }

    // Tendência: se as últimas 2 sessões já aumentaram e as reps caíram, segura
    if (action === 'increase' && input.recentSessions && input.recentSessions.length >= 2) {
      const [newest, older] = input.recentSessions;
      const n = newest?.sets.find((s) => s.setNumber === setNumber);
      const o = older?.sets.find((s) => s.setNumber === setNumber);
      if (n && o && n.weightKg > o.weightKg && n.reps < o.reps && n.reps < input.targetReps) {
        action = 'hold';
        delta = 0;
        rationale = `Carga já subiu e as reps caíram — estabilize em ${last.weightKg} kg.`;
      }
    }

    const suggested = roundToStep(Math.max(0, last.weightKg + delta));
    decisions.push({
      setNumber,
      previousWeightKg: last.weightKg,
      suggestedWeightKg: suggested,
      deltaKg: roundToStep(suggested - last.weightKg),
      action,
      rationale,
    });
  }

  const increases = decisions.filter((d) => d.action === 'increase').length;
  const decreases = decisions.filter((d) => d.action === 'decrease').length;
  let summary: string;
  if (!input.lastSets.length) {
    summary = `Coach: primeira referência para ${input.exerciseName}. Anote as cargas para eu ajustar nas próximas.`;
  } else if (increases > 0 && decreases === 0) {
    summary = `Coach: progresso liberado em ${increases} série(s) de ${input.exerciseName}.`;
  } else if (decreases > 0) {
    summary = `Coach: ajuste para baixo em ${decreases} série(s) — priorize a faixa de reps.`;
  } else {
    summary = `Coach: mantenha as cargas de ${input.exerciseName} nesta sessão.`;
  }

  // Enriquecer summary com conhecimento (opcional, curto)
  const chunks = retrieveKnowledge(
    `progressive overload ${experience} ${goal} load progression`,
    1,
  );
  const tip = chunks[0]?.content.split(/(?<=[.!?])\s+/)[0]?.slice(0, 120);
  if (tip && input.lastSets.length > 0) {
    summary = `${summary} ${tip}`;
  }

  return {
    exerciseId: input.exerciseId,
    sets: decisions,
    summary,
    provider: 'coach-local',
  };
}

/**
 * Decide cargas de todos os exercícios do treino para o usuário atual.
 */
export function coachDecideWorkoutLoads(input: {
  exercises: {
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    fallbackWeightKg: number;
    lastSets: { setNumber: number; weightKg: number; reps: number }[];
    recentSessions?: { sets: { setNumber: number; weightKg: number; reps: number }[] }[];
  }[];
  user?: UserProfile | null;
}): Record<string, ExerciseLoadCoachPlan> {
  const out: Record<string, ExerciseLoadCoachPlan> = {};
  for (const ex of input.exercises) {
    out[ex.exerciseId] = coachDecideSetLoads({
      ...ex,
      targetSets: ex.sets,
      targetReps: ex.reps,
      user: input.user,
    });
  }
  return out;
}

export function coachSuggestedPrompts(user?: UserProfile | null): string[] {
  const base = [
    'Como montar minha periodização até a prova?',
    'Quanto volume semanal de hipertrofia faz sentido para mim?',
    'Como fazer o taper sem perder força?',
    'O que ajustar se eu sentir dor no ombro no treino de peito?',
  ];
  if (user?.preparationMode) {
    return [
      `Revise minha periodização para ${user.competitionName ?? 'minha prova'}`,
      'Estou na fase certa para o tempo que falta?',
      ...base.slice(1),
    ];
  }
  return base;
}

export function listCoachSources(): string[] {
  return knowledgeSources.map((s) => s.title);
}

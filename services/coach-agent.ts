import { retrieveKnowledge, knowledgeSources } from '@/data/knowledge';
import { buildPeriodization } from '@/lib/periodization';
import type { PeriodizationPlan, UserProfile } from '@/types';

export type CoachContext = {
  user?: UserProfile | null;
  hasDietPlan?: boolean;
};

export type CoachAnswer = {
  content: string;
  sources: string[];
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

/** Resposta do agente especialista (RAG local sobre cânone + estudos). */
export function coachAnswer(question: string, context: CoachContext = {}): CoachAnswer {
  const enrichedQuery = [
    question,
    context.user?.goal,
    context.user?.preparationSport,
    context.user?.preparationMode ? 'periodization preparation sport' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const chunks = retrieveKnowledge(enrichedQuery, 6);
  const texts = chunks.map((c) => `[${c.title}] ${c.content}`);
  return {
    content: synthesizeFromChunks(question, texts, context.user),
    sources: sourceLabels(chunks),
  };
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

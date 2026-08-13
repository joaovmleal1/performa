import type { PeriodizationPhase, PeriodizationPhaseKind, PeriodizationPlan } from '@/types';

const PHASE_COPY: Record<
  PeriodizationPhaseKind,
  { name: string; focus: string; volume: PeriodizationPhase['volume']; intensity: PeriodizationPhase['intensity']; notes: string[] }
> = {
  base: {
    name: 'Base / Acumulação',
    focus: 'Volume aeróbio/geral, técnica e capacidade de trabalho',
    volume: 'high',
    intensity: 'low',
    notes: [
      'Priorize consistência e qualidade do movimento',
      'Inclua mobilidade e prevenção de lesões',
      'Cargas moderadas com muitas séries controladas',
    ],
  },
  build: {
    name: 'Construção',
    focus: 'Força estrutural e hipertrofia específica do esporte',
    volume: 'high',
    intensity: 'moderate',
    notes: [
      'Aumente progressivamente a carga nos básicos',
      'Mantenha acessórios para equilibrar assimetrias',
      'Monitore recuperação e sono',
    ],
  },
  intensification: {
    name: 'Intensificação',
    focus: 'Força máxima e potência mais próximas do gesto esportivo',
    volume: 'moderate',
    intensity: 'high',
    notes: [
      'Reduza volume e aumente intensidade',
      'Inclua trabalhos de potência e especificidade',
      'Evite fadiga residual excessiva perto da prova',
    ],
  },
  peak: {
    name: 'Pico',
    focus: 'Afinação da performance e transferência para a competição',
    volume: 'low',
    intensity: 'high',
    notes: [
      'Poucos estímulos, alta qualidade',
      'Ensaios técnicos e estratégias de prova',
      'Nutrição e peso sob controle',
    ],
  },
  taper: {
    name: 'Polimento (Taper)',
    focus: 'Redução de fadiga mantendo o sharpness',
    volume: 'low',
    intensity: 'moderate',
    notes: [
      'Corte volume em 40–60%',
      'Mantenha alguns estímulos rápidos/intensos curtos',
      'Priorize sono, hidratação e rotina pré-prova',
    ],
  },
  competition: {
    name: 'Semana da competição',
    focus: 'Execução, recuperação e estratégia do dia',
    volume: 'low',
    intensity: 'low',
    notes: [
      'Ativações leves e mobilidade',
      'Sem sessões exaustivas',
      'Foque em rotina, alimentação e mentalidade',
    ],
  },
};

function weeksUntil(dateIso: string, from = new Date()): number {
  const target = new Date(`${dateIso}T12:00:00`);
  const diffMs = target.getTime() - from.getTime();
  const weeks = Math.ceil(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(1, weeks);
}

function allocatePhases(totalWeeks: number): { kind: PeriodizationPhaseKind; weeks: number }[] {
  if (totalWeeks >= 16) {
    return [
      { kind: 'base', weeks: 4 },
      { kind: 'build', weeks: Math.max(3, totalWeeks - 14) },
      { kind: 'intensification', weeks: 4 },
      { kind: 'peak', weeks: 2 },
      { kind: 'taper', weeks: 1 },
      { kind: 'competition', weeks: 1 },
    ];
  }
  if (totalWeeks >= 10) {
    return [
      { kind: 'build', weeks: Math.max(2, totalWeeks - 8) },
      { kind: 'intensification', weeks: 3 },
      { kind: 'peak', weeks: 2 },
      { kind: 'taper', weeks: 1 },
      { kind: 'competition', weeks: 1 },
    ];
  }
  if (totalWeeks >= 6) {
    return [
      { kind: 'intensification', weeks: Math.max(2, totalWeeks - 4) },
      { kind: 'peak', weeks: 2 },
      { kind: 'taper', weeks: 1 },
      { kind: 'competition', weeks: 1 },
    ];
  }
  if (totalWeeks >= 3) {
    return [
      { kind: 'peak', weeks: Math.max(1, totalWeeks - 2) },
      { kind: 'taper', weeks: 1 },
      { kind: 'competition', weeks: 1 },
    ];
  }
  return [{ kind: 'competition', weeks: totalWeeks }];
}

export function buildPeriodization(input: {
  sport: string;
  competitionName: string;
  competitionDate: string;
}): PeriodizationPlan {
  const totalWeeks = weeksUntil(input.competitionDate);
  const allocation = allocatePhases(totalWeeks);
  const sum = allocation.reduce((acc, item) => acc + item.weeks, 0);
  if (sum !== totalWeeks && allocation.length > 1) {
    allocation[0] = {
      ...allocation[0],
      weeks: Math.max(1, allocation[0].weeks + (totalWeeks - sum)),
    };
  }

  const phases: PeriodizationPhase[] = allocation.map((item, index) => {
    const copy = PHASE_COPY[item.kind];
    return {
      id: `phase_${index + 1}_${item.kind}`,
      kind: item.kind,
      name: copy.name,
      weeks: item.weeks,
      focus: copy.focus,
      volume: copy.volume,
      intensity: copy.intensity,
      notes: copy.notes,
    };
  });

  return {
    id: `periodization_${Date.now()}`,
    sport: input.sport.trim(),
    competitionName: input.competitionName.trim(),
    competitionDate: input.competitionDate,
    totalWeeks,
    phases,
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

export const phaseKindLabels: Record<PeriodizationPhaseKind, string> = {
  base: 'Base',
  build: 'Construção',
  intensification: 'Intensificação',
  peak: 'Pico',
  taper: 'Polimento',
  competition: 'Competição',
};

export const loadLabels = {
  low: 'Baixa',
  moderate: 'Moderada',
  high: 'Alta',
} as const;

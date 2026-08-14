import type { MuscleGroup } from '@/types';

import catalogJson from './catalog.json';

export type FormType = 'both' | 'correct' | 'incorrect' | 'guide';

export type FormMuscleGroup = MuscleGroup | 'full_body';

export interface FormLesson {
  id: string;
  number: number;
  name: string;
  formType: FormType;
  muscleGroup: FormMuscleGroup;
  doTips: string[];
  dontTips: string[];
  summary: string;
  driveFileId: string;
  videoUrl: string;
  previewUrl: string;
  thumbnailUrl: string;
}

export const formCatalog = catalogJson as FormLesson[];

export const formTypeLabels: Record<FormType, string> = {
  both: 'Certo e errado',
  correct: 'Execução correta',
  incorrect: 'Erro comum',
  guide: 'Guia de técnica',
};

export const formMuscleLabels: Record<FormMuscleGroup, string> = {
  chest: 'Peito',
  back: 'Costas',
  legs: 'Pernas',
  shoulders: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  glutes: 'Glúteos',
  abs: 'Abdômen',
  cardio: 'Cardio',
  full_body: 'Corpo todo',
};

const byId = new Map(formCatalog.map((lesson) => [lesson.id, lesson]));

export function resolveFormLesson(id: string | undefined | null): FormLesson | undefined {
  if (!id) return undefined;
  return byId.get(id);
}

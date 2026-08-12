import type { Exercise } from '@/types';

import catalogJson from './catalog.json';
import aliasesJson from './legacy-aliases.json';

const catalog = catalogJson as Exercise[];
const legacyAliases = aliasesJson as Record<string, string>;

/** Full exercise library sourced from the Drive GIF pack (~700 exercises). */
export const exerciseCatalog: Exercise[] = catalog;

const byId = new Map(exerciseCatalog.map((exercise) => [exercise.id, exercise]));

/** Resolve an exercise by catalog id or legacy mock id (ex_bench, etc.). */
export function resolveExercise(id: string | undefined | null): Exercise | undefined {
  if (!id) return undefined;
  const direct = byId.get(id);
  if (direct) return direct;
  const aliased = legacyAliases[id];
  return aliased ? byId.get(aliased) : undefined;
}

export function getExerciseGifUrl(exercise: Pick<Exercise, 'gifUrl' | 'driveFileId'>): string | undefined {
  if (exercise.gifUrl) return exercise.gifUrl;
  if (exercise.driveFileId) {
    return `https://lh3.googleusercontent.com/d/${exercise.driveFileId}`;
  }
  return undefined;
}

export { legacyAliases };

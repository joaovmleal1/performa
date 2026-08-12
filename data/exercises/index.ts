import Constants from 'expo-constants';
import { Platform } from 'react-native';

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

function metroOrigin(): string | undefined {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as { manifest?: { debuggerHost?: string } }).manifest?.debuggerHost;

  if (!hostUri || typeof hostUri !== 'string') return undefined;
  const host = hostUri.split(':')[0];
  if (!host) return undefined;
  return `http://${host}:8081`;
}

function driveUrl(exercise: Pick<Exercise, 'gifUrl' | 'driveFileId'>): string | undefined {
  if (exercise.gifUrl) return exercise.gifUrl;
  if (exercise.driveFileId) {
    return `https://lh3.googleusercontent.com/d/${exercise.driveFileId}`;
  }
  return undefined;
}

function isProductionWeb(): boolean {
  if (Platform.OS !== 'web') return false;
  // Vercel / static hosting — no local public/exercises pack
  if (typeof process !== 'undefined' && process.env?.VERCEL) return true;
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return true;
  return false;
}

/**
 * Prefer locally downloaded media from `public/exercises/` in local/dev,
 * and Google Drive URLs in production (Vercel).
 */
export function getExerciseGifUrl(
  exercise: Pick<Exercise, 'id' | 'gifUrl' | 'driveFileId'>
): string | undefined {
  const remote = driveUrl(exercise);
  if (isProductionWeb()) {
    return remote;
  }

  const localPath = `/exercises/${exercise.id}.gif`;

  if (Platform.OS === 'web') {
    return localPath;
  }

  const origin = metroOrigin();
  if (origin) {
    return `${origin}${localPath}`;
  }

  return remote;
}

export { legacyAliases };

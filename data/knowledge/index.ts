import studiesJson from './studies-chunks.json';
import { expertCanon, type KnowledgeChunk } from './expert-canon';

export type { KnowledgeChunk };

const studyChunks = studiesJson as KnowledgeChunk[];

/** Corpus completo: cânone científico + estudos carregados (Brunaccioni + Fisico Spartano). */
export const knowledgeCorpus: KnowledgeChunk[] = [...expertCanon, ...studyChunks];

export const knowledgeSources = [
  {
    id: 'brunaccioni_massa_muscolare',
    title: 'Guida Completa Massa Muscolare — Massimo Brunaccioni (V Athlete / InVictus)',
    origin: 'drive:1QtR0izdj0ffYCFSkTp9i63A6QJZFXUCW',
  },
  {
    id: 'fisico_spartano_casa',
    title: 'Allenamento a Casa — Fisico Spartano (via Dhoze / postura & corpo livre)',
    origin: 'dhoze:3d3d548f-3f82-42ca-b8dd-bea237ddecf5',
  },
  {
    id: 'canon_ef',
    title: 'Cânone PERFORMA — educação física, musculação e fisioterapia esportiva',
    origin: 'internal_canon',
  },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9à-ü\s]/gi, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

/** Recuperação lexical simples (TF overlap + boost por tags). */
export function retrieveKnowledge(query: string, limit = 6): KnowledgeChunk[] {
  const qTokens = new Set(tokenize(query));
  if (qTokens.size === 0) return expertCanon.slice(0, limit);

  const scored = knowledgeCorpus.map((chunk) => {
    const contentTokens = tokenize(`${chunk.title} ${chunk.content} ${chunk.tags.join(' ')}`);
    let score = 0;
    for (const token of contentTokens) {
      if (qTokens.has(token)) score += 1;
    }
    for (const tag of chunk.tags) {
      if (query.toLowerCase().includes(tag) || [...qTokens].some((t) => tag.includes(t))) {
        score += 2;
      }
    }
    // leve prioridade ao cânone para respostas estáveis
    if (chunk.source.startsWith('canon')) score += 0.5;
    return { chunk, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.chunk);
}

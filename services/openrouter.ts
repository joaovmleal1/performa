/** Cliente do agente interno. A chave fica apenas no servidor. */
export const AGENT_API_URL =
  typeof window !== 'undefined'
    ? '/api/coach'
    : 'https://performa-xi.vercel.app/api/coach';

/** Modelo padrão do agente interno. */
export const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-4o-mini';

export type OpenRouterMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type OpenRouterResult =
  | { ok: true; content: string; model: string }
  | { ok: false; error: string };

export async function openRouterChat(params: {
  messages: OpenRouterMessage[];
}): Promise<OpenRouterResult> {
  try {
    const res = await fetch(AGENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: params.messages,
      }),
    });

    const data = (await res.json()) as {
      content?: string;
      error?: string;
    };

    if (!res.ok) {
      return {
        ok: false,
        error: data.error ?? `Agente HTTP ${res.status}`,
      };
    }

    const content = data.content?.trim();
    if (!content) {
      return { ok: false, error: 'Resposta vazia do modelo.' };
    }

    return { ok: true, content, model: DEFAULT_OPENROUTER_MODEL };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Falha de rede no agente.',
    };
  }
}

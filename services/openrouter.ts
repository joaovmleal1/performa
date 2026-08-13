/**
 * Cliente OpenRouter (OpenAI-compatible).
 * @see https://openrouter.ai/docs/quickstart
 */

export const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/** Modelo padrão: barato, rápido e bom para coaching. Troque no settings. */
export const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-4o-mini';

export const OPENROUTER_MODEL_OPTIONS = [
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (rápido)' },
  { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash' },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat' },
] as const;

export type OpenRouterMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type OpenRouterResult =
  | { ok: true; content: string; model: string }
  | { ok: false; error: string };

export async function openRouterChat(params: {
  apiKey: string;
  model?: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  maxTokens?: number;
}): Promise<OpenRouterResult> {
  const model = params.model?.trim() || DEFAULT_OPENROUTER_MODEL;
  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://performa-xi.vercel.app',
        'X-OpenRouter-Title': 'PERFORMA Coach',
      },
      body: JSON.stringify({
        model,
        messages: params.messages,
        temperature: params.temperature ?? 0.4,
        max_tokens: params.maxTokens ?? 1200,
      }),
    });

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string };
      model?: string;
    };

    if (!res.ok) {
      return {
        ok: false,
        error: data.error?.message ?? `OpenRouter HTTP ${res.status}`,
      };
    }

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return { ok: false, error: 'Resposta vazia do modelo.' };
    }

    return { ok: true, content, model: data.model ?? model };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Falha de rede no OpenRouter.',
    };
  }
}

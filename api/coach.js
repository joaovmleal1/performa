const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Assistência temporariamente indisponível.' });
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages.slice(-12) : [];
  if (!messages.length) {
    return res.status(400).json({ error: 'Mensagem obrigatória.' });
  }

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://performa-xi.vercel.app',
        'X-OpenRouter-Title': 'PERFORMA',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 1200,
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(502).json({ error: 'Não foi possível responder agora.' });
    }

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return res.status(502).json({ error: 'Resposta vazia.' });
    }

    return res.status(200).json({ content });
  } catch {
    return res.status(502).json({ error: 'Falha temporária de conexão.' });
  }
}

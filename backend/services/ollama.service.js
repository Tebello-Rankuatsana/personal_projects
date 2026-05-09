import 'dotenv/config';

const BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'mistral';
const DEFAULT_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';

/**
 * Send a prompt to Ollama and get a text response.
 *
 * @param {string} prompt
 * @param {string} model  - Ollama model name (default: mistral)
 * @returns {Promise<string>}
 */
export async function generate(prompt, model = DEFAULT_MODEL) {
  const url = `${BASE_URL}/api/generate`;

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    });
  } catch (err) {
    throw new Error(
      `[ollama] Cannot reach Ollama at ${BASE_URL}. Is it running? (${err.message})`
    );
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[ollama] generate failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.response?.trim() ?? '';
}

/**
 * Generate a vector embedding for a piece of text.
 *
 * @param {string} text
 * @param {string} model  - Ollama embedding model (default: nomic-embed-text)
 * @returns {Promise<number[]>}
 */
export async function embed(text, model = DEFAULT_EMBED_MODEL) {
  const url = `${BASE_URL}/api/embeddings`;

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: text }),
    });
  } catch (err) {
    throw new Error(
      `[ollama] Cannot reach Ollama at ${BASE_URL}. Is it running? (${err.message})`
    );
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[ollama] embed failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  if (!Array.isArray(data.embedding)) {
    throw new Error('[ollama] Unexpected embedding response format');
  }

  return data.embedding;
}

/**
 * Check if Ollama is reachable and return the list of local models.
 * @returns {Promise<string[]>}
 */
export async function listModels() {
  try {
    const res = await fetch(`${BASE_URL}/api/tags`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models ?? []).map(m => m.name);
  } catch {
    return [];
  }
}

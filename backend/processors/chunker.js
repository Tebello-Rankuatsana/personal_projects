/**
 * chunker.js
 * Splits long text into overlapping word-based chunks suitable for embedding.
 *
 * Target: 500–700 words per chunk with ~50-word overlap.
 * Overlap prevents context being cut mid-concept at chunk boundaries.
 */

const CHUNK_SIZE = 600;   // target words per chunk
const OVERLAP = 50;       // words to repeat at start of next chunk

/**
 * Split text into an array of overlapping chunks.
 *
 * @param {string} text       - raw extracted document text
 * @param {number} chunkSize  - words per chunk (default 600)
 * @param {number} overlap    - overlap in words (default 50)
 * @returns {string[]}
 */
export function chunkText(text, chunkSize = CHUNK_SIZE, overlap = OVERLAP) {
  if (!text || typeof text !== 'string') return [];

  // Normalise whitespace — collapse runs of spaces/newlines into single spaces
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')  // collapse triple+ newlines to double
    .replace(/[ \t]+/g, ' ')     // collapse horizontal whitespace
    .trim();

  if (cleaned.length === 0) return [];

  const words = cleaned.split(' ');

  if (words.length <= chunkSize) {
    // Document fits in a single chunk
    return [cleaned];
  }

  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunk = words.slice(start, end).join(' ');
    chunks.push(chunk);

    if (end === words.length) break;

    // Step forward by (chunkSize - overlap) so the next chunk starts with
    // the last `overlap` words of the current chunk
    start += chunkSize - overlap;
  }

  return chunks;
}

/**
 * Estimate token count (rough heuristic: ~1.3 tokens per word).
 * Useful for sanity-checking before sending to LLM.
 */
export function estimateTokens(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.round(words * 1.3);
}

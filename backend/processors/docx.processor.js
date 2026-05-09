import mammoth from 'mammoth';
import { readFile } from 'fs/promises';

/**
 * Extract plain text from a DOCX file or buffer.
 *
 * @param {string|Buffer} input  - file path (string) or raw buffer
 * @returns {Promise<string>}    - extracted text
 */
export async function extractText(input) {
  let options;

  if (typeof input === 'string') {
    options = { path: input };
  } else if (Buffer.isBuffer(input)) {
    options = { buffer: input };
  } else {
    throw new Error('[docx-processor] input must be a file path string or Buffer');
  }

  const result = await mammoth.extractRawText(options);

  if (result.messages?.length > 0) {
    const warnings = result.messages.filter(m => m.type === 'warning');
    if (warnings.length > 0) {
      console.warn('[docx-processor] Warnings:', warnings.map(w => w.message).join('; '));
    }
  }

  const text = result.value
    .replace(/\r\n/g, '\n')
    .replace(/(\n\s*){3,}/g, '\n\n')
    .trim();

  return text;
}

/**
 * Extract structured HTML from DOCX — useful if you want to preserve
 * headings and formatting for future display features.
 *
 * @param {string|Buffer} input
 * @returns {Promise<string>}   - HTML string
 */
export async function extractHtml(input) {
  let options;

  if (typeof input === 'string') {
    options = { path: input };
  } else {
    options = { buffer: input };
  }

  const result = await mammoth.convertToHtml(options);
  return result.value;
}

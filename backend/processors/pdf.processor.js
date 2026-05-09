import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { readFile } from 'fs/promises';

/**
 * Extract plain text from a PDF file or buffer.
 *
 * @param {string|Buffer} input  - file path (string) or raw buffer
 * @returns {Promise<string>}    - extracted text
 */
export async function extractText(input) {
  let buffer;

  if (typeof input === 'string') {
    buffer = await readFile(input);
  } else if (Buffer.isBuffer(input)) {
    buffer = input;
  } else {
    throw new Error('[pdf-processor] input must be a file path string or Buffer');
  }

  const data = await pdfParse(buffer);

  const text = data.text
    .replace(/\r\n/g, '\n')
    .replace(/(\n\s*){3,}/g, '\n\n')  // collapse excess blank lines
    .trim();

  return text;
}

/**
 * Return PDF metadata (page count, info fields).
 * Useful for storing alongside the document record.
 */
export async function getMetadata(input) {
  let buffer;

  if (typeof input === 'string') {
    buffer = await readFile(input);
  } else {
    buffer = input;
  }

  const data = await pdfParse(buffer);

  return {
    pages: data.numpages,
    info: data.info ?? {},
  };
}

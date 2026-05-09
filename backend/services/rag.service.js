import { embed, generate } from './ollama.service.js';
import { queryChunks } from './chroma.service.js';

/**
 * Tutor personality prompt prefixes for each mode.
 */
const TUTOR_MODES = {
  default: `You are a knowledgeable and encouraging study tutor. 
Answer the student's question clearly and accurately using the provided context.
If the context doesn't contain enough information, say so honestly rather than guessing.`,

  explain: `You are a patient tutor who explains concepts simply.
Break down the answer into easy-to-understand language. Use analogies where helpful.
Avoid jargon unless you define it. Use the provided context to ground your explanation.`,

  lecturer: `You are a university lecturer giving a precise, academic answer.
Provide a thorough, well-structured response. Reference key concepts and definitions.
Use the provided context as your primary source material.`,

  step_by_step: `You are a tutor who teaches through worked examples.
Solve the problem or explain the concept step by step, numbering each step.
Show your reasoning at each stage. Use the provided context to stay accurate.`,

  exam_revision: `You are an exam revision tutor. Be concise and exam-focused.
Highlight key facts, formulas, and definitions the student needs to remember.
Structure your answer with bullet points for easy memorisation.
Use the provided context as your knowledge base.`,
};

/**
 * Core RAG pipeline: question → embed → retrieve → generate → return.
 *
 * @param {string} question
 * @param {string} subject     - ChromaDB collection name to search
 * @param {string} mode        - tutor mode key (default | explain | lecturer | step_by_step | exam_revision)
 * @returns {Promise<{ answer: string, sources: string[], mode: string }>}
 */
export async function askTutor(question, subject = 'default', mode = 'default') {
  // 1. Embed the question
  const queryEmbedding = await embed(question);

  // 2. Retrieve relevant chunks from ChromaDB
  const sources = await queryChunks(subject, queryEmbedding, 5);

  // 3. Build RAG prompt
  const tutorInstruction = TUTOR_MODES[mode] ?? TUTOR_MODES.default;
  const context = sources.length > 0
    ? sources.join('\n\n---\n\n')
    : 'No specific context was found in the uploaded documents.';

  const prompt = `${tutorInstruction}

=== STUDY MATERIAL CONTEXT ===
${context}
=== END OF CONTEXT ===

Student's question: ${question}

Your answer:`;

  // 4. Generate response
  const answer = await generate(prompt);

  return { answer, sources, mode };
}

/**
 * Generate quiz questions from provided text context (not RAG-based).
 * Used by the quiz route after it retrieves its own context.
 *
 * @param {string} context     - raw study text
 * @param {string} type        - multiple_choice | true_false | short_answer
 * @param {number} count       - number of questions to generate
 * @returns {Promise<object[]>}
 */
export async function generateQuizFromContext(context, type = 'multiple_choice', count = 5) {
  const typeInstructions = {
    multiple_choice: `Generate ${count} multiple choice questions.
Each question must have exactly 4 options (A, B, C, D).
Return ONLY a valid JSON array — no markdown, no explanation, no extra text.
Format: [{"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"correct":"A","explanation":"..."}]`,

    true_false: `Generate ${count} true/false questions.
Return ONLY a valid JSON array.
Format: [{"question":"...","options":["True","False"],"correct":"True","explanation":"..."}]`,

    short_answer: `Generate ${count} short answer questions.
Return ONLY a valid JSON array.
Format: [{"question":"...","options":[],"correct":"sample model answer","explanation":"..."}]`,
  };

  const prompt = `You are a quiz generator for a study application.
${typeInstructions[type] ?? typeInstructions.multiple_choice}

Study material:
${context}`;

  const raw = await generate(prompt);

  // Strip possible markdown code fences before parsing
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    const questions = JSON.parse(cleaned);
    return Array.isArray(questions) ? questions : [];
  } catch {
    console.error('[rag] Failed to parse quiz JSON from LLM:', cleaned.slice(0, 300));
    return [];
  }
}

/**
 * Generate flashcards from provided text context.
 *
 * @param {string} context
 * @param {number} count
 * @returns {Promise<object[]>}
 */
export async function generateFlashcardsFromContext(context, count = 10) {
  const prompt = `You are a flashcard generator for a study application.
Generate ${count} flashcards from the study material below.
Return ONLY a valid JSON array — no markdown, no explanation, no extra text.
Format: [{"front":"term or question","back":"definition or answer"}]

Study material:
${context}`;

  const raw = await generate(prompt);
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    const cards = JSON.parse(cleaned);
    return Array.isArray(cards) ? cards : [];
  } catch {
    console.error('[rag] Failed to parse flashcard JSON from LLM:', cleaned.slice(0, 300));
    return [];
  }
}

/**
 * Generate mini-game content from provided text context.
 *
 * @param {string} context
 * @param {string} gameType  - memory_match | fill_blanks | speed_quiz | true_false_lightning
 * @param {number} count
 * @returns {Promise<object>}
 */
export async function generateGameContent(context, gameType = 'memory_match', count = 8) {
  const gameInstructions = {
    memory_match: `Generate ${count} term-definition pairs for a memory matching game.
Return ONLY valid JSON: {"pairs":[{"term":"...","definition":"..."}]}`,

    fill_blanks: `Generate ${count} fill-in-the-blank sentences from the material.
Remove one key word or phrase from each sentence and replace it with _____.
Return ONLY valid JSON: {"sentences":[{"text":"The _____ is responsible for...","answer":"mitochondria"}]}`,

    speed_quiz: `Generate ${count} rapid-fire quiz questions with single-word or short answers.
Return ONLY valid JSON: {"questions":[{"question":"...","answer":"..."}]}`,

    true_false_lightning: `Generate ${count} true/false statements from the material.
Return ONLY valid JSON: {"statements":[{"statement":"...","answer":true,"explanation":"..."}]}`,
  };

  const prompt = `You are a study game content generator.
${gameInstructions[gameType] ?? gameInstructions.memory_match}

Study material:
${context}`;

  const raw = await generate(prompt);
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error('[rag] Failed to parse game JSON from LLM:', cleaned.slice(0, 300));
    return {};
  }
}

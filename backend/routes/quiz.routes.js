import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/db.service.js';
import { embed } from '../services/ollama.service.js';
import { queryChunks } from '../services/chroma.service.js';
import { generateQuizFromContext } from '../services/rag.service.js';

const router = Router();

// ─────────────────────────────────────────────
// POST /api/quizzes/generate
// Body: { subject, doc_id?, type?, count?, title? }
// ─────────────────────────────────────────────
router.post('/generate', async (req, res) => {
  try {
    const { subject, doc_id, type = 'multiple_choice', count = 5, title, topic } = req.body;

    if (!subject) return res.status(400).json({ error: 'subject is required' });

    const VALID_TYPES = ['multiple_choice', 'true_false', 'short_answer'];
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: `type must be one of: ${VALID_TYPES.join(', ')}` });
    }

    let context = '';

    if (doc_id) {
      // Use specific document chunks
      const chunks = db.all(
        `SELECT chunk_text FROM document_chunks WHERE document_id = ? ORDER BY chunk_index LIMIT 10`,
        [doc_id]
      );
      context = chunks.map(c => c.chunk_text).join('\n\n');
    } else if (topic) {
      // RAG: embed the topic and retrieve relevant chunks
      const collectionName = subject.toLowerCase().replace(/\s+/g, '_');
      const topicEmbedding = await embed(topic);
      const chunks = await queryChunks(collectionName, topicEmbedding, 8);
      context = chunks.join('\n\n');
    } else {
      // Fall back to first N chunks from the subject
      const chunks = db.all(
        `SELECT dc.chunk_text FROM document_chunks dc
         INNER JOIN documents d ON d.id = dc.document_id
         WHERE d.subject = ? ORDER BY dc.chunk_index LIMIT 10`,
        [subject]
      );
      context = chunks.map(c => c.chunk_text).join('\n\n');
    }

    if (!context) {
      return res.status(404).json({ error: 'No study material found for this subject. Upload documents first.' });
    }

    // Generate questions via LLM
    const questions = await generateQuizFromContext(context, type, count);

    if (questions.length === 0) {
      return res.status(500).json({ error: 'LLM could not generate questions. Try again.' });
    }

    // Persist quiz and questions to SQLite
    const quizId = uuidv4();
    const quizTitle = title || `${subject} Quiz — ${new Date().toLocaleDateString()}`;

    db.transaction([
      {
        query: `INSERT INTO quizzes (id, subject, title, doc_id) VALUES (?, ?, ?, ?)`,
        params: [quizId, subject, quizTitle, doc_id || null],
      },
      ...questions.map(q => ({
        query: `INSERT INTO quiz_questions (id, quiz_id, question, options, correct_answer, explanation, question_type)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
        params: [
          uuidv4(), quizId, q.question,
          JSON.stringify(q.options || []),
          q.correct, q.explanation || '', type,
        ],
      })),
    ]);

    res.status(201).json({
      quiz: { id: quizId, subject, title: quizTitle, type },
      questions,
    });
  } catch (err) {
    console.error('[quizzes] Generate error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/quizzes
// ─────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const { subject } = req.query;
    const quizzes = subject
      ? db.all(`SELECT * FROM quizzes WHERE subject = ? ORDER BY created_at DESC`, [subject])
      : db.all(`SELECT * FROM quizzes ORDER BY created_at DESC`);

    res.json({ quizzes });
  } catch (err) {
    console.error('[quizzes] List error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/quizzes/:id
// ─────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const quiz = db.get(`SELECT * FROM quizzes WHERE id = ?`, [req.params.id]);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const questions = db.all(
      `SELECT id, question, options, correct_answer, explanation, question_type
       FROM quiz_questions WHERE quiz_id = ?`,
      [req.params.id]
    ).map(q => ({ ...q, options: JSON.parse(q.options) }));

    const attempts = db.all(
      `SELECT id, score, total, date FROM quiz_attempts WHERE quiz_id = ? ORDER BY date DESC`,
      [req.params.id]
    );

    res.json({ quiz, questions, attempts });
  } catch (err) {
    console.error('[quizzes] Get error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// POST /api/quizzes/:id/attempt
// Body: { answers: { question_id: chosen_answer } }
// ─────────────────────────────────────────────
router.post('/:id/attempt', (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'answers object is required' });
    }

    const questions = db.all(
      `SELECT id, correct_answer FROM quiz_questions WHERE quiz_id = ?`,
      [req.params.id]
    );

    if (questions.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let score = 0;
    const results = questions.map(q => {
      const chosen = answers[q.id] ?? null;
      const correct = chosen === q.correct_answer;
      if (correct) score++;
      return { question_id: q.id, chosen, correct_answer: q.correct_answer, correct };
    });

    const attemptId = uuidv4();
    db.run(
      `INSERT INTO quiz_attempts (id, quiz_id, score, total, answers_json) VALUES (?, ?, ?, ?, ?)`,
      [attemptId, req.params.id, score, questions.length, JSON.stringify(answers)]
    );

    res.json({
      attempt_id: attemptId,
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      results,
    });
  } catch (err) {
    console.error('[quizzes] Attempt error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

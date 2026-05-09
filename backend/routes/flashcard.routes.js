import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/db.service.js';
import { embed } from '../services/ollama.service.js';
import { queryChunks } from '../services/chroma.service.js';
import { generateFlashcardsFromContext } from '../services/rag.service.js';

const router = Router();

// ─────────────────────────────────────────────
// POST /api/flashcards/generate
// Body: { subject, doc_id?, topic?, count? }
// ─────────────────────────────────────────────
router.post('/generate', async (req, res) => {
  try {
    const { subject, doc_id, topic, count = 10 } = req.body;

    if (!subject) return res.status(400).json({ error: 'subject is required' });

    let context = '';

    if (doc_id) {
      const chunks = db.all(
        `SELECT chunk_text FROM document_chunks WHERE document_id = ? ORDER BY chunk_index LIMIT 10`,
        [doc_id]
      );
      context = chunks.map(c => c.chunk_text).join('\n\n');
    } else if (topic) {
      const collectionName = subject.toLowerCase().replace(/\s+/g, '_');
      const topicEmbedding = await embed(topic);
      const chunks = await queryChunks(collectionName, topicEmbedding, 8);
      context = chunks.join('\n\n');
    } else {
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

    const cards = await generateFlashcardsFromContext(context, count);

    if (cards.length === 0) {
      return res.status(500).json({ error: 'LLM could not generate flashcards. Try again.' });
    }

    // Persist to SQLite
    const insertedCards = [];
    const ops = cards.map(card => {
      const id = uuidv4();
      insertedCards.push({ id, subject, front: card.front, back: card.back, difficulty: 'new' });
      return {
        query: `INSERT INTO flashcards (id, subject, front, back, doc_id) VALUES (?, ?, ?, ?, ?)`,
        params: [id, subject, card.front, card.back, doc_id || null],
      };
    });

    db.transaction(ops);

    res.status(201).json({ flashcards: insertedCards, count: insertedCards.length });
  } catch (err) {
    console.error('[flashcards] Generate error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/flashcards?subject=&difficulty=
// ─────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const { subject, difficulty } = req.query;
    let query = `SELECT * FROM flashcards`;
    const params = [];
    const conditions = [];

    if (subject) { conditions.push(`subject = ?`); params.push(subject); }
    if (difficulty) { conditions.push(`difficulty = ?`); params.push(difficulty); }
    if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY created_at DESC`;

    const flashcards = db.all(query, params);
    res.json({ flashcards });
  } catch (err) {
    console.error('[flashcards] List error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// PATCH /api/flashcards/:id/difficulty
// Body: { difficulty: 'easy'|'medium'|'hard' }
// ─────────────────────────────────────────────
router.patch('/:id/difficulty', (req, res) => {
  try {
    const { difficulty } = req.body;
    const VALID = ['new', 'easy', 'medium', 'hard'];

    if (!VALID.includes(difficulty)) {
      return res.status(400).json({ error: `difficulty must be one of: ${VALID.join(', ')}` });
    }

    const card = db.get('SELECT id FROM flashcards WHERE id = ?', [req.params.id]);
    if (!card) return res.status(404).json({ error: 'Flashcard not found' });

    db.run(
      `UPDATE flashcards SET difficulty = ?, last_review = datetime('now') WHERE id = ?`,
      [difficulty, req.params.id]
    );

    res.json({ message: 'Difficulty updated', id: req.params.id, difficulty });
  } catch (err) {
    console.error('[flashcards] Update difficulty error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/flashcards/:id
// ─────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  try {
    const card = db.get('SELECT id FROM flashcards WHERE id = ?', [req.params.id]);
    if (!card) return res.status(404).json({ error: 'Flashcard not found' });

    db.run('DELETE FROM flashcards WHERE id = ?', [req.params.id]);
    res.json({ message: 'Flashcard deleted' });
  } catch (err) {
    console.error('[flashcards] Delete error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

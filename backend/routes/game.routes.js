import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/db.service.js';
import { embed } from '../services/ollama.service.js';
import { queryChunks } from '../services/chroma.service.js';
import { generateGameContent } from '../services/rag.service.js';

const router = Router();

const VALID_TYPES = ['memory_match', 'fill_blanks', 'speed_quiz', 'true_false_lightning'];

// ─────────────────────────────────────────────
// POST /api/games/generate
// Body: { subject, type, doc_id?, topic?, count?, title? }
// ─────────────────────────────────────────────
router.post('/generate', async (req, res) => {
  try {
    const { subject, type = 'memory_match', doc_id, topic, count = 8, title } = req.body;

    if (!subject) return res.status(400).json({ error: 'subject is required' });
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: `type must be one of: ${VALID_TYPES.join(', ')}` });
    }

    let context = '';

    if (doc_id) {
      const chunks = db.all(
        `SELECT chunk_text FROM document_chunks WHERE document_id = ? ORDER BY chunk_index LIMIT 8`,
        [doc_id]
      );
      context = chunks.map(c => c.chunk_text).join('\n\n');
    } else if (topic) {
      const collectionName = subject.toLowerCase().replace(/\s+/g, '_');
      const topicEmbedding = await embed(topic);
      const chunks = await queryChunks(collectionName, topicEmbedding, 6);
      context = chunks.join('\n\n');
    } else {
      const chunks = db.all(
        `SELECT dc.chunk_text FROM document_chunks dc
         INNER JOIN documents d ON d.id = dc.document_id
         WHERE d.subject = ? ORDER BY dc.chunk_index LIMIT 8`,
        [subject]
      );
      context = chunks.map(c => c.chunk_text).join('\n\n');
    }

    if (!context) {
      return res.status(404).json({ error: 'No study material found for this subject. Upload documents first.' });
    }

    const gameData = await generateGameContent(context, type, count);

    if (!gameData || Object.keys(gameData).length === 0) {
      return res.status(500).json({ error: 'LLM could not generate game content. Try again.' });
    }

    const gameId = uuidv4();
    const gameTitle = title || `${subject} — ${type.replace('_', ' ')}`;

    db.run(
      `INSERT INTO game_sets (id, type, subject, title, data_json, doc_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [gameId, type, subject, gameTitle, JSON.stringify(gameData), doc_id || null]
    );

    res.status(201).json({
      game: { id: gameId, type, subject, title: gameTitle },
      data: gameData,
    });
  } catch (err) {
    console.error('[games] Generate error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/games?subject=&type=
// ─────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const { subject, type } = req.query;
    let query = `SELECT id, type, subject, title, created_at FROM game_sets`;
    const params = [];
    const conditions = [];

    if (subject) { conditions.push(`subject = ?`); params.push(subject); }
    if (type) { conditions.push(`type = ?`); params.push(type); }
    if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
    query += ` ORDER BY created_at DESC`;

    const games = db.all(query, params);
    res.json({ games });
  } catch (err) {
    console.error('[games] List error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/games/:id
// ─────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const game = db.get(`SELECT * FROM game_sets WHERE id = ?`, [req.params.id]);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    res.json({
      game: { id: game.id, type: game.type, subject: game.subject, title: game.title, created_at: game.created_at },
      data: JSON.parse(game.data_json),
    });
  } catch (err) {
    console.error('[games] Get error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/games/:id
// ─────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  try {
    const game = db.get('SELECT id FROM game_sets WHERE id = ?', [req.params.id]);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    db.run('DELETE FROM game_sets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Game deleted' });
  } catch (err) {
    console.error('[games] Delete error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

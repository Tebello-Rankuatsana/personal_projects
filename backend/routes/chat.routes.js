import { Router } from 'express';
import db from '../services/db.service.js';
import { askTutor } from '../services/rag.service.js';

const router = Router();

// Valid tutor modes
const VALID_MODES = ['default', 'explain', 'lecturer', 'step_by_step', 'exam_revision'];


router.post('/', async (req, res) => {
  try {
    const { message, subject, mode, session_id } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    const resolvedSubject = (subject?.trim().toLowerCase().replace(/\s+/g, '_')) || 'default';
    const resolvedMode = VALID_MODES.includes(mode) ? mode : 'default';
    const resolvedSession = session_id?.trim() || 'default';

    // Save the user message
    db.run(
      `INSERT INTO chat_messages (session_id, role, message, subject) VALUES (?, ?, ?, ?)`,
      [resolvedSession, 'user', message.trim(), subject || null]
    );

    // Run RAG pipeline
    const { answer, sources } = await askTutor(message.trim(), resolvedSubject, resolvedMode);

    // Save the assistant response
    db.run(
      `INSERT INTO chat_messages (session_id, role, message, subject) VALUES (?, ?, ?, ?)`,
      [resolvedSession, 'assistant', answer, subject || null]
    );

    res.json({
      answer,
      sources,
      mode: resolvedMode,
      subject: resolvedSubject,
    });
  } catch (err) {
    console.error('[chat] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', (req, res) => {
  try {
    const session = req.query.session_id || 'default';
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);

    const messages = db.all(
      `SELECT id, role, message, subject, timestamp
       FROM chat_messages
       WHERE session_id = ?
       ORDER BY timestamp DESC
       LIMIT ?`,
      [session, limit]
    );

    // Return in chronological order (oldest first)
    res.json({ messages: messages.reverse() });
  } catch (err) {
    console.error('[chat] History error:', err);
    res.status(500).json({ error: err.message });
  }
});


router.delete('/history', (req, res) => {
  try {
    const session = req.query.session_id || 'default';
    db.run('DELETE FROM chat_messages WHERE session_id = ?', [session]);
    res.json({ message: 'Chat history cleared' });
  } catch (err) {
    console.error('[chat] Clear history error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

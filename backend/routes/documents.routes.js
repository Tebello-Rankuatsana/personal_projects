import { Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import db from '../services/db.service.js';
import { embed } from '../services/ollama.service.js';
import { upsertChunks, deleteDocumentChunks } from '../services/chroma.service.js';
import { chunkText } from '../processors/chunker.js';
import { extractText as extractPdf } from '../processors/pdf.processor.js';
import { extractText as extractDocx } from '../processors/docx.processor.js';

const router = Router();

// Store uploads in memory — we process them immediately and don't keep files on disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB cap
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Upload PDF, DOCX, or TXT.'));
    }
  },
});

// ─────────────────────────────────────────────
// POST /api/documents/upload
// ─────────────────────────────────────────────
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const subject = req.body.subject?.trim() || 'General';
    const docId = uuidv4();
    const fileType = file.mimetype;

    // 1. Extract text based on file type
    let rawText = '';
    if (fileType === 'application/pdf') {
      rawText = await extractPdf(file.buffer);
    } else if (fileType.includes('wordprocessingml')) {
      rawText = await extractDocx(file.buffer);
    } else {
      // Plain text
      rawText = file.buffer.toString('utf-8');
    }

    if (!rawText || rawText.trim().length === 0) {
      return res.status(422).json({ error: 'Could not extract text from file. Is it a scanned image?' });
    }

    // 2. Chunk the text
    const chunks = chunkText(rawText);
    console.log(`[documents] "${file.originalname}" → ${chunks.length} chunks`);

    // 3. Embed each chunk and prepare for ChromaDB upsert
    const chunkIds = [];
    const embeddings = [];
    const chunkTexts = [];
    const metadatas = [];
    const dbOps = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkId = `${docId}_chunk_${i}`;
      const embedding = await embed(chunks[i]);

      chunkIds.push(chunkId);
      embeddings.push(embedding);
      chunkTexts.push(chunks[i]);
      metadatas.push({ document_id: docId, chunk_index: i, subject });

      dbOps.push({
        query: `INSERT INTO document_chunks (id, document_id, chunk_index, chunk_text, embedding_id)
                VALUES (?, ?, ?, ?, ?)`,
        params: [chunkId, docId, i, chunks[i], chunkId],
      });
    }

    // 4. Upsert chunks into ChromaDB (use subject as collection name)
    const collectionName = subject.toLowerCase().replace(/\s+/g, '_');
    await upsertChunks(collectionName, chunkIds, embeddings, chunkTexts, metadatas);

    // 5. Save document record + all chunks to SQLite in one transaction
    db.transaction([
      {
        query: `INSERT INTO documents (id, name, subject, file_type, file_size, chunk_count)
                VALUES (?, ?, ?, ?, ?, ?)`,
        params: [docId, file.originalname, subject, fileType, file.size, chunks.length],
      },
      ...dbOps,
    ]);

    res.status(201).json({
      message: 'Document uploaded and processed successfully',
      document: {
        id: docId,
        name: file.originalname,
        subject,
        fileType,
        chunkCount: chunks.length,
      },
    });
  } catch (err) {
    console.error('[documents] Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/documents
// ─────────────────────────────────────────────
router.get('/', (_req, res) => {
  try {
    const docs = db.all(
      `SELECT id, name, subject, file_type, file_size, chunk_count, upload_date
       FROM documents ORDER BY upload_date DESC`
    );
    res.json({ documents: docs });
  } catch (err) {
    console.error('[documents] List error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// GET /api/documents/:id
// ─────────────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const doc = db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const chunks = db.all(
      'SELECT chunk_index, chunk_text FROM document_chunks WHERE document_id = ? ORDER BY chunk_index',
      [req.params.id]
    );

    res.json({ document: doc, chunks });
  } catch (err) {
    console.error('[documents] Get error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/documents/:id
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const doc = db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    const collectionName = doc.subject.toLowerCase().replace(/\s+/g, '_');
    await deleteDocumentChunks(collectionName, req.params.id);

    db.run('DELETE FROM documents WHERE id = ?', [req.params.id]);

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('[documents] Delete error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

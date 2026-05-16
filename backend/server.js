import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { runMigrations } from './db/migrate.js';

// Route modules
import chatRoutes from './routes/chat.routes.js';
import documentRoutes from './routes/documents.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import flashcardRoutes from './routes/flashcard.routes.js';
import gameRoutes from './routes/game.routes.js';

// Services (health checks)
import { listModels } from './services/ollama.service.js';
import { isHealthy as chromaHealthy } from './services/chroma.service.js';

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors({ origin: 'http://localhost:5173' })); // React dev server default
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (minimal, local-only)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// routes
app.use('/api/chat', chatRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/games', gameRoutes);


app.get('/api/health', async (_req, res) => {
  const [ollamaModels, chromaOk] = await Promise.all([
    listModels(),
    chromaHealthy(),
  ]);

  res.json({
    status: 'ok',
    services: {
      ollama: { connected: ollamaModels.length > 0, models: ollamaModels },
      chroma: { connected: chromaOk },
    },
    timestamp: new Date().toISOString(),
  });
});


app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});


async function start() {
  // Run DB migrations (creates tables if not present)
  runMigrations();

  app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════╗');
    console.log('║        StudyOS Backend Running       ║');
    console.log('╠══════════════════════════════════════╣');
    console.log(`║ API:     http://localhost:${PORT}/api║`);
    console.log(`║ Health:  http://localhost:${PORT}/api/health ║`);
    console.log('╚══════════════════════════════════════╝');
    console.log('BY: Ceo: Ranks');
    // just a sanity check log to confirm DB is working and migrations ran
    console.log('SELECT * FROM game_sets;');
  });
}

start();

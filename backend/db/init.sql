-- StudyOS Database Schema
-- Run automatically by migrate.js on server start

CREATE TABLE IF NOT EXISTS documents (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  subject     TEXT NOT NULL DEFAULT 'General',
  file_type   TEXT NOT NULL,
  file_size   INTEGER,
  chunk_count INTEGER DEFAULT 0,
  upload_date TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS document_chunks (
  id           TEXT PRIMARY KEY,
  document_id  TEXT NOT NULL,
  chunk_index  INTEGER NOT NULL,
  chunk_text   TEXT NOT NULL,
  embedding_id TEXT,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL DEFAULT 'default',
  role       TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
  message    TEXT NOT NULL,
  subject    TEXT,
  timestamp  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quizzes (
  id         TEXT PRIMARY KEY,
  subject    TEXT NOT NULL,
  title      TEXT,
  doc_id     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id             TEXT PRIMARY KEY,
  quiz_id        TEXT NOT NULL,
  question       TEXT NOT NULL,
  options        TEXT NOT NULL,  -- JSON array stored as string
  correct_answer TEXT NOT NULL,
  explanation    TEXT,
  question_type  TEXT NOT NULL DEFAULT 'multiple_choice',
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id           TEXT PRIMARY KEY,
  quiz_id      TEXT NOT NULL,
  score        INTEGER NOT NULL,
  total        INTEGER NOT NULL,
  answers_json TEXT,             -- JSON: {question_id: chosen_answer}
  date         TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flashcards (
  id          TEXT PRIMARY KEY,
  subject     TEXT NOT NULL,
  front       TEXT NOT NULL,
  back        TEXT NOT NULL,
  difficulty  TEXT NOT NULL DEFAULT 'new' CHECK(difficulty IN ('new', 'easy', 'medium', 'hard')),
  doc_id      TEXT,
  last_review TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS game_sets (
  id         TEXT PRIMARY KEY,
  type       TEXT NOT NULL,  -- memory_match | fill_blanks | speed_quiz | true_false_lightning
  subject    TEXT NOT NULL,
  title      TEXT,
  data_json  TEXT NOT NULL,  -- game content as JSON
  doc_id     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

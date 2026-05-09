/**
 * Uses Node 22's built-in node:sqlite — no native compilation required.
 * API mirrors better-sqlite3 (drop-in compatible with the rest of the codebase).
 */
import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'path';
import 'dotenv/config';

const DB_PATH = resolve(process.env.DB_PATH || './studyos.db');

let _db;

function getDb() {
  if (!_db) {
    _db = new DatabaseSync(DB_PATH);
    _db.exec(`PRAGMA journal_mode = WAL`);
    _db.exec(`PRAGMA foreign_keys = ON`);
    console.log(`[db] Connected to ${DB_PATH}`);
  }
  return _db;
}

const db = {
  /**
   * Execute a write query (INSERT, UPDATE, DELETE, CREATE).
   * Returns { changes, lastInsertRowid }
   */
  run(query, params = []) {
    return getDb().prepare(query).run(...params);
  },

  /**
   * Fetch a single row. Returns the row object or undefined.
   */
  get(query, params = []) {
    return getDb().prepare(query).get(...params);
  },

  /**
   * Fetch all matching rows. Returns an array (empty if none).
   */
  all(query, params = []) {
    return getDb().prepare(query).all(...params);
  },

  /**
   * Execute multiple statements in a single transaction.
   * Pass an array of { query, params } objects.
   */
  transaction(operations) {
    const database = getDb();
    database.exec('BEGIN');
    try {
      for (const { query, params = [] } of operations) {
        database.prepare(query).run(...params);
      }
      database.exec('COMMIT');
    } catch (err) {
      database.exec('ROLLBACK');
      throw err;
    }
  },

  /**
   * Execute raw SQL (used by migrate.js).
   */
  exec(sql) {
    getDb().exec(sql);
  },

  /**
   * Close the database connection. Useful for graceful shutdown.
   */
  close() {
    if (_db) {
      _db.close();
      _db = null;
      console.log('[db] Connection closed');
    }
  },
};

export default db;

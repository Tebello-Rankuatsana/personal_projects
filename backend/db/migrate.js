import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from '../services/db.service.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function runMigrations() {
  const sqlPath = join(__dirname, 'init.sql');
  const sql = readFileSync(sqlPath, 'utf-8');
  try {
    db.exec(sql);
    console.log('[migrate] ✓ Schema applied — database ready');
  } catch (err) {
    console.error('[migrate] Failed to apply schema:', err.message);
    throw err;
  }
}

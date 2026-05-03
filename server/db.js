import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';

// Ensure the data directory exists
const dataDir = path.resolve('server', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export async function initDb() {
  const db = await open({
    filename: path.join(dataDir, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      activeRole TEXT DEFAULT 'voter',
      language TEXT DEFAULT 'en',
      location TEXT DEFAULT '',
      onboardingComplete BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      step_index INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      UNIQUE(user_id, step_index)
    );
  `);

  return db;
}

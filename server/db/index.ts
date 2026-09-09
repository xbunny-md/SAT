import { createClient } from "@libsql/client";
import path from "path";

// Initialize local SQLite database using libSQL
const dbPath = path.join(process.cwd(), "somadian.db");
export const db = createClient({
  url: `file:${dbPath}`,
});

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      balance INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS leagues (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      logo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      league_id TEXT NOT NULL,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      logo TEXT,
      attack_strength INTEGER NOT NULL DEFAULT 70,
      defense_strength INTEGER NOT NULL DEFAULT 70,
      midfield_strength INTEGER NOT NULL DEFAULT 70,
      goalkeeper_strength INTEGER NOT NULL DEFAULT 70,
      tactical_style TEXT NOT NULL DEFAULT 'balanced',
      formation TEXT NOT NULL DEFAULT '4-3-3',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (league_id) REFERENCES leagues(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      league_id TEXT NOT NULL,
      home_team_id TEXT NOT NULL,
      away_team_id TEXT NOT NULL,
      start_time DATETIME NOT NULL,
      status TEXT NOT NULL DEFAULT 'upcoming',
      home_score INTEGER DEFAULT 0,
      away_score INTEGER DEFAULT 0,
      current_minute INTEGER DEFAULT 0,
      events_json TEXT DEFAULT '[]',
      integrity_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (league_id) REFERENCES leagues(id),
      FOREIGN KEY (home_team_id) REFERENCES teams(id),
      FOREIGN KEY (away_team_id) REFERENCES teams(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount INTEGER NOT NULL, -- Negative for debit, positive for credit
      type TEXT NOT NULL, -- 'deposit', 'withdrawal', 'bet_placed', 'bet_won'
      reference_id TEXT, -- e.g., bet_id
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS bets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      stake INTEGER NOT NULL,
      potential_win INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- pending, won, lost, refunded
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS bet_selections (
      id TEXT PRIMARY KEY,
      bet_id TEXT NOT NULL,
      match_id TEXT NOT NULL,
      market_name TEXT NOT NULL,
      outcome TEXT NOT NULL,
      odds REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      FOREIGN KEY (bet_id) REFERENCES bets(id),
      FOREIGN KEY (match_id) REFERENCES matches(id)
    );
  `);

  console.log("Database initialized");
}

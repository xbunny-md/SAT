import { db } from "./index";
import crypto from "crypto";

export async function seedDb() {
  // Check if we already seeded
  const existing = await db.execute("SELECT count(*) as count FROM leagues");
  if ((existing.rows[0].count as number) > 0) return;

  const leagues = [
    { id: crypto.randomUUID(), name: "Premier League", country: "England" },
    { id: crypto.randomUUID(), name: "La Liga", country: "Spain" },
  ];

  for (const l of leagues) {
    await db.execute({
      sql: "INSERT INTO leagues (id, name, country) VALUES (?, ?, ?)",
      args: [l.id, l.name, l.country]
    });
  }

  const teams = [
    { id: crypto.randomUUID(), league_id: leagues[0].id, name: "Arsenal", short_name: "ARS", att: 88, def: 85, mid: 86, gk: 84, style: "attacking" },
    { id: crypto.randomUUID(), league_id: leagues[0].id, name: "Chelsea", short_name: "CHE", att: 84, def: 82, mid: 84, gk: 80, style: "balanced" },
    { id: crypto.randomUUID(), league_id: leagues[0].id, name: "Man City", short_name: "MCI", att: 92, def: 88, mid: 92, gk: 89, style: "possession" },
    { id: crypto.randomUUID(), league_id: leagues[1].id, name: "Real Madrid", short_name: "RMA", att: 94, def: 87, mid: 90, gk: 91, style: "counter_attack" },
    { id: crypto.randomUUID(), league_id: leagues[1].id, name: "Barcelona", short_name: "BAR", att: 89, def: 85, mid: 88, gk: 87, style: "possession" },
  ];

  for (const t of teams) {
    await db.execute({
      sql: `INSERT INTO teams (id, league_id, name, short_name, attack_strength, defense_strength, midfield_strength, goalkeeper_strength, tactical_style)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [t.id, t.league_id, t.name, t.short_name, t.att, t.def, t.mid, t.gk, t.style]
    });
  }

  console.log("Database seeded with default leagues and teams");
}

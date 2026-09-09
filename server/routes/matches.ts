import express from "express";
import { db } from "../db/index";
import { oddsEngine } from "../services/odds.engine";

const router = express.Router();

// Get all matches (live and upcoming)
router.get("/", async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT m.*, 
        ht.name as home_name, ht.short_name as home_short, ht.logo as home_logo, ht.attack_strength as ht_att, ht.midfield_strength as ht_mid, ht.defense_strength as ht_def,
        at.name as away_name, at.short_name as away_short, at.logo as away_logo, at.attack_strength as at_att, at.midfield_strength as at_mid, at.defense_strength as at_def,
        l.name as league_name
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      JOIN leagues l ON m.league_id = l.id
      ORDER BY m.start_time ASC
    `);

    // Format output and calculate live odds
    const matches = result.rows.map(row => {
      const homeTeamStats = { attack_strength: row.ht_att, midfield_strength: row.ht_mid, defense_strength: row.ht_def };
      const awayTeamStats = { attack_strength: row.at_att, midfield_strength: row.at_mid, defense_strength: row.at_def };
      const odds = oddsEngine.calculateOdds(homeTeamStats, awayTeamStats);

      return {
        id: row.id,
        league: row.league_name,
        home: row.home_name,
        home_short: row.home_short,
        away: row.away_name,
        away_short: row.away_short,
        status: row.status,
        start_time: row.start_time,
        home_score: row.home_score,
        away_score: row.away_score,
        current_minute: row.current_minute,
        events: JSON.parse(row.events_json as string || '[]'),
        odds
      };
    });

    res.json({ matches });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single match details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute({
      sql: `
        SELECT m.*, 
          ht.name as home_name, ht.short_name as home_short, ht.logo as home_logo, ht.attack_strength as ht_att, ht.midfield_strength as ht_mid, ht.defense_strength as ht_def,
          at.name as away_name, at.short_name as away_short, at.logo as away_logo, at.attack_strength as at_att, at.midfield_strength as at_mid, at.defense_strength as at_def,
          l.name as league_name
        FROM matches m
        JOIN teams ht ON m.home_team_id = ht.id
        JOIN teams at ON m.away_team_id = at.id
        JOIN leagues l ON m.league_id = l.id
        WHERE m.id = ?
      `,
      args: [id]
    });

    if (result.rows.length === 0) return res.status(404).json({ error: "Match not found" });

    const row = result.rows[0];
    const homeTeamStats = { attack_strength: row.ht_att, midfield_strength: row.ht_mid, defense_strength: row.ht_def };
    const awayTeamStats = { attack_strength: row.at_att, midfield_strength: row.at_mid, defense_strength: row.at_def };
    const odds = oddsEngine.calculateOdds(homeTeamStats, awayTeamStats);

    const match = {
      id: row.id,
      league: row.league_name,
      home: row.home_name,
      home_short: row.home_short,
      away: row.away_name,
      away_short: row.away_short,
      status: row.status,
      start_time: row.start_time,
      home_score: row.home_score,
      away_score: row.away_score,
      current_minute: row.current_minute,
      events: JSON.parse(row.events_json as string || '[]'),
      odds
    };

    res.json({ match });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
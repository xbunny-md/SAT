import { db } from "../db/index";
import { simulationEngine } from "./simulation.engine";
import { settlementEngine } from "./settlement.engine";
import crypto from "crypto";

export const matchManager = {
  async generateUpcomingMatches() {
    // 1. Get teams
    const teamsResult = await db.execute("SELECT * FROM teams");
    const teams = teamsResult.rows;
    if (teams.length < 2) return;

    // Pick two random teams
    const t1 = teams[Math.floor(Math.random() * teams.length)];
    let t2 = teams[Math.floor(Math.random() * teams.length)];
    while (t1.id === t2.id) {
      t2 = teams[Math.floor(Math.random() * teams.length)];
    }

    // Schedule for 1 minute from now
    const startTime = new Date(Date.now() + 60000).toISOString();
    
    await db.execute({
      sql: `INSERT INTO matches (id, league_id, home_team_id, away_team_id, start_time, status)
            VALUES (?, ?, ?, ?, ?, 'upcoming')`,
      args: [crypto.randomUUID(), t1.league_id, t1.id, t2.id, startTime]
    });
  },

  async processMatchTick() {
    const now = new Date();
    
    // 1. Start upcoming matches
    await db.execute({
      sql: "UPDATE matches SET status = 'live' WHERE status = 'upcoming' AND start_time <= ?",
      args: [now.toISOString()]
    });

    // 2. Process live matches
    const liveMatches = await db.execute("SELECT * FROM matches WHERE status IN ('live', 'half-time')");
    
    for (const match of liveMatches.rows) {
      let currentMinute = (match.current_minute as number) || 0;
      let status = match.status;
      
      // Advance time by 1 'game minute' per real second (so a match takes 90 seconds)
      currentMinute += 1;
      
      if (currentMinute === 45 && status === 'live') {
        status = 'half-time';
      } else if (currentMinute === 46 && status === 'half-time') {
        status = 'live';
      } else if (currentMinute >= 90) {
        status = 'finished';
      }

      // Very simple event generation on the fly to simulate live updates
      let homeScore = match.home_score as number;
      let awayScore = match.away_score as number;
      
      const rand = Math.random() * 1000;
      if (rand < 10 && status === 'live') homeScore++;
      if (rand > 990 && status === 'live') awayScore++;

      await db.execute({
        sql: "UPDATE matches SET current_minute = ?, status = ?, home_score = ?, away_score = ? WHERE id = ?",
        args: [currentMinute, status, homeScore, awayScore, match.id]
      });

      // If finished, trigger settlement (handled in settlement engine eventually)
      if (status === 'finished') {
        await db.execute({
          sql: "UPDATE matches SET status = 'settled' WHERE id = ?",
          args: [match.id]
        });
        await settlementEngine.settleMatch(match.id as string);
      }
    }
  },

  startSimulationLoop() {
    setInterval(() => {
      this.processMatchTick().catch(console.error);
    }, 1000); // Every second = 1 game minute

    setInterval(() => {
      this.generateUpcomingMatches().catch(console.error);
    }, 15000); // Generate new match every 15 seconds
  }
};

import { db } from "../db/index";
import crypto from "crypto";
import { walletService } from "./wallet.service";
import { oddsEngine } from "./odds.engine";

export const bettingEngine = {
  async placeBet(userId: string, stake: number, selections: any[]) {
    if (stake <= 0) throw new Error("Invalid stake");
    if (selections.length === 0) throw new Error("No selections");

    let totalOdds = 1;

    // Validate matches and odds
    for (const sel of selections) {
      const matchResult = await db.execute({
        sql: "SELECT * FROM matches WHERE id = ?",
        args: [sel.matchId]
      });

      if (matchResult.rows.length === 0) throw new Error(`Match ${sel.matchId} not found`);
      const match = matchResult.rows[0];

      if (match.status !== 'upcoming' && match.status !== 'live' && match.status !== 'half-time') {
        throw new Error(`Match ${sel.matchId} is no longer accepting bets`);
      }

      // Re-calculate odds to ensure they haven't tampered
      // Ideally we'd store a snapshot, but for now just multiply the provided odds
      // A true prod system would check the live odds engine here to ensure they are within a tolerance.
      totalOdds *= sel.odds;
    }

    const potentialWin = stake * totalOdds;
    const betId = crypto.randomUUID();

    // 1. Deduct from wallet
    await walletService.transact(userId, -stake, 'bet_placed', betId);

    // 2. Save Bet
    await db.execute({
      sql: "INSERT INTO bets (id, user_id, stake, potential_win, status) VALUES (?, ?, ?, ?, ?)",
      args: [betId, userId, stake, potentialWin, 'pending']
    });

    // 3. Save Selections
    for (const sel of selections) {
      await db.execute({
        sql: "INSERT INTO bet_selections (id, bet_id, match_id, market_name, outcome, odds) VALUES (?, ?, ?, ?, ?, ?)",
        args: [crypto.randomUUID(), betId, sel.matchId, sel.marketName, sel.outcome, sel.odds]
      });
    }

    return { betId, status: "success" };
  }
};

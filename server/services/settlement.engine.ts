import { db } from "../db/index";
import { walletService } from "./wallet.service";

export const settlementEngine = {
  async evaluateSelection(selection: any, match: any) {
    const hs = match.home_score as number;
    const as = match.away_score as number;

    if (selection.market_name === "Match Winner") {
      if (hs > as && selection.outcome === "1") return 'won';
      if (hs === as && selection.outcome === "X") return 'won';
      if (hs < as && selection.outcome === "2") return 'won';
      return 'lost';
    }

    // Add more market evaluation logic here...
    return 'lost';
  },

  async settleMatch(matchId: string) {
    const matchRes = await db.execute({
      sql: "SELECT * FROM matches WHERE id = ?",
      args: [matchId]
    });
    
    if (matchRes.rows.length === 0) return;
    const match = matchRes.rows[0];

    // Find pending selections for this match
    const selections = await db.execute({
      sql: "SELECT * FROM bet_selections WHERE match_id = ? AND status = 'pending'",
      args: [matchId]
    });

    for (const sel of selections.rows) {
      const result = await this.evaluateSelection(sel, match);
      await db.execute({
        sql: "UPDATE bet_selections SET status = ? WHERE id = ?",
        args: [result, sel.id]
      });

      // Check if the parent bet is fully resolved
      const allSelections = await db.execute({
        sql: "SELECT status FROM bet_selections WHERE bet_id = ?",
        args: [sel.bet_id]
      });

      let betStatus = 'pending';
      const hasLost = allSelections.rows.some(s => s.status === 'lost');
      const allWon = allSelections.rows.every(s => s.status === 'won');

      if (hasLost) betStatus = 'lost';
      else if (allWon) betStatus = 'won';

      if (betStatus !== 'pending') {
        // Prevent double settlement
        const betCheck = await db.execute({
          sql: "SELECT status, potential_win, user_id FROM bets WHERE id = ? AND status = 'pending'",
          args: [sel.bet_id]
        });

        if (betCheck.rows.length > 0) {
          const bet = betCheck.rows[0];
          await db.execute({
            sql: "UPDATE bets SET status = ? WHERE id = ?",
            args: [betStatus, sel.bet_id]
          });

          if (betStatus === 'won') {
            await walletService.transact(bet.user_id as string, bet.potential_win as number, 'bet_won', sel.bet_id as string);
          }
        }
      }
    }
  }
};

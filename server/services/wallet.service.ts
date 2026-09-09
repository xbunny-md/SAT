import { db } from "../db/index";
import crypto from "crypto";

export const walletService = {
  async transact(userId: string, amount: number, type: 'deposit' | 'withdrawal' | 'bet_placed' | 'bet_won', referenceId?: string) {
    // In a real prod environment we use DB transactions. libSQL supports it via batches.
    const userResult = await db.execute({
      sql: "SELECT balance FROM users WHERE id = ?",
      args: [userId]
    });

    if (userResult.rows.length === 0) throw new Error("User not found");

    const currentBalance = userResult.rows[0].balance as number;
    
    if (amount < 0 && currentBalance + amount < 0) {
      throw new Error("Insufficient balance");
    }

    const transactionId = crypto.randomUUID();

    // Use a batch for pseudo-transaction atomicity
    await db.batch([
      {
        sql: "UPDATE users SET balance = balance + ? WHERE id = ?",
        args: [amount, userId]
      },
      {
        sql: "INSERT INTO transactions (id, user_id, amount, type, reference_id) VALUES (?, ?, ?, ?, ?)",
        args: [transactionId, userId, amount, type, referenceId || null]
      }
    ], "write");

    return { transactionId, newBalance: currentBalance + amount };
  }
};

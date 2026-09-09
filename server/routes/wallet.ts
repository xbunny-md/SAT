import express from "express";
import { db } from "../db/index";
import { walletService } from "../services/wallet.service";
import { authService } from "../services/auth.service";

const router = express.Router();

const requireAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = authService.verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/", requireAuth, async (req: any, res) => {
  try {
    const userRes = await db.execute({
      sql: "SELECT balance FROM users WHERE id = ?",
      args: [req.user.id]
    });
    if (userRes.rows.length === 0) return res.status(404).json({ error: "User not found" });
    
    res.json({ balance: userRes.rows[0].balance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/deposit", requireAuth, async (req: any, res) => {
  try {
    const { amount } = req.body;
    if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    const result = await walletService.transact(req.user.id, amount, 'deposit');
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

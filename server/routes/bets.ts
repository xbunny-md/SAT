import express from "express";
import { db } from "../db/index";
import { bettingEngine } from "../services/betting.engine";
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

router.post("/", requireAuth, async (req: any, res) => {
  try {
    const { stake, selections } = req.body;
    const result = await bettingEngine.placeBet(req.user.id, stake, selections);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/my-bets", requireAuth, async (req: any, res) => {
  try {
    const betsRes = await db.execute({
      sql: "SELECT * FROM bets WHERE user_id = ? ORDER BY created_at DESC",
      args: [req.user.id]
    });
    
    // For a real app, we'd also JOIN the bet_selections, but this is a start
    res.json({ bets: betsRes.rows });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

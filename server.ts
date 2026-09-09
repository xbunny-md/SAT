import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { initDb } from "./server/db/index";
import { seedDb } from "./server/db/seed";
import { authService } from "./server/services/auth.service";
import matchRoutes from "./server/routes/matches";
import betRoutes from "./server/routes/bets";
import walletRoutes from "./server/routes/wallet";
import { matchManager } from "./server/services/match.manager";

async function startServer() {
  await initDb();
  await seedDb();
  
  matchManager.startSimulationLoop();
  
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "somadian-bet-api" });
  });

  // Attach domain routes
  app.use("/api/matches", matchRoutes);
  app.use("/api/bets", betRoutes);
  app.use("/api/wallet", walletRoutes);

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await authService.register(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  // Middleware for protected routes
  const requireAuth = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    
    try {
      const decoded = authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  app.get("/api/me", requireAuth, (req: any, res: any) => {
    res.json({ user: req.user });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

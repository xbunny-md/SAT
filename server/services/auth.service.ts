import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "somadian-bet-super-secret-key-change-in-prod";

export const authService = {
  async register(email: string, password: string, role: string = "user") {
    // Check if user exists
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: [email]
    });

    if (existing.rows.length > 0) {
      throw new Error("Email already registered");
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    await db.execute({
      sql: "INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)",
      args: [id, email, password_hash, role]
    });

    const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "24h" });
    
    return {
      user: { id, email, role, balance: 0 },
      token
    };
  },

  async login(email: string, password: string) {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email]
    });

    if (result.rows.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash as string);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        balance: user.balance
      },
      token
    };
  },

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  }
};

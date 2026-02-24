import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { pool } from "./db.js";
import { signToken, authMiddleware } from "./auth.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Admin check
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin only" });
  }
  next();
}

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/questions", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM questions ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("QUESTIONS ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

//  Create new question *ADMIN ONLY*
app.post("/api/questions", authMiddleware, requireAdmin, async (req, res) => {
  const {
    campaign,
    text,
    optiona,
    optionb,
    optionc,
    correctoption,
    explanation,
  } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO questions (campaign, text, optiona, optionb, optionc, correctoption, explanation)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [campaign, text, optiona, optionb, optionc, correctoption, explanation],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("CREATE QUESTION ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

//  Update question *ADMIN ONLY*
app.put(
  "/api/questions/:id",
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    const {
      campaign,
      text,
      optiona,
      optionb,
      optionc,
      correctoption,
      explanation,
    } = req.body;
    try {
      const { rows } = await pool.query(
        `UPDATE questions 
       SET campaign=$1, text=$2, optiona=$3, optionb=$4, optionc=$5, correctoption=$6, explanation=$7
       WHERE id=$8 RETURNING *`,
        [
          campaign,
          text,
          optiona,
          optionb,
          optionc,
          correctoption,
          explanation,
          id,
        ],
      );
      if (!rows.length) return res.status(404).json({ error: "Not found" });
      res.json(rows[0]);
    } catch (err) {
      console.error("UPDATE QUESTION ERROR:", err);
      res.status(500).json({ error: "DB error" });
    }
  },
);

// Delete question *ADMIN ONLY*
app.delete(
  "/api/questions/:id",
  authMiddleware,
  requireAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        "DELETE FROM questions WHERE id=$1 RETURNING id",
        [id],
      );
      if (!result.rowCount) return res.status(404).json({ error: "Not found" });
      res.json({ success: true });
    } catch (err) {
      console.error("DELETE QUESTION ERROR:", err);
      res.status(500).json({ error: "DB error" });
    }
  },
);

// Register
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  try {
    const existing = await pool.query(
      "SELECT id FROM app_user WHERE username=$1",
      [username],
    );
    if (existing.rowCount > 0)
      return res.status(409).json({ error: "username already taken" });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO app_user (username, password, role, score) VALUES ($1,$2,'USER',0) RETURNING id, username, role, score",
      [username, hash],
    );
    const user = rows[0];
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT id, username, role, score, password FROM app_user WHERE username=$1",
      [username],
    );
    if (!rows.length)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);
    delete user.password;
    res.json({ token, user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// Submit answer + badge logic
app.post("/api/answers", authMiddleware, async (req, res) => {
  const { questionId, chosen } = req.body;
  const userId = req.user.id;

  try {
    const qRes = await pool.query(
      "SELECT correctoption, explanation FROM questions WHERE id=$1",
      [questionId],
    );
    if (!qRes.rows.length)
      return res.status(404).json({ error: "Question not found" });

    const question = qRes.rows[0];
    const isCorrect = chosen === question.correctoption;

    await pool.query(
      "INSERT INTO attempts (user_id, question_id, chosen, correct) VALUES ($1,$2,$3,$4)",
      [userId, questionId, chosen, isCorrect],
    );

    if (isCorrect) {
      await pool.query("UPDATE app_user SET score = score + 10 WHERE id=$1", [
        userId,
      ]);
    } else {
      await pool.query(
        "UPDATE app_user SET score = GREATEST(score - 5, 0) WHERE id=$1",
        [userId],
      );
    }

    // Badge logic
    const { rows } = await pool.query(
      "SELECT score FROM app_user WHERE id=$1",
      [userId],
    );
    const score = rows[0].score;

    let earned = [];
    if (score >= 100) earned.push("Baby Shark");
    if (score >= 200) earned.push("Spam Samurai");
    if (score >= 300) earned.push("Unphishable");

    // Wrong streak = 10 -> Phish Fingers
    const wrongStreak = await pool.query(
      "SELECT COUNT(*) FROM (SELECT * FROM attempts WHERE user_id=$1 ORDER BY id DESC LIMIT 10) t WHERE correct=false",
      [userId],
    );
    if (parseInt(wrongStreak.rows[0].count) === 10) {
      earned.push("Phish Fingers");
    }

    for (let b of earned) {
      await pool.query(
        "INSERT INTO badges (user_id, name) VALUES ($1,$2) ON CONFLICT (user_id,name) DO NOTHING",
        [userId, b],
      );
    }

    res.json({ correct: isCorrect, explanation: question.explanation });
  } catch (err) {
    console.error("ANSWER ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// Leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT username, score FROM app_user ORDER BY score DESC LIMIT 10",
    );
    res.json(rows);
  } catch (err) {
    console.error("LEADERBOARD ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

// User badges
app.get("/api/badges", authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT name FROM badges WHERE user_id=$1",
      [req.user.id],
    );
    res.json(rows.map((r) => r.name));
  } catch (err) {
    console.error("BADGES ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Backend running on http://localhost:${port}`),
);

const express = require("express");
const router = express.Router();
const pool = require("../db");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// ✅ Alle Fragen abrufen
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM questions ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Database error fetching questions" });
  }
});

// ✅ Neue Frage erstellen (nur Admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  const {
    campaign,
    text,
    optiona,
    optionb,
    optionc,
    correctoption,
    explanation,
  } = req.body;

  if (!text || !optiona || !optionb || !optionc || !correctoption) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO questions (campaign, text, optiona, optionb, optionc, correctoption, explanation)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [campaign, text, optiona, optionb, optionc, correctoption, explanation]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting question:", err);
    res.status(500).json({ error: "Insert failed" });
  }
});

// ✅ Frage updaten (nur Admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
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
    const result = await pool.query(
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
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// ✅ Frage löschen (nur Admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM questions WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;

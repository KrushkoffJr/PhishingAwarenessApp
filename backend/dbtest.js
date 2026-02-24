// backend/dbtest.js
import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function run() {
  try {
    const { rows } = await pool.query("SELECT count(*) as c FROM questions;");
    console.log("OK - questions count =", rows[0].c);
  } catch (err) {
    console.error("DB TEST ERROR:", err);
  } finally {
    await pool.end();
    process.exit();
  }
}
run();

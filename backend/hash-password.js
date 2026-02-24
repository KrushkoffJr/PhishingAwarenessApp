import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
import bcrypt from "bcrypt";

const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function run() {
  const plain = "demo";
  const hash = await bcrypt.hash(plain, 10);
  // Update exissting demo user
  const r = await pool.query(
    "UPDATE app_user SET password=$1 WHERE username=$2 RETURNING id, username",
    [hash, "demo"],
  );
  if (r.rowCount === 0) {
    await pool.query(
      "INSERT INTO app_user (username, password, role, score) VALUES ($1,$2,$3,$4)",
      ["demo", hash, "USER", 0],
    );
    console.log('Created demo user with username "demo" and password "demo"');
  } else {
    console.log("Updated demo password to bcrypt hash");
  }
  await pool.end();
}
run().catch((err) => {
  console.error(err);
  process.exit(1);
});

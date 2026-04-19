const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  const bRes = await pool.query("SELECT b.id, b.name, b.stand_id FROM Blocks b WHERE b.stadium_id = 'ahmedabad' LIMIT 15");
  console.log(bRes.rows);
  pool.end();
}
check();

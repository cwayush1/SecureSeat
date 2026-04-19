const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const matchesRes = await pool.query("SELECT * FROM Matches ORDER BY id ASC");
  const configRes = await pool.query("SELECT * FROM Match_Stands_Config ORDER BY match_id ASC");
  
  const data = {
    matches: matchesRes.rows,
    config: configRes.rows
  };
  fs.writeFileSync('output_config.json', JSON.stringify(data, null, 2));
  pool.end();
}
run();

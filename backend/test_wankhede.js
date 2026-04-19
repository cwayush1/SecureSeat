const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const standsRes = await pool.query("SELECT * FROM Stands WHERE stadium_id = 'wankhede'");
  const blocksRes = await pool.query("SELECT * FROM Blocks WHERE stadium_id = 'wankhede'");
  const seatsRes = await pool.query("SELECT * FROM Seats WHERE stadium_id = 'wankhede' LIMIT 5");
  
  const data = {
    stands: standsRes.rows.slice(0,2),
    blocks: blocksRes.rows.slice(0,2),
    seats: seatsRes.rows
  };
  fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
  pool.end();
}
run();

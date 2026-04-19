const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  const bRes = await pool.query("SELECT b.id FROM Blocks b JOIN Stands st ON st.id = b.stand_id WHERE st.stadium_id = 'ahmedabad' LIMIT 1");
  const blockId = bRes.rows[0].id;
  const matchId = 3;
  console.log('Testing Match:', matchId, 'Block:', blockId);
  const sRes = await pool.query('SELECT COUNT(*) FROM Match_Seat_Map WHERE match_id = $1 AND block_id = $2', [matchId, blockId]);
  console.log('Seat Count:', sRes.rows[0]);
  pool.end();
}
check();

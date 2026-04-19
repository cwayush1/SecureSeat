const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  const bRes = await pool.query("SELECT b.id, b.name, st.id as stand_id FROM Blocks b JOIN Stands st ON st.id = b.stand_id WHERE st.stadium_id = 'wankhede' AND st.name = 'NE Upper'");
  console.log(bRes.rows);
  pool.end();
}
check();

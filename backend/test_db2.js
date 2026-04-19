const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    const stands = await pool.query('SELECT id, stadium_id FROM Stands');
    console.log('--- ALL STANDS ---');
    console.log(stands.rows.map(r=>`${r.stadium_id}: ${r.id}`));
    const seats = await pool.query('SELECT stadium_id, COUNT(*) as seats FROM Seats GROUP BY stadium_id');
    console.log('--- SEAT COUNTS BY STADIUM ---');
    console.log(seats.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();

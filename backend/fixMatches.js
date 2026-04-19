const { Pool } = require('pg');
require('dotenv').config();

const STADIUMS = {
  eden_gardens: [
    { id: 'eg_club', base: 40000 }, { id: 'eg_b', base: 8000 }, { id: 'eg_a', base: 8000 },
    { id: 'eg_h', base: 5000 }, { id: 'eg_g', base: 5000 }, { id: 'eg_f', base: 5000 },
    { id: 'eg_vip', base: 25000 }, { id: 'eg_exec_n', base: 7000 }, { id: 'eg_exec_s', base: 7000 },
    { id: 'eg_gen_e', base: 3000 }, { id: 'eg_gen_w', base: 3000 }, { id: 'eg_u1', base: 1500 },
    { id: 'eg_u2', base: 1500 }, { id: 'eg_u3', base: 1200 }
  ],
  ahmedabad: [
    { id: 'l_n', base: 4000 }, { id: 'l_ne', base: 2500 }, { id: 'l_e', base: 3500 }, { id: 'l_se', base: 2500 },
    { id: 'l_s', base: 4000 }, { id: 'l_sw', base: 2500 }, { id: 'l_w', base: 3500 }, { id: 'l_nw', base: 2500 },
    { id: 'c_n', base: 20000 }, { id: 'c_e', base: 12000 }, { id: 'c_s', base: 35000 }, { id: 'c_w', base: 12000 },
    { id: 'u_n', base: 1200 }, { id: 'u_e1', base: 1500 }, { id: 'u_e2', base: 1500 }, { id: 'u_s', base: 1200 },
    { id: 'u_w1', base: 1500 }, { id: 'u_w2', base: 1500 }
  ]
};

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fixMatches() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const matches = await client.query("SELECT id, stadium_id FROM Matches WHERE stadium_id IN ('eden_gardens', 'ahmedabad')");
    
    for (const match of matches.rows) {
      console.log(`Fixing match ${match.id} (${match.stadium_id})`);
      // Delete old mismatched config
      await client.query("DELETE FROM Match_Stands_Config WHERE match_id = $1", [match.id]);
      
      const stands = STADIUMS[match.stadium_id];
      for (const stand of stands) {
        await client.query(
          "INSERT INTO Match_Stands_Config (match_id, stand_id, base_price) VALUES ($1, $2, $3)",
          [match.id, stand.id, stand.base]
        );
      }
    }
    
    await client.query('COMMIT');
    console.log("✅ Match fixes applied successfully.");
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Failed to fix matches", err);
  } finally {
    client.release();
    pool.end();
  }
}

fixMatches();

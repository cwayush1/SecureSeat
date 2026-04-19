const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const stads = [
    { id: 'wankhede', layout: require('../frontend/src/stadiums/stad1.js').default },
    { id: 'eden_gardens', layout: require('../frontend/src/stadiums/stad2.js').default },
    { id: 'ahmedabad', layout: require('../frontend/src/stadiums/stad3.js').default }
  ];

  const client = await pool.connect();
  try {
      for (const stad of stads) {
        await client.query('BEGIN');
        
        let pricing_tiers = stad.layout.stands.map(s => ({
            stand_id: s.id,
            base_price: s.base
        }));

        console.log(`Trying to insert match for ${stad.id}...`);

        const matchResult = await client.query(
            'INSERT INTO Matches (team_a, team_b, stadium_id, date) VALUES ($1, $2, $3, $4) RETURNING *',
            ['A', 'B', stad.id, '2025-05-01T10:00']
        );
        const newMatch = matchResult.rows[0];

        for (let tier of pricing_tiers) {
            await client.query(
                'INSERT INTO Match_Stands_Config (match_id, stand_id, base_price) VALUES ($1, $2, $3)',
                [newMatch.id, tier.stand_id, tier.base_price]
            );
        }

        console.log(`Success for ${stad.id}!`);
        await client.query('ROLLBACK');
      }
  } catch (error) {
      console.error('Failed to create match:', error);
      await client.query('ROLLBACK');
  } finally {
      client.release();
      pool.end();
  }
}

run();

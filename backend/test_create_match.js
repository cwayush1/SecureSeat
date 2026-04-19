const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const matchData = { team_a: 'A', team_b: 'B', stadium_id: 'ahmedabad', date: '2025-05-01T10:00' };
  
  const stadiumLayout = require('../frontend/src/stadiums/stad3.js').default;
  let pricing_tiers = [];
  if (stadiumLayout && stadiumLayout.stands) {
      pricing_tiers = stadiumLayout.stands.map(stand => ({
          stand_id: stand.id,
          base_price: stand.base
      }));
  }

  const client = await pool.connect();
  try {
      await client.query('BEGIN');
      const matchResult = await client.query(
          'INSERT INTO Matches (team_a, team_b, stadium_id, date) VALUES ($1, $2, $3, $4) RETURNING *',
          [matchData.team_a, matchData.team_b, matchData.stadium_id, matchData.date]
      );
      const newMatch = matchResult.rows[0];

      if (pricing_tiers && pricing_tiers.length > 0) {
          for (let tier of pricing_tiers) {
              await client.query(
                  'INSERT INTO Match_Stands_Config (match_id, stand_id, base_price) VALUES ($1, $2, $3)',
                  [newMatch.id, tier.stand_id, tier.base_price]
              );
          }
      }

      await client.query('ROLLBACK'); // rollback instead of commit for testing
      console.log('Match inserted successfully during test format');
  } catch (error) {
      await client.query('ROLLBACK');
      console.error('Failed to create match:', error);
  } finally {
      client.release();
      pool.end();
  }
}

run();

const pool = require('./src/config/db');
require('dotenv').config();

const wankhedeData = {
  id: 'wankhede', // This becomes the SLUG
  name: 'Wankhede Stadium', city: 'Mumbai', capacity: 33108,
  stands: [
    { id: 'vip_p', name: 'VVIP', type: 'VVIP Premium', color: '#ee25c9', start: 260, end: 280, inner: 0.22, outer: 0.42, base: 35000, mult: 2.0, cap: 800 },
    { id: 'i1', name: 'N Lower A', type: 'Premium Tier', color: '#06daffed', start: 220, end: 260, inner: 0.22, outer: 0.42, base: 9000, mult: 1.5, cap: 2200 },
    { id: 'i2', name: 'N Lower B', type: 'Premium Tier', color: '#06daffed', start: 280, end: 320, inner: 0.22, outer: 0.42, base: 9000, mult: 1.5, cap: 2200 },
    { id: 'i3', name: 'East Lower', type: 'Club Tier', color: '#ff4000ed', start: 320, end: 400, inner: 0.22, outer: 0.42, base: 5000, mult: 1.3, cap: 3400 },
    { id: 'i4', name: 'South Pavilion', type: 'VVIP Premium', color: '#06daffed', start: 40, end: 140, inner: 0.22, outer: 0.42, base: 15000, mult: 1.8, cap: 4200 },
    { id: 'i5', name: 'West Lower', type: 'Club Tier', color: '#ff4000ed', start: 140, end: 220, inner: 0.22, outer: 0.42, base: 5000, mult: 1.3, cap: 3200 },
    { id: 'm1', name: 'North Executive', type: 'Executive Tier', color: '#e8133a', start: 220, end: 320, inner: 0.42, outer: 0.65, base: 7500, mult: 1.4, cap: 4800 },
    { id: 'vip_g', name: 'South Grandstand', type: 'VIP Elite', color: '#e8133a', start: 60, end: 120, inner: 0.42, outer: 0.65, base: 22000, mult: 1.9, cap: 2000 },
    { id: 'm2', name: 'East Grandstand', type: 'General', color: '#ae00ff', start: 320, end: 420, inner: 0.42, outer: 0.65, base: 3500, mult: 1.1, cap: 5200 },
    { id: 'm4', name: 'West Grandstand', type: 'General', color: '#ae00ff', start: 120, end: 220, inner: 0.42, outer: 0.65, base: 3500, mult: 1.1, cap: 5000 },
    { id: 'o1', name: 'NW Upper', type: 'Upper Deck', color: '#2c19be', start: 180, end: 270, inner: 0.65, outer: 0.95, base: 2500, mult: 1.0, cap: 6000 },
    { id: 'o2', name: 'NE Upper', type: 'Upper Deck', color: '#50ce07', start: 270, end: 360, inner: 0.65, outer: 0.95, base: 2500, mult: 1.0, cap: 6000 },
    { id: 'o3', name: 'SE Upper', type: 'Upper Deck', color: '#3b43b6', start: 0, end: 90, inner: 0.65, outer: 0.95, base: 1800, mult: 0.9, cap: 7000 },
    { id: 'o4', name: 'SW Upper', type: 'Upper Deck', color: '#3dc828', start: 90, end: 180, inner: 0.65, outer: 0.95, base: 1800, mult: 0.9, cap: 7000 }
  ]
};

const edenGardensData = {
  id: 'eden_gardens', // This becomes the SLUG
  name: 'Eden Gardens', city: 'Kolkata', capacity: 66349,
  stands: [
    { id: 'eg_club', name: 'Club House', type: 'VVIP Premium', color: '#FFB300', start: 250, end: 290, inner: 0.20, outer: 0.40, base: 40000, mult: 2.2, cap: 600 },
    { id: 'eg_b', name: 'B Block', type: 'Premium Tier', color: '#6A1B9A', start: 290, end: 360, inner: 0.20, outer: 0.40, base: 8000, mult: 1.6, cap: 3000 },
    { id: 'eg_a', name: 'A Block', type: 'Premium Tier', color: '#6A1B9A', start: 0, end: 70, inner: 0.20, outer: 0.40, base: 8000, mult: 1.6, cap: 3000 },
    { id: 'eg_h', name: 'H Block', type: 'Club Tier', color: '#0277BD', start: 70, end: 130, inner: 0.20, outer: 0.40, base: 5000, mult: 1.3, cap: 4000 },
    { id: 'eg_g', name: 'G Block', type: 'Club Tier', color: '#0277BD', start: 130, end: 190, inner: 0.20, outer: 0.40, base: 5000, mult: 1.3, cap: 3800 },
    { id: 'eg_f', name: 'F Block', type: 'Club Tier', color: '#0277BD', start: 190, end: 250, inner: 0.20, outer: 0.40, base: 5000, mult: 1.3, cap: 3600 },
    { id: 'eg_vip', name: 'VIP Pavilion', type: 'VIP Elite', color: '#FF8F00', start: 255, end: 285, inner: 0.40, outer: 0.62, base: 25000, mult: 2.0, cap: 1200 },
    { id: 'eg_exec_n', name: 'North Executive', type: 'Executive Tier', color: '#4527A0', start: 285, end: 360, inner: 0.40, outer: 0.62, base: 7000, mult: 1.5, cap: 5500 },
    { id: 'eg_exec_s', name: 'South Executive', type: 'Executive Tier', color: '#4527A0', start: 0, end: 75, inner: 0.40, outer: 0.62, base: 7000, mult: 1.5, cap: 5500 },
    { id: 'eg_gen_e', name: 'East General', type: 'General', color: '#00838F', start: 75, end: 185, inner: 0.40, outer: 0.62, base: 3000, mult: 1.1, cap: 9000 },
    { id: 'eg_gen_w', name: 'West General', type: 'General', color: '#00838F', start: 185, end: 255, inner: 0.40, outer: 0.62, base: 3000, mult: 1.1, cap: 8500 },
    { id: 'eg_u1', name: 'Upper North', type: 'Upper Deck', color: '#4DD0E1', start: 230, end: 360, inner: 0.62, outer: 0.95, base: 1500, mult: 0.9, cap: 10000 },
    { id: 'eg_u2', name: 'Upper South', type: 'Upper Deck', color: '#26C6DA', start: 0, end: 120, inner: 0.62, outer: 0.95, base: 1500, mult: 0.9, cap: 10000 },
    { id: 'eg_u3', name: 'Upper East', type: 'Upper Deck', color: '#4DD0E1', start: 120, end: 230, inner: 0.62, outer: 0.95, base: 1200, mult: 0.8, cap: 8000 }
  ]
};

const ahmedabadData = {
  id: 'ahmedabad', // This becomes the SLUG
  name: 'Narendra Modi Stadium', city: 'Ahmedabad', capacity: 132000,
  stands: [
    { id: 'l_n', name: 'North Lower', type: 'Premium Tier', color: '#00b4d8', start: 340, end: 380, inner: 0.22, outer: 0.48, base: 4000, mult: 1.5, cap: 6500 },
    { id: 'l_ne', name: 'NE Lower', type: 'General', color: '#0077b6', start: 20, end: 70, inner: 0.22, outer: 0.48, base: 2500, mult: 1.2, cap: 8000 },
    { id: 'l_e', name: 'East Lower', type: 'Club Tier', color: '#00b4d8', start: 70, end: 110, inner: 0.22, outer: 0.48, base: 3500, mult: 1.3, cap: 7000 },
    { id: 'l_se', name: 'SE Lower', type: 'General', color: '#0077b6', start: 110, end: 160, inner: 0.22, outer: 0.48, base: 2500, mult: 1.2, cap: 8000 },
    { id: 'l_s', name: 'South Lower', type: 'Premium Tier', color: '#00b4d8', start: 160, end: 200, inner: 0.22, outer: 0.48, base: 4000, mult: 1.5, cap: 6500 },
    { id: 'l_sw', name: 'SW Lower', type: 'General', color: '#0077b6', start: 200, end: 250, inner: 0.22, outer: 0.48, base: 2500, mult: 1.2, cap: 8000 },
    { id: 'l_w', name: 'West Lower', type: 'Club Tier', color: '#00b4d8', start: 250, end: 290, inner: 0.22, outer: 0.48, base: 3500, mult: 1.3, cap: 7000 },
    { id: 'l_nw', name: 'NW Lower', type: 'General', color: '#0077b6', start: 290, end: 340, inner: 0.22, outer: 0.48, base: 2500, mult: 1.2, cap: 8000 },
    { id: 'c_n', name: 'North VIP Box', type: 'VIP Elite', color: '#ffb703', start: 330, end: 390, inner: 0.48, outer: 0.60, base: 20000, mult: 1.8, cap: 1500 },
    { id: 'c_e', name: 'East Corporate', type: 'Executive', color: '#fb8500', start: 30, end: 150, inner: 0.48, outer: 0.60, base: 12000, mult: 1.6, cap: 3500 },
    { id: 'c_s', name: 'Presidential Box', type: 'VVIP Premium', color: '#ffb703', start: 150, end: 210, inner: 0.48, outer: 0.60, base: 35000, mult: 2.5, cap: 1000 },
    { id: 'c_w', name: 'West Corporate', type: 'Executive', color: '#fb8500', start: 210, end: 330, inner: 0.48, outer: 0.60, base: 12000, mult: 1.6, cap: 3500 },
    { id: 'u_n', name: 'North Upper', type: 'Upper Deck', color: '#800f2f', start: 330, end: 390, inner: 0.60, outer: 0.96, base: 1200, mult: 1.0, cap: 12000 },
    { id: 'u_e1', name: 'East Upper N', type: 'Upper Deck', color: '#ff4d6d', start: 30, end: 90, inner: 0.60, outer: 0.96, base: 1500, mult: 1.0, cap: 12000 },
    { id: 'u_e2', name: 'East Upper S', type: 'Upper Deck', color: '#c9184a', start: 90, end: 150, inner: 0.60, outer: 0.96, base: 1500, mult: 1.0, cap: 12000 },
    { id: 'u_s', name: 'South Upper', type: 'Upper Deck', color: '#800f2f', start: 150, end: 210, inner: 0.60, outer: 0.96, base: 1200, mult: 1.0, cap: 12000 },
    { id: 'u_w1', name: 'West Upper S', type: 'Upper Deck', color: '#ff4d6d', start: 210, end: 270, inner: 0.60, outer: 0.96, base: 1500, mult: 1.0, cap: 12000 },
    { id: 'u_w2', name: 'West Upper N', type: 'Upper Deck', color: '#c9184a', start: 270, end: 330, inner: 0.60, outer: 0.96, base: 1500, mult: 1.0, cap: 12000 }
  ]
};

const stadiumsToSeed = [wankhedeData, edenGardensData, ahmedabadData];

async function seedDatabase() {
  console.log("🌱 Starting Database Seeding...");
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (let stadium of stadiumsToSeed) {
      const exists = await client.query('SELECT id FROM Stadiums WHERE slug = $1', [stadium.id]);

      if (exists.rows.length === 0) {
        console.log(`Inserting ${stadium.name}...`);
        await client.query(
          `INSERT INTO Stadiums (slug, name, city, capacity, layout_data) 
                     VALUES ($1, $2, $3, $4, $5)`,
          [
            stadium.id, // SLUG mapping
            stadium.name,
            stadium.city,
            stadium.capacity,
            JSON.stringify({ stands: stadium.stands })
          ]
        );
      } else {
        console.log(`⏩ ${stadium.name} already exists, skipping.`);
      }
    }

    await client.query('COMMIT');
    console.log("✅ Seeding Complete! Stadiums inserted with auto-generated Integer IDs.");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("❌ Seeding Error:", error);
  } finally {
    client.release();
    process.exit();
  }
}

seedDatabase();
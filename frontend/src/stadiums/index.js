// ─── Stadium registry ─────────────────────────────────────────────────────────
// Add new stadiums here and they'll be auto-available everywhere.

import stad1    from './stad1';
import stad2 from './stad2';
import stad3 from './stad3';

const STADIUMS = {
  stad1,
  stad2,
  stad3
};

// Look up a stadium by its id string
export function getStadium(id) {
  return STADIUMS[id] ?? null;
}

// All stadiums as an array (useful for dropdowns / listings)
export function getAllStadiums() {
  return Object.values(STADIUMS);
}

export default STADIUMS;
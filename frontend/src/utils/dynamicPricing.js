// ─── Dynamic Pricing Engine ──────────────────────────────────────────────────
// Computes a real-time multiplier based on genuine market factors.
// Rule: Multiplier NEVER drops below 1.0 — prices only go UP, never below base.
//
// Factors:
//   1. TIME URGENCY   — Exponential rise as match date approaches
//   2. SEAT SCARCITY  — Cubic curve as occupancy increases
//   3. TIER DEMAND    — VIP/Premium stands have inherently higher demand weight
//   4. BOOKING CRAZE  — High occupancy with many days left = wild demand signal
//   5. LAST 24H HEAT  — If recent bookings are aggressive, amplify the multiplier

// ─── Tier demand weights ─────────────────────────────────────────────────────
const TIER_WEIGHTS = {
  'VVIP Premium':   1.25,
  'VIP Elite':      1.20,
  'Premium Tier':   1.15,
  'Executive Tier': 1.10,
  'Executive':      1.10,
  'Club Tier':      1.08,
  'General':        1.00,
  'Upper Deck':     1.00,
};

/**
 * Compute the dynamic pricing multiplier for a stand.
 *
 * @param {Object} params
 * @param {number} params.daysLeft       — Days remaining until the match (0 = match day)
 * @param {number} params.occupancyRatio — Fraction of seats sold (0.0 to 1.0)
 * @param {string} params.standType      — Stand type string from stadium data (e.g. 'VVIP Premium')
 * @param {number} params.totalSeats     — Total seat capacity for the stand
 * @param {number} params.availableSeats — Currently available seats
 * @param {number} [params.recentBookings24h=0] — Number of bookings in last 24h (if available)
 * @returns {{ multiplier: number, factors: Object }} — The final multiplier and breakdown
 */
export function computeDynamicMultiplier({
  daysLeft,
  occupancyRatio,
  standType,
  totalSeats,
  availableSeats,
  recentBookings24h = 0,
}) {
  // ── 1. TIME URGENCY (exponential decay curve) ──────────────────────────────
  // daysLeft ≥ 30  → factor ≈ 1.001 (negligible)
  // daysLeft = 14  → factor ≈ 1.03
  // daysLeft = 7   → factor ≈ 1.12
  // daysLeft = 3   → factor ≈ 1.27
  // daysLeft = 1   → factor ≈ 1.41
  // daysLeft = 0   → factor = 1.50 (match day peak)
  const clampedDays = Math.max(0, daysLeft);
  const timeFactor = 1 + 0.5 * Math.exp(-clampedDays / 5);

  // ── 2. SEAT SCARCITY (cubic power curve) ───────────────────────────────────
  // occupancy 0%   → 1.00
  // occupancy 30%  → 1.02
  // occupancy 50%  → 1.09
  // occupancy 70%  → 1.24
  // occupancy 85%  → 1.43
  // occupancy 95%  → 1.60
  // occupancy 100% → 1.70
  const clampedOcc = Math.max(0, Math.min(1, occupancyRatio));
  const scarcityFactor = 1 + 0.7 * Math.pow(clampedOcc, 3);

  // ── 3. TIER DEMAND WEIGHT ──────────────────────────────────────────────────
  // Premium stands inherently attract more demand
  const tierFactor = TIER_WEIGHTS[standType] || 1.0;

  // ── 4. BOOKING CRAZE BONUS ─────────────────────────────────────────────────
  // If occupancy > 40% AND many days left (>5), it means tickets are selling
  // at a much faster-than-expected pace → implies viral/craze demand.
  // This only INCREASES the multiplier, never decreases.
  let crazeBonus = 1.0;
  if (clampedOcc > 0.4 && clampedDays > 5) {
    // The further above 40% with more days left, the crazier the demand
    crazeBonus = 1 + 0.25 * (clampedOcc - 0.4);
  }

  // ── 5. LAST 24H HEAT (asymmetric — only amplifies, never dampens) ──────────
  // If there were aggressive bookings in the last 24h, amplify the multiplier.
  // If bookings were silent (0), this factor stays at 1.0 — NO penalty.
  let heatFactor = 1.0;
  if (totalSeats > 0 && recentBookings24h > 0) {
    // "Hot rate" = what % of total seats were booked in just the last 24h
    const hotRate = recentBookings24h / totalSeats;
    // If >5% of total seats sold in 24h, that's hot. >15% is wild.
    if (hotRate > 0.05) {
      heatFactor = 1 + 0.4 * Math.min(hotRate / 0.15, 1); // caps at 1.4
    }
  }

  // ── FINAL MULTIPLIER (multiplicative combination) ──────────────────────────
  let multiplier = timeFactor * scarcityFactor * tierFactor * crazeBonus * heatFactor;

  // GOLDEN RULE: Never go below 1.0 — prices only surge, never discount
  multiplier = Math.max(1.0, multiplier);

  // Cap at 3.5x to prevent extreme pricing
  multiplier = Math.min(3.5, multiplier);

  // Round to 2 decimal places
  multiplier = Math.round(multiplier * 100) / 100;

  return {
    multiplier,
    factors: {
      time: Math.round(timeFactor * 100) / 100,
      scarcity: Math.round(scarcityFactor * 100) / 100,
      tier: tierFactor,
      craze: Math.round(crazeBonus * 100) / 100,
      heat24h: Math.round(heatFactor * 100) / 100,
    },
  };
}

/**
 * Compute the final dynamic price for a stand.
 *
 * @param {number} basePrice — The stand's base ticket price
 * @param {Object} params    — Same params as computeDynamicMultiplier
 * @returns {{ price: number, multiplier: number, factors: Object }}
 */
export function computeDynamicPrice(basePrice, params) {
  const { multiplier, factors } = computeDynamicMultiplier(params);
  return {
    price: Math.round(basePrice * multiplier),
    basePrice,
    multiplier,
    factors,
  };
}

/**
 * Get a human-readable demand level label + emoji from the multiplier.
 */
export function getDemandLevel(multiplier) {
  if (multiplier >= 2.5) return { label: 'EXTREME DEMAND', emoji: '🔥🔥🔥', color: '#ff0000' };
  if (multiplier >= 2.0) return { label: 'VERY HIGH DEMAND', emoji: '🔥🔥', color: '#ff4500' };
  if (multiplier >= 1.5) return { label: 'HIGH DEMAND', emoji: '🔥', color: '#ff8c00' };
  if (multiplier >= 1.2) return { label: 'MODERATE DEMAND', emoji: '📈', color: '#ffa500' };
  if (multiplier >= 1.05) return { label: 'STEADY', emoji: '📊', color: '#4caf50' };
  return { label: 'NORMAL', emoji: '✅', color: '#2196f3' };
}

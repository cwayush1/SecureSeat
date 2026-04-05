const dbPool = require('../config/db');

// @desc    Get all upcoming matches
// @route   GET /api/matches
// @access  Public
const getMatches = async (req, res) => {
    try {
        const matches = await dbPool.query('SELECT * FROM Matches ORDER BY date ASC');
        res.status(200).json(matches.rows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch matches', error: error.message });
    }
};

// @desc    Add a new match (Admin Only)
// @route   POST /api/matches
// @access  Private/Admin
// @desc    Add a new match WITH tiered pricing (Admin Only)
// @route   POST /api/matches
// @access  Private/Admin
const addMatch = async (req, res) => {
    // pricing_tiers should be an array like: [{ tier: 'VIP', price: 5000 }, { tier: 'General', price: 1000 }]
    const { team_a, team_b, stadium_id, date, pricing_tiers } = req.body;

    const client = await dbPool.connect();

    try {
        await client.query('BEGIN'); // Start transaction for safety

        // 1. Create the Match
        const matchResult = await client.query(
            'INSERT INTO Matches (team_a, team_b, stadium_id, date) VALUES ($1, $2, $3, $4) RETURNING *',
            [team_a, team_b, stadium_id, date]
        );
        const newMatch = matchResult.rows[0];

        // 2. Add the Pricing Engine logic (Base price for different types of seats)
        if (pricing_tiers && pricing_tiers.length > 0) {
            for (let tier of pricing_tiers) {
                await client.query(
                    'INSERT INTO Match_Pricing (match_id, tier_name, price) VALUES ($1, $2, $3)',
                    [newMatch.id, tier.tier, tier.price]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Match and pricing created successfully!', match: newMatch });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Failed to create match', error: error.message });
    } finally {
        client.release();
    }
};
// @desc    Get pricing and booked seats for a specific match
// @route   GET /api/matches/:id/seats
// @access  Public
const getMatchSeatsAndPricing = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Get the pricing for different tiers
        const pricing = await dbPool.query('SELECT tier_name, price FROM Match_Pricing WHERE match_id = $1', [id]);
        
        // 2. Get seats that are ALREADY booked (so the frontend makes them unclickable)
        const bookedSeats = await dbPool.query('SELECT seat_id FROM Tickets WHERE match_id = $1 AND status = $2', [id, 'Booked']);

        res.status(200).json({
            pricing: pricing.rows,
            booked_seats: bookedSeats.rows.map(row => row.seat_id) // Returns an array like ['A1', 'A2', 'B5']
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch seat data', error: error.message });
    }
};

module.exports = { getMatches, addMatch, getMatchSeatsAndPricing }; // <-- Update exports


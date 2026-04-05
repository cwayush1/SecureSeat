const dbPool = require('../config/db');

// @desc    Fetch ticket details and biometric vector for gate security
// @route   GET /api/security/ticket/:ticketId
// @access  Private (Security Role)
const getTicketForVerification = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const ticket = await dbPool.query(`
            SELECT t.id, t.seat_id, t.status, t.face_embedding, 
                   u.name as user_name
            FROM Tickets t
            JOIN Users u ON t.user_id = u.id
            WHERE t.id = $1
        `, [ticketId]);

        if (ticket.rows.length === 0) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        // Return the ticket info and the 128-dimensional array for the AI service
        res.status(200).json(ticket.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving ticket', error: error.message });
    }
};

module.exports = { getTicketForVerification };
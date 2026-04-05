const express = require('express');
const router = express.Router();
const { getMatches, addMatch , getMatchSeatsAndPricing} = require('../controllers/matchController');
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');

router.route('/')
    .get(getMatches)
    .post(protect, admin, addMatch);
router.get('/:id/seats',getMatchSeatsAndPricing);
module.exports = router;
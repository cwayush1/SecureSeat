const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    createPaymentOrder,
    verifyPayment,
    handlePaymentFailure,
    getPaymentHistory,
    getPaymentDetails,
    refundPayment,
    handleRazorpayWebhook
} = require('../controllers/paymentController');

// Public route for Razorpay webhook notifications
router.post('/webhook', handleRazorpayWebhook);

// Protected routes (User must be authenticated)
router.use(protect);

// POST /api/payments/create-order - Initialize Razorpay order
router.post('/create-order', createPaymentOrder);

// POST /api/payments/verify-payment - Verify signature and finalize payment
router.post('/verify-payment', verifyPayment);

// POST /api/payments/handle-payment-failure - Record failed payment attempt
router.post('/handle-payment-failure', handlePaymentFailure);

// GET /api/payments/history - User's past transactions
router.get('/history', getPaymentHistory);

// GET /api/payments/:paymentId - Get specific payment status
router.get('/:paymentId', getPaymentDetails);

// POST /api/payments/refund - Refund a completed transaction
router.post('/refund', refundPayment);

module.exports = router;

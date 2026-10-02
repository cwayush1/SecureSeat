const Razorpay = require("razorpay");

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
    console.warn("⚠️ Warning: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing from environment variables.");
}

const razorpay = new Razorpay({
    key_id: keyId || '',
    key_secret: keySecret || ''
});

module.exports = razorpay;
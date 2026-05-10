const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getPricingInfo } = require('../controllers/paymentController');

// For simplicity, we'll assume authentication is handled by a middleware if needed
// But for now, we'll expose the routes as per the instructions
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/pricing-info', getPricingInfo);

module.exports = router;

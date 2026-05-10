const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// For simplicity, we'll assume authentication is handled by a middleware if needed
// But for now, we'll expose the routes as per the instructions
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

module.exports = router;

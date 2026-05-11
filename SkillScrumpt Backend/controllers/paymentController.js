const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail, templates } = require('../utils/mailService');

// Initialize Razorpay lazily to ensure env vars are loaded
let razorpay;
const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

/**
 * @desc    Create a new Razorpay order
 * @route   POST /api/v1/payments/create-order
 * @access  Private (Assume user is authenticated)
 */
exports.createOrder = async (req, res) => {
  try {
    const { currency = 'INR', receipt = 'receipt_' + Date.now(), userId } = req.body;

    // Calculate price based on promotion: first 200 users get it for ₹1
    const proUserCount = await User.countDocuments({ isPro: true });
    let amount = 100; // Default to promo price (100 paise = ₹1)

    if (proUserCount >= 200) {
      // Find user to determine role-based price
      const user = await User.findById(userId);
      if (user && user.role === 'client') {
        amount = 4900; // ₹49 for clients
      } else {
        amount = 6900; // ₹69 for professionals/default
      }
    }

    const options = {
      amount: amount, // amount in the smallest currency unit (paise)
      currency: currency,
      receipt: receipt,
    };

    const order = await getRazorpay().orders.create(options);

    if (!order) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create Razorpay order',
      });
    }

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Verify Razorpay payment signature
 * @route   POST /api/v1/payments/verify-payment
 * @access  Private
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification fields',
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Signature matches - Payment is successful
      
      // Update user to Pro status if userId is provided
      const { userId } = req.body;
      if (userId) {
        const user = await User.findByIdAndUpdate(userId, { isPro: true }, { new: true });
        
        // Send Pro Upgrade Email
        try {
          const template = templates.proUpgrade(user.firstName);
          await sendEmail(user.email, template.subject, template.html);
        } catch (mailErr) {
          console.error('Failed to send pro upgrade email:', mailErr);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully and account upgraded to Pro',
      });
    } else {
      // Signature mismatch
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Razorpay Verify Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current pricing info for Pro upgrade
 * @route   GET /api/v1/payments/pricing-info
 * @access  Public
 */
exports.getPricingInfo = async (req, res) => {
  try {
    const proUserCount = await User.countDocuments({ isPro: true });
    const limit = 200;
    const isPromoActive = proUserCount < limit;
    
    res.status(200).json({
      success: true,
      currentPrice: isPromoActive ? 1 : 69, // Default to professional price
      professionalPrice: isPromoActive ? 1 : 69,
      clientPrice: isPromoActive ? 1 : 49,
      isPromoActive: isPromoActive,
      remainingPromoSpots: Math.max(0, limit - proUserCount),
      totalProUsers: proUserCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing info',
      error: error.message
    });
  }
};

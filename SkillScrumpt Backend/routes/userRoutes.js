const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getProfessionals, 
  updateUserProfile,
  forgotPassword,
  resetPassword,
  desktopHandoff,
  getStats,
  getFeedbacks,
  addFeedback
} = require('../controllers/userController');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/desktop-handoff', protect, desktopHandoff);

router.get('/profile/:id', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/professionals', protect, getProfessionals);
router.get('/stats', getStats);

// Diagnostic Route
router.get('/mail-test', async (req, res) => {
  const { sendEmail } = require('../utils/mailService');
  try {
    await sendEmail(process.env.EMAIL_USER, 'SkillScrumpt Live Diagnostic', '<h1>System Check</h1><p>Your live environment is correctly configured to send mail.</p>');
    res.json({ success: true, message: `Test email sent to ${process.env.EMAIL_USER}` });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message, 
      code: error.code,
      tip: 'Check Render Env Vars and ensure App Password is used.' 
    });
  }
});

// Feedbacks
router.get('/feedbacks', getFeedbacks);
router.post('/feedbacks', protect, addFeedback);

module.exports = router;

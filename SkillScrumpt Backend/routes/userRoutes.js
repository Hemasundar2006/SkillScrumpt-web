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

// Feedbacks
router.get('/feedbacks', getFeedbacks);
router.post('/feedbacks', protect, addFeedback);

module.exports = router;

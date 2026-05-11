const express = require('express');
const { registerUser, loginUser, getUserProfile, getProfessionals, updateUserProfile } = require('../controllers/userController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/professionals', protect, getProfessionals);
router.get('/stats', require('../controllers/userController').getStats);

// Feedbacks
const { getFeedbacks, addFeedback } = require('../controllers/userController');
router.get('/feedbacks', getFeedbacks);
router.post('/feedbacks', protect, addFeedback);

module.exports = router;

const express = require('express');
const { registerUser, loginUser, getUserProfile, getProfessionals } = require('../controllers/userController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', protect, getUserProfile);
router.get('/professionals', protect, getProfessionals);

module.exports = router;

const express = require('express');
const { 
  createReview,
  getUserReviews
} = require('../controllers/reviewController');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/user/:userId', getUserReviews);

module.exports = router;

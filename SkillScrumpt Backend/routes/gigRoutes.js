const express = require('express');
const { 
  createGig,
  getGigs,
  getGigById,
  buyGig
} = require('../controllers/gigController');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getGigs)
  .post(protect, authorize('professional'), createGig);

router.route('/:id')
  .get(getGigById);

router.post('/:id/buy', protect, authorize('client'), buyGig);

module.exports = router;

const express = require('express');
const { 
  getAssessments, 
  getAssessmentById, 
  submitResult,
  getMyResults
} = require('../controllers/assessmentController');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getAssessments);
router.get('/my-results', protect, getMyResults);
router.get('/:id', protect, getAssessmentById);
router.post('/:id/submit', protect, authorize('professional'), submitResult);

module.exports = router;

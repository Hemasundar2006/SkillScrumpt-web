const express = require('express');
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  applyToProject,
  getProjectBids
} = require('../controllers/projectController');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('professional', 'admin', 'client'), getProjects)
  .post(protect, authorize('client', 'admin'), createProject);

router.get('/:id', protect, getProjectById);
router.post('/:id/apply', protect, authorize('professional'), applyToProject);
router.get('/:id/bids', protect, authorize('client'), getProjectBids);

module.exports = router;

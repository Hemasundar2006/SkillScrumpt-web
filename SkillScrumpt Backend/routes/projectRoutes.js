const express = require('express');
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  placeBid,
  getProjectBids,
  acceptBid,
  getMyBids
} = require('../controllers/projectController');
const router = express.Router();

const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');

router.get('/my-bids', protect, authorize('professional'), getMyBids);

router.route('/')
  .get(optionalProtect, getProjects)
  .post(protect, authorize('client', 'admin'), createProject);

router.get('/:id', optionalProtect, getProjectById);
router.post('/:id/bid', protect, authorize('professional'), placeBid);
router.get('/:id/bids', protect, authorize('client'), getProjectBids);
router.post('/:id/bids/:bidId/accept', protect, authorize('client'), acceptBid);

module.exports = router;

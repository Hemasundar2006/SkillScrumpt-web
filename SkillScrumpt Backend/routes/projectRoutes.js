const express = require('express');
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  placeBid,
  getProjectBids,
  acceptBid,
  getMyBids,
  createMessage,
  getProjectMessages,
  addProjectMilestone,
  fundProjectMilestone,
  releaseProjectMilestone,
  completeProjectMilestone,
  disputeProjectMilestone,
  resolveProjectDispute,
  logProjectTime
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

// Workspace Action Routes
router.route('/:id/messages')
  .get(protect, getProjectMessages)
  .post(protect, createMessage);

router.post('/:id/milestones', protect, authorize('client'), addProjectMilestone);
router.post('/:id/milestones/:milestoneId/fund', protect, authorize('client'), fundProjectMilestone);
router.post('/:id/milestones/:milestoneId/release', protect, authorize('client'), releaseProjectMilestone);
router.post('/:id/milestones/:milestoneId/complete', protect, authorize('professional'), completeProjectMilestone);
router.post('/:id/milestones/:milestoneId/dispute', protect, disputeProjectMilestone);
router.post('/:id/disputes/:disputeId/resolve', protect, resolveProjectDispute);
router.post('/:id/time-logs', protect, authorize('professional'), logProjectTime);

module.exports = router;

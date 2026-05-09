const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  getAllTransactions, 
  createAssessment, 
  getAllUsers,
  getSystemSettings,
  updateSystemSettings
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/transactions', getAllTransactions);
router.get('/users', getAllUsers);
router.post('/assessments', createAssessment);
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

module.exports = router;

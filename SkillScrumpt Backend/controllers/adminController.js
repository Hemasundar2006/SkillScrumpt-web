const User = require('../models/User');
const Project = require('../models/Project');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const Settings = require('../models/Settings');

// @desc    Get system settings
// @route   GET /api/v1/admin/settings
// @access  Private/Admin
exports.getSystemSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/v1/admin/settings
// @access  Private/Admin
exports.updateSystemSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findOneAndUpdate({}, req.body, { new: true });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const professionalCount = await User.countDocuments({ role: 'professional' });
    const clientCount = await User.countDocuments({ role: 'client' });
    const projectCount = await Project.countDocuments();
    const assessmentCount = await Assessment.countDocuments();
    
    // Calculate total volume (sum of all projects budget)
    const projects = await Project.find();
    const totalVolume = projects.reduce((acc, curr) => acc + (curr.budget || 0), 0);

    // Recent activity (last 5 users, last 5 projects)
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentProjects = await Project.find().populate('client', 'firstName lastName').sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: userCount,
        professionals: professionalCount,
        clients: clientCount,
        totalProjects: projectCount,
        totalAssessments: assessmentCount,
        totalVolume
      },
      recentActivity: {
        users: recentUsers,
        projects: recentProjects
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all transactions/payments
// @route   GET /api/v1/admin/transactions
// @access  Private/Admin
exports.getAllTransactions = async (req, res) => {
  try {
    // Since we don't have a Transaction model yet, we'll infer from projects with 'completed' status
    const completedProjects = await Project.find({ status: 'completed' })
      .populate('client', 'firstName lastName email')
      .populate('professional', 'firstName lastName email');

    const transactions = completedProjects.map(proj => ({
      _id: proj._id,
      amount: proj.budget,
      client: proj.client,
      professional: proj.professional,
      date: proj.updatedAt,
      status: 'success'
    }));

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create new assessment
// @route   POST /api/v1/admin/assessments
// @access  Private/Admin
exports.createAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.create(req.body);
    res.status(201).json({
      success: true,
      data: assessment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all users (Admin view)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

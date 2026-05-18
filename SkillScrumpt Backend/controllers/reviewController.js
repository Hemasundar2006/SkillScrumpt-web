const Review = require('../models/Review');
const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Create a review for a project contract
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { projectId, toUserId, rating, comment } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project contract not found.' });
    }

    // Verify user is part of the project
    const isClient = project.client.toString() === req.user._id.toString();
    const isProfessional = project.professional && project.professional.toString() === req.user._id.toString();

    if (!isClient && !isProfessional) {
      return res.status(403).json({ message: 'You are not authorized to review this contract.' });
    }

    // Verify project is completed or in_progress (allow reviews once project is wrapping up)
    if (project.status !== 'completed' && project.status !== 'in_progress') {
      return res.status(400).json({ message: 'Can only submit reviews for active or completed contracts.' });
    }

    const reviewType = isClient ? 'client_to_professional' : 'professional_to_client';

    const review = await Review.create({
      project: projectId,
      from: req.user._id,
      to: toUserId,
      rating,
      comment,
      reviewType
    });

    // Update target user's average rating
    const reviews = await Review.find({ to: toUserId });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((totalRating / reviews.length).toFixed(1));

    await User.findByIdAndUpdate(toUserId, { rating: avgRating });

    res.status(201).json({
      message: 'Review submitted successfully.',
      review
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already submitted a review for this contract.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews received by a specific user
// @route   GET /api/v1/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ to: req.params.userId })
      .populate('from', 'firstName lastName avatar rating')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

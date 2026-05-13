const Project = require('../models/Project');
const Bid = require('../models/Bid');

// @desc    Place a bid on a project
// @route   POST /api/v1/projects/:id/bid
exports.placeBid = async (req, res) => {
  try {
    const { amount, deliveryTime, coverLetter } = req.body;

    // Pro Check
    if (!req.user.isPro) {
      return res.status(403).json({ 
        message: 'PRO_ACCESS_REQUIRED: Only SkillScrumpt Pro members can place bids on projects.' 
      });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.status !== 'open') return res.status(400).json({ message: 'Project is no longer accepting bids' });

    const bid = await Bid.create({
      project: req.params.id,
      bidder: req.user._id,
      amount,
      deliveryTime,
      coverLetter
    });

    // Update project bids count
    await Project.findByIdAndUpdate(req.params.id, { $inc: { bidsCount: 1 } });

    res.status(201).json(bid);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already placed a bid on this project.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, budget, category, skillsRequired } = req.body;
    
    const project = await Project.create({
      title,
      description,
      client: req.user._id,
      budget,
      category,
      skillsRequired
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects
// @route   GET /api/v1/projects
exports.getProjects = async (req, res) => {
  try {
    const { mine } = req.query;
    let query = { status: 'open' };
    
    // If client specifically asks for their own projects
    if (mine === 'true' && req.user && req.user.role === 'client') {
      query = { client: req.user._id };
    }
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .populate('client', 'firstName lastName');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project details
// @route   GET /api/v1/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'firstName lastName')
      .populate('professional', 'firstName lastName');
    
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept a bid
// @route   POST /api/v1/projects/:id/bids/:bidId/accept
exports.acceptBid = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Only client can accept bid
    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to accept bids for this project' });
    }

    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    // Update Project
    project.status = 'in_progress';
    project.professional = bid.bidder;
    await project.save();

    // Update Bid
    bid.status = 'accepted';
    await bid.save();

    // Reject other bids
    await Bid.updateMany(
      { project: project._id, _id: { $ne: bid._id } },
      { status: 'rejected' }
    );

    res.json({ message: 'Bid accepted and project started', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bids for a project
// @route   GET /api/v1/projects/:id/bids
exports.getProjectBids = async (req, res) => {
  try {
    const bids = await Bid.find({ project: req.params.id })
      .populate('bidder', 'firstName lastName aiScore rating avatar skills');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get current user's bids
// @route   GET /api/v1/projects/my-bids
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .populate({
        path: 'project',
        select: 'title status budget client',
        populate: { path: 'client', select: 'firstName lastName' }
      });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

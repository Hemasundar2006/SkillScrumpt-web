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

const Message = require('../models/Message');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// --- WORKSPACE CHAT METHODS ---

// @desc    Send a message in project workspace
// @route   POST /api/v1/projects/:id/messages
exports.createMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Validate membership
    const isClient = project.client.toString() === req.user._id.toString();
    const isProfessional = project.professional && project.professional.toString() === req.user._id.toString();
    if (!isClient && !isProfessional) {
      return res.status(403).json({ message: 'Not authorized in this workspace' });
    }

    const message = await Message.create({
      project: req.params.id,
      sender: req.user._id,
      content,
      isSystem: false
    });

    const populatedMessage = await Message.findById(message._id).populate('sender', 'firstName lastName avatar role');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages in project workspace
// @route   GET /api/v1/projects/:id/messages
exports.getProjectMessages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isClient = project.client.toString() === req.user._id.toString();
    const isProfessional = project.professional && project.professional.toString() === req.user._id.toString();
    if (!isClient && !isProfessional) {
      return res.status(403).json({ message: 'Not authorized in this workspace' });
    }

    const messages = await Message.find({ project: req.params.id })
      .populate('sender', 'firstName lastName avatar role')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- CONTRACT / MILESTONE & ESCROW METHODS ---

// @desc    Add a milestone to project contract
// @route   POST /api/v1/projects/:id/milestones
exports.addProjectMilestone = async (req, res) => {
  try {
    const { title, amount, dueDate } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only clients can add milestones' });
    }

    project.milestones.push({ title, amount, dueDate, status: 'pending' });
    await project.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fund a milestone (Hold in Escrow)
// @route   POST /api/v1/projects/:id/milestones/:milestoneId/fund
exports.fundProjectMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only clients can fund escrow' });
    }

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    milestone.status = 'funded';
    await project.save();

    // Create a transaction record with status secured
    await Transaction.create({
      project: project._id,
      from: project.client,
      to: project.professional,
      amount: milestone.amount,
      status: 'secured',
      type: 'milestone_payment',
      milestoneId: milestone._id,
      transactionRef: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    });

    // Send system message
    await Message.create({
      project: project._id,
      sender: project.client,
      content: `SYSTEM_ALERT: Client funded milestone "${milestone.title}" ($${milestone.amount}). Funds are securely held in escrow.`,
      isSystem: true
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Release milestone payment (From Escrow to Professional)
// @route   POST /api/v1/projects/:id/milestones/:milestoneId/release
exports.releaseProjectMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only clients can release milestone payments' });
    }

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    milestone.status = 'released';
    await project.save();

    // Update Transaction record
    await Transaction.findOneAndUpdate(
      { milestoneId: milestone._id, status: 'secured' },
      { status: 'released' }
    );

    // Update Professional Earnings
    await User.findByIdAndUpdate(project.professional, {
      $inc: { totalEarnings: milestone.amount, completedProjects: 1 }
    });

    // Update Client Spent
    await User.findByIdAndUpdate(project.client, {
      $inc: { totalSpent: milestone.amount }
    });

    // If all milestones are released, set project to completed
    const allReleased = project.milestones.every(m => m.status === 'released' || m.status === 'refunded');
    if (allReleased) {
      project.status = 'completed';
    }
    await project.save();

    // Send system message
    await Message.create({
      project: project._id,
      sender: project.client,
      content: `SYSTEM_ALERT: Client released milestone "${milestone.title}" ($${milestone.amount}) from escrow to professional.`,
      isSystem: true
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit milestone work (Completed by Professional)
// @route   POST /api/v1/projects/:id/milestones/:milestoneId/complete
exports.completeProjectMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.professional.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only professionals can submit milestone work' });
    }

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    milestone.status = 'completed';
    await project.save();

    // Send system message
    await Message.create({
      project: project._id,
      sender: project.professional,
      content: `SYSTEM_ALERT: Professional submitted work for milestone "${milestone.title}". Awaiting client verification.`,
      isSystem: true
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Dispute a milestone payment
// @route   POST /api/v1/projects/:id/milestones/:milestoneId/dispute
exports.disputeProjectMilestone = async (req, res) => {
  try {
    const { reason } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    milestone.status = 'disputed';
    project.disputes.push({
      raisedBy: req.user._id,
      milestoneId: milestone._id,
      reason,
      status: 'open'
    });

    await project.save();

    // Send system message
    await Message.create({
      project: project._id,
      sender: req.user._id,
      content: `SYSTEM_ALERT: Dispute raised on milestone "${milestone.title}". Reason: "${reason}". SkillScrumpt AI Arbitrator notified.`,
      isSystem: true
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve a milestone dispute
// @route   POST /api/v1/projects/:id/disputes/:disputeId/resolve
exports.resolveProjectDispute = async (req, res) => {
  try {
    const { resolution, action } = req.body; // action: 'release' or 'refund'
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const dispute = project.disputes.id(req.params.disputeId);
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

    const milestone = project.milestones.id(dispute.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Associated milestone not found' });

    dispute.status = 'resolved';
    dispute.resolution = resolution;

    if (action === 'release') {
      milestone.status = 'released';
      await Transaction.findOneAndUpdate(
        { milestoneId: milestone._id, status: 'secured' },
        { status: 'released' }
      );
      await User.findByIdAndUpdate(project.professional, {
        $inc: { totalEarnings: milestone.amount, completedProjects: 1 }
      });
      await User.findByIdAndUpdate(project.client, {
        $inc: { totalSpent: milestone.amount }
      });
    } else {
      milestone.status = 'refunded';
      await Transaction.findOneAndUpdate(
        { milestoneId: milestone._id, status: 'secured' },
        { status: 'refunded' }
      );
    }

    await project.save();

    // Send system message
    await Message.create({
      project: project._id,
      sender: req.user._id,
      content: `SYSTEM_ALERT: Dispute resolved on milestone "${milestone.title}". Action taken: ${action.toUpperCase()}. Resolution details: "${resolution}"`,
      isSystem: true
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- TIME TRACKING METHODS ---

// @desc    Log hours worked on a project
// @route   POST /api/v1/projects/:id/time-logs
exports.logProjectTime = async (req, res) => {
  try {
    const { hours, description } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.professional.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only assigned professionals can log time' });
    }

    project.timeLogs.push({
      professional: req.user._id,
      hours: Number(hours),
      description
    });

    await project.save();

    // Send system message
    await Message.create({
      project: project._id,
      sender: req.user._id,
      content: `SYSTEM_ALERT: Professional logged ${hours} hours. Task description: "${description}"`,
      isSystem: true
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

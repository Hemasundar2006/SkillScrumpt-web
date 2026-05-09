const Project = require('../models/Project');
const Bid = require('../models/Bid');

// @desc    Create a new project
// @route   POST /api/v1/projects
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
    const projects = await Project.find({ status: 'open' }).populate('client', 'firstName lastName');
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

// @desc    Apply to a project
// @route   POST /api/v1/projects/:id/apply
exports.applyToProject = async (req, res) => {
  try {
    const { amount, proposal } = req.body;
    
    const bid = await Bid.create({
      project: req.params.id,
      professional: req.user._id,
      amount,
      proposal
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bids for a project
// @route   GET /api/v1/projects/:id/bids
exports.getProjectBids = async (req, res) => {
  try {
    const bids = await Bid.find({ project: req.params.id })
      .populate('professional', 'firstName lastName aiScore rating avatar skills');
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Gig = require('../models/Gig');
const Project = require('../models/Project');

// @desc    Create a new gig
// @route   POST /api/v1/gigs
// @access  Private (Professional)
exports.createGig = async (req, res) => {
  try {
    const { title, description, price, deliveryTime, skills, features, category } = req.body;

    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Only professionals can create service packages.' });
    }

    const gig = await Gig.create({
      title,
      description,
      professional: req.user._id,
      price,
      deliveryTime,
      skills,
      features,
      category
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all gigs
// @route   GET /api/v1/gigs
// @access  Public
exports.getGigs = async (req, res) => {
  try {
    const { search, category, professional } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (professional) {
      query.professional = professional;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const gigs = await Gig.find(query)
      .populate('professional', 'firstName lastName avatar rating aiScore')
      .sort({ createdAt: -1 });

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single gig details
// @route   GET /api/v1/gigs/:id
// @access  Public
exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('professional', 'firstName lastName avatar rating aiScore bio college');
    
    if (!gig) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Buy a gig (Create active contract)
// @route   POST /api/v1/gigs/:id/buy
// @access  Private (Client)
exports.buyGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({ message: 'Service package not found' });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can purchase service packages.' });
    }

    // Automatically spawn a project contract in progress
    const project = await Project.create({
      title: `GIG: ${gig.title}`,
      description: `Purchase of service package: ${gig.title}\n\nFeatures Included:\n${gig.features.map(f => `- ${f}`).join('\n')}\n\nOriginal Description:\n${gig.description}`,
      client: req.user._id,
      professional: gig.professional,
      status: 'in_progress',
      budget: {
        exact: gig.price
      },
      category: gig.category,
      skillsRequired: gig.skills,
      milestones: [{
        title: 'Complete Gig Delivery',
        status: 'pending',
        amount: gig.price,
        dueDate: new Date(Date.now() + gig.deliveryTime * 24 * 60 * 60 * 1000)
      }]
    });

    // Increment sales count
    gig.salesCount += 1;
    await gig.save();

    res.status(201).json({
      message: 'Service package purchased successfully and secure contract initiated.',
      project
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

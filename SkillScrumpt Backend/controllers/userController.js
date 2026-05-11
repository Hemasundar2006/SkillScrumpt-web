const User = require('../models/User');
const Feedback = require('../models/Feedback');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail, templates } = require('../utils/mailService');

// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, college, graduationYear } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      role
    };

    if (role === 'professional') {
      userData.college = college;
      userData.graduationYear = graduationYear;
    }

    const user = await User.create(userData);

    if (user) {
      // Send Welcome Email
      try {
        const template = user.role === 'client' ? templates.welcomeClient(user.firstName) : templates.welcomeStudent(user.firstName);
        await sendEmail(user.email, template.subject, template.html);
      } catch (err) {
        console.error('Failed to send welcome email:', err);
      }

      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/v1/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/v1/users/profile/:id
// @access  Public (simplified for demo)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all professionals
// @route   GET /api/v1/users/professionals
// @access  Protected
exports.getProfessionals = async (req, res) => {
  try {
    const professionals = await User.find({ role: 'professional' }).select('-password');
    res.json(professionals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform stats
// @route   GET /api/v1/users/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const studentCount = await User.countDocuments({ role: 'professional' });
    const clientCount = await User.countDocuments({ role: 'client' });

    // We can count how many users have attempted exams to estimate assessments taken
    const usersWithExams = await User.find({ 'attemptedExams.0': { $exists: true } }).select('attemptedExams');
    const assessmentsCount = usersWithExams.reduce((acc, user) => acc + user.attemptedExams.length, 0);

    // Hired count could be based on a fixed ratio or a specific criteria
    // For now we assume ~30% of professionals are hired
    const hiredCount = Math.floor(studentCount * 0.3);

    res.json({
      students: studentCount + 150000, // Adding base count to look realistic per UI
      clients: clientCount + 1200,
      assessments: assessmentsCount + 850000,
      hired: hiredCount + 45000
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all feedbacks
// @route   GET /api/v1/users/feedbacks
// @access  Public
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user', 'firstName lastName role').sort('-createdAt');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add feedback
// @route   POST /api/v1/users/feedbacks
// @access  Protected
exports.addFeedback = async (req, res) => {
  try {
    const { text, rating } = req.body;

    // Check if user already submitted feedback
    const existingFeedback = await Feedback.findOne({ user: req.user._id });
    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already submitted feedback.' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      text,
      rating
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Protected
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.location = req.body.location !== undefined ? req.body.location : user.location;
      user.website = req.body.website !== undefined ? req.body.website : user.website;
      user.timezone = req.body.timezone !== undefined ? req.body.timezone : user.timezone;

      if (req.body.socialLinks) {
        user.socialLinks = {
          github: req.body.socialLinks.github !== undefined ? req.body.socialLinks.github : user.socialLinks?.github,
          linkedin: req.body.socialLinks.linkedin !== undefined ? req.body.socialLinks.linkedin : user.socialLinks?.linkedin,
          twitter: req.body.socialLinks.twitter !== undefined ? req.body.socialLinks.twitter : user.socialLinks?.twitter
        };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        phone: updatedUser.phone,
        location: updatedUser.location,
        website: updatedUser.website,
        timezone: updatedUser.timezone,
        socialLinks: updatedUser.socialLinks,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /users/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    console.log('STEP: Generating reset token...');
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

    console.log('STEP: Saving user with reset token...');
    await user.save();

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'https://skillscrumpt.vercel.app';
    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/reset-password/${resetToken}`;
    
    console.log(`STEP: Generated Link: ${resetUrl}`);

    try {
      console.log('STEP: Fetching template...');
      const template = templates.forgotPassword(user.firstName, resetUrl);
      
      console.log('STEP: Dispatching email...');
      await sendEmail(user.email, template.subject, template.html);
      
      console.log('STEP: Email dispatch confirmed.');
      res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
    } catch (mailErr) {
      console.error('STEP_FAILED: Mail Dispatch Error:', mailErr);
      res.status(500).json({ 
        message: 'Mail server rejected the request.',
        error: mailErr.message,
        code: mailErr.code
      });
    }
  } catch (error) {
    console.error('CRITICAL_CONTROLLER_ERROR:', error);
    res.status(500).json({ 
      message: 'Internal server logic error.',
      error: error.message 
    });
  }
};

// @desc    Reset Password
// @route   POST /api/v1/users/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send Test Link to Desktop
// @route   POST /api/v1/users/desktop-handoff
// @access  Protected
exports.desktopHandoff = async (req, res) => {
  try {
    const { testId } = req.body;
    const user = await User.findById(req.user._id);

    const testLink = `${process.env.FRONTEND_URL || 'https://skillscrumpt.vercel.app/'}/assessments/start/${testId}`;
    const template = templates.desktopHandoff(testLink);

    await sendEmail(user.email, template.subject, template.html);

    res.json({ message: 'Link sent to your email for desktop access.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

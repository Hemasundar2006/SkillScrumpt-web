const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const User = require('../models/User');

// @desc    Get all assessments
// @route   GET /api/v1/assessments
exports.getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().select('-questions');
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assessment by ID
// @route   GET /api/v1/assessments/:id
exports.getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (assessment) {
      res.json(assessment);
    } else {
      res.status(404).json({ message: 'Assessment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit assessment result
// @route   POST /api/v1/assessments/:id/submit
exports.submitResult = async (req, res) => {
  try {
    const { 
      score, 
      totalQuestions, 
      correctAnswers, 
      timeTaken, 
      proctoringLogs 
    } = req.body;

    // AI Analysis Simulation (This would use the BACKEND_PROMPT.md logic)
    const cheatingProbability = calculateCheatingProbability(proctoringLogs);
    const status = (score / totalQuestions > 0.7 && cheatingProbability < 0.3) ? 'passed' : 'failed';

    const result = await AssessmentResult.create({
      assessment: req.params.id,
      user: req.user._id,
      score,
      totalQuestions,
      correctAnswers,
      timeTaken,
      status,
      proctoringLogs,
      aiAnalysis: {
        cheatingProbability,
        summary: cheatingProbability > 0.5 ? 'Suspicious activity detected.' : 'Session verified clean.'
      }
    });

    // If passed, update user AI score and add badge
    if (status === 'passed') {
      const assessment = await Assessment.findById(req.params.id);
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { aiScore: 50 },
        $push: { badges: { name: assessment.reward, assessmentId: assessment._id } }
      });
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simple simulation of AI logic defined in BACKEND_PROMPT.md
function calculateCheatingProbability(logs) {
  if (!logs || logs.length === 0) return 0.05;
  
  const highSeverityLogs = logs.filter(log => log.severity === 'high');
  const mediumSeverityLogs = logs.filter(log => log.severity === 'medium');
  
  let probability = (highSeverityLogs.length * 0.4) + (mediumSeverityLogs.length * 0.15);
  return Math.min(probability, 1.0);
}

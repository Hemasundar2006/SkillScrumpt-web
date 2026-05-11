const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const User = require('../models/User');
const Settings = require('../models/Settings');

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
    const settings = await Settings.findOne() || { coolingPeriodActive: true };
    const user = await User.findById(req.user._id);
    const lastAttempt = user.attemptedExams
      .filter(attempt => attempt.examId === req.params.id)
      .sort((a, b) => b.attemptedAt - a.attemptedAt)[0];
    
    if (lastAttempt && settings.coolingPeriodActive) {
      const coolingPeriodMs = 48 * 60 * 60 * 1000; // 48 hours
      const timePassed = Date.now() - new Date(lastAttempt.attemptedAt).getTime();
      
      if (timePassed < coolingPeriodMs) {
        const remainingHours = Math.ceil((coolingPeriodMs - timePassed) / (1000 * 60 * 60));
        return res.status(403).json({ 
          message: `Cooling Period Active: Your previous attempt was rejected. Our security protocol requires a 48-hour cooling period for skill improvement.`,
          isLocked: true,
          remainingHours,
          canRetryAt: new Date(new Date(lastAttempt.attemptedAt).getTime() + coolingPeriodMs)
        });
      }
    }

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
      proctoringLogs,
      proctoringReport
    } = req.body;

    // Check if already attempted (secondary server-side check)
    const user = await User.findById(req.user._id);
    if (user.attemptedExams.some(a => a.examId === req.params.id)) {
      return res.status(403).json({ message: 'Submission rejected: Duplicate attempt detected.' });
    }

    let finalScore = score;
    let cheatingProbability = 0;
    let proctoringSummary = 'Session verified clean.';

    if (proctoringReport) {
      // Use the actual AI Proctoring report
      const proctoringScore = proctoringReport.proctoring_score || 100;
      
      // Cheating probability is inversely proportional to proctoring score
      cheatingProbability = (100 - proctoringScore) / 100;
      
      // Calculate final overall score combining technical score and proctoring integrity
      // Technical score is 70% weight, Proctoring integrity is 30% weight
      finalScore = Math.round((score * 0.7) + (proctoringScore * 0.3));

      if (proctoringScore < 50) {
        proctoringSummary = `CRITICAL_VIOLATION: AI proctoring detected significant integrity anomalies. Assessment terminated with failure status.`;
        cheatingProbability = 0.9; // Force failure
      } else if (proctoringScore < 70) {
        proctoringSummary = `INTEGRITY_ALERT: Multiple suspicious behaviors detected during the session.`;
      } else if (proctoringScore < 85) {
        proctoringSummary = `NOMINAL_ANOMALIES: Minor behavioral deviations recorded.`;
      } else {
        proctoringSummary = `VERIFIED_CLEAN: Session maintained optimal integrity standards.`;
      }
    } else {
      // Fallback if no report is provided
      cheatingProbability = calculateCheatingProbability(proctoringLogs);
      proctoringSummary = cheatingProbability > 0.5 ? 'SECURITY_BREACH: Suspicious activity detected via telemetry logs.' : 'VERIFIED_CLEAN: No significant telemetry alerts.';
    }

    // A test fails if either the technical score is too low (< 70) OR if suspicious activity is high
    const status = (finalScore >= 70 && cheatingProbability < 0.5) ? 'passed' : 'failed';
    
    // Explicitly set failure reason if it's proctoring related
    if (status === 'failed' && cheatingProbability >= 0.5) {
      proctoringSummary = proctoringSummary || "FAILED: Security protocols detected suspicious activity.";
    } else if (status === 'failed' && finalScore < 70) {
      proctoringSummary = "FAILED: Technical performance did not meet the required threshold.";
    }

    const result = await AssessmentResult.create({
      assessment: req.params.id,
      user: req.user._id,
      score: finalScore,
      totalQuestions,
      correctAnswers,
      timeTaken,
      status,
      proctoringLogs: proctoringReport?.violations || proctoringLogs || [],
      aiAnalysis: {
        cheatingProbability,
        summary: proctoringSummary,
        rawReport: proctoringReport
      }
    });

    // Update user: Record attempt and rewards
    const updateData = {
      $push: { 
        attemptedExams: { 
          examId: req.params.id, 
          status: status === 'passed' ? 'completed' : 'failed' 
        } 
      }
    };

    if (status === 'passed') {
      const assessment = await Assessment.findById(req.params.id);
      updateData.$inc = { aiScore: 50 };
      if (!updateData.$push.badges) updateData.$push.badges = [];
      updateData.$push.badges = { 
        name: assessment?.reward || 'Certified Professional', 
        assessmentId: req.params.id,
        score: finalScore,
        earnedAt: new Date()
      };
    }

    await User.findByIdAndUpdate(req.user._id, updateData);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's assessment results
// @route   GET /api/v1/assessments/my-results
exports.getMyResults = async (req, res) => {
  try {
    const results = await AssessmentResult.find({ user: req.user._id })
      .populate('assessment', 'title category difficulty')
      .sort('-createdAt');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simple simulation of AI logic as fallback
function calculateCheatingProbability(logs) {
  if (!logs || logs.length === 0) return 0.05;
  
  const highSeverityLogs = logs.filter(log => log.severity === 'high');
  const mediumSeverityLogs = logs.filter(log => log.severity === 'medium');
  
  let probability = (highSeverityLogs.length * 0.4) + (mediumSeverityLogs.length * 0.15);
  return Math.min(probability, 1.0);
}

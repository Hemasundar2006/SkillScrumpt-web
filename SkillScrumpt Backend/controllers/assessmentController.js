const mongoose = require('mongoose');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { sendEmail, templates } = require('../utils/mailService');

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
    
    // Check for cooling period if attempt failed recently
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

    let assessment;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      assessment = await Assessment.findById(req.params.id);
    }
    
    if (!assessment) {
      assessment = await Assessment.findOne({ testId: req.params.id });
    }

    if (assessment) {
      // Logic: Randomize questions for each student attempt
      const mcqs = assessment.questions.filter(q => q.type === 'mcq');
      const coding = assessment.questions.filter(q => q.type === 'coding');
      
      // Helper to shuffle
      const shuffle = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      };

      // Pick random subset: 20 MCQs + 1 Coding challenge
      const selectedMcqs = shuffle(mcqs).slice(0, 20);
      const selectedCoding = shuffle(coding).slice(0, 1);
      
      // Re-index questions for frontend display consistency
      const finalQuestions = [...selectedMcqs, ...selectedCoding].map((q, idx) => {
        const qObj = q.toObject ? q.toObject() : q;
        return { ...qObj, id: idx + 1 };
      });

      const assessmentObj = assessment.toObject();
      assessmentObj.questions = finalQuestions;
      
      res.json(assessmentObj);
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
      const proctoringScore = proctoringReport.proctoring_score || 100;
      cheatingProbability = (100 - proctoringScore) / 100;
      finalScore = Math.round((score * 0.7) + (proctoringScore * 0.3));

      const techGrade = score >= 90 ? 'EXCEPTIONAL' : score >= 70 ? 'COMPETENT' : 'DEVELOPING';
      const integrityGrade = proctoringScore >= 85 ? 'OPTIMAL' : proctoringScore >= 70 ? 'NOMINAL' : 'COMPROMISED';

      if (proctoringScore < 50) {
        proctoringSummary = `CRITICAL_SECURITY_VIOLATION: AI telemetry detected significant integrity deviations (Integrity: ${integrityGrade}). Technical performance (${techGrade}) voided due to security breach.`;
        cheatingProbability = 0.9;
      } else if (proctoringScore < 85) {
        proctoringSummary = `INTEGRITY_ALERT: Technical proficiency evaluated as ${techGrade}. However, behavioral telemetry recorded minor anomalies (Integrity: ${integrityGrade}). Further manual audit may be required for elite badge verification.`;
      } else {
        proctoringSummary = `VERIFIED_SUCCESS: Candidate demonstrated ${techGrade} technical proficiency with ${integrityGrade} session integrity. AI Engine confirms authentic expertise.`;
      }
    } else {
      cheatingProbability = calculateCheatingProbability(proctoringLogs);
      proctoringSummary = cheatingProbability > 0.5 ? 'SECURITY_ALERT: Suspicious telemetry detected. Session integrity compromised.' : 'VERIFIED_CLEAN: Performance metrics and integrity logs within expected parameters.';
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

    // Send Assessment Result Email
    try {
      // Find assessment - handle potential non-ObjectId errors
      let assessmentData;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        assessmentData = await Assessment.findById(req.params.id);
      }
      if (!assessmentData) {
        assessmentData = await Assessment.findOne({ testId: req.params.id });
      }

      const finalAssessmentTitle = assessmentData?.title || 'Expert Assessment';
      const badgeName = status === 'passed' ? (assessmentData?.reward || 'Certified Professional') : null;
      
      console.log(`Triggering email for ${user.email} - Status: ${status}`);
      
      const template = templates.assessmentResult(
        user.firstName || 'Student', 
        finalAssessmentTitle, 
        finalScore, 
        status, 
        badgeName
      );
      
      await sendEmail(user.email, template.subject, template.html);
      console.log(`Assessment result email sent successfully to ${user.email}`);
    } catch (mailErr) {
      console.error('CRITICAL: Failed to send assessment result email:', mailErr.message);
    }

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

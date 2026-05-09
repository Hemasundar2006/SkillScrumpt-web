const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timeTaken: { type: Number }, // in seconds
  status: { type: String, enum: ['passed', 'failed'], required: true },
  proctoringLogs: [{
    timestamp: { type: Date, default: Date.now },
    eventType: { type: String }, // 'tab_switch', 'eye_movement', 'no_face'
    severity: { type: String, enum: ['low', 'medium', 'high'] }
  }],
  aiAnalysis: {
    cheatingProbability: { type: Number },
    summary: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);

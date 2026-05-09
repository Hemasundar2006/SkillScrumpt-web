const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true }, // in minutes
  difficulty: { type: String, enum: ['Entry', 'Intermediate', 'Senior', 'Expert'], required: true },
  reward: { type: String }, // e.g., "Advanced React Badge"
  category: { type: String }, // e.g., "Web Development"
  questions: [{
    question: { type: String, required: true },
    type: { type: String, enum: ['mcq', 'coding'], default: 'mcq' },
    // MCQ fields
    options: [String],
    correctAnswer: Number, // index of options for MCQ
    // Coding fields
    testCases: [{
      input: String,
      output: String,
      isPublic: { type: Boolean, default: true }
    }],
    initialCode: String,
    language: String,
    points: { type: Number, default: 1 }
  }],
  cutoffScore: { type: Number, default: 70 }, // percentage required to pass
  isProctored: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);

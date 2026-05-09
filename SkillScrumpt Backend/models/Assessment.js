const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true }, // in minutes
  difficulty: { type: String, enum: ['Entry', 'Intermediate', 'Senior', 'Expert'], required: true },
  reward: { type: String }, // e.g., "Advanced React Badge"
  category: { type: String }, // e.g., "Web Development"
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number, // index of options
    points: { type: Number, default: 1 }
  }],
  cutoffScore: { type: Number, default: 70 }, // percentage required to pass
  isProctored: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);

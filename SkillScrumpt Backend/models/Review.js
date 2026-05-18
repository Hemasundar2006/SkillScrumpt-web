const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  reviewType: {
    type: String,
    enum: ['client_to_professional', 'professional_to_client'],
    required: true
  }
}, { timestamps: true });

// Prevent duplicate reviews of the same type for the same project
reviewSchema.index({ project: 1, from: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);

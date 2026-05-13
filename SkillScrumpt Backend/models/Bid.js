const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  bidder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  deliveryTime: { 
    type: Number, // in days
    required: true 
  },
  coverLetter: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  isBrokerageFree: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Prevent duplicate bids from same user on same project
bidSchema.index({ project: 1, bidder: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);

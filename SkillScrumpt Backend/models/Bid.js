const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  professional: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  proposal: { type: String, required: true },
  estimatedDuration: { type: String }, // e.g., "2 weeks"
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Update project bid count on new bid
bidSchema.post('save', async function() {
  await mongoose.model('Project').findByIdAndUpdate(this.project, {
    $inc: { bidsCount: 1 }
  });
});

module.exports = mongoose.model('Bid', bidSchema);

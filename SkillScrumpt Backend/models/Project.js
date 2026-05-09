const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
  amount: { type: Number, required: true },
  dueDate: { type: Date }
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  professional: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['open', 'reviewing', 'in_progress', 'completed', 'cancelled'], 
    default: 'open' 
  },
  budget: {
    min: { type: Number },
    max: { type: Number },
    exact: { type: Number }
  },
  bidsCount: { type: Number, default: 0 },
  milestones: [milestoneSchema],
  assets: [{
    name: String,
    url: String,
    size: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  category: { type: String },
  skillsRequired: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

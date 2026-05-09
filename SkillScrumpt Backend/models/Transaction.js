const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['pending', 'secured', 'released', 'refunded'], 
    default: 'pending' 
  },
  type: { 
    type: String, 
    enum: ['milestone_payment', 'project_payment', 'bonus'], 
    default: 'project_payment' 
  },
  milestoneId: { type: mongoose.Schema.Types.ObjectId },
  transactionRef: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);

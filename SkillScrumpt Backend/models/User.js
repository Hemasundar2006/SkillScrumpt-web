const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['professional', 'client', 'admin'], required: true },
  avatar: { type: String }, // URL or initials
  bio: { type: String },
  isVerified: { type: Boolean, default: false },
  
  // Professional specific fields
  college: { type: String },
  graduationYear: { type: String },
  aiScore: { type: Number, default: 0 },
  skills: [{ type: String }],
  badges: [{ 
    name: String, 
    issuedAt: { type: Date, default: Date.now },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }
  }],
  
  // Stats
  rating: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  completedProjects: { type: Number, default: 0 },
  
  // Client specific fields
  totalSpent: { type: Number, default: 0 },
  activeContractsCount: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

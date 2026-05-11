const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  maintenanceMode: { type: Boolean, default: false },
  coolingPeriodActive: { type: Boolean, default: true },
  maintenanceMessage: { type: String, default: 'SkillScrumpt is currently undergoing scheduled maintenance. We will be back shortly!' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

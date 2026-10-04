const mongoose = require('mongoose');

const savingsGoalSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:           { type: String, required: true },
  targetAmount:   { type: Number, required: true },
  savedAmount:    { type: Number, default: 0 },
  monthlySavings: { type: Number, default: 0 },
  targetDate:     { type: String, default: '' },
  icon:           { type: String, default: '🎯' },
  color:          { type: String, default: '#7c3aed' },
  completed:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('SavingsGoal', savingsGoalSchema);

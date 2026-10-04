const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month:      { type: String, required: true }, // e.g. "2026-10"
  totalBudget:{ type: Number, default: 0 },
  categories: [
    {
      name:      { type: String, required: true },
      allocated: { type: Number, default: 0 },
      spent:     { type: Number, default: 0 },
      icon:      { type: String, default: '💰' },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);

const mongoose = require('mongoose');

// ─── Scheme Model ─────────────────────────────────────────────────────────────
// Stores government schemes - either fetched from api.data.gov.in
// or manually added/overridden by admin via CMS.
const schemeSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, default: '' },
  category:     { type: String, default: 'General' }, // Savings, Business Loan, Girl Child, Entrepreneurship etc.
  benefits:     { type: String, default: '' },
  eligibility:  { type: String, default: '' },
  documents:    [{ type: String }],
  deadline:     { type: String, default: '' },
  officialLink: { type: String, default: '' },
  ministry:     { type: String, default: '' },
  tags:         [{ type: String }],
  isActive:     { type: Boolean, default: true },
  source:       { type: String, enum: ['govt_api', 'admin', 'seed'], default: 'admin' },
  govtApiId:    { type: String, default: '' },    // ID from api.data.gov.in
  lastSyncedAt: { type: Date, default: null },     // Last time fetched from govt API
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);

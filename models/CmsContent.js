const mongoose = require('mongoose');

// Reusable for both Schemes CMS and Literacy CMS
const cmsContentSchema = new mongoose.Schema({
  type:        { type: String, enum: ['scheme', 'literacy'], required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  content:     { type: String, default: '' },     // Rich text body (literacy)
  eligibility: { type: String, default: '' },     // For schemes
  benefits:    { type: String, default: '' },     // For schemes
  deadline:    { type: String, default: '' },     // For schemes
  category:    { type: String, default: '' },     // For literacy
  difficulty:  { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', ''], default: '' },
  tags:        [{ type: String }],
  isActive:    { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('CmsContent', cmsContentSchema);

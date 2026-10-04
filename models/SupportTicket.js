const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  category: { type: String, default: 'General' },
  subject:  { type: String, required: true },
  message:  { type: String, required: true },
  status:   { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  adminReply: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);

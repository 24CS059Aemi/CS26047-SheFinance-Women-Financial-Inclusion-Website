const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// ─── POST /api/support (anyone can submit a ticket; attaches user ID if logged in) ─────
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { category, subject, message, priority } = req.body;
    let name = req.body.name || req.user?.name;
    let email = req.body.email || req.user?.email;

    if (!name || !email) {
      if (req.user?.id) {
        const User = require('../models/User');
        const u = await User.findById(req.user.id);
        if (u) {
          name = name || u.name;
          email = email || u.email;
        }
      }
    }

    if (!name) name = 'Registered User';
    if (!email) email = 'user@shefinance.in';

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required.' });
    }
    const ticket = await SupportTicket.create({
      userId: req.user?.id || null,
      name,
      email,
      category: category || 'general',
      subject,
      message,
      priority: priority || 'Medium'
    });
    res.status(201).json({ success: true, message: 'Support ticket submitted.', ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/support/my (user's own tickets) ─────────────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/support (admin: all tickets) ───────────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/support/:id (admin: update status + reply) ─────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminReply, priority } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(adminReply !== undefined && { adminReply }), ...(priority && { priority }) },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/support/:id (admin only) ────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await SupportTicket.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ticket deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

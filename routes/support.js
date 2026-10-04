const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { protect, adminOnly } = require('../middleware/auth');

// ─── POST /api/support (anyone can submit a ticket) ──────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, category, subject, message, priority } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, subject and message are required.' });
    }
    const ticket = await SupportTicket.create({
      userId: req.user?.id || null, name, email, category, subject, message, priority
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

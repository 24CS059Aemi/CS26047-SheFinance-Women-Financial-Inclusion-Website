const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const SupportTicket = require('../models/SupportTicket');
const CmsContent = require('../models/CmsContent');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require login + admin role
router.use(protect, adminOnly);

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', status: 'active' });
    const openTickets = await SupportTicket.countDocuments({ status: 'Open' });
    const totalTickets = await SupportTicket.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const revenueAgg = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      stats: { totalUsers, activeUsers, openTickets, totalTickets, totalTransactions, totalRevenue }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/admin/users/:id/status ─────────────────────────────────────────
router.put('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/admin/users/:id ─────────────────────────────────────────────
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── SCHEMES CMS ─────────────────────────────────────────────────────────────
// GET /api/admin/schemes
router.get('/schemes', async (req, res) => {
  try {
    const schemes = await CmsContent.find({ type: 'scheme' }).sort({ createdAt: -1 });
    res.json({ success: true, schemes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/schemes
router.post('/schemes', async (req, res) => {
  try {
    const scheme = await CmsContent.create({ ...req.body, type: 'scheme', createdBy: req.user.id });
    res.status(201).json({ success: true, scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/schemes/:id
router.put('/schemes/:id', async (req, res) => {
  try {
    const scheme = await CmsContent.findOneAndUpdate(
      { _id: req.params.id, type: 'scheme' }, req.body, { new: true }
    );
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });
    res.json({ success: true, scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/schemes/:id
router.delete('/schemes/:id', async (req, res) => {
  try {
    await CmsContent.findOneAndDelete({ _id: req.params.id, type: 'scheme' });
    res.json({ success: true, message: 'Scheme deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── LITERACY CMS ─────────────────────────────────────────────────────────────
// GET /api/admin/literacy
router.get('/literacy', async (req, res) => {
  try {
    const articles = await CmsContent.find({ type: 'literacy' }).sort({ createdAt: -1 });
    res.json({ success: true, articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/literacy
router.post('/literacy', async (req, res) => {
  try {
    const article = await CmsContent.create({ ...req.body, type: 'literacy', createdBy: req.user.id });
    res.status(201).json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/literacy/:id
router.put('/literacy/:id', async (req, res) => {
  try {
    const article = await CmsContent.findOneAndUpdate(
      { _id: req.params.id, type: 'literacy' }, req.body, { new: true }
    );
    if (!article) return res.status(404).json({ success: false, message: 'Article not found.' });
    res.json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/literacy/:id
router.delete('/literacy/:id', async (req, res) => {
  try {
    await CmsContent.findOneAndDelete({ _id: req.params.id, type: 'literacy' });
    res.json({ success: true, message: 'Article deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

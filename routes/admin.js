const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const SupportTicket = require('../models/SupportTicket');
const CmsContent = require('../models/CmsContent');
const SavingsGoal = require('../models/SavingsGoal');
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
    const totalGoals = await SavingsGoal.countDocuments();
    const totalSchemes = await CmsContent.countDocuments({ type: 'scheme' });
    const totalArticles = await CmsContent.countDocuments({ type: 'literacy' });
    const revenueAgg = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const expenseAgg = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;
    const totalExpense = expenseAgg[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalUsers, activeUsers, openTickets, totalTickets,
        totalTransactions, totalRevenue, totalExpense,
        totalGoals, totalSchemes, totalArticles
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── USER MANAGEMENT ─────────────────────────────────────────────────────────

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/users (create user from admin panel)
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists.' });
    }
    const user = await User.create({
      name, email, password, role: role || 'user', provider: 'local'
    });
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, user: userObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/users/:id/status
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

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── TRANSACTIONS (admin view all) ───────────────────────────────────────────

// GET /api/admin/transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'name email')
      .sort({ date: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/admin/transactions/:id
router.delete('/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Transaction deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── SAVINGS GOALS (admin view all) ──────────────────────────────────────────

// GET /api/admin/goals
router.get('/goals', async (req, res) => {
  try {
    const goals = await SavingsGoal.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, goals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── SUPPORT TICKETS (admin CRUD) ────────────────────────────────────────────

// GET /api/admin/support
router.get('/support', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/admin/support/:id
router.put('/support/:id', async (req, res) => {
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

// DELETE /api/admin/support/:id
router.delete('/support/:id', async (req, res) => {
  try {
    await SupportTicket.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ticket deleted.' });
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

// ─── ADMIN PASSWORD CHANGE ───────────────────────────────────────────────────

router.put('/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Both passwords are required. New password must be 6+ characters.' });
    }
    const admin = await User.findById(req.user.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found.' });

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect.' });

    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DATA EXPORT (CSV) ──────────────────────────────────────────────────────

router.get('/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let csv = '';
    let filename = '';

    if (type === 'users') {
      const users = await User.find().select('-password').lean();
      csv = 'Name,Email,Role,Status,Provider,Joined\n';
      users.forEach(u => {
        csv += `"${u.name}","${u.email}","${u.role}","${u.status}","${u.provider}","${u.createdAt}"\n`;
      });
      filename = 'shefinance_users.csv';
    } else if (type === 'transactions') {
      const txns = await Transaction.find().populate('userId', 'name email').lean();
      csv = 'User,Email,Type,Category,Amount,Note,Date\n';
      txns.forEach(t => {
        csv += `"${t.userId?.name || 'N/A'}","${t.userId?.email || 'N/A'}","${t.type}","${t.category}",${t.amount},"${t.note || ''}","${t.date}"\n`;
      });
      filename = 'shefinance_transactions.csv';
    } else if (type === 'schemes') {
      const schemes = await CmsContent.find({ type: 'scheme' }).lean();
      csv = 'Title,Category,Benefits,Eligibility,Deadline,Active\n';
      schemes.forEach(s => {
        csv += `"${s.title}","${s.category}","${s.benefits}","${s.eligibility}","${s.deadline}",${s.isActive}\n`;
      });
      filename = 'shefinance_schemes.csv';
    } else if (type === 'literacy') {
      const articles = await CmsContent.find({ type: 'literacy' }).lean();
      csv = 'Title,Category,Difficulty,Description\n';
      articles.forEach(a => {
        csv += `"${a.title}","${a.category}","${a.difficulty}","${(a.description || '').replace(/"/g, '""')}"\n`;
      });
      filename = 'shefinance_literacy.csv';
    } else if (type === 'tickets') {
      const tickets = await SupportTicket.find().lean();
      csv = 'Name,Email,Category,Subject,Message,Status,Priority,AdminReply,Date\n';
      tickets.forEach(t => {
        csv += `"${t.name}","${t.email}","${t.category}","${t.subject}","${(t.message || '').replace(/"/g, '""')}","${t.status}","${t.priority}","${(t.adminReply || '').replace(/"/g, '""')}","${t.createdAt}"\n`;
      });
      filename = 'shefinance_tickets.csv';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid export type.' });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;


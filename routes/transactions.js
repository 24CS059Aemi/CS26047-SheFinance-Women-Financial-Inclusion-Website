const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// All routes require login
router.use(protect);

// ─── GET /api/transactions ───────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { month } = req.query; // e.g. "2026-10"
    let filter = { userId: req.user.id };
    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    }
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/transactions ──────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { type, category, amount, note, description, date } = req.body;
    if (!type || !category || !amount) {
      return res.status(400).json({ success: false, message: 'Type, category and amount are required.' });
    }
    const tx = await Transaction.create({
      userId: req.user.id,
      type,
      category,
      amount: Number(amount),
      note: note || description || '',
      date: date ? new Date(date) : new Date()
    });
    res.status(201).json({ success: true, transaction: tx });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/transactions/:id ───────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { type, category, amount, note, description, date } = req.body;
    const updateData = {};
    if (type) updateData.type = type;
    if (category) updateData.category = category;
    if (amount !== undefined) updateData.amount = Number(amount);
    if (note !== undefined || description !== undefined) updateData.note = note || description || '';
    if (date) updateData.date = new Date(date);

    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found.' });
    res.json({ success: true, transaction: tx });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/transactions/summary ───────────────────────────────────────────
router.get('/summary', async (req, res) => {
  try {
    const all = await Transaction.find({ userId: req.user.id });
    const income = all.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = all.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    res.json({ success: true, summary: { income, expense, balance: income - expense } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/transactions/:id ────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found.' });
    res.json({ success: true, message: 'Transaction deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

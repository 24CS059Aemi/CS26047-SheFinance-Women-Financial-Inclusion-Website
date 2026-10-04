const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');
const { protect } = require('../middleware/auth');

router.use(protect);

// ─── GET /api/savings ─────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, goals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/savings ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, targetAmount, savedAmount, monthlySavings, targetDate, icon, color } = req.body;
    if (!name || !targetAmount) {
      return res.status(400).json({ success: false, message: 'Name and target amount are required.' });
    }
    const goal = await SavingsGoal.create({
      userId: req.user.id, name, targetAmount, savedAmount: savedAmount || 0,
      monthlySavings: monthlySavings || 0, targetDate, icon, color
    });
    res.status(201).json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/savings/:id ─────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found.' });
    res.json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/savings/:id ──────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found.' });
    res.json({ success: true, message: 'Goal deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

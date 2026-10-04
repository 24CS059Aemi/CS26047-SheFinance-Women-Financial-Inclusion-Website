const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const { protect } = require('../middleware/auth');

router.use(protect);

// ─── GET /api/budget?month=2026-10 ───────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);
    let budget = await Budget.findOne({ userId: req.user.id, month });
    if (!budget) {
      // Return empty budget if none exists yet
      return res.json({ success: true, budget: null });
    }
    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/budget (create or replace for month) ──────────────────────────
router.post('/', async (req, res) => {
  try {
    const { month, totalBudget, categories } = req.body;
    if (!month || !totalBudget) {
      return res.status(400).json({ success: false, message: 'Month and totalBudget are required.' });
    }
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, month },
      { userId: req.user.id, month, totalBudget, categories: categories || [] },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Budget saved.', budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/budget/:id/category-spent ──────────────────────────────────────
// Update spent amount for a specific category
router.put('/:id/category-spent', async (req, res) => {
  try {
    const { categoryName, spent } = req.body;
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user.id });
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found.' });

    const cat = budget.categories.find(c => c.name === categoryName);
    if (cat) cat.spent = spent;
    await budget.save();
    res.json({ success: true, budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

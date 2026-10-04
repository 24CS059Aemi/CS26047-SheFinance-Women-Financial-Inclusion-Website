const express = require('express');
const router = express.Router();

// ─── POST /api/predict_health (Peer Analysis) ─────────────────────────────────
router.post('/predict_health', (req, res) => {
  try {
    const { age = 28, income = 30000, occupation = 'salaried' } = req.body;
    const numAge = Number(age) || 28;
    const numIncome = Number(income) || 30000;

    // Smart heuristic model matching peer dataset
    const peerSavingsRate = numIncome > 50000 ? 0.28 : numIncome > 25000 ? 0.22 : 0.18;
    const predicted_peer_savings = Math.round(numIncome * peerSavingsRate);
    const predicted_health_score = Math.min(95, Math.max(45, Math.round(65 + (numIncome / 5000) - (numAge > 40 ? 5 : 0))));

    res.json({
      status: 'success',
      predicted_health_score,
      predicted_peer_savings,
      peer_occupation: occupation
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

// ─── POST /api/predict_timeline (Goal Completion Simulation) ───────────────────
router.post('/predict_timeline', (req, res) => {
  try {
    const { target_amount, saved_amount = 0, monthly_savings = 0, target_date } = req.body;
    const targetAmount = parseFloat(target_amount);
    const savedAmount = parseFloat(saved_amount) || 0;
    const monthlySavings = parseFloat(monthly_savings) || 0;

    if (isNaN(targetAmount) || targetAmount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid target amount' });
    }

    const today = new Date();
    const remaining = targetAmount - savedAmount;

    if (remaining <= 0) {
      return res.json({
        status: 'success',
        predicted_finish_date: today.toISOString().split('T')[0],
        status_label: 'Achieved 🎉',
        months_required: 0,
        recommendation: 'Congratulations! You have already achieved this savings goal!'
      });
    }

    if (monthlySavings <= 0) {
      return res.json({
        status: 'success',
        predicted_finish_date: 'Never',
        status_label: 'Critical Delay 🚨',
        months_required: 999,
        recommendation: 'Your monthly savings rate is zero. Increase monthly savings to stay on track.'
      });
    }

    const monthsRequired = remaining / monthlySavings;
    const daysRequired = Math.round(monthsRequired * 30.4);
    const finishDate = new Date(today.getTime() + daysRequired * 24 * 60 * 60 * 1000);
    const targetDt = target_date ? new Date(target_date) : finishDate;

    const diffDays = Math.round((finishDate - targetDt) / (1000 * 60 * 60 * 24));
    let status_label = 'On Track 🟢';
    let recommendation = '';

    if (diffDays <= 0) {
      const earlyMonths = Math.max(0, Math.round(Math.abs(diffDays) / 30.4));
      status_label = 'On Track 🟢';
      recommendation = earlyMonths > 0
        ? `Great work! You are on track to achieve this goal ${earlyMonths} month(s) early.`
        : `Excellent! You are exactly on schedule to achieve this goal on time.`;
    } else {
      const delayedMonths = Math.max(1, Math.round(diffDays / 30.4));
      status_label = 'Delayed ⚠️';
      const availableDays = Math.max(1, Math.round((targetDt - today) / (1000 * 60 * 60 * 24)));
      const requiredMonthly = Math.round(remaining / (availableDays / 30.4));
      recommendation = `At this rate, you will be delayed by ${delayedMonths} month(s). Increase monthly savings to ₹${requiredMonthly.toLocaleString('en-IN')} to reach your target by ${targetDt.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}.`;
    }

    res.json({
      status: 'success',
      predicted_finish_date: finishDate.toISOString().split('T')[0],
      status_label,
      months_required: Math.round(monthsRequired * 10) / 10,
      recommendation
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

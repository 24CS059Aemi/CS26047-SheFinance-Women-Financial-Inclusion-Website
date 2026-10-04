const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ─── GET /api/profile ────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/profile ────────────────────────────────────────────────────────
router.put('/', protect, async (req, res) => {
  try {
    const { name, avatar, profile } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (profile) {
      user.profile = { ...user.profile.toObject(), ...profile };
    }

    await user.save();
    res.json({ success: true, message: 'Profile updated.', user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/profile/password ────────────────────────────────────────────────
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user || user.provider === 'google') {
      return res.status(400).json({ success: false, message: 'Cannot change password for Google accounts.' });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

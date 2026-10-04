const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'shefinance_secret_key';

// Setup mailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
});

function sendWelcomeMail(email, name) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to SheFinance! 🎉',
    html: `<div style="font-family:Arial,sans-serif;padding:20px;color:#333">
      <h2 style="color:#7c3aed">Hello ${name}, Welcome to SheFinance! 💜</h2>
      <p>Your journey to financial freedom starts here.</p>
      <p>You can now track expenses, set savings goals, get AI guidance, and explore government schemes.</p>
      <br><p>Best Regards,<br><strong>The SheFinance Team</strong></p>
    </div>`
  };
  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error('Email error:', err.message);
    else console.log('Welcome email sent to:', email);
  });
}

// ─── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password, role: role || 'user', provider: 'local' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    // Send welcome email
    sendWelcomeMail(email, name);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─── POST /api/auth/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email. Please register first.' });
    }
    if (user.provider === 'google') {
      return res.status(400).json({ success: false, message: 'This account uses Google Sign-In. Please use "Sign in with Google".' });
    }
    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact support.' });
    }
    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: `Access Denied. You are not registered as ${role.toUpperCase()}.` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─── POST /api/auth/google-login ─────────────────────────────────────────────
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google-login', async (req, res) => {
  try {
    const { credential, isRegister } = req.body;
    let payload;
    try {
      const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
      payload = ticket.getPayload();
    } catch (verifyError) {
      if (verifyError.message.includes('Token used too early')) {
        const base64Url = credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
      } else throw verifyError;
    }

    const { email, name } = payload;
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({ name, email, provider: 'google', role: 'user' });
      if (isRegister) sendWelcomeMail(email, name);
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: isRegister ? 'Google account registered.' : 'Google login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ success: false, message: 'Google authentication failed.' });
  }
});

// ─── POST /api/auth/send-welcome ─────────────────────────────────────────────
router.post('/send-welcome', (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ success: false, message: 'Email and Name required.' });
  sendWelcomeMail(email, name);
  res.json({ success: true, message: 'Welcome email triggered.' });
});

module.exports = router;

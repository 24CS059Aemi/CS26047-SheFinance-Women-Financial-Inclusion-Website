require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const app = express();

// ─── Connect to MongoDB Atlas ─────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Serve React production build ─────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'client/dist')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/profile',      require('./routes/profile'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budget',       require('./routes/budget'));
app.use('/api/savings',      require('./routes/savings'));
app.use('/api/support',      require('./routes/support'));
app.use('/api/admin',        require('./routes/admin'));
app.use('/api/chatbot',      require('./routes/chatbot'));

// ─── Legacy compatibility endpoints ──────────────────────────────────────────
// Keep /api/google-login and /api/send-welcome working (now handled in auth routes)
app.post('/api/google-login',  (req, res) => res.redirect(307, '/api/auth/google-login'));
app.post('/api/send-welcome',  (req, res) => res.redirect(307, '/api/auth/send-welcome'));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SheFinance API is running.', timestamp: new Date() });
});

// ─── SPA Fallback for React Router ───────────────────────────────────────────
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SheFinance Backend running on http://localhost:${PORT}`);
  console.log(`📦 MongoDB: ${process.env.MONGODB_URI ? 'Connected via Atlas' : '⚠️  MONGODB_URI not set in .env'}`);
});

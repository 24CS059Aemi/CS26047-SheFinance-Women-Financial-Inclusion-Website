require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const cron    = require('node-cron');
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

// ─── Public Schemes Route (no auth needed) ────────────────────────────────────
const schemesModule = require('./routes/schemes');
app.use('/api/schemes', schemesModule.router);

app.use('/api',              require('./routes/ml'));

// ─── Legacy compatibility endpoints ──────────────────────────────────────────
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
app.listen(PORT, async () => {
  console.log(`🚀 SheFinance Backend running on http://localhost:${PORT}`);
  console.log(`📦 MongoDB: ${process.env.MONGODB_URI ? 'Connected via Atlas' : '⚠️  MONGODB_URI not set in .env'}`);

  // ── Seed schemes if DB is empty (first run) ─────────────────────────────────
  try {
    await schemesModule.seedSchemesIfEmpty();
  } catch (e) {
    console.error('⚠️  Scheme seeding error:', e.message);
  }

  // ── Try initial Govt API sync ───────────────────────────────────────────────
  try {
    await schemesModule.syncFromGovtAPI();
  } catch (e) {
    console.error('⚠️  Initial Govt API sync error:', e.message);
  }

  // ── node-cron: Auto-sync from api.data.gov.in every 24 hours at 2:00 AM IST ─
  cron.schedule('0 2 * * *', async () => {
    console.log('⏰ [CRON] Daily Govt API sync triggered at 2:00 AM');
    try {
      await schemesModule.syncFromGovtAPI();
      console.log('✅ [CRON] Daily sync complete.');
    } catch (e) {
      console.error('❌ [CRON] Daily sync failed:', e.message);
    }
  }, { timezone: 'Asia/Kolkata' });

  console.log('⏰ node-cron: Govt API auto-sync scheduled daily at 2:00 AM IST');
});


// Quick script to check all MongoDB collections and their data
require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const User = require('./models/User');
const Budget = require('./models/Budget');
const SavingsGoal = require('./models/SavingsGoal');
const Transaction = require('./models/Transaction');
const SupportTicket = require('./models/SupportTicket');
const CmsContent = require('./models/CmsContent');

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check each collection
    const collections = [
      { name: 'Users', model: User },
      { name: 'Budgets', model: Budget },
      { name: 'SavingsGoals', model: SavingsGoal },
      { name: 'Transactions', model: Transaction },
      { name: 'SupportTickets', model: SupportTicket },
      { name: 'CmsContents', model: CmsContent },
    ];

    for (const col of collections) {
      const count = await col.model.countDocuments();
      console.log(`📦 ${col.name}: ${count} document(s)`);
      
      if (count > 0) {
        const docs = await col.model.find().lean().limit(5);
        docs.forEach((doc, i) => {
          // Hide password field
          if (doc.password) doc.password = '****HIDDEN****';
          console.log(`   [${i + 1}]`, JSON.stringify(doc, null, 2).substring(0, 300));
        });
      }
      console.log('');
    }

    await mongoose.disconnect();
    console.log('✅ Done. Disconnected.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkDatabase();

// ─── Seed Script: Comprehensive Sample Data Generator for Testing ─────────────
// Run:  node seed-sample-data.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const SavingsGoal = require('./models/SavingsGoal');
const SupportTicket = require('./models/SupportTicket');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // 1. Get or Create a Demo User
    let user = await User.findOne({ role: 'user' });
    if (!user) {
      user = await User.create({
        name: 'Priya Sharma',
        email: 'priya.demo@shefinance.com',
        password: 'Password@123',
        role: 'user',
        status: 'active',
        profile: {
          occupation: 'Handicraft Micro-Entrepreneur',
          income: '45000',
          financialGoal: 'Business Expansion & Emergency Fund',
          literacyLevel: 'Intermediate',
          onboarded: true,
        },
      });
      console.log('👤 Created Demo User: priya.demo@shefinance.com (Password: Password@123)');
    } else {
      console.log(`👤 Using existing User: ${user.name} (${user.email})`);
    }

    // 2. Add Sample Transactions (Income & Expenses for chart testing)
    console.log('\n💳 Seeding Sample Transactions...');
    await Transaction.deleteMany({ userId: user._id }); // refresh demo user transactions

    const sampleTransactions = [
      { userId: user._id, type: 'income', category: 'Business Income', amount: 45000, note: 'Monthly Handicraft Product Sales', date: new Date('2026-09-01') },
      { userId: user._id, type: 'income', category: 'Freewriting / Freelancing', amount: 8500, note: 'Custom Order Design Work', date: new Date('2026-09-10') },
      { userId: user._id, type: 'income', category: 'Government Grant', amount: 15000, note: 'Mudra Micro-Enterprise Incentive', date: new Date('2026-09-15') },
      
      { userId: user._id, type: 'expense', category: 'Raw Materials', amount: 12000, note: 'Fabric & Thread supplies', date: new Date('2026-09-03') },
      { userId: user._id, type: 'expense', category: 'Household Groceries', amount: 8500, note: 'Monthly family ration', date: new Date('2026-09-05') },
      { userId: user._id, type: 'expense', category: 'Education & Fees', amount: 5000, note: 'Daughter school fees', date: new Date('2026-09-12') },
      { userId: user._id, type: 'expense', category: 'Utilities & Bills', amount: 2800, note: 'Electricity & Wifi', date: new Date('2026-09-18') },
      { userId: user._id, type: 'expense', category: 'Savings Contribution', amount: 10000, note: 'SIP Investment into Mutual Fund', date: new Date('2026-09-22') },
      { userId: user._id, type: 'expense', category: 'Healthcare', amount: 2200, note: 'Routine health checkup', date: new Date('2026-09-25') },
    ];

    await Transaction.insertMany(sampleTransactions);
    console.log(`✅ Seeded ${sampleTransactions.length} Transactions`);

    // 3. Add Sample Savings Goals
    console.log('\n🎯 Seeding Sample Savings Goals...');
    await SavingsGoal.deleteMany({ userId: user._id });

    const sampleGoals = [
      {
        userId: user._id,
        name: 'Emergency Support Reserve',
        targetAmount: 50000,
        savedAmount: 35000,
        monthlySavings: 5000,
        targetDate: '2026-12-31',
        icon: '🛡️',
        color: '#10b981',
        completed: false,
      },
      {
        userId: user._id,
        name: 'Workshop Equipment Purchase',
        targetAmount: 80000,
        savedAmount: 55000,
        monthlySavings: 8000,
        targetDate: '2027-03-31',
        icon: '🧵',
        color: '#8b5cf6',
        completed: false,
      },
      {
        userId: user._id,
        name: 'Higher Education Fund',
        targetAmount: 150000,
        savedAmount: 45000,
        monthlySavings: 10000,
        targetDate: '2028-06-30',
        icon: '🎓',
        color: '#f59e0b',
        completed: false,
      },
      {
        userId: user._id,
        name: 'Gold Savings Scheme',
        targetAmount: 30000,
        savedAmount: 30000,
        monthlySavings: 5000,
        targetDate: '2026-08-31',
        icon: '🪙',
        color: '#ec4899',
        completed: true,
      },
    ];

    await SavingsGoal.insertMany(sampleGoals);
    console.log(`✅ Seeded ${sampleGoals.length} Savings Goals`);

    // 4. Add Sample Support Ticket
    console.log('\n🎫 Seeding Support Ticket...');
    const ticketCount = await SupportTicket.countDocuments({ email: user.email });
    if (ticketCount === 0) {
      await SupportTicket.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        category: 'Schemes',
        subject: 'Application guidance for Stand-Up India loan',
        message: 'Hello SheFinance team, I want to apply for Stand-Up India loan for expanding my handicraft workshop. Could you help me verify required documents?',
        status: 'Open',
        priority: 'High',
      });
      console.log('✅ Seeded Sample Support Ticket');
    } else {
      console.log('✅ Support ticket already exists');
    }

    console.log('\n=====================================================');
    console.log('🎉 SAMPLE DATA SEEDING COMPLETE!');
    console.log('=====================================================');
    console.log('Login credentials to test user view:');
    console.log(`   Email:    priya.demo@shefinance.com`);
    console.log(`   Password: Password@123\n`);
    console.log('Admin login to check all data across the platform:');
    console.log(`   Email:    admin@shefinance.com`);
    console.log(`   Password: Admin@2026`);
    console.log('=====================================================\n');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedData();

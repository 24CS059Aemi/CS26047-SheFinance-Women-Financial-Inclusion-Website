// ─── Seed Script: Admin User + Default CMS Data + Sample Tickets ─────────────
// Run:  node seed-admin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const CmsContent = require('./models/CmsContent');
const SupportTicket = require('./models/SupportTicket');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ──────────────────────────────────────────────────────────────────────────
    // 1. SEED ADMIN USER
    // ──────────────────────────────────────────────────────────────────────────
    const adminEmail = 'admin@shefinance.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'SheFinance Admin',
        email: adminEmail,
        password: 'Admin@2026',
        role: 'admin',
        provider: 'local',
        status: 'active',
        profile: {
          occupation: 'Platform Administrator',
          bio: 'SheFinance system administrator',
          onboarded: true,
        },
      });
      console.log('👤 Admin user created:');
      console.log(`   Email:    ${adminEmail}`);
      console.log(`   Password: Admin@2026`);
      console.log(`   Role:     admin\n`);
    } else {
      console.log('👤 Admin user already exists:', adminEmail, '\n');
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. SEED GOVERNMENT SCHEMES (CMS)
    // ──────────────────────────────────────────────────────────────────────────
    const existingSchemes = await CmsContent.countDocuments({ type: 'scheme' });
    if (existingSchemes === 0) {
      const schemes = [
        {
          type: 'scheme',
          title: 'Mahila Samman Savings Certificate',
          description: 'A government-backed savings certificate exclusively for women, offering a fixed 7.5% interest rate per annum with a 2-year tenure. Available at post offices and authorized banks.',
          category: 'Savings',
          eligibility: 'Women of any age (Tenure 2 yrs)',
          benefits: '7.5% Fixed Interest p.a.',
          deadline: '2027-03-31',
          isActive: true,
          createdBy: admin._id,
        },
        {
          type: 'scheme',
          title: 'Pradhan Mantri Mudra Yojana (PMMY)',
          description: 'Provides collateral-free micro-loans up to ₹10 Lakhs to women entrepreneurs and small businesses under three categories — Shishu, Kishore, and Tarun.',
          category: 'Business Loan',
          eligibility: 'Women Entrepreneurs & Small Businesses',
          benefits: 'Collateral-free loan up to ₹10 Lakhs',
          deadline: 'Ongoing',
          isActive: true,
          createdBy: admin._id,
        },
        {
          type: 'scheme',
          title: 'Sukanya Samriddhi Yojana (SSY)',
          description: 'A girl-child savings scheme under Beti Bachao Beti Padhao, offering one of the highest government-backed interest rates with tax-free returns on maturity.',
          category: 'Girl Child',
          eligibility: 'Parents of girl child under 10 years',
          benefits: '8.2% Tax-Free Interest Rate',
          deadline: 'Ongoing',
          isActive: true,
          createdBy: admin._id,
        },
        {
          type: 'scheme',
          title: 'Stand-Up India Scheme',
          description: 'Facilitates bank loans between ₹10 Lakhs to ₹1 Crore to at least one SC/ST and one woman entrepreneur per bank branch for greenfield enterprises.',
          category: 'Entrepreneurship',
          eligibility: 'SC/ST and Women Entrepreneurs',
          benefits: 'Bank loans from ₹10 Lakhs to ₹1 Crore',
          deadline: 'Ongoing',
          isActive: true,
          createdBy: admin._id,
        },
        {
          type: 'scheme',
          title: 'Dena Shakti Scheme',
          description: 'Provides loans up to ₹20 Lakhs to women in agriculture, retail, micro-enterprises, and small businesses at concessional interest rates.',
          category: 'Micro-Loan',
          eligibility: 'Women in agriculture, retail, micro-enterprises',
          benefits: '0.25% Interest concession on loans',
          deadline: 'Ongoing',
          isActive: true,
          createdBy: admin._id,
        },
      ];
      await CmsContent.insertMany(schemes);
      console.log(`📋 Seeded ${schemes.length} Government Schemes`);
    } else {
      console.log(`📋 Schemes already exist (${existingSchemes}), skipping.`);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. SEED FINANCIAL LITERACY ARTICLES (CMS)
    // ──────────────────────────────────────────────────────────────────────────
    const existingLiteracy = await CmsContent.countDocuments({ type: 'literacy' });
    if (existingLiteracy === 0) {
      const articles = [
        {
          type: 'literacy',
          title: '50-30-20 Rule for Smart Budgeting',
          description: 'Divide monthly income into Needs (50%), Wants (30%), and Savings (20%). This simple framework helps women take control of household finances without feeling overwhelmed.',
          content: 'The 50-30-20 budgeting rule is one of the simplest and most effective personal finance strategies. Allocate 50% of your after-tax income to needs (rent, groceries, utilities), 30% to wants (dining, entertainment, shopping), and 20% to savings and debt repayment. Start by tracking your expenses for one month, then categorize them. Use the SheFinance Budget Planner to automate this process.',
          category: 'Budgeting',
          difficulty: 'Beginner',
          isActive: true,
          createdBy: admin._id,
        },
        {
          type: 'literacy',
          title: 'Safe UPI & Net Banking Practices',
          description: 'Protecting UPI PINs, identifying fake customer care numbers, and recognizing phishing attempts. Essential digital safety for women using mobile banking.',
          content: 'Digital banking safety is crucial. Never share your UPI PIN or OTP with anyone. Banks never ask for passwords over phone. Always verify URLs before entering credentials. Enable two-factor authentication. Report suspicious transactions immediately through your bank app. Use only official bank apps downloaded from Play Store or App Store.',
          category: 'Digital Safety',
          difficulty: 'Beginner',
          isActive: true,
          createdBy: admin._id,
        },
        {
          type: 'literacy',
          title: 'Starting a Business with SHG Micro-Loans',
          description: 'Practical walkthrough for women self-help groups on securing bank credit, creating business plans, and managing group finances effectively.',
          content: 'Self-Help Groups (SHGs) are a powerful tool for women entrepreneurs. Start by forming a group of 10-20 women. Save regularly as a group for 6 months. Apply for credit linkage through NABARD or your local bank. Create a simple business plan outlining your products, customers, and expected revenue. Keep proper accounts of all group transactions.',
          category: 'Entrepreneurship',
          difficulty: 'Intermediate',
          isActive: true,
          createdBy: admin._id,
        },
        {
          type: 'literacy',
          title: 'Fixed Deposits vs Mutual Funds for Women',
          description: 'Understanding risks, compounding interest, and steady returns for long-term financial security. A comparison guide for first-time women investors.',
          content: 'Fixed Deposits offer guaranteed returns (6-7% p.a.) with zero risk — ideal for emergency funds. Mutual Funds can offer higher returns (10-15% p.a.) but with market risk. For beginners, start with FDs for your emergency fund (6 months of expenses), then explore SIP (Systematic Investment Plans) in index funds. Diversification is key to building long-term wealth.',
          category: 'Investments',
          difficulty: 'Intermediate',
          isActive: true,
          createdBy: admin._id,
        },
      ];
      await CmsContent.insertMany(articles);
      console.log(`📚 Seeded ${articles.length} Financial Literacy Articles`);
    } else {
      console.log(`📚 Literacy articles already exist (${existingLiteracy}), skipping.`);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. SEED SAMPLE SUPPORT TICKETS
    // ──────────────────────────────────────────────────────────────────────────
    const existingTickets = await SupportTicket.countDocuments();
    if (existingTickets === 0) {
      // Find existing users to link
      const users = await User.find({ role: 'user' }).limit(2);
      const tickets = [
        {
          userId: users[0]?._id || null,
          name: users[0]?.name || 'Priya Sharma',
          email: users[0]?.email || 'priya@example.com',
          category: 'Schemes',
          subject: 'How to apply for Mahila Samman Certificate?',
          message: 'I tried visiting the post office but needed guidance on the required forms and documents. Can you provide a step-by-step process?',
          status: 'Open',
          priority: 'Medium',
        },
        {
          userId: users[1]?._id || null,
          name: users[1]?.name || 'Kavita Joshi',
          email: users[1]?.email || 'kavita@example.com',
          category: 'Technical',
          subject: 'Error connecting UPI in tracker',
          message: 'Can we directly import bank statements into the SheFinance tracker? I keep getting an error when trying to add transactions manually.',
          status: 'Open',
          priority: 'High',
        },
      ];
      await SupportTicket.insertMany(tickets);
      console.log(`🎫 Seeded ${tickets.length} Sample Support Tickets`);
    } else {
      console.log(`🎫 Support tickets already exist (${existingTickets}), skipping.`);
    }

    console.log('\n✅ Seeding complete! Disconnecting...');
    await mongoose.disconnect();
    console.log('✅ Done.');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();

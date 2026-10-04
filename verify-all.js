async function runFullVerification() {
  const BASE = 'http://localhost:3000/api';
  console.log('========================================================');
  console.log('   FULL SYSTEM & PAGE VERIFICATION SUITE');
  console.log('========================================================\n');

  let results = [];

  async function check(name, fn) {
    try {
      const res = await fn();
      if (res) {
        console.log('[PASS] ✅  ' + name);
        results.push({ name, pass: true });
      } else {
        console.log('[FAIL] ❌  ' + name);
        results.push({ name, pass: false });
      }
    } catch (e) {
      console.log('[FAIL] ❌  ' + name + ' -> ' + e.message);
      results.push({ name, pass: false, err: e.message });
    }
  }

  // 1. Health
  await check('1. API Health Check', async () => {
    const res = await (await fetch(BASE + '/health')).json();
    return res.success === true;
  });

  // 2. Auth User Register & Login
  let userToken = '';
  const testEmail = 'verify_' + Date.now() + '@example.com';
  await check('2. User Register & Login Flow', async () => {
    const reg = await (await fetch(BASE + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Verify Test User', email: testEmail, password: 'Password@123' })
    })).json();
    userToken = reg.token;
    return reg.success && userToken;
  });

  const uHeaders = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken };

  // 3. Profile
  await check('3. Profile Get & Update', async () => {
    const pGet = await (await fetch(BASE + '/profile', { headers: uHeaders })).json();
    const pPut = await (await fetch(BASE + '/profile', {
      method: 'PUT',
      headers: uHeaders,
      body: JSON.stringify({ profile: { city: 'Surat', occupation: 'Finance Lead' } })
    })).json();
    return pGet.success && pPut.success;
  });

  // 4. Tracker Transactions
  let txId = '';
  await check('4. Tracker CRUD & Summary', async () => {
    const post = await (await fetch(BASE + '/transactions', {
      method: 'POST',
      headers: uHeaders,
      body: JSON.stringify({ type: 'income', category: 'Salary', amount: 50000, description: 'Test Salary' })
    })).json();
    txId = post.transaction?._id;
    const get = await (await fetch(BASE + '/transactions', { headers: uHeaders })).json();
    const sum = await (await fetch(BASE + '/transactions/summary', { headers: uHeaders })).json();
    return post.success && get.transactions?.length > 0 && sum.summary?.income === 50000;
  });

  // 5. Savings Goals
  let goalId = '';
  await check('5. Savings Goals CRUD', async () => {
    const post = await (await fetch(BASE + '/savings', {
      method: 'POST',
      headers: uHeaders,
      body: JSON.stringify({ name: 'Emergency Fund', targetAmount: 50000, savedAmount: 10000, monthlySavings: 5000, targetDate: '2027-01-01' })
    })).json();
    goalId = post.goal?._id;
    const put = await (await fetch(BASE + '/savings/' + goalId, {
      method: 'PUT',
      headers: uHeaders,
      body: JSON.stringify({ savedAmount: 15000 })
    })).json();
    return post.success && put.goal?.savedAmount === 15000;
  });

  // 6. Budget Planner
  await check('6. Budget Planner Save & Load', async () => {
    const post = await (await fetch(BASE + '/budget', {
      method: 'POST',
      headers: uHeaders,
      body: JSON.stringify({ month: '2026-10', totalBudget: 30000, categories: [{ name: 'Food', allocated: 10000 }] })
    })).json();
    const get = await (await fetch(BASE + '/budget?month=2026-10', { headers: uHeaders })).json();
    return post.success && get.budget?.totalBudget === 30000;
  });

  // 7. ML Predictions
  await check('7. ML Timeline & Health Benchmark', async () => {
    const ml1 = await (await fetch(BASE + '/predict_timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_amount: 50000, saved_amount: 15000, monthly_savings: 5000, target_date: '2027-02-01' })
    })).json();
    const ml2 = await (await fetch(BASE + '/predict_health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age: 26, income: 45000 })
    })).json();
    return ml1.status === 'success' && ml2.status === 'success';
  });

  // 8. AI Chatbot
  await check('8. AI Chatbot Financial Engine', async () => {
    const chat = await (await fetch(BASE + '/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is Mahila Samman Scheme?' })
    })).json();
    return chat.status === 'success' && typeof chat.reply === 'string' && chat.reply.length > 20;
  });

  // 9. Support Ticket
  await check('9. Support Desk Ticket Submission', async () => {
    const sup = await (await fetch(BASE + '/support', {
      method: 'POST',
      headers: uHeaders,
      body: JSON.stringify({ subject: 'Test Inquiry', message: 'Hello Support Desk', category: 'General' })
    })).json();
    return sup.success && sup.ticket?._id;
  });

  // 10. Admin Login & Authorization
  let adminToken = '';
  await check('10. Admin Authentication (admin@shefinance.com)', async () => {
    const aLog = await (await fetch(BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@shefinance.com', password: 'Admin@2026', role: 'admin' })
    })).json();
    adminToken = aLog.token;
    return aLog.success && adminToken;
  });

  const aHeaders = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken };

  // 11. Admin Stats & Analytics
  await check('11. Admin Platform Stats & Metrics', async () => {
    const res = await (await fetch(BASE + '/admin/stats', { headers: aHeaders })).json();
    return res.success && typeof res.stats?.totalUsers === 'number';
  });

  // 12. Admin Users List
  await check('12. Admin Users Directory', async () => {
    const res = await (await fetch(BASE + '/admin/users', { headers: aHeaders })).json();
    return res.success && Array.isArray(res.users) && res.users.length > 0;
  });

  // 13. Admin Transactions
  await check('13. Admin Transactions Monitor', async () => {
    const res = await (await fetch(BASE + '/admin/transactions', { headers: aHeaders })).json();
    return res.success && Array.isArray(res.transactions);
  });

  // 14. Admin Savings Monitor
  await check('14. Admin Savings Goals Monitor', async () => {
    const res = await (await fetch(BASE + '/admin/goals', { headers: aHeaders })).json();
    return res.success && Array.isArray(res.goals);
  });

  // 15. Admin Support Desk
  await check('15. Admin Support Ticket Management', async () => {
    const res = await (await fetch(BASE + '/admin/support', { headers: aHeaders })).json();
    return res.success && Array.isArray(res.tickets);
  });

  // 16. Admin Schemes CMS
  await check('16. Admin Schemes Content Management (CMS)', async () => {
    const res = await (await fetch(BASE + '/admin/schemes', { headers: aHeaders })).json();
    return res.success && Array.isArray(res.schemes) && res.schemes.length > 0;
  });

  // 17. Admin Literacy CMS
  await check('17. Admin Financial Literacy Articles (CMS)', async () => {
    const res = await (await fetch(BASE + '/admin/literacy', { headers: aHeaders })).json();
    return res.success && Array.isArray(res.articles) && res.articles.length > 0;
  });

  console.log('\n========================================================');
  const passCount = results.filter(r => r.pass).length;
  const failCount = results.filter(r => !r.pass).length;
  console.log('   TOTAL CHECKS: ' + results.length + ' | PASSED: ' + passCount + ' | FAILED: ' + failCount);
  console.log('   OVERALL STATUS: ' + (failCount === 0 ? 'ALL SYSTEMS OPERATIONAL ✅🎉' : 'ISSUES DETECTED ❌'));
  console.log('========================================================');
}

runFullVerification();

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';

const categoryIcons = {
  'Salary': 'fa-briefcase', 'Freelance': 'fa-briefcase', 'Business': 'fa-briefcase',
  'Investment': 'fa-arrow-trend-up', 'Food': 'fa-cart-shopping', 'Rent': 'fa-house',
  'Transport': 'fa-car', 'Shopping': 'fa-bag-shopping', 'Bills': 'fa-bolt',
  'Health': 'fa-heart-pulse', 'Education': 'fa-graduation-cap', 'Entertainment': 'fa-film',
  'Other Income': 'fa-wallet', 'Other Expense': 'fa-ellipsis',
};

function getTransactions() { try { return JSON.parse(localStorage.getItem('sheFinanceTransactions') || '[]'); } catch { return []; } }
function getBudgets() { try { return JSON.parse(localStorage.getItem('sheFinanceBudgets') || '{}'); } catch { return {}; } }

function calcDashboard() {
  const txs = getTransactions();
  const now = new Date();
  const currentMonthStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  let totalBalance = 0, totalExpenseMonth = 0, totalIncomeMonth = 0;
  txs.forEach(tx => {
    if (tx.type === 'income') totalBalance += tx.amount; else totalBalance -= tx.amount;
    if (tx.date && tx.date.substring(0, 7) === currentMonthStr) {
      if (tx.type === 'expense') totalExpenseMonth += tx.amount;
      else if (tx.type === 'income') totalIncomeMonth += tx.amount;
    }
  });
  let score = 50;
  if (totalIncomeMonth > 0) {
    const savingsRate = ((totalIncomeMonth - totalExpenseMonth) / totalIncomeMonth) * 100;
    if (savingsRate > 20) score += 30;
    else if (savingsRate > 10) score += 15;
    else if (savingsRate < 0) score -= 20;
  } else if (totalExpenseMonth > 0) score -= 30;
  const budgets = getBudgets()[currentMonthStr] || {};
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
  if (totalBudget > 0) {
    const budgetUsage = (totalExpenseMonth / totalBudget) * 100;
    if (budgetUsage <= 90) score += 20;
    else if (budgetUsage > 100) score -= 15;
  }
  score = Math.max(10, Math.min(100, Math.round(score)));
  if (totalIncomeMonth === 0 && totalExpenseMonth === 0) score = 0;
  const recent = [...txs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  return { totalBalance, totalExpenseMonth, totalIncomeMonth, score, recent, currentSavings: totalIncomeMonth - totalExpenseMonth };
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [userName, setUserName] = useState('User');
  const [avatar, setAvatar] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const [tickets, setTickets] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'User';
    const formatted = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setUserName(formatted);
    const saved = localStorage.getItem('userAvatar');
    setAvatar(saved || `https://ui-avatars.com/api/?name=${encodeURIComponent(formatted)}&background=c99f55&color=fff`);
    setData(calcDashboard());
    const ann = localStorage.getItem('globalAnnouncement');
    if (ann) setAnnouncement(ann);
    loadTickets();
  }, []);

  function loadTickets() {
    const userEmail = localStorage.getItem('userEmail') || '';
    const all = JSON.parse(localStorage.getItem('sheFinanceTickets') || '[]');
    setTickets(all.filter(t => t.email === userEmail).reverse());
  }

  function submitTicket(e) {
    e.preventDefault();
    if (!ticket.subject.trim() || !ticket.message.trim()) return;
    const userName = localStorage.getItem('userName') || 'User';
    const userEmail = localStorage.getItem('userEmail') || '';
    const all = JSON.parse(localStorage.getItem('sheFinanceTickets') || '[]');
    const newT = {
      id: 'TCK-' + Math.floor(100 + Math.random() * 900),
      name: userName, user: userName, email: userEmail,
      subject: ticket.subject, msg: ticket.message, message: ticket.message,
      date: new Date().toISOString().split('T')[0], status: 'pending', reply: ''
    };
    all.push(newT);
    localStorage.setItem('sheFinanceTickets', JSON.stringify(all));
    setTicket({ subject: '', message: '' });
    showToast('Ticket submitted successfully! Our team will respond soon.');
    loadTickets();
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  if (!data) return null;
  const { totalBalance, totalExpenseMonth, totalIncomeMonth, score, recent, currentSavings } = data;

  function healthLabel() {
    if (score === 0) return { label: 'No transactions this month', cls: '', color: 'var(--text-light)' };
    if (score >= 80) return { label: 'Excellent! Keep saving.', color: '#2ecc71' };
    if (score >= 50) return { label: 'Fair. Try reducing wants.', color: '#f39c12' };
    return { label: 'Critical. Check budget!', color: '#e74c3c' };
  }

  const h = healthLabel();

  return (
    <div className="dashboard-body">
      <DashboardNav />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Welcome back, {userName}! 👋</h2>
            <p>Here is your financial summary for this month.</p>
          </div>
          <Link to="/profile" className="header-profile-link" title="Click to manage Profile & Settings">
            <div className="header-profile">
              <div className="profile-pic-wrapper">
                <img src={avatar} alt="Profile" />
                <span className="profile-badge-icon"><i className="fa-solid fa-gear"></i></span>
              </div>
              <div className="header-user-info">
                <span className="user-name">{userName}</span>
                <span className="profile-hint-text">Manage Profile <i className="fa-solid fa-chevron-right"></i></span>
              </div>
            </div>
          </Link>
        </header>

        {announcement && (
          <div className="announcement-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <i className="fa-solid fa-bullhorn" style={{ fontSize: '1.2rem' }}></i>
              <span>{announcement}</span>
            </div>
            <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', opacity: 0.8, padding: '5px' }} onClick={() => setAnnouncement('')}></i>
          </div>
        )}

        <section className="dashboard-content">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="card balance-card">
              <div className="card-icon"><i className="fa-solid fa-wallet"></i></div>
              <h3>Total Balance</h3>
              <h2>₹ {totalBalance.toLocaleString('en-IN')}</h2>
              <p className={totalBalance >= 0 ? 'positive' : 'negative'}>
                <i className={`fa-solid ${totalBalance >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
                {totalBalance >= 0 ? ' Net Savings' : ' Overdrawn!'}
              </p>
            </div>
            <div className="card expense-card">
              <div className="card-icon"><i className="fa-solid fa-chart-line"></i></div>
              <h3>Monthly Expenses</h3>
              <h2>₹ {totalExpenseMonth.toLocaleString('en-IN')}</h2>
              <p className="negative">This month</p>
            </div>
            <div className="card health-card">
              <div className="card-icon"><i className="fa-solid fa-heart-pulse"></i></div>
              <h3>Financial Health</h3>
              <h2>{score === 0 ? 'N/A' : `${score} / 100`}</h2>
              <p style={{ color: h.color, fontWeight: 500, fontSize: '0.9rem' }}>{h.label}</p>
            </div>
          </div>

          {/* Widgets */}
          <div className="dashboard-widgets">
            <div className="widget">
              <h3>Recent Transactions</h3>
              <ul className="transaction-list">
                {recent.length === 0 ? (
                  <li style={{ textAlign: 'center', color: 'var(--text-light)', padding: '20px 0' }}>No transactions recorded yet.</li>
                ) : recent.map((tx, i) => (
                  <li key={i}>
                    <div className="tx-info">
                      <div className="tx-icon"><i className={`fa-solid ${categoryIcons[tx.category] || 'fa-receipt'}`}></i></div>
                      {tx.description}
                    </div>
                    <div className={`tx-amount ${tx.type === 'income' ? 'positive' : 'negative'}`}>
                      {tx.type === 'income' ? '+' : '-'} ₹ {tx.amount.toLocaleString('en-IN')}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="widget ai-widget">
              <h3><i className="fa-solid fa-wand-magic-sparkles"></i> AI Savings Prediction</h3>
              <div className="ai-box">
                {totalIncomeMonth === 0 && totalExpenseMonth === 0 ? (
                  <>
                    <p>Start logging your income and expenses to unlock live AI budgeting tips and financial scores! ✨</p>
                    <Link to="/tracker" className="btn btn-primary" style={{ marginTop: '15px' }}>Log Transaction</Link>
                  </>
                ) : currentSavings <= 0 ? (
                  <>
                    <p>🚨 Your monthly spending exceeds your income! You have spent <strong>₹{Math.abs(currentSavings).toLocaleString('en-IN')}</strong> more than you earned.</p>
                    <p><em>AI Tip: Go to the Budget Planner and set strict limits on luxury wants.</em></p>
                    <Link to="/budget" className="btn btn-primary" style={{ marginTop: '15px' }}>Plan Budget</Link>
                  </>
                ) : (
                  <>
                    <p>Based on your current spending, you are saving <strong>₹{currentSavings.toLocaleString('en-IN')}</strong> ({Math.round((currentSavings / totalIncomeMonth) * 100)}%) of your income this month! ✨</p>
                    <p><em>AI Tip: Consider locking ₹{Math.round(currentSavings * 0.4).toLocaleString('en-IN')} into a Savings Goal.</em></p>
                    <Link to="/savings" className="btn btn-primary" style={{ marginTop: '15px' }}>Set Savings Goal</Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="dashboard-widgets" id="help-support-section" style={{ marginTop: '30px' }}>
            <div className="widget" style={{ flex: 1 }}>
              <h3><i className="fa-solid fa-headset" style={{ color: 'var(--secondary-color)', marginRight: '8px' }}></i> Help &amp; Support</h3>
              <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '18px' }}>Have a question? Submit your query below and our team will respond.</p>
              <form onSubmit={submitTicket}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '5px' }}>Subject / Topic</label>
                  <input type="text" placeholder="e.g., How to apply for Mudra Yojana?" value={ticket.subject} onChange={e => setTicket(t => ({ ...t, subject: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#666', display: 'block', marginBottom: '5px' }}>Describe your question or issue</label>
                  <textarea rows="4" placeholder="Tell us how we can help you..." value={ticket.message} onChange={e => setTicket(t => ({ ...t, message: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary"><i className="fa-solid fa-paper-plane"></i> Submit Ticket</button>
              </form>
              {tickets.length > 0 && (
                <div style={{ marginTop: '22px' }}>
                  <h4 style={{ margin: '0 0 12px', color: 'var(--primary-color)', fontSize: '0.95rem' }}>
                    <i className="fa-solid fa-ticket" style={{ color: 'var(--secondary-color)', marginRight: '6px' }}></i>My Tickets
                  </h4>
                  {tickets.map(t => (
                    <div key={t.id} style={{ background: '#f8f9fb', padding: '14px 16px', borderRadius: '10px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--primary-color)' }}>{t.subject}</strong>
                        <span style={{ background: t.status === 'resolved' ? 'rgba(46,204,113,0.12)' : 'rgba(243,156,18,0.14)', color: t.status === 'resolved' ? '#2ecc71' : '#d68910', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {t.status === 'resolved' ? '✅ Resolved' : '🕐 Pending'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#888', margin: 0 }}>{t.id} · {t.date}</p>
                      {t.reply && (
                        <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(46,204,113,0.06)', borderLeft: '3px solid #2ecc71', borderRadius: '6px' }}>
                          <p style={{ fontSize: '0.82rem', color: '#555', margin: 0 }}><i className="fa-solid fa-reply" style={{ color: '#2ecc71', marginRight: '6px' }}></i><strong>Admin Reply:</strong> {t.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="widget" style={{ flex: 0.6 }}>
              <h3><i className="fa-solid fa-circle-question" style={{ color: 'var(--secondary-color)', marginRight: '8px' }}></i> Quick Help</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                <Link to="/chatbot" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: '#f8f9fb', borderRadius: '10px', color: 'var(--primary-color)', fontWeight: 500, fontSize: '0.9rem' }}>
                  <i className="fa-solid fa-robot" style={{ color: 'var(--secondary-color)', fontSize: '1.1rem' }}></i> Ask AI Chatbot
                </Link>
                <Link to="/education" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', background: '#f8f9fb', borderRadius: '10px', color: 'var(--primary-color)', fontWeight: 500, fontSize: '0.9rem' }}>
                  <i className="fa-solid fa-book-open" style={{ color: 'var(--secondary-color)', fontSize: '1.1rem' }}></i> Education Hub &amp; Guides
                </Link>
                <div style={{ padding: '14px 15px', background: 'linear-gradient(135deg,rgba(201,159,85,0.08),rgba(201,159,85,0.02))', borderRadius: '10px', border: '1px solid rgba(201,159,85,0.15)' }}>
                  <p style={{ fontSize: '0.82rem', color: '#888', margin: 0 }}><i className="fa-solid fa-phone" style={{ color: 'var(--secondary-color)', marginRight: '6px' }}></i><strong>Women Helpline:</strong> 181</p>
                  <p style={{ fontSize: '0.82rem', color: '#888', margin: '4px 0 0' }}><i className="fa-solid fa-shield" style={{ color: 'var(--secondary-color)', marginRight: '6px' }}></i><strong>Cyber Crime:</strong> 1930</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {toast && (
        <div className="toast-notification show">
          <i className="fa-solid fa-check-circle"></i> {toast}
        </div>
      )}
    </div>
  );
}

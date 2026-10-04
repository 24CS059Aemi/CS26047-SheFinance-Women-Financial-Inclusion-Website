import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import { budgetAPI, transactionAPI } from '../api';

const EXPENSE_CATEGORIES = [
  { key: 'Food', label: 'Food & Groceries', icon: 'fa-utensils', colorClass: 'food' },
  { key: 'Rent', label: 'Rent / Housing', icon: 'fa-house', colorClass: 'rent' },
  { key: 'Transport', label: 'Transport', icon: 'fa-car', colorClass: 'transport' },
  { key: 'Shopping', label: 'Shopping', icon: 'fa-bag-shopping', colorClass: 'shopping' },
  { key: 'Bills', label: 'Bills & Utilities', icon: 'fa-bolt', colorClass: 'bills' },
  { key: 'Health', label: 'Health & Medical', icon: 'fa-heart-pulse', colorClass: 'health' },
  { key: 'Education', label: 'Education', icon: 'fa-graduation-cap', colorClass: 'education' },
  { key: 'Entertainment', label: 'Entertainment', icon: 'fa-film', colorClass: 'entertainment' },
  { key: 'Other', label: 'Other', icon: 'fa-ellipsis', colorClass: 'other' },
];

export default function Budget() {
  const now = new Date();
  const currentMonthStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [budgets, setBudgets] = useState({});
  const [inputs, setInputs] = useState({});
  const [txs, setTxs] = useState([]);
  const [toast, setToast] = useState('');
  const [userName, setUserName] = useState('User');
  const [avatar, setAvatar] = useState('');

  async function loadBudgetData(month) {
    try {
      const res = await budgetAPI.get(month);
      const categoryMap = {};
      if (res.budget && Array.isArray(res.budget.categories)) {
        res.budget.categories.forEach(c => {
          categoryMap[c.name] = c.allocated || 0;
        });
      }
      setBudgets(categoryMap);
      const inp = {};
      EXPENSE_CATEGORIES.forEach(c => { inp[c.key] = categoryMap[c.key] || ''; });
      setInputs(inp);
    } catch {
      const all = JSON.parse(localStorage.getItem('sheFinanceBudgets') || '{}');
      const monthBudget = all[month] || {};
      setBudgets(monthBudget);
      const inp = {};
      EXPENSE_CATEGORIES.forEach(c => { inp[c.key] = monthBudget[c.key] || ''; });
      setInputs(inp);
    }
  }

  async function loadTransactions() {
    try {
      const res = await transactionAPI.getAll();
      setTxs(res.transactions || []);
    } catch {
      const cached = JSON.parse(localStorage.getItem('sheFinanceTransactions') || '[]');
      setTxs(cached);
    }
  }

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'User';
    const formatted = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setUserName(formatted);
    const saved = localStorage.getItem('userAvatar');
    setAvatar(saved || `https://ui-avatars.com/api/?name=${encodeURIComponent(formatted)}&background=c99f55&color=fff`);
    loadBudgetData(selectedMonth);
    loadTransactions();
  }, []);

  function handleMonthChange(e) {
    const m = e.target.value;
    setSelectedMonth(m);
    loadBudgetData(m);
  }

  async function handleSave() {
    const parsed = {};
    const categoriesArray = [];
    let totalBudgetSum = 0;

    EXPENSE_CATEGORIES.forEach(c => {
      const v = parseFloat(inputs[c.key]);
      if (!isNaN(v) && v > 0) {
        parsed[c.key] = v;
        categoriesArray.push({ name: c.key, allocated: v, spent: getSpent(c.key) });
        totalBudgetSum += v;
      }
    });

    try {
      await budgetAPI.save({
        month: selectedMonth,
        totalBudget: totalBudgetSum,
        categories: categoriesArray
      });
      setBudgets(parsed);
      const all = JSON.parse(localStorage.getItem('sheFinanceBudgets') || '{}');
      all[selectedMonth] = parsed;
      localStorage.setItem('sheFinanceBudgets', JSON.stringify(all));
      showToast('Budget saved to database! ✅');
    } catch (err) {
      alert('Failed to save budget: ' + err.message);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  // Calculate actual spending for selected month per category
  const monthTxs = txs.filter(tx => tx.type === 'expense' && tx.date && (typeof tx.date === 'string' ? tx.date : new Date(tx.date).toISOString()).substring(0, 7) === selectedMonth);

  function getSpent(catKey) {
    return monthTxs.filter(tx => tx.category === catKey || tx.category.toLowerCase().includes(catKey.toLowerCase())).reduce((s, t) => s + Number(t.amount || 0), 0);
  }

  const totalBudget = EXPENSE_CATEGORIES.reduce((s, c) => s + (budgets[c.key] || 0), 0);
  const totalSpent = EXPENSE_CATEGORIES.reduce((s, c) => s + getSpent(c.key), 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPct = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

  function getBarColor(pct) {
    if (pct > 100) return 'fill-red';
    if (pct > 75) return 'fill-orange';
    return 'fill-green';
  }

  return (
    <div className="dashboard-body">
      <DashboardNav />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Budget Planner</h2>
            <p>Set monthly spending limits per category and track your adherence in real-time.</p>
          </div>
          <Link to="/profile" className="header-profile-link" title="Manage Profile">
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

        {/* Month Selector & Save */}
        <div className="budget-header-row">
          <div className="budget-month-select">
            <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}><i className="fa-solid fa-calendar-days" style={{ color: 'var(--secondary-color)', marginRight: '8px' }}></i>Budget Month:</span>
            <input type="month" value={selectedMonth} onChange={handleMonthChange} />
          </div>
          <button className="btn-save-budget" onClick={handleSave}>
            <i className="fa-solid fa-floppy-disk"></i> Save Budget
          </button>
        </div>

        {/* Overview Cards */}
        <div className="budget-overview">
          <div className="card">
            <div className="card-icon"><i className="fa-solid fa-wallet"></i></div>
            <h3>Total Budget</h3>
            <h2>₹ {totalBudget.toLocaleString('en-IN')}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Monthly limit set</p>
          </div>
          <div className="card">
            <div className="card-icon"><i className="fa-solid fa-chart-bar"></i></div>
            <h3>Total Spent</h3>
            <h2 style={{ color: '#e74c3c' }}>₹ {totalSpent.toLocaleString('en-IN')}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>This month</p>
          </div>
          <div className="card" style={totalRemaining < 0 ? { borderLeft: '4px solid #e74c3c' } : {}}>
            <div className="card-icon"><i className="fa-solid fa-piggy-bank"></i></div>
            <h3>Remaining</h3>
            <h2 style={{ color: totalRemaining >= 0 ? '#2ecc71' : '#e74c3c' }}>₹ {Math.abs(totalRemaining).toLocaleString('en-IN')}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{totalRemaining < 0 ? 'Over budget!' : 'Left to spend'}</p>
          </div>
          <div className="card">
            <div className="card-icon"><i className="fa-solid fa-percent"></i></div>
            <h3>Budget Used</h3>
            <h2 style={{ color: overallPct > 90 ? '#e74c3c' : overallPct > 70 ? '#f39c12' : '#2ecc71' }}>{Math.round(overallPct)}%</h2>
            <div className="budget-progress-bar" style={{ marginTop: '10px' }}>
              <div className={`budget-progress-fill ${getBarColor(overallPct)}`} style={{ width: `${Math.min(overallPct, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Budget Categories Grid */}
        <div className="budget-grid">
          <div className="budget-card">
            <h3><i className="fa-solid fa-sliders"></i> Set Category Budgets</h3>
            <div id="budget-inputs">
              {EXPENSE_CATEGORIES.map(cat => (
                <div className="category-budget-item" key={cat.key}>
                  <div className="cat-info">
                    <div className={`cat-icon ${cat.colorClass}`}>
                      <i className={`fa-solid ${cat.icon}`}></i>
                    </div>
                    <div className="cat-details">
                      <h4>{cat.label}</h4>
                      <div className="cat-amounts">
                        Spent: <span style={{ color: '#e74c3c' }}>₹{getSpent(cat.key).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    className="cat-budget-input"
                    placeholder="₹ Limit"
                    min="0"
                    value={inputs[cat.key] ?? ''}
                    onChange={e => setInputs(inp => ({ ...inp, [cat.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="budget-card">
            <h3><i className="fa-solid fa-chart-bar"></i> Spending vs Budget</h3>
            <div id="budget-comparison">
              {EXPENSE_CATEGORIES.map(cat => {
                const spent = getSpent(cat.key);
                const limit = budgets[cat.key] || 0;
                const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
                const fillClass = pct < 60 ? 'fill-green' : pct < 85 ? 'fill-orange' : 'fill-red';
                return (
                  <div className="category-budget-item" key={cat.key}>
                    <div className="cat-info">
                      <div className={`cat-icon ${cat.colorClass}`}>
                        <i className={`fa-solid ${cat.icon}`}></i>
                      </div>
                      <div className="cat-details">
                        <h4>{cat.label}</h4>
                        <div className="cat-amounts">
                          <span>₹{spent.toLocaleString('en-IN')}</span> of ₹{limit.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <div className="cat-progress">
                      <div className="cat-progress-bar">
                        <div className={`cat-progress-fill ${fillClass}`} style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="cat-percent">{Math.round(pct)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="budget-tip">
              <h3><i className="fa-solid fa-wand-magic-sparkles"></i> AI Budget Tip</h3>
              <p>
                Follow the <strong>50/30/20 Rule</strong>: Allocate <strong>50%</strong> of income to Needs (Rent, Food, Bills),
                <strong> 30%</strong> to Wants (Shopping, Entertainment), and <strong>20%</strong> to Savings &amp; Investments.
                {totalBudget > 0 && totalSpent > totalBudget && <> <strong>You are currently over budget!</strong> Consider cutting discretionary spending first.</>}
              </p>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <div className="toast-notification show">
          <i className="fa-solid fa-check-circle"></i> {toast}
        </div>
      )}
    </div>
  );
}

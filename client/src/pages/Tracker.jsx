import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Other Income'];
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Entertainment', 'Other Expense'];
const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const categoryIcons = {
  'Salary': 'fa-briefcase', 'Freelance': 'fa-laptop', 'Business': 'fa-store',
  'Investment': 'fa-arrow-trend-up', 'Other Income': 'fa-wallet',
  'Food': 'fa-cart-shopping', 'Rent': 'fa-house', 'Transport': 'fa-car',
  'Shopping': 'fa-bag-shopping', 'Bills': 'fa-bolt', 'Health': 'fa-heart-pulse',
  'Education': 'fa-graduation-cap', 'Entertainment': 'fa-film', 'Other Expense': 'fa-ellipsis',
};

function getTxs() { try { return JSON.parse(localStorage.getItem('sheFinanceTransactions') || '[]'); } catch { return []; } }
function saveTxs(txs) { localStorage.setItem('sheFinanceTransactions', JSON.stringify(txs)); }

const defaultForm = { type: 'income', description: '', amount: '', category: 'Salary', date: new Date().toISOString().split('T')[0] };

export default function Tracker() {
  const [txs, setTxs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  });
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState(-1);
  const [form, setForm] = useState(defaultForm);
  const [toast, setToast] = useState('');
  const [userName, setUserName] = useState('User');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    setTxs(getTxs());
    const name = localStorage.getItem('userName') || 'User';
    const formatted = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setUserName(formatted);
    const saved = localStorage.getItem('userAvatar');
    setAvatar(saved || `https://ui-avatars.com/api/?name=${encodeURIComponent(formatted)}&background=c99f55&color=fff`);
  }, []);

  const filtered = txs
    .filter(tx => {
      if (filterType !== 'all' && tx.type !== filterType) return false;
      if (filterCat !== 'all' && tx.category !== filterCat) return false;
      if (filterMonth && tx.date && tx.date.substring(0, 7) !== filterMonth) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const monthTxs = txs.filter(tx => filterMonth && tx.date && tx.date.substring(0, 7) === filterMonth);
  const totalIncome = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = totalIncome - totalExpense;

  function openAdd() {
    setEditIdx(-1);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEdit(tx, idx) {
    setEditIdx(idx);
    setForm({ type: tx.type, description: tx.description, amount: String(tx.amount), category: tx.category, date: tx.date });
    setShowModal(true);
  }

  function handleDelete(idx) {
    if (!window.confirm('Delete this transaction?')) return;
    const updated = [...txs];
    updated.splice(idx, 1);
    saveTxs(updated);
    setTxs(updated);
    showToast('Transaction deleted!');
  }

  function handleSave() {
    if (!form.description.trim() || !form.amount || parseFloat(form.amount) <= 0 || !form.date) {
      alert('Please fill in all fields with valid values.');
      return;
    }
    const tx = { ...form, amount: parseFloat(form.amount) };
    const updated = [...txs];
    if (editIdx >= 0) { updated[editIdx] = tx; showToast('Transaction updated!'); }
    else { updated.push(tx); showToast('Transaction added!'); }
    saveTxs(updated);
    setTxs(updated);
    setShowModal(false);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  // Find original index in full txs array
  function origIdx(tx) { return txs.indexOf(tx); }

  return (
    <div className="dashboard-body">
      <DashboardNav />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Income &amp; Expense Tracker</h2>
            <p>Track every rupee — log your income and expenses to stay on top of your finances.</p>
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

        {/* Summary Cards */}
        <div className="tracker-summary">
          <div className="card income-card">
            <div className="card-icon"><i className="fa-solid fa-arrow-trend-up"></i></div>
            <h3>Total Income</h3>
            <h2 style={{ color: '#2ecc71' }}>₹ {totalIncome.toLocaleString('en-IN')}</h2>
            <p className="positive" style={{ fontSize: '0.85rem' }}>This month</p>
          </div>
          <div className="card expense-card">
            <div className="card-icon"><i className="fa-solid fa-arrow-trend-down"></i></div>
            <h3>Total Expenses</h3>
            <h2 style={{ color: '#e74c3c' }}>₹ {totalExpense.toLocaleString('en-IN')}</h2>
            <p className="negative" style={{ fontSize: '0.85rem' }}>This month</p>
          </div>
          <div className="card net-card">
            <div className="card-icon"><i className="fa-solid fa-scale-balanced"></i></div>
            <h3>Net Balance</h3>
            <h2 style={{ color: net >= 0 ? '#2ecc71' : '#e74c3c' }}>₹ {Math.abs(net).toLocaleString('en-IN')}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Income - Expenses</p>
          </div>
        </div>

        {/* Controls */}
        <div className="tracker-controls">
          <div className="tracker-filters">
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
          </div>
          <button className="btn-add" onClick={openAdd}>
            <i className="fa-solid fa-plus"></i> Add Transaction
          </button>
        </div>

        {/* Transactions Table */}
        <div className="transactions-widget">
          <h3><i className="fa-solid fa-list-ul" style={{ color: 'var(--secondary-color)' }}></i> Transaction History</h3>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <i className="fa-solid fa-receipt"></i>
              <p>No transactions found. Click "Add Transaction" to get started!</p>
            </div>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => {
                  const oi = origIdx(tx);
                  const dateStr = new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={i}>
                      <td>{dateStr}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ background: '#f4f7f9', padding: '6px 8px', borderRadius: '8px', color: 'var(--primary-color)' }}>
                            <i className={`fa-solid ${categoryIcons[tx.category] || 'fa-receipt'}`}></i>
                          </span>
                          {tx.description}
                        </div>
                      </td>
                      <td>
                        <span className={`tx-category-badge ${isIncome ? 'tx-type-income' : 'tx-type-expense'}`}>{tx.category}</span>
                      </td>
                      <td>
                        <span className={`tx-category-badge ${isIncome ? 'tx-type-income' : 'tx-type-expense'}`}>
                          {isIncome ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className={isIncome ? 'tx-amount-positive' : 'tx-amount-negative'}>
                        {isIncome ? '+' : '-'} ₹ {tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <div className="tx-actions">
                          <button className="btn-edit" title="Edit" onClick={() => openEdit(tx, oi)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button className="btn-delete" title="Delete" onClick={() => handleDelete(oi)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay active" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h3>
              <i className={`fa-solid ${editIdx >= 0 ? 'fa-pen-to-square' : 'fa-plus-circle'}`} style={{ color: 'var(--secondary-color)' }}></i>
              {editIdx >= 0 ? ' Edit Transaction' : ' Add Transaction'}
            </h3>
            <div className="input-group">
              <label>Type</label>
              <div className="type-toggle">
                <input type="radio" id="type-income" name="tx-type" checked={form.type === 'income'} onChange={() => setForm(f => ({ ...f, type: 'income', category: 'Salary' }))} style={{ display: 'none' }} />
                <label htmlFor="type-income" className="type-income-label" style={{ flex: 1, textAlign: 'center', padding: '12px', cursor: 'pointer', fontWeight: 500, background: form.type === 'income' ? '#2ecc71' : '', color: form.type === 'income' ? '#fff' : '', transition: 'all 0.3s ease' }}>
                  <i className="fa-solid fa-arrow-up"></i> Income
                </label>
                <input type="radio" id="type-expense" name="tx-type" checked={form.type === 'expense'} onChange={() => setForm(f => ({ ...f, type: 'expense', category: 'Food' }))} style={{ display: 'none' }} />
                <label htmlFor="type-expense" className="type-expense-label" style={{ flex: 1, textAlign: 'center', padding: '12px', cursor: 'pointer', fontWeight: 500, background: form.type === 'expense' ? '#e74c3c' : '', color: form.type === 'expense' ? '#fff' : '', transition: 'all 0.3s ease' }}>
                  <i className="fa-solid fa-arrow-down"></i> Expense
                </label>
              </div>
            </div>
            <div className="input-group">
              <label>Description</label>
              <input type="text" placeholder="e.g., Monthly Salary, Groceries" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="input-group">
              <label>Amount (₹)</label>
              <input type="number" placeholder="Enter amount" min="1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <optgroup label="Income">
                  {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </optgroup>
                <optgroup label="Expense">
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </optgroup>
              </select>
            </div>
            <div className="input-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSave}>Save Transaction</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-notification show">
          <i className="fa-solid fa-circle-check"></i> {toast}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import { transactionAPI } from '../api';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Other Income'];
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Entertainment', 'Other Expense'];
const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const categoryIcons = {
  'Salary': 'fa-briefcase', 'Freelance': 'fa-laptop', 'Business': 'fa-store',
  'Investment': 'fa-arrow-trend-up', 'Other Income': 'fa-wallet',
  'Food': 'fa-cart-shopping', 'Rent': 'fa-house', 'Transport': 'fa-car',
  'Shopping': 'fa-bag-shopping', 'Bills': 'fa-bolt', 'Health': 'fa-heart-pulse',
  'Education': 'fa-graduation-cap', 'Entertainment': 'fa-film', 'Other Expense': 'fa-ellipsis',
  'Raw Materials': 'fa-boxes-stacked', 'Household Groceries': 'fa-basket-shopping',
  'Education & Fees': 'fa-graduation-cap', 'Utilities & Bills': 'fa-bolt',
  'Savings Contribution': 'fa-piggy-bank', 'Healthcare': 'fa-heart-pulse',
  'Business Income': 'fa-store', 'Freewriting / Freelancing': 'fa-laptop', 'Government Grant': 'fa-landmark'
};

const defaultForm = { type: 'income', description: '', amount: '', category: 'Salary', date: new Date().toISOString().split('T')[0] };

export default function Tracker() {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [toast, setToast] = useState('');
  const [userName, setUserName] = useState('User');
  const [avatar, setAvatar] = useState('');

  async function loadTransactions() {
    setLoading(true);
    try {
      const res = await transactionAPI.getAll();
      const list = (res.transactions || []).map(t => ({
        ...t,
        description: t.note || t.description || t.category || '',
        date: t.date ? t.date.split('T')[0] : '',
        amount: Number(t.amount) || 0
      }));
      setTxs(list);
      localStorage.setItem('sheFinanceTransactions', JSON.stringify(list));
    } catch (err) {
      console.warn('API error, falling back to cached local storage:', err.message);
      try {
        const cached = JSON.parse(localStorage.getItem('sheFinanceTransactions') || '[]');
        setTxs(cached);
      } catch (e) {
        setTxs([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
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
    setEditingTx(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEdit(tx) {
    setEditingTx(tx);
    setForm({
      type: tx.type,
      description: tx.description || tx.note || '',
      amount: String(tx.amount),
      category: tx.category,
      date: tx.date
    });
    setShowModal(true);
  }

  async function handleDelete(tx) {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      if (tx._id) {
        await transactionAPI.delete(tx._id);
      }
      const updated = txs.filter(t => t !== tx && t._id !== tx._id);
      setTxs(updated);
      localStorage.setItem('sheFinanceTransactions', JSON.stringify(updated));
      showToast('Transaction deleted from database!');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  }

  async function handleSave() {
    if (!form.description.trim() || !form.amount || parseFloat(form.amount) <= 0 || !form.date) {
      alert('Please fill in all fields with valid values.');
      return;
    }
    const payload = {
      type: form.type,
      category: form.category,
      amount: parseFloat(form.amount),
      note: form.description,
      description: form.description,
      date: form.date
    };

    try {
      if (editingTx && editingTx._id) {
        const res = await transactionAPI.update(editingTx._id, payload);
        const updatedDoc = {
          ...res.transaction,
          description: res.transaction.note || form.description,
          date: res.transaction.date ? res.transaction.date.split('T')[0] : form.date,
          amount: Number(res.transaction.amount)
        };
        const updated = txs.map(t => (t._id === editingTx._id ? updatedDoc : t));
        setTxs(updated);
        localStorage.setItem('sheFinanceTransactions', JSON.stringify(updated));
        showToast('Transaction updated in database!');
      } else {
        const res = await transactionAPI.create(payload);
        const newDoc = {
          ...res.transaction,
          description: res.transaction.note || form.description,
          date: res.transaction.date ? res.transaction.date.split('T')[0] : form.date,
          amount: Number(res.transaction.amount)
        };
        const updated = [newDoc, ...txs];
        setTxs(updated);
        localStorage.setItem('sheFinanceTransactions', JSON.stringify(updated));
        showToast('Transaction saved to database!');
      }
      setShowModal(false);
    } catch (err) {
      alert('Failed to save to database: ' + err.message);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }
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
                    <tr key={tx._id || i}>
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
                          <button className="btn-edit" title="Edit" onClick={() => openEdit(tx)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button className="btn-delete" title="Delete" onClick={() => handleDelete(tx)}>
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
              <i className={`fa-solid ${editingTx ? 'fa-pen-to-square' : 'fa-plus-circle'}`} style={{ color: 'var(--secondary-color)' }}></i>
              {editingTx ? ' Edit Transaction' : ' Add Transaction'}
            </h3>
            <div className="input-group">
              <label>Type</label>
              <div className="type-toggle" style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <button
                  type="button"
                  className={`btn ${form.type === 'income' ? 'btn-income-active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: 'income', category: 'Salary' }))}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: form.type === 'income' ? '2px solid #2ecc71' : '1px solid #ddd',
                    background: form.type === 'income' ? '#eafaf1' : '#fff',
                    color: form.type === 'income' ? '#27ae60' : '#555',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <i className="fa-solid fa-arrow-up"></i> Income
                </button>
                <button
                  type="button"
                  className={`btn ${form.type === 'expense' ? 'btn-expense-active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: 'expense', category: 'Food' }))}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: form.type === 'expense' ? '2px solid #e74c3c' : '1px solid #ddd',
                    background: form.type === 'expense' ? '#fdeeed' : '#fff',
                    color: form.type === 'expense' ? '#c0392b' : '#555',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <i className="fa-solid fa-arrow-down"></i> Expense
                </button>
              </div>
            </div>
            <div className="input-group">
              <label>Description / Note</label>
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
              <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="button" className="btn-save" onClick={handleSave}>
                {editingTx ? 'Update Transaction' : 'Save Transaction'}
              </button>
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

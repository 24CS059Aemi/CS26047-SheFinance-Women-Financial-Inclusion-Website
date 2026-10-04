import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import { savingsAPI } from '../api';

const GOAL_ICONS = [
  { icon: 'fa-house', label: 'Home' },
  { icon: 'fa-car', label: 'Car' },
  { icon: 'fa-plane', label: 'Travel' },
  { icon: 'fa-graduation-cap', label: 'Education' },
  { icon: 'fa-shield-halved', label: 'Emergency' },
  { icon: 'fa-ring', label: 'Wedding' },
  { icon: 'fa-baby', label: 'Baby' },
  { icon: 'fa-briefcase', label: 'Business' },
  { icon: 'fa-laptop', label: 'Gadget' },
  { icon: 'fa-bullseye', label: 'Other' },
];

const defaultForm = {
  name: '', targetAmount: '', savedAmount: '0', monthlySavings: '',
  targetDate: '', icon: 'fa-bullseye',
};

export default function Savings() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingGoal, setEditingGoal] = useState(null);
  const [toast, setToast] = useState('');
  const [userName, setUserName] = useState('User');
  const [avatar, setAvatar] = useState('');
  const [predModal, setPredModal] = useState(null);
  const [loadingPred, setLoadingPred] = useState(false);
  const [adjustModal, setAdjustModal] = useState(null); // { goal, type: 'add'|'sub', amount: '' }
  const [peerData, setPeerData] = useState(null);

  async function loadGoals() {
    setLoading(true);
    try {
      const res = await savingsAPI.getAll();
      const list = res.goals || [];
      setGoals(list);
      localStorage.setItem('sheFinanceGoals', JSON.stringify(list));
    } catch {
      const cached = JSON.parse(localStorage.getItem('sheFinanceGoals') || '[]');
      setGoals(cached);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'User';
    const formatted = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setUserName(formatted);
    const saved = localStorage.getItem('userAvatar');
    setAvatar(saved || `https://ui-avatars.com/api/?name=${encodeURIComponent(formatted)}&background=c99f55&color=fff`);
    loadGoals();
    fetchPeerData();
  }, []);

  async function fetchPeerData() {
    try {
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const res = await fetch('/api/predict_health', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age: profile.age || 28, occupation: profile.occupation || 'salaried', income: profile.income || 30000 })
      });
      const data = await res.json();
      if (data.status === 'success') setPeerData(data);
    } catch { /* offline fallback */ }
  }

  function openAdd() {
    setEditingGoal(null);
    setForm(defaultForm);
    setShowForm(true);
  }

  function openEdit(goal) {
    setEditingGoal(goal);
    setForm({
      name: goal.name,
      targetAmount: String(goal.targetAmount),
      savedAmount: String(goal.savedAmount),
      monthlySavings: String(goal.monthlySavings || ''),
      targetDate: goal.targetDate ? goal.targetDate.split('T')[0] : '',
      icon: goal.icon || 'fa-bullseye'
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.targetAmount || !form.targetDate) {
      alert('Please fill in name, target amount, and target date.');
      return;
    }
    const payload = {
      name: form.name,
      targetAmount: parseFloat(form.targetAmount),
      savedAmount: parseFloat(form.savedAmount) || 0,
      monthlySavings: parseFloat(form.monthlySavings) || 0,
      targetDate: form.targetDate,
      icon: form.icon,
    };

    try {
      if (editingGoal && editingGoal._id) {
        const res = await savingsAPI.update(editingGoal._id, payload);
        const updated = goals.map(g => (g._id === editingGoal._id ? res.goal : g));
        setGoals(updated);
        localStorage.setItem('sheFinanceGoals', JSON.stringify(updated));
        showToast('Goal updated in database!');
      } else {
        const res = await savingsAPI.create(payload);
        const updated = [res.goal, ...goals];
        setGoals(updated);
        localStorage.setItem('sheFinanceGoals', JSON.stringify(updated));
        showToast('Goal saved to database!');
      }
      setShowForm(false);
    } catch (err) {
      alert('Failed to save goal: ' + err.message);
    }
  }

  async function handleDelete(goal) {
    if (!window.confirm('Delete this savings goal?')) return;
    try {
      if (goal._id) {
        await savingsAPI.delete(goal._id);
      }
      const updated = goals.filter(g => g !== goal && g._id !== goal._id);
      setGoals(updated);
      localStorage.setItem('sheFinanceGoals', JSON.stringify(updated));
      showToast('Goal deleted from database!');
    } catch (err) {
      alert('Failed to delete goal: ' + err.message);
    }
  }

  function openAdjust(goal, type) {
    setAdjustModal({ goal, type, amount: '' });
  }

  async function applyAdjust() {
    const amt = parseFloat(adjustModal.amount);
    if (!amt || amt <= 0) { alert('Enter a valid amount.'); return; }
    const currentGoal = adjustModal.goal;
    const newSaved = adjustModal.type === 'add'
      ? (currentGoal.savedAmount || 0) + amt
      : Math.max(0, (currentGoal.savedAmount || 0) - amt);

    try {
      if (currentGoal._id) {
        const res = await savingsAPI.update(currentGoal._id, { savedAmount: newSaved });
        const updated = goals.map(g => (g._id === currentGoal._id ? res.goal : g));
        setGoals(updated);
        localStorage.setItem('sheFinanceGoals', JSON.stringify(updated));
      } else {
        const updated = goals.map(g => g === currentGoal ? { ...g, savedAmount: newSaved } : g);
        setGoals(updated);
        localStorage.setItem('sheFinanceGoals', JSON.stringify(updated));
      }
      setAdjustModal(null);
      showToast(adjustModal.type === 'add' ? `₹${amt.toLocaleString('en-IN')} added to savings!` : `₹${amt.toLocaleString('en-IN')} withdrawn.`);
    } catch (err) {
      alert('Failed to adjust amount: ' + err.message);
    }
  }

  async function predict(goal, idx) {
    if (!goal.monthlySavings || goal.monthlySavings <= 0) {
      alert('Please set a monthly savings amount for this goal first.');
      return;
    }
    setLoadingPred(true);
    try {
      const res = await fetch('/api/predict_timeline', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_amount: goal.targetAmount, saved_amount: goal.savedAmount,
          monthly_savings: goal.monthlySavings, target_date: goal.targetDate,
        })
      });
      const data = await res.json();
      if (data.status === 'success') setPredModal({ ...data, goal });
      else alert('Prediction error: ' + data.message);
    } catch {
      // Offline fallback calculation
      const remaining = goal.targetAmount - goal.savedAmount;
      const months = remaining > 0 ? Math.ceil(remaining / goal.monthlySavings) : 0;
      const finishDate = new Date();
      finishDate.setMonth(finishDate.getMonth() + months);
      const targetDt = new Date(goal.targetDate);
      const isOnTrack = finishDate <= targetDt;
      setPredModal({
        goal, months_required: months,
        predicted_finish_date: finishDate.toISOString().split('T')[0],
        status_label: months === 0 ? 'Achieved 🎉' : isOnTrack ? 'On Track 🟢' : 'Delayed ⚠️',
        recommendation: months === 0 ? 'Goal already achieved!' : isOnTrack
          ? `Great! You'll hit your goal ${Math.round((targetDt - finishDate) / (1000 * 60 * 60 * 24 * 30))} month(s) early.`
          : `Increase monthly savings to ₹${Math.ceil(remaining / Math.max(1, (targetDt - new Date()) / (1000 * 60 * 60 * 24 * 30))).toLocaleString('en-IN')} to stay on track.`
      });
    }
    setLoadingPred(false);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const activeGoals = goals.filter(g => g.savedAmount < g.targetAmount).length;
  const achieved = goals.filter(g => g.savedAmount >= g.targetAmount).length;

  return (
    <div className="dashboard-body">
      <DashboardNav />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Savings Goals &amp; AI Predictor</h2>
            <p>Plan your dreams, set targets, and let our AI calculate your path to success.</p>
          </div>
          <Link to="/profile" className="header-profile-link">
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

        {/* Overview Cards */}
        <div className="savings-overview">
          <div className="card">
            <div className="card-icon"><i className="fa-solid fa-bullseye"></i></div>
            <h3>Active Goals</h3>
            <h2>{activeGoals}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>In progress</p>
          </div>
          <div className="card">
            <div className="card-icon"><i className="fa-solid fa-trophy"></i></div>
            <h3>Goals Achieved</h3>
            <h2 style={{ color: '#2ecc71' }}>{achieved}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Completed 🎉</p>
          </div>
          <div className="card">
            <div className="card-icon"><i className="fa-solid fa-piggy-bank"></i></div>
            <h3>Total Saved</h3>
            <h2>₹ {totalSaved.toLocaleString('en-IN')}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Across all goals</p>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-color), #2a5266)', position: 'relative', overflow: 'hidden' }}>
            <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.75rem', background: 'rgba(201,159,85,0.25)', color: 'var(--secondary-color)', padding: '3px 8px', borderRadius: '20px', fontWeight: 600 }}>AI</span>
            <h3 style={{ color: '#fff', fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem' }}>Peer Avg Savings</h3>
            <h2 style={{ color: '#fff' }}>₹ {peerData ? peerData.predicted_peer_savings.toLocaleString('en-IN') : '—'}</h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{peerData ? `Peers in your group` : 'Connect to server'}</p>
          </div>
        </div>

        <div className="savings-grid">
          {/* Add / Edit Goal Form */}
          <div className="savings-card">
            <h3><i className={`fa-solid ${editingGoal ? 'fa-pen-to-square' : 'fa-plus-circle'}`}></i> {editingGoal ? 'Edit Savings Goal' : 'Create New Goal'}</h3>
            <div className="form-group">
              <label>Goal Name</label>
              <input type="text" placeholder="e.g., Start Boutique Shop, Emergency Fund" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Goal Icon</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {GOAL_ICONS.map(g => (
                  <button key={g.icon} type="button" onClick={() => setForm(f => ({ ...f, icon: g.icon }))}
                    style={{ padding: '8px 12px', border: `2px solid ${form.icon === g.icon ? 'var(--secondary-color)' : '#ddd'}`, borderRadius: '8px', background: form.icon === g.icon ? 'rgba(201,159,85,0.1)' : '#fff', cursor: 'pointer', color: form.icon === g.icon ? 'var(--secondary-color)' : '#666', transition: 'all 0.2s' }}>
                    <i className={`fa-solid ${g.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Target Amount (₹)</label>
              <input type="number" placeholder="e.g., 50000" min="1" value={form.targetAmount} onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Initial Saved Amount (₹)</label>
              <input type="number" placeholder="e.g., 5000" min="0" value={form.savedAmount} onChange={e => setForm(f => ({ ...f, savedAmount: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Monthly Savings Plan (₹)</label>
              <input type="number" placeholder="How much can you save per month?" min="0" value={form.monthlySavings} onChange={e => setForm(f => ({ ...f, monthlySavings: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Target Date</label>
              <input type="date" value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="btn-submit-goal" onClick={handleSave}>
                <i className={`fa-solid ${editingGoal ? 'fa-floppy-disk' : 'fa-check'}`}></i> {editingGoal ? 'Update Goal' : 'Set Goal'}
              </button>
              {editingGoal && (
                <button onClick={() => { setEditingGoal(null); setForm(defaultForm); }} style={{ padding: '12px 20px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#555' }}>
                  Cancel
                </button>
              )}
            </div>

            {/* Peer Analysis ML Panel */}
            <div className="prediction-summary-box" style={{ marginTop: '25px', padding: '18px', background: 'linear-gradient(135deg, #fdfbf7, #f7efe1)', border: '1px solid rgba(201,159,85,0.25)', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: '0.98rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-users-viewfinder" style={{ color: 'var(--secondary-color)' }}></i> Peer Analysis (ML Prediction)
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', lineHeight: 1.6 }}>
                {peerData ? (
                  <>Women with similar income profiles save an average of <strong style={{ color: 'var(--primary-color)' }}>₹{peerData.predicted_peer_savings.toLocaleString('en-IN')}</strong> monthly.</>
                ) : (
                  <>Based on historical community patterns, women allocating 20% to savings achieve their targets <strong>2.4x faster</strong>.</>
                )}
              </p>
            </div>
          </div>

          {/* Goals List */}
          <div className="goal-list">
            {goals.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '15px', padding: '60px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '3rem', color: '#ddd', marginBottom: '15px' }}><i className="fa-solid fa-flag"></i></div>
                <p style={{ color: 'var(--text-light)' }}>No savings goals yet. Create your first goal to get started!</p>
              </div>
            ) : (
              goals.map((goal, idx) => {
                const pct = Math.min(100, goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0);
                const achieved = goal.savedAmount >= goal.targetAmount;
                return (
                  <div className="goal-item" key={goal._id || idx} style={{ borderLeftColor: achieved ? '#2ecc71' : 'var(--secondary-color)' }}>
                    <div className="goal-header">
                      <div className="goal-title-wrapper">
                        <div className="goal-icon" style={achieved ? { background: 'rgba(46,204,113,0.1)', color: '#2ecc71' } : {}}>
                          <i className={`fa-solid ${goal.icon || 'fa-bullseye'}`}></i>
                        </div>
                        <div className="goal-title">
                          <h4>{goal.name} {achieved && '🎉'}</h4>
                          <span>Target: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                      </div>
                      <div className="goal-target-val">
                        <h4>₹{goal.targetAmount.toLocaleString('en-IN')}</h4>
                        <span>Target</span>
                      </div>
                    </div>
                    <div className="goal-progress-section">
                      <div className="goal-progress-meta">
                        <span>Saved: <strong>₹{goal.savedAmount.toLocaleString('en-IN')}</strong></span>
                        <span>Remaining: <strong>₹{Math.max(0, goal.targetAmount - goal.savedAmount).toLocaleString('en-IN')}</strong></span>
                        <span><strong>{Math.round(pct)}%</strong></span>
                      </div>
                      <div className="goal-bar-bg">
                        <div className="goal-bar-fill" style={{ width: `${pct}%`, background: achieved ? 'linear-gradient(90deg,#2ecc71,#27ae60)' : 'linear-gradient(90deg,var(--secondary-color),var(--secondary-hover))' }}></div>
                      </div>
                    </div>
                    <div className="goal-actions">
                      <button className="btn-action btn-add-val" onClick={() => openAdjust(goal, 'add')}>
                        <i className="fa-solid fa-plus"></i> Add Savings
                      </button>
                      <button className="btn-action btn-sub-val" onClick={() => openAdjust(goal, 'sub')}>
                        <i className="fa-solid fa-minus"></i> Withdraw
                      </button>
                      <button className="btn-action btn-predict-val" onClick={() => predict(goal, idx)} disabled={loadingPred}>
                        <i className="fa-solid fa-robot"></i> {loadingPred ? 'Predicting...' : 'AI Predict'}
                      </button>
                      <button className="btn-action" onClick={() => openEdit(goal)} style={{ background: 'rgba(52,152,219,0.1)', color: '#3498db' }}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button className="btn-action btn-delete-goal" onClick={() => handleDelete(goal)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Adjust Modal */}
      {adjustModal && (
        <div className="modal-overlay active" onClick={e => e.target === e.currentTarget && setAdjustModal(null)}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: '20px', padding: '30px', width: '90%', maxWidth: '420px' }}>
            <div className="modal-header">
              <h3>{adjustModal.type === 'add' ? '➕ Add Savings' : '➖ Withdraw Savings'}</h3>
              <span className="modal-close" onClick={() => setAdjustModal(null)}><i className="fa-solid fa-xmark"></i></span>
            </div>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
              {adjustModal.type === 'add' ? 'How much are you depositing into this goal?' : 'How much are you withdrawing from this goal?'}
            </p>
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" min="1" placeholder="Enter amount" value={adjustModal.amount}
                onChange={e => setAdjustModal(a => ({ ...a, amount: e.target.value }))} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'Outfit, sans-serif', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setAdjustModal(null)} style={{ flex: 1, padding: '12px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={applyAdjust} style={{ flex: 1, padding: '12px', background: adjustModal.type === 'add' ? '#2ecc71' : '#e67e22', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                {adjustModal.type === 'add' ? 'Add' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prediction Modal */}
      {predModal && (
        <div className="modal-overlay active" style={{ opacity: 1, pointerEvents: 'auto' }} onClick={e => e.target === e.currentTarget && setPredModal(null)}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: '20px', padding: '30px', width: '90%', maxWidth: '550px' }}>
            <div className="modal-header">
              <h3><i className="fa-solid fa-robot" style={{ color: 'var(--secondary-color)', marginRight: '10px' }}></i> AI Prediction: {predModal.goal.name}</h3>
              <span className="modal-close" onClick={() => setPredModal(null)}><i className="fa-solid fa-xmark"></i></span>
            </div>
            <div className="simulation-detail">
              <div className="sim-metric"><span>Status</span><strong style={{ color: predModal.status_label.includes('🟢') ? '#2ecc71' : predModal.status_label.includes('🎉') ? '#2ecc71' : '#e74c3c' }}>{predModal.status_label}</strong></div>
              <div className="sim-metric"><span>Predicted Finish Date</span><strong>{predModal.predicted_finish_date}</strong></div>
              <div className="sim-metric"><span>Months Required</span><strong>{predModal.months_required}</strong></div>
              <div className="sim-metric"><span>Monthly Savings Plan</span><strong>₹{predModal.goal.monthlySavings?.toLocaleString('en-IN')}</strong></div>
              <div className="sim-metric"><span>Amount Remaining</span><strong>₹{Math.max(0, predModal.goal.targetAmount - predModal.goal.savedAmount).toLocaleString('en-IN')}</strong></div>
            </div>
            <div className="sim-recommendation">
              <i className="fa-solid fa-lightbulb" style={{ color: 'var(--secondary-color)', marginRight: '8px' }}></i>
              {predModal.recommendation}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-notification show">
          <i className="fa-solid fa-check-circle"></i> {toast}
        </div>
      )}
    </div>
  );
}

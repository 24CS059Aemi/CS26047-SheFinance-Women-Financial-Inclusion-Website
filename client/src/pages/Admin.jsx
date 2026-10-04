import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_USERS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', joined: '2026-08-10', status: 'active', role: 'user' },
  { id: 2, name: 'Ananya Patel', email: 'ananya@example.com', joined: '2026-08-15', status: 'active', role: 'user' },
  { id: 3, name: 'Sunita Rao', email: 'sunita@example.com', joined: '2026-08-20', status: 'active', role: 'user' }
];

const DEFAULT_SCHEMES = [
  { id: 1, name: 'Mahila Samman Savings Certificate', cat: 'Savings', benefit: '7.5% Fixed Interest p.a.', eligibility: 'Women of any age (Tenure 2 yrs)', status: 'active', link: 'https://www.indiapost.gov.in' },
  { id: 2, name: 'Pradhan Mantri Mudra Yojana (PMMY)', cat: 'Business Loan', benefit: 'Collateral-free loan up to ₹10 Lakhs', eligibility: 'Women Entrepreneurs & Small Businesses', status: 'active', link: 'https://www.mudra.org.in' },
  { id: 3, name: 'Sukanya Samriddhi Yojana (SSY)', cat: 'Girl Child', benefit: '8.2% Tax-Free Interest Rate', eligibility: 'Parents of girl child under 10 years', status: 'active', link: 'https://www.indiapost.gov.in' },
  { id: 4, name: 'Stand-Up India Scheme', cat: 'Entrepreneurship', benefit: 'Bank loans from ₹10 Lakhs to ₹1 Crore', eligibility: 'SC/ST and Women Entrepreneurs', status: 'active', link: 'https://www.standupmitra.in' },
  { id: 5, name: 'Dena Shakti Scheme', cat: 'Micro-Loan', benefit: '0.25% Interest concession on loans', eligibility: 'Women in agriculture, retail, micro-enterprises', status: 'active', link: 'https://www.bankofbaroda.in' }
];

const DEFAULT_LITERACY = [
  { id: 1, title: '50-30-20 Rule for Smart Budgeting', cat: 'Budgeting', type: 'Article Guide', level: 'Beginner', duration: '5 min read', desc: 'Divide monthly income into Needs (50%), Wants (30%), and Savings (20%).' },
  { id: 2, title: 'Safe UPI & Net Banking Practices', cat: 'Digital Safety', type: 'Step-by-Step', level: 'All Levels', duration: '7 min read', desc: 'Protecting UPI PINs, identifying fake customer care numbers, and recognizing phishing.' },
  { id: 3, title: 'Starting a Business with SHG Micro-Loans', cat: 'Entrepreneurship', type: 'Video Tutorial', level: 'Intermediate', duration: '12 min video', desc: 'Practical walkthrough for women self-help groups on securing bank credit.' },
  { id: 4, title: 'Fixed Deposits vs Mutual Funds for Women', cat: 'Investments', type: 'Article Guide', level: 'Intermediate', duration: '6 min read', desc: 'Understanding risks, compounding interest, and steady returns for long-term security.' }
];

const DEFAULT_TICKETS = [
  { id: 'TKT-101', name: 'Priya Sharma', email: 'priya@example.com', subject: 'How to apply for Mahila Samman Certificate?', message: 'I tried visiting the post office but needed guidance on required forms.', date: '2026-08-25', status: 'pending' },
  { id: 'TKT-102', name: 'Kavita Joshi', email: 'kavita@example.com', subject: 'Error connecting UPI in tracker', message: 'Can we directly import bank statements into the SheFinance tracker?', date: '2026-08-28', status: 'resolved' }
];

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Platform state
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [literacy, setLiteracy] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Search & Filter states
  const [userSearch, setUserSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState('all');
  const [schemeSearch, setSchemeSearch] = useState('');
  const [schemeCatFilter, setSchemeCatFilter] = useState('all');
  const [literacySearch, setLiteracySearch] = useState('');
  const [literacyCatFilter, setLiteracyCatFilter] = useState('all');
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('all');

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'user' });

  const [showAddSchemeModal, setShowAddSchemeModal] = useState(false);
  const [newSchemeData, setNewSchemeData] = useState({ name: '', cat: 'Savings', benefit: '', eligibility: '', link: '' });

  const [showAddLiteracyModal, setShowAddLiteracyModal] = useState(false);
  const [newLiteracyData, setNewLiteracyData] = useState({ title: '', cat: 'Budgeting', type: 'Article Guide', level: 'Beginner', duration: '5 min read', desc: '' });

  const [activeTicketModal, setActiveTicketModal] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Password update in settings
  const [adminPassOld, setAdminPassOld] = useState('');
  const [adminPassNew, setAdminPassNew] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  function loadAllData() {
    // 1. Users
    try {
      const u = localStorage.getItem('sheFinanceUsers');
      if (u) setUsers(JSON.parse(u));
      else {
        setUsers(DEFAULT_USERS);
        localStorage.setItem('sheFinanceUsers', JSON.stringify(DEFAULT_USERS));
      }
    } catch {
      setUsers(DEFAULT_USERS);
    }

    // 2. Transactions
    try {
      const t = localStorage.getItem('sheFinanceTransactions');
      setTransactions(t ? JSON.parse(t) : []);
    } catch {
      setTransactions([]);
    }

    // 3. Goals
    try {
      const g = localStorage.getItem('sheFinanceGoals');
      setGoals(g ? JSON.parse(g) : []);
    } catch {
      setGoals([]);
    }

    // 4. Schemes
    try {
      const s = localStorage.getItem('sheFinanceSchemes');
      if (s) setSchemes(JSON.parse(s));
      else {
        setSchemes(DEFAULT_SCHEMES);
        localStorage.setItem('sheFinanceSchemes', JSON.stringify(DEFAULT_SCHEMES));
      }
    } catch {
      setSchemes(DEFAULT_SCHEMES);
    }

    // 5. Literacy
    try {
      const l = localStorage.getItem('sheFinanceLiteracy');
      if (l) setLiteracy(JSON.parse(l));
      else {
        setLiteracy(DEFAULT_LITERACY);
        localStorage.setItem('sheFinanceLiteracy', JSON.stringify(DEFAULT_LITERACY));
      }
    } catch {
      setLiteracy(DEFAULT_LITERACY);
    }

    // 6. Tickets
    try {
      const tk = localStorage.getItem('sheFinanceTickets');
      if (tk) setTickets(JSON.parse(tk));
      else {
        setTickets(DEFAULT_TICKETS);
        localStorage.setItem('sheFinanceTickets', JSON.stringify(DEFAULT_TICKETS));
      }
    } catch {
      setTickets(DEFAULT_TICKETS);
    }

    // 7. Announcement
    const ann = localStorage.getItem('globalAnnouncement') || '';
    setAnnouncement(ann);
  }

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  }

  function handleLogout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  }

  // --- User Handlers ---
  function handleToggleBlockUser(id) {
    const updated = users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem('sheFinanceUsers', JSON.stringify(updated));
    showToast('User status updated');
  }

  function handleDeleteUser(id) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem('sheFinanceUsers', JSON.stringify(updated));
    showToast('User removed');
  }

  function handleCreateUser(e) {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;
    const newUser = {
      id: Date.now(),
      name: newUserData.name,
      email: newUserData.email,
      password: newUserData.password || 'password123',
      joined: new Date().toISOString().split('T')[0],
      status: 'active',
      role: newUserData.role || 'user'
    };
    const updated = [newUser, ...users];
    setUsers(updated);
    localStorage.setItem('sheFinanceUsers', JSON.stringify(updated));
    setShowAddUserModal(false);
    setNewUserData({ name: '', email: '', password: '', role: 'user' });
    showToast('User created successfully');
  }

  // --- Transactions Handlers ---
  function handleDeleteTransaction(id) {
    if (!window.confirm('Delete this transaction record?')) return;
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('sheFinanceTransactions', JSON.stringify(updated));
    showToast('Transaction removed');
  }

  // --- Scheme Handlers ---
  function handleToggleSchemeStatus(id) {
    const updated = schemes.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'active' ? 'inactive' : 'active' };
      }
      return s;
    });
    setSchemes(updated);
    localStorage.setItem('sheFinanceSchemes', JSON.stringify(updated));
    showToast('Scheme status updated');
  }

  function handleDeleteScheme(id) {
    if (!window.confirm('Delete this scheme?')) return;
    const updated = schemes.filter(s => s.id !== id);
    setSchemes(updated);
    localStorage.setItem('sheFinanceSchemes', JSON.stringify(updated));
    showToast('Scheme deleted');
  }

  function handleCreateScheme(e) {
    e.preventDefault();
    if (!newSchemeData.name) return;
    const newScheme = {
      id: Date.now(),
      ...newSchemeData,
      status: 'active'
    };
    const updated = [newScheme, ...schemes];
    setSchemes(updated);
    localStorage.setItem('sheFinanceSchemes', JSON.stringify(updated));
    setShowAddSchemeModal(false);
    setNewSchemeData({ name: '', cat: 'Savings', benefit: '', eligibility: '', link: '' });
    showToast('New government scheme added');
  }

  // --- Literacy Handlers ---
  function handleDeleteLiteracy(id) {
    if (!window.confirm('Delete this learning guide?')) return;
    const updated = literacy.filter(l => l.id !== id);
    setLiteracy(updated);
    localStorage.setItem('sheFinanceLiteracy', JSON.stringify(updated));
    showToast('Guide deleted');
  }

  function handleCreateLiteracy(e) {
    e.preventDefault();
    if (!newLiteracyData.title) return;
    const newGuide = {
      id: Date.now(),
      ...newLiteracyData
    };
    const updated = [newGuide, ...literacy];
    setLiteracy(updated);
    localStorage.setItem('sheFinanceLiteracy', JSON.stringify(updated));
    setShowAddLiteracyModal(false);
    setNewLiteracyData({ title: '', cat: 'Budgeting', type: 'Article Guide', level: 'Beginner', duration: '5 min read', desc: '' });
    showToast('Learning resource published');
  }

  // --- Support Ticket Handlers ---
  function handleToggleTicketStatus(id) {
    const updated = tickets.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'resolved' ? 'pending' : 'resolved' };
      }
      return t;
    });
    setTickets(updated);
    localStorage.setItem('sheFinanceTickets', JSON.stringify(updated));
    showToast('Ticket status updated');
  }

  function handleDeleteTicket(id) {
    if (!window.confirm('Delete this ticket?')) return;
    const updated = tickets.filter(t => t.id !== id);
    setTickets(updated);
    localStorage.setItem('sheFinanceTickets', JSON.stringify(updated));
    showToast('Ticket deleted');
  }

  function handleSaveAnnouncement() {
    localStorage.setItem('globalAnnouncement', announcement);
    showToast('Announcement banner updated across platform');
  }

  function handleClearAnnouncement() {
    setAnnouncement('');
    localStorage.removeItem('globalAnnouncement');
    showToast('Announcement removed');
  }

  // Stats
  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  }, [transactions]);

  const netBalance = totalIncome - totalExpense;
  const pendingTicketsCount = tickets.filter(t => t.status === 'pending').length;

  // Filtered collections
  const filteredUsers = users.filter(u =>
    !userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t => {
    if (txTypeFilter === 'all') return true;
    return t.type === txTypeFilter;
  });

  const filteredSchemes = schemes.filter(s => {
    const matchSearch = !schemeSearch || s.name.toLowerCase().includes(schemeSearch.toLowerCase());
    const matchCat = schemeCatFilter === 'all' || s.cat === schemeCatFilter;
    return matchSearch && matchCat;
  });

  const filteredLiteracy = literacy.filter(l => {
    const matchSearch = !literacySearch || l.title.toLowerCase().includes(literacySearch.toLowerCase());
    const matchCat = literacyCatFilter === 'all' || l.cat === literacyCatFilter;
    return matchSearch && matchCat;
  });

  const filteredTickets = tickets.filter(t => {
    const matchSearch = !ticketSearch || t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) || t.name.toLowerCase().includes(ticketSearch.toLowerCase());
    const matchStatus = ticketStatusFilter === 'all' || t.status === ticketStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Outfit', sans-serif" }}>
      {/* Top Navbar */}
      <nav style={{
        background: 'var(--primary-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 40px',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
            She<span style={{ color: 'var(--secondary-color)' }}>Finance</span> Admin
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', overflowX: 'auto', padding: '4px 0' }}>
          {[
            { key: 'overview', icon: 'fa-gauge-high', label: 'Overview' },
            { key: 'users', icon: 'fa-users', label: 'Users' },
            { key: 'transactions', icon: 'fa-money-bill-transfer', label: 'Transactions' },
            { key: 'schemes', icon: 'fa-landmark', label: 'Schemes' },
            { key: 'literacy', icon: 'fa-graduation-cap', label: 'Literacy' },
            { key: 'support', icon: 'fa-headset', label: 'Support', badge: pendingTicketsCount },
            { key: 'analytics', icon: 'fa-chart-pie', label: 'Analytics' },
            { key: 'settings', icon: 'fa-user-gear', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                color: activeTab === tab.key ? 'var(--secondary-color)' : '#a0b2bd',
                background: activeTab === tab.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                fontWeight: 600,
                fontSize: '0.9rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span style={{ background: '#e74c3c', color: '#fff', fontSize: '0.72rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 700 }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--secondary-color)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              A
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin Portal</span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ff6b6b',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              padding: '6px 14px',
              background: 'rgba(255,107,107,0.1)',
              borderRadius: '20px',
              border: 'none'
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 40px' }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-color)', margin: '0 0 4px 0' }}>Platform Overview</h2>
              <p style={{ color: '#888', margin: 0, fontSize: '0.92rem' }}>Real-time summary of SheFinance platform activity.</p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #c99f55' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(201,159,85,0.12)', color: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <i className="fa-solid fa-users"></i>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.82rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Registered Users</h4>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{users.length}</div>
                <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '4px 0 0 0' }}>Active member accounts</p>
              </div>

              <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #2ecc71' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(46,204,113,0.12)', color: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.82rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Logged Transactions</h4>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{transactions.length}</div>
                <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '4px 0 0 0' }}>Total cash flow entries</p>
              </div>

              <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #3498db' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(52,152,219,0.12)', color: '#3498db', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <i className="fa-solid fa-bullseye"></i>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.82rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Savings Goals</h4>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>{goals.length}</div>
                <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '4px 0 0 0' }}>Targets being tracked</p>
              </div>

              <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #e74c3c' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(231,76,60,0.12)', color: '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <i className="fa-solid fa-headset"></i>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.82rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Help Inquiries</h4>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#e74c3c' }}>{pendingTicketsCount}</div>
                <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '4px 0 0 0' }}>Require response</p>
              </div>
            </div>

            {/* Quick Summary Tables */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '22px' }}>
              <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--primary-color)' }}>
                    <i className="fa-solid fa-user-plus" style={{ color: 'var(--secondary-color)', marginRight: '8px' }}></i> Recent Users
                  </h3>
                  <button onClick={() => setActiveTab('users')} style={{ background: 'none', border: 'none', color: 'var(--secondary-color)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                    View All &rarr;
                  </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fb', textAlign: 'left', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 20px' }}>Name</th>
                      <th style={{ padding: '10px 20px' }}>Email</th>
                      <th style={{ padding: '10px 20px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f5', fontSize: '0.88rem' }}>
                        <td style={{ padding: '12px 20px', fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: '12px 20px', color: '#666' }}>{u.email}</td>
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: u.status === 'blocked' ? 'rgba(231,76,60,0.12)' : 'rgba(46,204,113,0.12)',
                            color: u.status === 'blocked' ? '#e74c3c' : '#2ecc71'
                          }}>
                            {u.status || 'active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '18px 22px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--primary-color)' }}>
                    <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--secondary-color)', marginRight: '8px' }}></i> Recent Transactions
                  </h3>
                  <button onClick={() => setActiveTab('transactions')} style={{ background: 'none', border: 'none', color: 'var(--secondary-color)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                    View All &rarr;
                  </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fb', textAlign: 'left', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 20px' }}>Description</th>
                      <th style={{ padding: '10px 20px' }}>Type</th>
                      <th style={{ padding: '10px 20px' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((t, idx) => (
                      <tr key={t.id || idx} style={{ borderBottom: '1px solid #f5f5f5', fontSize: '0.88rem' }}>
                        <td style={{ padding: '12px 20px', fontWeight: 500 }}>{t.description || t.category}</td>
                        <td style={{ padding: '12px 20px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: t.type === 'income' ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                            color: t.type === 'income' ? '#2ecc71' : '#e74c3c'
                          }}>
                            {t.type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 20px', fontWeight: 600, color: t.type === 'income' ? '#2ecc71' : '#e74c3c' }}>
                          {t.type === 'income' ? '+' : '-'}₹{parseFloat(t.amount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No transactions recorded yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-color)', margin: '0 0 4px 0' }}>User Management</h2>
                <p style={{ color: '#888', margin: 0, fontSize: '0.92rem' }}>View, search, block, or manage accounts.</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(true)}
                style={{
                  background: 'var(--secondary-color)',
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa-solid fa-plus"></i> Add New User
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-color)' }}>
                  All Users ({filteredUsers.length})
                </h3>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '0.88rem',
                    outline: 'none',
                    width: '240px'
                  }}
                />
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fb', textAlign: 'left', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 20px' }}>Name</th>
                      <th style={{ padding: '12px 20px' }}>Email</th>
                      <th style={{ padding: '12px 20px' }}>Joined</th>
                      <th style={{ padding: '12px 20px' }}>Role</th>
                      <th style={{ padding: '12px 20px' }}>Status</th>
                      <th style={{ padding: '12px 20px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f5', fontSize: '0.9rem' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: '14px 20px', color: '#555' }}>{u.email}</td>
                        <td style={{ padding: '14px 20px', color: '#888' }}>{u.joined || '2026-08'}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: u.role === 'admin' ? '#9b59b6' : '#64748b' }}>
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: u.status === 'blocked' ? 'rgba(231,76,60,0.12)' : 'rgba(46,204,113,0.12)',
                            color: u.status === 'blocked' ? '#e74c3c' : '#2ecc71'
                          }}>
                            {u.status || 'active'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleToggleBlockUser(u.id)}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                background: u.status === 'blocked' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.1)',
                                color: u.status === 'blocked' ? '#2ecc71' : '#e74c3c'
                              }}
                            >
                              {u.status === 'blocked' ? 'Unblock' : 'Block'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                background: 'rgba(231,76,60,0.1)',
                                color: '#e74c3c'
                              }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-color)', margin: '0 0 4px 0' }}>Transaction Monitor</h2>
              <p style={{ color: '#888', margin: 0, fontSize: '0.92rem' }}>Review all logged financial entries.</p>
            </div>

            {/* Financial Totals */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '18px 24px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Total Inflows</h4>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2ecc71' }}>₹{totalIncome.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '18px 24px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Total Outflows</h4>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#e74c3c' }}>₹{totalExpense.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '18px 24px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Net Surplus</h4>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: netBalance >= 0 ? 'var(--primary-color)' : '#e74c3c' }}>
                  ₹{netBalance.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-color)' }}>
                  All Transactions ({filteredTransactions.length})
                </h3>
                <select
                  value={txTypeFilter}
                  onChange={e => setTxTypeFilter(e.target.value)}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.88rem' }}
                >
                  <option value="all">All Types</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expense Only</option>
                </select>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fb', textAlign: 'left', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 20px' }}>Date</th>
                      <th style={{ padding: '12px 20px' }}>Description</th>
                      <th style={{ padding: '12px 20px' }}>Category</th>
                      <th style={{ padding: '12px 20px' }}>Type</th>
                      <th style={{ padding: '12px 20px' }}>Amount</th>
                      <th style={{ padding: '12px 20px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t, idx) => (
                      <tr key={t.id || idx} style={{ borderBottom: '1px solid #f5f5f5', fontSize: '0.9rem' }}>
                        <td style={{ padding: '14px 20px', color: '#888' }}>{t.date || 'N/A'}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>{t.description || t.category}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ background: '#f4f7f9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.82rem', color: '#555' }}>
                            {t.category}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: t.type === 'income' ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                            color: t.type === 'income' ? '#2ecc71' : '#e74c3c'
                          }}>
                            {t.type}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 700, color: t.type === 'income' ? '#2ecc71' : '#e74c3c' }}>
                          {t.type === 'income' ? '+' : '-'}₹{parseFloat(t.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <button
                            onClick={() => handleDeleteTransaction(t.id)}
                            style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: 'rgba(231,76,60,0.1)', color: '#e74c3c', cursor: 'pointer' }}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>No transactions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SCHEMES */}
        {activeTab === 'schemes' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-color)', margin: '0 0 4px 0' }}>Government Schemes CMS</h2>
                <p style={{ color: '#888', margin: 0, fontSize: '0.92rem' }}>Manage initiatives shown on the Education Hub.</p>
              </div>
              <button
                onClick={() => setShowAddSchemeModal(true)}
                style={{
                  background: 'var(--secondary-color)',
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa-solid fa-plus"></i> Add New Scheme
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-color)' }}>All Schemes ({filteredSchemes.length})</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Search schemes..."
                    value={schemeSearch}
                    onChange={e => setSchemeSearch(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.88rem' }}
                  />
                  <select
                    value={schemeCatFilter}
                    onChange={e => setSchemeCatFilter(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.88rem' }}
                  >
                    <option value="all">All Categories</option>
                    <option value="Savings">Savings</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Girl Child">Girl Child</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Micro-Loan">Micro-Loan</option>
                  </select>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fb', textAlign: 'left', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 20px' }}>Scheme Name</th>
                      <th style={{ padding: '12px 20px' }}>Category</th>
                      <th style={{ padding: '12px 20px' }}>Key Benefit</th>
                      <th style={{ padding: '12px 20px' }}>Eligibility</th>
                      <th style={{ padding: '12px 20px' }}>Status</th>
                      <th style={{ padding: '12px 20px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchemes.map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid #f5f5f5', fontSize: '0.88rem' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>{s.name}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ background: 'rgba(201,159,85,0.15)', color: 'var(--primary-color)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                            {s.cat}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#27ae60', fontWeight: 600 }}>{s.benefit}</td>
                        <td style={{ padding: '14px 20px', color: '#666', maxWidth: '240px' }}>{s.eligibility}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: s.status === 'active' ? 'rgba(46,204,113,0.12)' : 'rgba(149,165,166,0.15)',
                            color: s.status === 'active' ? '#2ecc71' : '#7f8c8d'
                          }}>
                            {s.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleToggleSchemeStatus(s.id)}
                              style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: 'rgba(52,152,219,0.12)', color: '#3498db', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                            >
                              Toggle
                            </button>
                            <button
                              onClick={() => handleDeleteScheme(s.id)}
                              style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: 'rgba(231,76,60,0.1)', color: '#e74c3c', cursor: 'pointer' }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LITERACY */}
        {activeTab === 'literacy' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-color)', margin: '0 0 4px 0' }}>Financial Literacy CMS</h2>
                <p style={{ color: '#888', margin: 0, fontSize: '0.92rem' }}>Publish new learning guides &amp; articles for users.</p>
              </div>
              <button
                onClick={() => setShowAddLiteracyModal(true)}
                style={{
                  background: 'var(--secondary-color)',
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fa-solid fa-plus"></i> Add Learning Guide
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-color)' }}>Published Guides ({filteredLiteracy.length})</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Search guides..."
                    value={literacySearch}
                    onChange={e => setLiteracySearch(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.88rem' }}
                  />
                  <select
                    value={literacyCatFilter}
                    onChange={e => setLiteracyCatFilter(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.88rem' }}
                  >
                    <option value="all">All Topics</option>
                    <option value="Budgeting">Budgeting</option>
                    <option value="Digital Safety">Digital Safety</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Investments">Investments</option>
                  </select>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fb', textAlign: 'left', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 20px' }}>Title</th>
                      <th style={{ padding: '12px 20px' }}>Category</th>
                      <th style={{ padding: '12px 20px' }}>Format</th>
                      <th style={{ padding: '12px 20px' }}>Level</th>
                      <th style={{ padding: '12px 20px' }}>Duration</th>
                      <th style={{ padding: '12px 20px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLiteracy.map(l => (
                      <tr key={l.id} style={{ borderBottom: '1px solid #f5f5f5', fontSize: '0.88rem' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>{l.title}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ background: '#f4f7f9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#555' }}>
                            {l.cat}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#666' }}>{l.type}</td>
                        <td style={{ padding: '14px 20px', color: '#666' }}>{l.level}</td>
                        <td style={{ padding: '14px 20px', color: '#888' }}>{l.duration}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <button
                            onClick={() => handleDeleteLiteracy(l.id)}
                            style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: 'rgba(231,76,60,0.1)', color: '#e74c3c', cursor: 'pointer' }}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SUPPORT */}
        {activeTab === 'support' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-color)', margin: '0 0 4px 0' }}>Support &amp; Inquiries Helpdesk</h2>
                <p style={{ color: '#888', margin: 0, fontSize: '0.92rem' }}>Review inquiries and questions submitted by users.</p>
              </div>
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
                <i className="fa-solid fa-clock"></i> {pendingTicketsCount} Pending Inquiries
              </span>
            </div>

            <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary-color)' }}>All Inquiries ({filteredTickets.length})</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Search queries..."
                    value={ticketSearch}
                    onChange={e => setTicketSearch(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.88rem' }}
                  />
                  <select
                    value={ticketStatusFilter}
                    onChange={e => setTicketStatusFilter(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.88rem' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending Only</option>
                    <option value="resolved">Resolved Only</option>
                  </select>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fb', textAlign: 'left', fontSize: '0.78rem', color: '#888', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 20px' }}>Ticket ID</th>
                      <th style={{ padding: '12px 20px' }}>User</th>
                      <th style={{ padding: '12px 20px' }}>Subject</th>
                      <th style={{ padding: '12px 20px' }}>Date</th>
                      <th style={{ padding: '12px 20px' }}>Status</th>
                      <th style={{ padding: '12px 20px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #f5f5f5', fontSize: '0.88rem' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--primary-color)' }}>{t.id}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 600 }}>{t.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#888' }}>{t.email}</div>
                        </td>
                        <td style={{ padding: '14px 20px', maxWidth: '300px' }}>{t.subject}</td>
                        <td style={{ padding: '14px 20px', color: '#888' }}>{t.date}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: t.status === 'resolved' ? 'rgba(46,204,113,0.12)' : 'rgba(243,156,18,0.14)',
                            color: t.status === 'resolved' ? '#2ecc71' : '#d68910'
                          }}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setActiveTicketModal(t);
                                setTicketReplyText('');
                              }}
                              style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: 'rgba(52,152,219,0.12)', color: '#3498db', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                            >
                              View / Reply
                            </button>
                            <button
                              onClick={() => handleToggleTicketStatus(t.id)}
                              style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: 'rgba(46,204,113,0.12)', color: '#2ecc71', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                            >
                              {t.status === 'resolved' ? 'Reopen' : 'Resolve'}
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(t.id)}
                              style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: 'rgba(231,76,60,0.1)', color: '#e74c3c', cursor: 'pointer' }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTickets.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>No inquiries found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-color)', margin: '0 0 4px 0' }}>Platform Analytics</h2>
              <p style={{ color: '#888', margin: 0, fontSize: '0.92rem' }}>Comprehensive statistics on user growth and financial patterns.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
              <div style={{ background: '#fff', borderRadius: '14px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 20px 0', color: 'var(--primary-color)' }}>
                  User Distribution &amp; Status
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '5px' }}>
                      <span>Active Accounts</span>
                      <strong>{users.filter(u => u.status !== 'blocked').length}</strong>
                    </div>
                    <div style={{ background: '#f0f2f5', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{
                        background: '#2ecc71',
                        height: '100%',
                        width: `${users.length ? (users.filter(u => u.status !== 'blocked').length / users.length) * 100 : 100}%`
                      }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '5px' }}>
                      <span>Blocked / Inactive</span>
                      <strong>{users.filter(u => u.status === 'blocked').length}</strong>
                    </div>
                    <div style={{ background: '#f0f2f5', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{
                        background: '#e74c3c',
                        height: '100%',
                        width: `${users.length ? (users.filter(u => u.status === 'blocked').length / users.length) * 100 : 0}%`
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '14px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 20px 0', color: 'var(--primary-color)' }}>
                  Cash Inflow vs Outflow Ratio
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '5px' }}>
                      <span>Total Inflow (₹{totalIncome.toLocaleString('en-IN')})</span>
                      <strong>{totalIncome + totalExpense > 0 ? Math.round((totalIncome / (totalIncome + totalExpense)) * 100) : 50}%</strong>
                    </div>
                    <div style={{ background: '#f0f2f5', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{
                        background: '#2ecc71',
                        height: '100%',
                        width: `${totalIncome + totalExpense > 0 ? (totalIncome / (totalIncome + totalExpense)) * 100 : 50}%`
                      }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '5px' }}>
                      <span>Total Outflow (₹{totalExpense.toLocaleString('en-IN')})</span>
                      <strong>{totalIncome + totalExpense > 0 ? Math.round((totalExpense / (totalIncome + totalExpense)) * 100) : 50}%</strong>
                    </div>
                    <div style={{ background: '#f0f2f5', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{
                        background: '#e74c3c',
                        height: '100%',
                        width: `${totalIncome + totalExpense > 0 ? (totalExpense / (totalIncome + totalExpense)) * 100 : 50}%`
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-color)', margin: '0 0 4px 0' }}>Platform Settings &amp; Broadcasts</h2>
              <p style={{ color: '#888', margin: 0, fontSize: '0.92rem' }}>Configure announcements and portal preferences.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
              {/* Broadcast Announcement */}
              <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-bullhorn" style={{ color: 'var(--secondary-color)' }}></i> Global Announcement Banner
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '14px' }}>
                  This message appears at the top of user dashboards and the Education Hub.
                </p>
                <textarea
                  rows="3"
                  value={announcement}
                  onChange={e => setAnnouncement(e.target.value)}
                  placeholder="e.g. New Mahila Samman Savings guidelines released for 2026! Check Education Hub."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', marginBottom: '14px', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleSaveAnnouncement}
                    style={{ background: 'var(--primary-color)', color: '#fff', padding: '8px 18px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Publish Banner
                  </button>
                  <button
                    onClick={handleClearAnnouncement}
                    style={{ background: '#f8fafc', color: '#666', border: '1px solid #ddd', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Clear Banner
                  </button>
                </div>
              </div>

              {/* Admin Security */}
              <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-lock" style={{ color: 'var(--secondary-color)' }}></i> Admin Credentials
                </h3>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Current Admin Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={adminPassOld}
                    onChange={e => setAdminPassOld(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>New Admin Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={adminPassNew}
                    onChange={e => setAdminPassNew(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  onClick={() => {
                    if (adminPassNew.length < 6) {
                      alert('Password must be at least 6 characters');
                      return;
                    }
                    localStorage.setItem('adminPassword', adminPassNew);
                    setAdminPassOld('');
                    setAdminPassNew('');
                    showToast('Admin password updated successfully');
                  }}
                  style={{ background: 'var(--secondary-color)', color: 'var(--primary-color)', padding: '9px 18px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: Add User */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--primary-color)' }}>Add New User</h3>
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserData.name}
                  onChange={e => setNewUserData({ ...newUserData, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Email</label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={e => setNewUserData({ ...newUserData, email: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Temporary Password</label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={e => setNewUserData({ ...newUserData, password: e.target.value })}
                  placeholder="Defaults to password123"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Role</label>
                <select
                  value={newUserData.role}
                  onChange={e => setNewUserData({ ...newUserData, role: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--secondary-color)', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Scheme */}
      {showAddSchemeModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--primary-color)' }}>Add Government Scheme</h3>
            <form onSubmit={handleCreateScheme}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Scheme Name</label>
                <input
                  type="text"
                  required
                  value={newSchemeData.name}
                  onChange={e => setNewSchemeData({ ...newSchemeData, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Category</label>
                <select
                  value={newSchemeData.cat}
                  onChange={e => setNewSchemeData({ ...newSchemeData, cat: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                >
                  <option value="Savings">Savings</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Girl Child">Girl Child</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Micro-Loan">Micro-Loan</option>
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Key Benefit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7.5% Interest rate p.a."
                  value={newSchemeData.benefit}
                  onChange={e => setNewSchemeData({ ...newSchemeData, benefit: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Eligibility Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Women entrepreneurs running micro enterprises"
                  value={newSchemeData.eligibility}
                  onChange={e => setNewSchemeData({ ...newSchemeData, eligibility: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Official Website URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newSchemeData.link}
                  onChange={e => setNewSchemeData({ ...newSchemeData, link: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddSchemeModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--secondary-color)', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Literacy */}
      {showAddLiteracyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--primary-color)' }}>Add Learning Resource</h3>
            <form onSubmit={handleCreateLiteracy}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  required
                  value={newLiteracyData.title}
                  onChange={e => setNewLiteracyData({ ...newLiteracyData, title: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Topic</label>
                  <select
                    value={newLiteracyData.cat}
                    onChange={e => setNewLiteracyData({ ...newLiteracyData, cat: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                  >
                    <option value="Budgeting">Budgeting</option>
                    <option value="Digital Safety">Digital Safety</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Investments">Investments</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Format</label>
                  <select
                    value={newLiteracyData.type}
                    onChange={e => setNewLiteracyData({ ...newLiteracyData, type: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                  >
                    <option value="Article Guide">Article Guide</option>
                    <option value="Step-by-Step">Step-by-Step</option>
                    <option value="Video Tutorial">Video Tutorial</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Description / Content Summary</label>
                <textarea
                  rows="3"
                  required
                  value={newLiteracyData.desc}
                  onChange={e => setNewLiteracyData({ ...newLiteracyData, desc: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddLiteracyModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--secondary-color)', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Publish Guide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Ticket View / Reply */}
      {activeTicketModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '540px', width: '100%', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-color)' }}>
              Ticket: {activeTicketModal.id}
            </h3>
            <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', color: '#666' }}>
              From <strong>{activeTicketModal.name}</strong> ({activeTicketModal.email}) on {activeTicketModal.date}
            </p>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '16px', borderLeft: '3px solid var(--secondary-color)' }}>
              <div style={{ fontWeight: 600, marginBottom: '6px' }}>{activeTicketModal.subject}</div>
              <div style={{ fontSize: '0.9rem', color: '#444' }}>{activeTicketModal.message}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Send Reply via Email</label>
              <textarea
                rows="3"
                value={ticketReplyText}
                onChange={e => setTicketReplyText(e.target.value)}
                placeholder="Type your response to the user..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveTicketModal(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleToggleTicketStatus(activeTicketModal.id);
                  setActiveTicketModal(null);
                  showToast('Reply dispatched & ticket resolved');
                }}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--secondary-color)', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }}
              >
                Send &amp; Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'var(--primary-color)',
          color: '#fff',
          padding: '14px 22px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 99999
        }}>
          <i className="fa-solid fa-circle-check" style={{ color: '#2ecc71', fontSize: '1.2rem' }}></i>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

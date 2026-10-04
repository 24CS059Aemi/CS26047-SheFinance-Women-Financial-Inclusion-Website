import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DashboardNav from '../components/DashboardNav';

export default function Support() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [tickets, setTickets] = useState([]);
  const [toast, setToast] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);

  const isLoggedIn = !!localStorage.getItem('userName');

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || '';
    const storedEmail = localStorage.getItem('userEmail') || '';
    setUserName(storedName);
    setUserEmail(storedEmail);
    const saved = localStorage.getItem('userAvatar');
    if (storedName) {
      setAvatar(saved || `https://ui-avatars.com/api/?name=${encodeURIComponent(storedName)}&background=c99f55&color=fff`);
    }
    loadTickets(storedEmail);
  }, []);

  function loadTickets(email) {
    const all = JSON.parse(localStorage.getItem('sheFinanceTickets') || '[]');
    if (email) {
      setTickets(all.filter(t => t.email === email).reverse());
    } else {
      setTickets([]);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in both subject and description.');
      return;
    }
    const name = userName || 'Guest User';
    const email = userEmail || 'guest@shefinance.in';
    const all = JSON.parse(localStorage.getItem('sheFinanceTickets') || '[]');
    const newT = {
      id: 'TCK-' + Math.floor(100 + Math.random() * 900),
      name: name,
      user: name,
      email: email,
      category: category,
      subject: subject.trim(),
      msg: message.trim(),
      message: message.trim(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      reply: ''
    };
    all.push(newT);
    localStorage.setItem('sheFinanceTickets', JSON.stringify(all));
    setSubject('');
    setMessage('');
    loadTickets(email);
    showToast('Your inquiry has been submitted! Support team will respond shortly.');
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  const faqs = [
    { q: 'How does SheFinance calculate my Financial Health Score?', a: 'Your Financial Health Score is computed using your 50/30/20 budget adherence, emergency fund availability, debt-to-income ratio, and consistent savings history.' },
    { q: 'How do I apply for Government Schemes like Mudra or Stand-Up India?', a: 'Visit our Education Hub and navigate to the Govt Schemes tab. Each scheme includes detailed eligibility criteria, list of required documents, and a direct link to the official government portal.' },
    { q: 'Is my financial data secure?', a: 'Yes! SheFinance uses local-first data encryption and complies with strict privacy regulations. Your sensitive data is never shared with third parties.' },
    { q: 'Can I use the AI Chatbot for complex financial math?', a: 'Absolutely! SheFinance AI is powered by ML and the Grok Math Engine. You can calculate SIP returns, compound interest, EMI amortization schedules, and customized budget allocations.' }
  ];

  const content = (
    <div className="container" style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', background: '#2ecc71', color: '#fff', padding: '14px 24px', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.15)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}>
          <i className="fa-solid fa-circle-check"></i> {toast}
        </div>
      )}

      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, #2a5266 100%)', borderRadius: '20px', padding: '40px', color: '#fff', marginBottom: '35px', boxShadow: '0 10px 30px rgba(27,54,68,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span style={{ background: 'rgba(201,159,85,0.25)', color: 'var(--secondary-color)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <i className="fa-solid fa-headset" style={{ marginRight: '6px' }}></i> Help &amp; Support Center
          </span>
          <h1 style={{ color: '#fff', fontSize: '2.2rem', margin: '14px 0 8px', fontFamily: "'Playfair Display', serif" }}>
            How can we help you today?
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', maxWidth: '600px', margin: 0 }}>
            Submit an inquiry to our financial counseling team, explore quick FAQs, or contact official national helplines for urgent assistance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/chatbot" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
            <i className="fa-solid fa-robot"></i> Ask AI Advisor
          </Link>
          <Link to="/education" className="btn btn-primary">
            <i className="fa-solid fa-book-open"></i> Education Hub
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px', alignItems: 'start' }}>
        {/* Left Column: Submit Ticket & Past Inquiries */}
        <div>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.04)', border: '1px solid #edf2f7', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-color)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-ticket" style={{ color: 'var(--secondary-color)' }}></i> Submit a Support Ticket
            </h2>
            <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '22px' }}>
              Our expert advisors typically respond within 24 hours.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', outline: 'none' }}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="schemes">Govt Schemes Guidance</option>
                    <option value="budget">Budgeting &amp; Savings</option>
                    <option value="loans">Micro-loans &amp; Credit</option>
                    <option value="technical">App / Account Issue</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., Eligibility for Mudra Tarun Loan"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    required
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', outline: 'none' }}
                  />
                </div>
              </div>

              {!isLoggedIn && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>Your Email</label>
                  <input
                    type="email"
                    placeholder="your-email@example.com"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', outline: 'none' }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>Detailed Description</label>
                <textarea
                  rows={5}
                  placeholder="Explain your question or problem in detail..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i> Submit Support Ticket
              </button>
            </form>
          </div>

          {/* Past Inquiries */}
          {tickets.length > 0 && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.04)', border: '1px solid #edf2f7' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-color)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--secondary-color)' }}></i> Your Ticket History ({tickets.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tickets.map(t => (
                  <div key={t.id} style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--primary-color)' }}>{t.subject}</strong>
                      <span style={{
                        background: t.status === 'resolved' ? 'rgba(46,204,113,0.12)' : 'rgba(243,156,18,0.14)',
                        color: t.status === 'resolved' ? '#2ecc71' : '#d68910',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600
                      }}>
                        {t.status === 'resolved' ? '✅ Resolved' : '🕐 Pending Review'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#555', margin: '0 0 8px' }}>{t.msg || t.message}</p>
                    <div style={{ fontSize: '0.78rem', color: '#888' }}>
                      Ticket ID: <strong>{t.id}</strong> • Submitted: {t.date}
                    </div>
                    {t.reply && (
                      <div style={{ marginTop: '12px', padding: '12px 16px', background: '#ecfdf5', borderLeft: '3px solid #10b981', borderRadius: '6px' }}>
                        <p style={{ fontSize: '0.85rem', color: '#065f46', margin: 0 }}>
                          <i className="fa-solid fa-reply" style={{ marginRight: '6px' }}></i>
                          <strong>Support Response:</strong> {t.reply}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Emergency Helplines & FAQs */}
        <div>
          {/* Official Helplines */}
          <div style={{ background: 'linear-gradient(135deg, #fdfbf7, #f7efe1)', borderRadius: '16px', padding: '26px', border: '1px solid rgba(201,159,85,0.25)', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-color)', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-shield-halved" style={{ color: 'var(--secondary-color)' }}></i> Official 24x7 Helplines
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(201,159,85,0.2)' }}>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '0.92rem', color: 'var(--primary-color)' }}>Women Helpline (National)</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#777' }}>Toll-free emergency &amp; domestic assistance</p>
                </div>
                <a href="tel:181" style={{ background: '#c0392b', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
                  <i className="fa-solid fa-phone" style={{ marginRight: '4px' }}></i> 181
                </a>
              </div>

              <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(201,159,85,0.2)' }}>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '0.92rem', color: 'var(--primary-color)' }}>Cyber Crime Helpline</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#777' }}>Financial fraud &amp; phishing reporting</p>
                </div>
                <a href="tel:1930" style={{ background: '#2980b9', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>
                  <i className="fa-solid fa-phone" style={{ marginRight: '4px' }}></i> 1930
                </a>
              </div>

              <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(201,159,85,0.2)' }}>
                <div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '0.92rem', color: 'var(--primary-color)' }}>Kisan Call Centre</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#777' }}>Rural agriculture &amp; SHG queries</p>
                </div>
                <a href="tel:18001801551" style={{ background: '#27ae60', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                  1800-180-1551
                </a>
              </div>
            </div>
          </div>

          {/* Quick FAQ Accordion */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '26px', boxShadow: '0 5px 20px rgba(0,0,0,0.04)', border: '1px solid #edf2f7' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-color)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-circle-question" style={{ color: 'var(--secondary-color)' }}></i> Frequently Asked Questions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ border: '1px solid #edf2f7', borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: faqOpen === i ? '#f8fafc' : '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '0.88rem', color: 'var(--primary-color)', fontFamily: "'Outfit', sans-serif" }}
                  >
                    <span>{faq.q}</span>
                    <i className={`fa-solid ${faqOpen === i ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ color: 'var(--secondary-color)', fontSize: '0.8rem', marginLeft: '8px' }}></i>
                  </button>
                  {faqOpen === i && (
                    <div style={{ padding: '12px 16px', background: '#fff', fontSize: '0.84rem', color: '#666', lineHeight: 1.6, borderTop: '1px solid #f1f5f9' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoggedIn) {
    return (
      <div className="dashboard-body">
        <DashboardNav />
        <main className="dashboard-main">
          <header className="dashboard-header">
            <div className="header-title">
              <h2>Help &amp; Support</h2>
              <p>Get in touch with support, track inquiries, or access emergency resources.</p>
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
          {content}
        </main>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '80vh' }}>
        {content}
      </div>
      <Footer />
    </>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import educationData from '../data/educationData';

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

const SCHEME_ELIGIBILITY_MAP = {
  ssy: {
    title: "Sukanya Samriddhi Yojana (SSY)",
    questions: [
      "Is the girl child less than 10 years of age?",
      "Is she a resident Indian citizen?",
      "Are you opening for the 1st or 2nd girl child in your family?"
    ],
    documents: ["Birth Certificate of Girl Child", "Aadhaar/ID Proof of Parent/Guardian", "Address Proof", "Passport Photographs"],
    officialUrl: "https://www.indiapost.gov.in/banking-services/savings"
  },
  ppf: {
    title: "Public Provident Fund (PPF)",
    questions: [
      "Are you an Indian resident individual?",
      "Can you deposit a minimum of ₹500 per year?",
      "Are you looking for a long-term (15-year) tax-free saving option?"
    ],
    documents: ["Aadhaar Card", "PAN Card", "Passport Size Photo", "Bank Savings Account details"],
    officialUrl: "https://www.nsiindia.gov.in/"
  },
  pragati: {
    title: "AICTE Pragati Scholarship",
    questions: [
      "Are you a female student admitted to 1st year of AICTE Degree/Diploma?",
      "Is your family annual income less than ₹8 Lakhs?",
      "Are you within the max 2 girl children per family limit?"
    ],
    documents: ["10th & 12th Marksheets", "Family Income Certificate from competent authority", "College Admission Letter", "Bank Account linked with Aadhaar"],
    officialUrl: "https://fellowship.aicte.gov.in/"
  },
  cbse: {
    title: "CBSE Single Girl Child Merit Scholarship",
    questions: [
      "Are you the single girl child of your parents?",
      "Did you pass CBSE Class X with 60% or higher marks?",
      "Are you currently studying in Class XI / XII in a CBSE school?"
    ],
    documents: ["Class X CBSE Marksheet", "Affidavit of Single Girl Child on Stamp Paper", "School Principal Verification Form", "Bank Passbook Copy"],
    officialUrl: "https://www.cbse.gov.in/cbsenew/scholar.html"
  },
  mudra: {
    title: "Pradhan Mantri MUDRA Yojana (PMMY)",
    questions: [
      "Do you run or plan to start a non-farm micro/small business?",
      "Is your required loan amount up to ₹20 Lakhs?",
      "Do you have a viable business proposal?"
    ],
    documents: ["Business Plan/Proposal", "KYC Documents (Aadhaar & PAN)", "Quotation of Machinery/Equipment", "Bank Statements (last 6 months)"],
    officialUrl: "https://www.jansamarth.in/business-loan-pradhan-mantri-mudra-yojana-scheme"
  },
  mssc: {
    title: "Mahila Samman Savings Certificate (MSSC)",
    questions: [
      "Are you a woman resident of India or opening for a minor girl child?",
      "Do you want a 7.5% fixed interest rate for 2 years backed by Ministry of Finance?",
      "Is your deposit amount between ₹1,000 and ₹2 Lakhs?"
    ],
    documents: ["Aadhaar Card", "PAN Card", "Account Opening Form", "Passport Photograph"],
    officialUrl: "https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Savings-Schemes.aspx"
  },
  wep: {
    title: "Women Entrepreneurship Platform (WEP - NITI Aayog)",
    questions: [
      "Are you a woman founder, aspiring entrepreneur, or managing an MSME?",
      "Are you seeking government incubation, credit access, or venture funding?",
      "Do you need mentorship, legal guidance, and compliance support?"
    ],
    documents: ["Aadhaar Card", "Udyam/Business Registration (if available)", "PAN Card", "Bank Account Details"],
    officialUrl: "https://wep.gov.in/"
  },
  pmjdy: {
    title: "Pradhan Mantri Jan-Dhan Yojana (PMJDY)",
    questions: [
      "Do you need a zero-balance basic savings bank account?",
      "Are you an Indian citizen above 10 years of age?",
      "Do you want direct government subsidy (DBT) transfers?"
    ],
    documents: ["Aadhaar Card (or PAN / Voter ID)", "Passport Photograph"],
    officialUrl: "https://pmjdy.gov.in/"
  },
  pmjjby: {
    title: "PM Jeevan Jyoti Bima Yojana (PMJJBY)",
    questions: [
      "Do you have a active savings bank account?",
      "Is your age between 18 and 50 years?",
      "Do you consent to auto-debit of annual premium?"
    ],
    documents: ["Savings Bank Account Number", "Aadhaar Card", "Nominee Details"],
    officialUrl: "https://www.jansuraksha.gov.in/"
  },
  pmsby: {
    title: "PM Suraksha Bima Yojana (PMSBY)",
    questions: [
      "Is your age between 18 and 70 years?",
      "Do you have an active savings bank account?",
      "Do you want ₹2 Lakh accidental insurance for ₹20/year?"
    ],
    documents: ["Savings Bank Account", "Aadhaar Card", "Nominee Details"],
    officialUrl: "https://www.jansuraksha.gov.in/"
  },
  apy: {
    title: "Atal Pension Yojana (APY)",
    questions: [
      "Is your age between 18 and 40 years?",
      "Do you have a savings bank account?",
      "Are you outside the income tax paying slab?"
    ],
    documents: ["Savings Bank Account Number", "Aadhaar Card", "Mobile Number"],
    officialUrl: "https://www.pfrda.org.in/"
  }
};

export default function Education() {
  const [userName, setUserName] = useState('User');
  const [announcement, setAnnouncement] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Scheme Modal state
  const [activeModalKey, setActiveModalKey] = useState(null);
  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [hasEvaluated, setHasEvaluated] = useState(false);

  // EMI Calculator state
  const [emiAmount, setEmiAmount] = useState('500000');
  const [emiRate, setEmiRate] = useState('8.5');
  const [emiTenure, setEmiTenure] = useState('5');
  const [emiResult, setEmiResult] = useState(null);

  // SIP Calculator state
  const [sipMonthly, setSipMonthly] = useState('5000');
  const [sipRate, setSipRate] = useState('12');
  const [sipYears, setSipYears] = useState('10');
  const [sipResult, setSipResult] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'User';
    setUserName(storedName);
    const ann = localStorage.getItem('globalAnnouncement');
    if (ann) setAnnouncement(ann);

    // Initial topic
    if (educationData && educationData.length > 0 && educationData[0].topics.length > 0) {
      setSelectedTopicId(educationData[0].topics[0].id);
    }

    // Attach global click handlers for modal triggers if topic content uses checkSchemeEligibility
    window.checkSchemeEligibility = (key) => {
      openEligibilityModal(key);
    };

    return () => {
      delete window.checkSchemeEligibility;
    };
  }, []);

  const adminSchemes = useMemo(() => {
    try {
      const s = localStorage.getItem('sheFinanceSchemes');
      return s ? JSON.parse(s) : DEFAULT_SCHEMES;
    } catch {
      return DEFAULT_SCHEMES;
    }
  }, []);

  const adminLiteracy = useMemo(() => {
    try {
      const l = localStorage.getItem('sheFinanceLiteracy');
      return l ? JSON.parse(l) : DEFAULT_LITERACY;
    } catch {
      return DEFAULT_LITERACY;
    }
  }, []);

  // Build flat topics list
  const flatTopics = useMemo(() => {
    const list = [];
    educationData.forEach((levelObj) => {
      levelObj.topics.forEach((t) => {
        list.push({ ...t, levelName: levelObj.level });
      });

      if (levelObj.level.includes('Government Schemes') || levelObj.level.includes('Level 5')) {
        list.push({
          id: 'govt-schemes',
          title: '6. Live Curated Schemes Directory',
          icon: 'fa-solid fa-landmark',
          isLiveSchemes: true,
          levelName: levelObj.level
        });
      }
    });

    adminLiteracy.forEach((g) => {
      list.push({
        id: `guide-${g.id}`,
        title: g.title,
        icon: 'fa-solid fa-file-lines',
        isGuide: true,
        guideData: g,
        levelName: 'Admin Published Guides'
      });
    });

    return list;
  }, [adminLiteracy]);

  const currentIndex = flatTopics.findIndex((t) => t.id === selectedTopicId);
  const currentTopic = flatTopics[currentIndex] || flatTopics[0];

  function handleSelectTopic(id) {
    setSelectedTopicId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleNavigate(delta) {
    const newIdx = currentIndex + delta;
    if (newIdx >= 0 && newIdx < flatTopics.length) {
      handleSelectTopic(flatTopics[newIdx].id);
    }
  }

  function openEligibilityModal(key) {
    setActiveModalKey(key);
    setCheckedQuestions({});
    setHasEvaluated(false);
  }

  function closeEligibilityModal() {
    setActiveModalKey(null);
  }

  function toggleQuestion(idx) {
    setCheckedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }));
  }

  function calculateLoanEMI() {
    const P = parseFloat(emiAmount);
    const annualRate = parseFloat(emiRate);
    const years = parseFloat(emiTenure);
    if (!P || !annualRate || !years) return;
    const r = annualRate / 12 / 100;
    const n = years * 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    setEmiResult({
      emi: Math.round(emi).toLocaleString('en-IN'),
      interest: Math.round(totalInterest).toLocaleString('en-IN'),
      total: Math.round(totalPayment).toLocaleString('en-IN')
    });
  }

  function calculateSIPGrowth() {
    const P = parseFloat(sipMonthly);
    const annualRate = parseFloat(sipRate);
    const years = parseFloat(sipYears);
    if (!P || !annualRate || !years) return;
    const i = annualRate / 12 / 100;
    const n = years * 12;
    const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const returns = M - totalInvested;
    setSipResult({
      invested: Math.round(totalInvested).toLocaleString('en-IN'),
      returns: Math.round(returns).toLocaleString('en-IN'),
      total: Math.round(M).toLocaleString('en-IN')
    });
  }

  const activeSchemeModalData = activeModalKey ? SCHEME_ELIGIBILITY_MAP[activeModalKey] : null;
  const checkedCount = Object.values(checkedQuestions).filter(Boolean).length;
  const totalQuestions = activeSchemeModalData ? activeSchemeModalData.questions.length : 0;
  const isFullyEligible = checkedCount === totalQuestions && totalQuestions > 0;

  return (
    <div className="dashboard-body">
      <DashboardNav />

      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Financial Education Hub</h2>
            <p>Read step-by-step articles, calculate financial plans, and master your money.</p>
          </div>
          <Link to="/profile" className="header-profile-link" title="Click to manage Profile & Settings">
            <div className="header-profile">
              <div className="profile-pic-wrapper">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=c99f55&color=fff`}
                  alt="Profile"
                />
                <span className="profile-badge-icon"><i className="fa-solid fa-gear"></i></span>
              </div>
              <div className="header-user-info">
                <span className="user-name">{userName}</span>
                <span className="profile-hint-text">Manage Profile <i className="fa-solid fa-chevron-right"></i></span>
              </div>
            </div>
          </Link>
        </header>

        {/* Global Announcement */}
        {announcement && (
          <div style={{
            background: 'linear-gradient(90deg,#c99f55,#e0b96a)',
            color: '#1b3644',
            padding: '12px 20px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(201,159,85,0.2)'
          }}>
            <i className="fa-solid fa-bullhorn" style={{ fontSize: '1.1rem' }}></i>
            <span style={{ flex: 1 }}>{announcement}</span>
            <i
              className="fa-solid fa-xmark"
              style={{ cursor: 'pointer', opacity: 0.7 }}
              onClick={() => setAnnouncement('')}
            ></i>
          </div>
        )}

        {/* Main Education Layout */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Left Sidebar */}
          <aside style={{
            width: '320px',
            flexShrink: 0,
            background: '#ffffff',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
            position: 'sticky',
            top: '90px'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="🔍 Search topics..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {educationData.map((lvl, lIdx) => {
              const matchingTopics = lvl.topics.filter(t => 
                !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (searchQuery && matchingTopics.length === 0) return null;

              return (
                <div key={lIdx} style={{ marginBottom: '20px' }}>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--primary-color)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '10px',
                    paddingBottom: '6px',
                    borderBottom: '2px solid rgba(201,159,85,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className={lvl.icon || 'fa-solid fa-graduation-cap'} style={{ color: 'var(--secondary-color)' }}></i>
                    <span>{lvl.level}</span>
                  </div>

                  {matchingTopics.map(topic => {
                    const isActive = selectedTopicId === topic.id;
                    return (
                      <div
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          color: isActive ? '#fff' : 'var(--text-dark)',
                          background: isActive ? 'var(--secondary-color)' : 'transparent',
                          boxShadow: isActive ? '0 4px 12px rgba(201,159,85,0.35)' : 'none',
                          fontWeight: isActive ? 600 : 500,
                          fontSize: '0.92rem',
                          marginBottom: '4px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          transform: isActive ? 'translateX(3px)' : 'none'
                        }}
                      >
                        <i className={topic.icon || 'fa-solid fa-book-open'} style={{ color: isActive ? '#fff' : 'var(--secondary-color)', minWidth: '16px', textAlign: 'center' }}></i>
                        <span>{topic.title}</span>
                      </div>
                    );
                  })}

                  {/* Curated Scheme directory item if level 5 */}
                  {(lvl.level.includes('Government Schemes') || lvl.level.includes('Level 5')) && (
                    <div
                      onClick={() => handleSelectTopic('govt-schemes')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        color: selectedTopicId === 'govt-schemes' ? '#fff' : 'var(--text-dark)',
                        background: selectedTopicId === 'govt-schemes' ? 'var(--secondary-color)' : 'transparent',
                        boxShadow: selectedTopicId === 'govt-schemes' ? '0 4px 12px rgba(201,159,85,0.35)' : 'none',
                        fontWeight: selectedTopicId === 'govt-schemes' ? 600 : 500,
                        fontSize: '0.92rem',
                        marginBottom: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fa-solid fa-landmark" style={{ color: selectedTopicId === 'govt-schemes' ? '#fff' : 'var(--secondary-color)', minWidth: '16px' }}></i>
                      <span>6. Live Curated Schemes Directory</span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Admin Guides Sidebar Section */}
            {adminLiteracy.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--primary-color)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '10px',
                  paddingBottom: '6px',
                  borderBottom: '2px solid rgba(201,159,85,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <i className="fa-solid fa-certificate" style={{ color: 'var(--secondary-color)' }}></i>
                  <span>Admin Published Guides</span>
                </div>
                {adminLiteracy.map(g => {
                  const gid = `guide-${g.id}`;
                  const isActive = selectedTopicId === gid;
                  return (
                    <div
                      key={gid}
                      onClick={() => handleSelectTopic(gid)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        color: isActive ? '#fff' : 'var(--text-dark)',
                        background: isActive ? 'var(--secondary-color)' : 'transparent',
                        fontSize: '0.92rem',
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        marginBottom: '4px'
                      }}
                    >
                      <i className="fa-solid fa-file-lines" style={{ color: isActive ? '#fff' : 'var(--secondary-color)', minWidth: '16px' }}></i>
                      <span>{g.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>

          {/* Right Content Area */}
          <section style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
            minHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Live Schemes View */}
            {currentTopic?.isLiveSchemes ? (
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>
                  🏛️ Government Schemes &amp; Subsidies for Women
                </h2>
                <p style={{ color: '#666', marginBottom: '24px' }}>
                  Explore verified central &amp; state government financial schemes specifically designed for women&apos;s financial inclusion, savings, and entrepreneurship.
                </p>

                <div style={{
                  background: '#f8f9fb',
                  padding: '16px 20px',
                  borderRadius: '10px',
                  marginBottom: '24px',
                  borderLeft: '4px solid var(--secondary-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <strong style={{ color: 'var(--primary-color)', fontSize: '1rem' }}>
                      <i className="fa-solid fa-bullhorn" style={{ color: 'var(--secondary-color)', marginRight: '6px' }}></i>
                      Curated Scheme Directory ({adminSchemes.filter(s => s.status === 'active').length} Active)
                    </strong>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#666' }}>All schemes below link directly to official national portals.</p>
                  </div>
                  <Link to="/chatbot" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
                    <i className="fa-solid fa-robot"></i> Ask AI About Schemes
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {adminSchemes.filter(s => s.status === 'active').map(s => (
                    <div key={s.id} style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '24px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.04)'
                    }}>
                      <div style={{ marginBottom: '16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          background: 'rgba(201,159,85,0.15)',
                          color: 'var(--primary-color)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          marginBottom: '8px'
                        }}>
                          {s.cat}
                        </span>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <i className="fa-solid fa-landmark" style={{ color: 'var(--secondary-color)' }}></i> {s.name}
                        </h3>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                          <strong>Eligibility:</strong> {s.eligibility}
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '12px',
                        background: '#f8fafc',
                        padding: '14px',
                        borderRadius: '10px',
                        border: '1px solid #edf2f7',
                        margin: '16px 0'
                      }}>
                        <div>
                          <strong style={{ color: 'var(--primary-color)', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase' }}>Key Benefit</strong>
                          <span style={{ color: '#27ae60', fontWeight: 600, fontSize: '0.92rem' }}>{s.benefit}</span>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--primary-color)', display: 'block', fontSize: '0.78rem', textTransform: 'uppercase' }}>Status</strong>
                          <span style={{ color: '#2ecc71', fontWeight: 600, fontSize: '0.92rem' }}>
                            <i className="fa-solid fa-circle-check"></i> Active Scheme
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
                        <a
                          href={s.link || 'https://www.india.gov.in'}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                          style={{ fontSize: '0.88rem', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square"></i> Apply / View Official Portal
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : currentTopic?.isGuide ? (
              /* Admin Guide View */
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>
                  {currentTopic.guideData.title}
                </h2>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(201,159,85,0.15)', color: 'var(--primary-color)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {currentTopic.guideData.cat}
                  </span>
                  <span style={{ background: '#e8f4f8', color: '#2980b9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {currentTopic.guideData.type || 'Article Guide'}
                  </span>
                  <span style={{ background: '#fef9e7', color: '#d4ac0d', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {currentTopic.guideData.level || 'All Levels'}
                  </span>
                  <span style={{ color: '#888', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="fa-regular fa-clock"></i> {currentTopic.guideData.duration || '5 min read'}
                  </span>
                </div>
                <div style={{ background: '#f8f9fb', padding: '20px', borderRadius: '12px', borderLeft: '4px solid var(--secondary-color)', marginBottom: '25px', lineHeight: 1.8, fontSize: '1.05rem', color: '#333' }}>
                  <p style={{ margin: 0 }}>{currentTopic.guideData.desc}</p>
                </div>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-color)', marginBottom: '12px' }}>💡 Key Takeaways &amp; Action Steps</h3>
                <ul style={{ lineHeight: 2, marginLeft: '25px', color: '#444' }}>
                  <li>Review this topic regularly and apply the principles to your monthly budgeting and savings.</li>
                  <li>Track every rupee spent with the <Link to="/tracker" style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>Income &amp; Expense Tracker</Link>.</li>
                  <li>Set a dedicated monthly target in <Link to="/savings" style={{ color: 'var(--secondary-color)', fontWeight: 600 }}>Savings Goals Tracker</Link>.</li>
                </ul>

                <div style={{ marginTop: '30px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link to="/tracker" className="btn btn-primary"><i className="fa-solid fa-money-bill-transfer"></i> Go to Expense Tracker</Link>
                  <Link to="/savings" className="btn btn-outline"><i className="fa-solid fa-bullseye"></i> Set Savings Goal</Link>
                </div>
              </div>
            ) : (
              /* Standard Educational Content */
              <div>
                <div
                  className="education-content"
                  dangerouslySetInnerHTML={{ __html: currentTopic?.content || '' }}
                />

                {/* Interactive Tool Check: If topic is SIP or Loan or Budget, embed interactive calculators */}
                {currentTopic?.id === 'l1-loan-emi' && (
                  <div style={{ marginTop: '30px', background: '#f8fafc', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-calculator" style={{ color: 'var(--secondary-color)' }}></i> Interactive Loan EMI Calculator
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Loan Amount (₹)</label>
                        <input
                          type="number"
                          value={emiAmount}
                          onChange={e => setEmiAmount(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Interest Rate (% p.a.)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={emiRate}
                          onChange={e => setEmiRate(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Tenure (Years)</label>
                        <input
                          type="number"
                          value={emiTenure}
                          onChange={e => setEmiTenure(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                    <button onClick={calculateLoanEMI} className="btn btn-primary" style={{ padding: '8px 18px' }}>
                      Calculate EMI
                    </button>

                    {emiResult && (
                      <div style={{ marginTop: '16px', background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Monthly EMI</div>
                          <strong style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>₹{emiResult.emi}</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Total Interest</div>
                          <strong style={{ fontSize: '1.2rem', color: '#e74c3c' }}>₹{emiResult.interest}</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Total Amount</div>
                          <strong style={{ fontSize: '1.2rem', color: '#27ae60' }}>₹{emiResult.total}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentTopic?.id === 'l2-sip-investing' && (
                  <div style={{ marginTop: '30px', background: '#f8fafc', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-chart-line" style={{ color: 'var(--secondary-color)' }}></i> Interactive SIP Calculator
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Monthly SIP (₹)</label>
                        <input
                          type="number"
                          value={sipMonthly}
                          onChange={e => setSipMonthly(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Expected Return (% p.a.)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={sipRate}
                          onChange={e => setSipRate(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '4px' }}>Time Period (Years)</label>
                        <input
                          type="number"
                          value={sipYears}
                          onChange={e => setSipYears(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                    <button onClick={calculateSIPGrowth} className="btn btn-primary" style={{ padding: '8px 18px' }}>
                      Calculate Future Value
                    </button>

                    {sipResult && (
                      <div style={{ marginTop: '16px', background: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Invested Amount</div>
                          <strong style={{ fontSize: '1.2rem', color: 'var(--primary-color)' }}>₹{sipResult.invested}</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Est. Wealth Gain</div>
                          <strong style={{ fontSize: '1.2rem', color: '#27ae60' }}>₹{sipResult.returns}</strong>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Total Future Value</div>
                          <strong style={{ fontSize: '1.2rem', color: 'var(--secondary-color)' }}>₹{sipResult.total}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Prev / Next Navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '1px solid #eee'
            }}>
              <button
                className="btn btn-outline"
                style={{ visibility: currentIndex > 0 ? 'visible' : 'hidden' }}
                onClick={() => handleNavigate(-1)}
              >
                <i className="fa-solid fa-arrow-left"></i> Previous Topic
              </button>
              <button
                className="btn btn-primary"
                style={{ visibility: currentIndex < flatTopics.length - 1 ? 'visible' : 'hidden', marginLeft: 'auto' }}
                onClick={() => handleNavigate(1)}
              >
                Next Topic <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Scheme Eligibility Modal */}
      {activeSchemeModalData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={closeEligibilityModal}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '580px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              background: 'var(--primary-color)',
              color: '#ffffff',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-clipboard-check"></i> {activeSchemeModalData.title}
              </h3>
              <button
                onClick={closeEligibilityModal}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: 0 }}>
                Check all boxes that apply to you to verify eligibility and required documents:
              </p>

              <div>
                {activeSchemeModalData.questions.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: '12px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      fontSize: '0.93rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={!!checkedQuestions[idx]}
                        onChange={() => toggleQuestion(idx)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--secondary-color)' }}
                      />
                      <span>{q}</span>
                    </label>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setHasEvaluated(true)}
                  style={{ padding: '9px 18px', fontSize: '0.88rem' }}
                >
                  <i className="fa-solid fa-magnifying-glass"></i> Verify Eligibility
                </button>
                <a
                  href={activeSchemeModalData.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i> Official Portal ↗
                </a>
              </div>

              {hasEvaluated && (
                <div style={{
                  marginTop: '18px',
                  padding: '16px',
                  borderRadius: '10px',
                  background: isFullyEligible ? '#ecfdf5' : '#fffbebfb',
                  border: isFullyEligible ? '1px solid #a7f3d0' : '1px solid #fde68a',
                  color: isFullyEligible ? '#065f46' : '#92400e'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isFullyEligible ? (
                      <>
                        <i className="fa-solid fa-circle-check"></i> ✅ Eligible / High Probability!
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-triangle-exclamation"></i> ⚠️ Partially Meets Criteria ({checkedCount}/{totalQuestions})
                      </>
                    )}
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>
                    {isFullyEligible
                      ? `You meet key conditions for ${activeSchemeModalData.title}.`
                      : 'Please check the requirements carefully. You may still qualify with exemptions.'}
                  </p>
                  <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>
                    📋 Prepare these documents:
                  </strong>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: '18px', fontSize: '0.88rem' }}>
                    {activeSchemeModalData.documents.map((doc, dIdx) => (
                      <li key={dIdx}>{doc}</li>
                    ))}
                  </ul>
                  <a
                    href={activeSchemeModalData.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                  >
                    Apply Now
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';
import { schemesAPI } from '../api';

// ─── Category color map ───────────────────────────────────────────────────────
const CAT_COLORS = {
  'Savings':          { bg: '#e8f5e9', color: '#2e7d32', icon: 'fa-solid fa-piggy-bank' },
  'Business Loan':    { bg: '#e3f2fd', color: '#1565c0', icon: 'fa-solid fa-briefcase' },
  'Girl Child':       { bg: '#fce4ec', color: '#c62828', icon: 'fa-solid fa-child-reaching' },
  'Entrepreneurship': { bg: '#fff3e0', color: '#e65100', icon: 'fa-solid fa-rocket' },
  'Banking':          { bg: '#e8eaf6', color: '#283593', icon: 'fa-solid fa-building-columns' },
  'Insurance':        { bg: '#f3e5f5', color: '#6a1b9a', icon: 'fa-solid fa-shield-halved' },
  'Pension':          { bg: '#e0f7fa', color: '#00695c', icon: 'fa-solid fa-umbrella' },
  'Education':        { bg: '#fff8e1', color: '#f57f17', icon: 'fa-solid fa-graduation-cap' },
  'Micro-Loan':       { bg: '#fbe9e7', color: '#bf360c', icon: 'fa-solid fa-coins' },
  'Social Welfare':   { bg: '#f1f8e9', color: '#33691e', icon: 'fa-solid fa-heart' },
  'General':          { bg: '#f5f5f5', color: '#424242', icon: 'fa-solid fa-landmark' },
};

function getCatStyle(cat) {
  return CAT_COLORS[cat] || CAT_COLORS['General'];
}

// ─── Source badge ─────────────────────────────────────────────────────────────
function SourceBadge({ source }) {
  if (source === 'govt_api') {
    return (
      <span style={{
        background: 'linear-gradient(135deg,#1565c0,#0d47a1)',
        color: '#fff', fontSize: '0.7rem', fontWeight: 700,
        padding: '3px 9px', borderRadius: '20px', letterSpacing: '0.5px'
      }}>
        <i className="fa-solid fa-landmark" style={{ marginRight: 4 }}></i> OFFICIAL GOVT
      </span>
    );
  }
  if (source === 'admin') {
    return (
      <span style={{
        background: 'linear-gradient(135deg,#c99f55,#e0b96a)',
        color: '#1b3644', fontSize: '0.7rem', fontWeight: 700,
        padding: '3px 9px', borderRadius: '20px', letterSpacing: '0.5px'
      }}>
        <i className="fa-solid fa-star" style={{ marginRight: 4 }}></i> CURATED
      </span>
    );
  }
  return (
    <span style={{
      background: 'linear-gradient(135deg,#4caf50,#388e3c)',
      color: '#fff', fontSize: '0.7rem', fontWeight: 700,
      padding: '3px 9px', borderRadius: '20px', letterSpacing: '0.5px'
    }}>
      <i className="fa-solid fa-seedling" style={{ marginRight: 4 }}></i> VERIFIED
    </span>
  );
}

// ─── Scheme Detail Modal ─────────────────────────────────────────────────────
function SchemeModal({ scheme, onClose }) {
  if (!scheme) return null;
  const cat = getCatStyle(scheme.category);
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '640px',
          maxHeight: '90vh', overflowY: 'auto', padding: '32px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          animation: 'fadeInUp 0.3s ease'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: cat.bg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0
          }}>
            <i className={cat.icon} style={{ fontSize: '1.4rem', color: cat.color }}></i>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{
                background: cat.bg, color: cat.color,
                fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px'
              }}>{scheme.category}</span>
              <SourceBadge source={scheme.source} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1b3644', lineHeight: 1.3 }}>{scheme.title}</h2>
            {scheme.ministry && (
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>
                <i className="fa-solid fa-landmark" style={{ marginRight: 4 }}></i>{scheme.ministry}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f5f5f5', border: 'none', borderRadius: '50%',
              width: '36px', height: '36px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', color: '#666', flexShrink: 0
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Description */}
        {scheme.description && (
          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#444', lineHeight: 1.7 }}>{scheme.description}</p>
          </div>
        )}

        {/* Key Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          {scheme.benefits && (
            <div style={{ background: '#e8f5e9', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#388e3c', marginBottom: '6px', textTransform: 'uppercase' }}>
                <i className="fa-solid fa-gift" style={{ marginRight: 4 }}></i>Benefits
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#333', lineHeight: 1.5 }}>{scheme.benefits}</p>
            </div>
          )}
          {scheme.eligibility && (
            <div style={{ background: '#e3f2fd', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1565c0', marginBottom: '6px', textTransform: 'uppercase' }}>
                <i className="fa-solid fa-user-check" style={{ marginRight: 4 }}></i>Eligibility
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#333', lineHeight: 1.5 }}>{scheme.eligibility}</p>
            </div>
          )}
          {scheme.deadline && (
            <div style={{ background: '#fff3e0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e65100', marginBottom: '6px', textTransform: 'uppercase' }}>
                <i className="fa-solid fa-calendar" style={{ marginRight: 4 }}></i>Deadline / Status
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#333', lineHeight: 1.5 }}>{scheme.deadline}</p>
            </div>
          )}
        </div>

        {/* Documents Required */}
        {scheme.documents && scheme.documents.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#1b3644', fontWeight: 700 }}>
              <i className="fa-solid fa-file-lines" style={{ marginRight: 6, color: '#c99f55' }}></i>
              Documents Required
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {scheme.documents.map((doc, i) => (
                <span key={i} style={{
                  background: '#f5f5f5', color: '#444', fontSize: '0.82rem',
                  padding: '5px 12px', borderRadius: '20px', border: '1px solid #e0e0e0'
                }}>
                  <i className="fa-solid fa-check" style={{ marginRight: 4, color: '#4caf50' }}></i>{doc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {scheme.tags && scheme.tags.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {scheme.tags.map((tag, i) => (
                <span key={i} style={{
                  background: 'rgba(201,159,85,0.12)', color: '#a07c3a',
                  fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px',
                  border: '1px solid rgba(201,159,85,0.3)'
                }}>#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {scheme.officialLink && (
            <a
              href={scheme.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg,#c99f55,#e0b96a)',
                color: '#1b3644', textDecoration: 'none',
                padding: '12px 24px', borderRadius: '12px', fontWeight: 700,
                fontSize: '0.9rem', transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
              Apply on Official Website
            </a>
          )}
          <button
            onClick={onClose}
            style={{
              background: '#f5f5f5', border: 'none', color: '#666',
              padding: '12px 24px', borderRadius: '12px', fontWeight: 600,
              fontSize: '0.9rem', cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Schemes Page ────────────────────────────────────────────────────────
export default function Schemes() {
  const [userName, setUserName] = useState('User');
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'User');
    fetchSchemes();
    // eslint-disable-next-line
  }, []);

  const fetchSchemes = useCallback(async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await schemesAPI.getAll(params);
      setSchemes(data.schemes || []);
      setCategories(data.categories || ['All']);
      if (data.lastSynced) setLastSynced(new Date(data.lastSynced).toLocaleDateString('en-IN'));
    } catch (err) {
      setError('Could not load schemes. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSearch(e) {
    const val = e.target.value;
    setSearch(val);
    fetchSchemes({ search: val, category });
  }

  function handleCategoryChange(cat) {
    setCategory(cat);
    fetchSchemes({ search, category: cat });
  }

  // Stats
  const govtCount = schemes.filter(s => s.source === 'govt_api').length;
  const adminCount = schemes.filter(s => s.source === 'admin').length;
  const seedCount = schemes.filter(s => s.source === 'seed').length;

  return (
    <div className="dashboard-body">
      <DashboardNav />
      <main className="dashboard-main">

        {/* Scheme Detail Modal */}
        {selectedScheme && (
          <SchemeModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />
        )}

        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="dashboard-header">
          <div className="header-title">
            <h2><i className="fa-solid fa-landmark" style={{ color: '#c99f55', marginRight: 10 }}></i>Government Schemes</h2>
            <p>Curated welfare & financial schemes for women — fetched from official government sources.</p>
          </div>
          <Link to="/profile" className="header-profile-link" title="Manage Profile">
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

        {/* ── Hero Banner ─────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #1b3644 0%, #2a5068 50%, #c99f55 100%)',
          borderRadius: '20px', padding: '32px 36px', marginBottom: '28px',
          display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', right: -40, top: -40, width: 200, height: 200,
            borderRadius: '50%', background: 'rgba(255,255,255,0.04)'
          }}></div>
          <div style={{
            position: 'absolute', right: 60, bottom: -60, width: 150, height: 150,
            borderRadius: '50%', background: 'rgba(201,159,85,0.12)'
          }}></div>
          <div style={{
            width: 64, height: 64, borderRadius: '16px',
            background: 'rgba(201,159,85,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <i className="fa-solid fa-indian-rupee-sign" style={{ fontSize: '1.8rem', color: '#c99f55' }}></i>
          </div>
          <div style={{ flex: 1, zIndex: 1 }}>
            <h3 style={{ margin: '0 0 6px', color: '#fff', fontSize: '1.3rem' }}>
              Govt Schemes for Women's Financial Empowerment
            </h3>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Discover savings, loans, insurance, education & entrepreneurship schemes for Indian women. Verified from official government sources and updated daily.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', zIndex: 1 }}>
            {[
              { val: schemes.length, label: 'Total Schemes', icon: 'fa-solid fa-list' },
              { val: govtCount || seedCount, label: 'Govt Verified', icon: 'fa-solid fa-shield-check' },
              { val: adminCount, label: 'Admin Added', icon: 'fa-solid fa-star' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)', borderRadius: '14px',
                padding: '14px 20px', textAlign: 'center', minWidth: '90px'
              }}>
                <i className={stat.icon} style={{ fontSize: '1.1rem', color: '#c99f55', display: 'block', marginBottom: 4 }}></i>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{stat.val}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Search + Filter Bar ──────────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: '14px', marginBottom: '24px',
          alignItems: 'center', flexWrap: 'wrap'
        }}>
          {/* Search */}
          <div style={{
            flex: 1, minWidth: '240px', position: 'relative'
          }}>
            <i className="fa-solid fa-magnifying-glass" style={{
              position: 'absolute', left: '14px', top: '50%',
              transform: 'translateY(-50%)', color: '#999', fontSize: '0.9rem'
            }}></i>
            <input
              id="schemes-search"
              type="text"
              placeholder="Search schemes, benefits, eligibility..."
              value={search}
              onChange={handleSearch}
              style={{
                width: '100%', padding: '11px 14px 11px 38px',
                borderRadius: '12px', border: '1.5px solid #e0e0e0',
                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#c99f55'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          {/* Category filter chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {categories.map(cat => {
              const key = cat === 'All' ? 'all' : cat;
              const active = category === key;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(key)}
                  style={{
                    padding: '8px 16px', borderRadius: '20px', border: '1.5px solid',
                    borderColor: active ? '#c99f55' : '#e0e0e0',
                    background: active ? 'linear-gradient(135deg,#c99f55,#e0b96a)' : '#fff',
                    color: active ? '#1b3644' : '#666',
                    fontWeight: active ? 700 : 500, fontSize: '0.83rem',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              setLoading(true);
              fetchSchemes({ search, category });
            }}
            disabled={loading}
            title="Refresh scheme listings"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '12px',
              background: '#1b3644', color: '#c99f55',
              border: '1px solid #c99f55', fontWeight: 600,
              fontSize: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', flexShrink: 0
            }}
          >
            <i className={`fa-solid fa-rotate ${loading ? 'fa-spin' : ''}`}></i>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          {/* Last synced */}
          {lastSynced && (
            <div style={{ fontSize: '0.78rem', color: '#999', flexShrink: 0 }}>
              <i className="fa-solid fa-rotate" style={{ marginRight: 4, color: '#4caf50' }}></i>
              Synced: {lastSynced}
            </div>
          )}
        </div>

        {/* ── Content Area ─────────────────────────────────────────────── */}
        {loading ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '80px 20px', gap: '16px'
          }}>
            <div style={{
              width: 48, height: 48, border: '4px solid #f0e8d5',
              borderTopColor: '#c99f55', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <p style={{ color: '#888', margin: 0 }}>Loading government schemes...</p>
          </div>
        ) : error ? (
          <div style={{
            background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '14px',
            padding: '24px', textAlign: 'center', color: '#856404'
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2rem', marginBottom: '12px', display: 'block' }}></i>
            <strong>{error}</strong>
            <p style={{ margin: '8px 0 16px', fontSize: '0.88rem' }}>
              Make sure your backend server is running at <code>localhost:3000</code>
            </p>
            <button
              onClick={() => fetchSchemes()}
              style={{
                background: '#c99f55', color: '#1b3644', border: 'none',
                padding: '10px 20px', borderRadius: '10px', fontWeight: 700,
                cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              <i className="fa-solid fa-rotate" style={{ marginRight: 6 }}></i> Retry
            </button>
          </div>
        ) : schemes.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px', color: '#999'
          }}>
            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '2.5rem', marginBottom: '16px', display: 'block', opacity: 0.4 }}></i>
            <h3 style={{ margin: '0 0 8px', color: '#555' }}>No schemes found</h3>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px'
          }}>
            {schemes.map((scheme) => {
              const cat = getCatStyle(scheme.category);
              return (
                <div
                  key={scheme._id}
                  style={{
                    background: '#fff',
                    borderRadius: '18px',
                    padding: '22px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    border: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex', flexDirection: 'column', gap: '14px',
                    position: 'relative', overflow: 'hidden'
                  }}
                  onClick={() => setSelectedScheme(scheme)}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Top color stripe */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                    background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)`
                  }}></div>

                  {/* Card header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      background: cat.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <i className={cat.icon} style={{ fontSize: '1.25rem', color: cat.color }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          background: cat.bg, color: cat.color,
                          fontSize: '0.72rem', fontWeight: 700,
                          padding: '2px 9px', borderRadius: '20px'
                        }}>{scheme.category}</span>
                        <SourceBadge source={scheme.source} />
                      </div>
                      <h3 style={{
                        margin: 0, fontSize: '1rem', color: '#1b3644',
                        fontWeight: 700, lineHeight: 1.3,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>{scheme.title}</h3>
                    </div>
                  </div>

                  {/* Ministry */}
                  {scheme.ministry && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-building-government" style={{ color: '#999', fontSize: '0.8rem' }}></i>
                      <span style={{ fontSize: '0.8rem', color: '#777' }}>{scheme.ministry}</span>
                    </div>
                  )}

                  {/* Benefits preview */}
                  {scheme.benefits && (
                    <div style={{
                      background: '#f8f9fa', borderRadius: '10px', padding: '10px 14px',
                      display: 'flex', gap: '8px', alignItems: 'flex-start'
                    }}>
                      <i className="fa-solid fa-gift" style={{ color: '#4caf50', fontSize: '0.85rem', marginTop: 2 }}></i>
                      <p style={{
                        margin: 0, fontSize: '0.84rem', color: '#444', lineHeight: 1.5,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>{scheme.benefits}</p>
                    </div>
                  )}

                  {/* Eligibility preview */}
                  {scheme.eligibility && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <i className="fa-solid fa-user-check" style={{ color: '#1565c0', fontSize: '0.85rem', marginTop: 2 }}></i>
                      <p style={{
                        margin: 0, fontSize: '0.83rem', color: '#555', lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>{scheme.eligibility}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: '12px', borderTop: '1px solid #f0f0f0', marginTop: 'auto'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-calendar-check" style={{ color: '#c99f55', fontSize: '0.8rem' }}></i>
                      <span style={{ fontSize: '0.79rem', color: '#888' }}>{scheme.deadline || 'Ongoing'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedScheme(scheme); }}
                        style={{
                          background: 'rgba(201,159,85,0.1)', color: '#a07c3a',
                          border: '1px solid rgba(201,159,85,0.3)',
                          padding: '7px 14px', borderRadius: '8px', fontWeight: 600,
                          fontSize: '0.8rem', cursor: 'pointer'
                        }}
                      >
                        View Details
                      </button>
                      {scheme.officialLink && (
                        <a
                          href={scheme.officialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{
                            background: 'linear-gradient(135deg,#c99f55,#e0b96a)',
                            color: '#1b3644', textDecoration: 'none',
                            padding: '7px 14px', borderRadius: '8px', fontWeight: 700,
                            fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px'
                          }}
                        >
                          Apply <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.7rem' }}></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}



      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', icon: 'fa-solid fa-house', label: 'Overview' },
  { path: '/tracker', icon: 'fa-solid fa-money-bill-transfer', label: 'Income & Expense' },
  { path: '/budget', icon: 'fa-solid fa-wallet', label: 'Budget Planner' },
  { path: '/savings', icon: 'fa-solid fa-bullseye', label: 'Savings Goals' },
  { path: '/chatbot', icon: 'fa-solid fa-robot', label: 'AI Chatbot' },
  { path: '/education', icon: 'fa-solid fa-book-open-reader', label: 'Education Hub' },
  { path: '/schemes', icon: 'fa-solid fa-landmark', label: 'Govt Schemes' },
  { path: '/reports', icon: 'fa-solid fa-chart-pie', label: 'Reports' },
];

export default function DashboardNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('userProfile');
    navigate('/login');
  }

  return (
    <aside className={`sidebar${scrolled ? ' scrolled' : ''}${mobileMenuOpen ? ' mobile-expanded' : ''}`}>
      <div className="sidebar-logo">
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="SheFinance Emblem" style={{ height: '44px', width: 'auto', borderRadius: '8px', objectFit: 'contain' }} />
          <h2>She<span>Finance</span></h2>
        </Link>
        <button 
          className="sidebar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle App Menu"
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      <div className={`sidebar-menu-wrapper${mobileMenuOpen ? ' mobile-open' : ''}`}>
        <ul className="sidebar-menu">
          {navItems.map(item => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path} onClick={() => setMobileMenuOpen(false)}>
                <i className={item.icon}></i> {item.label}
              </Link>
            </li>
          ))}
          <li className={location.pathname === '/support' ? 'active' : ''}>
            <Link to="/support" onClick={() => setMobileMenuOpen(false)}>
              <i className="fa-solid fa-headset"></i> Help &amp; Support
            </Link>
          </li>
        </ul>
        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={logout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}

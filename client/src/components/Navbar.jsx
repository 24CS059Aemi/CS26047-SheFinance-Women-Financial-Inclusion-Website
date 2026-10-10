import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="SheFinance Emblem" style={{ height: '46px', width: 'auto', borderRadius: '8px', objectFit: 'contain' }} />
            <h2>She<span>Finance</span></h2>
          </Link>
        </div>
        <ul className="nav-links">
          <li><a href="/#home">Home</a></li>
          <li><a href="/#features">Features</a></li>
          <li><a href="/#about">About Us</a></li>
          <li><Link to="/support">Help &amp; Support</Link></li>
        </ul>
        <div className="nav-buttons">
          <Link to="/login" className="btn btn-outline">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}

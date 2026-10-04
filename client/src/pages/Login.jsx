import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const GOOGLE_CLIENT_ID = '220990349271-16bitos8lvag5d1thbdhhkt2da0mq5g9.apps.googleusercontent.com';

function getUsers() {
  try { return JSON.parse(localStorage.getItem('registeredUsers') || '[]'); } catch { return []; }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function sessionStart(name, emailVal, roleVal) {
    const prevEmail = localStorage.getItem('userEmail');
    if (prevEmail && prevEmail !== emailVal) {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userAvatar');
    }
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', emailVal);
    if (roleVal) localStorage.setItem('userRole', roleVal);
    if (roleVal === 'admin') navigate('/admin');
    else navigate('/dashboard');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const users = getUsers();
    const user = users.find(u => u.email === email.trim().toLowerCase());
    if (!user) { setError('No account found with this email. Please register first.'); return; }
    if (user.provider === 'google') { setError('This account uses Google Sign-In. Please use "Sign in with Google" below.'); return; }
    if (user.password !== password) { setError('Incorrect password. Please try again.'); return; }
    const registeredRole = user.role || 'user';
    if (registeredRole !== role) { setError(`Access Denied. You are not registered as ${role.toUpperCase()}.`); return; }
    if (user.status === 'blocked') { setError('Your account has been suspended. Please contact support.'); return; }
    setError('');
    sessionStart(user.name, user.email, role);
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="logo">
          <Link to="/"><h2>She<span>Finance</span></h2></Link>
        </div>
        <h3 style={{ marginBottom: '20px' }}>Welcome Back</h3>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', fontSize: '0.9rem' }}>
          Sign in to continue to your dashboard.
        </p>

        {error && (
          <div style={{ background: '#ffeaea', color: '#e74c3c', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.88rem', textAlign: 'left' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>{error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" className="toggle-password" onClick={() => setShowPass(!showPass)}>
                <i className={`fa-regular ${showPass ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </button>
            </div>
          </div>
          <div className="input-group">
            <label>Login As</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">Women Student / General User</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Sign In</button>
        </form>

        <div className="auth-links">
          <p>Don't have an account? <Link to="/register">Get Started</Link></p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function sessionStart(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userId', user.id);
    if (user.role === 'admin') navigate('/admin');
    else navigate('/dashboard');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authAPI.login({ email, password, role });
      sessionStart(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-links">
          <p>Don't have an account? <Link to="/register">Get Started</Link></p>
        </div>
      </div>
    </div>
  );
}

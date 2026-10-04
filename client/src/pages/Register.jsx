import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export default function Register() {
  const [form, setForm] = useState({ fullname: '', mobile: '', email: '', role: 'user', password: '', confirm_password: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm_password) { setError('Passwords do not match!'); return; }
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/;
    if (!passwordRegex.test(form.password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number and special character.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authAPI.register({
        name: form.fullname,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userId', data.user.id);
      if (data.user.role === 'admin') navigate('/admin');
      else navigate('/onboarding');
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
        <h3 style={{ marginBottom: '20px' }}>Create an Account</h3>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', fontSize: '0.9rem' }}>Start your journey to financial freedom.</p>

        {error && (
          <div style={{ background: '#ffeaea', color: '#e74c3c', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.88rem', textAlign: 'left' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>{error}
          </div>
        )}

        <form className="auth-form grid-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" name="fullname" placeholder="Enter full name" value={form.fullname} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Mobile Number</label>
            <input type="tel" name="mobile" placeholder="Enter mobile no." pattern="[0-9]{10}" value={form.mobile} onChange={handleChange} required />
          </div>
          <div className="input-group full-width">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="Enter your email address" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group full-width">
            <label>Register As</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">Women Student / General User</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input type={showPass ? 'text' : 'password'} name="password" placeholder="Strong password" value={form.password} onChange={handleChange} required />
              <button type="button" className="toggle-password" onClick={() => setShowPass(!showPass)}>
                <i className={`fa-regular ${showPass ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </button>
            </div>
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input type={showConfirm ? 'text' : 'password'} name="confirm_password" placeholder="Confirm password" value={form.confirm_password} onChange={handleChange} required />
              <button type="button" className="toggle-password" onClick={() => setShowConfirm(!showConfirm)}>
                <i className={`fa-regular ${showConfirm ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary full-width" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
        </form>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

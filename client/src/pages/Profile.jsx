import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [cityState, setCityState] = useState('');
  const [language, setLanguage] = useState('');

  const [occupation, setOccupation] = useState('');
  const [incomeRange, setIncomeRange] = useState('');
  const [financialGoal, setFinancialGoal] = useState('');
  const [literacyLevel, setLiteracyLevel] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  function loadProfileData() {
    const rawName = localStorage.getItem('userName') || 'User';
    const rawEmail = localStorage.getItem('userEmail') || (rawName.includes('@') ? rawName : 'user@example.com');
    setEmail(rawEmail);

    let profileObj = {};
    try {
      const p = localStorage.getItem('userProfile');
      if (p) profileObj = JSON.parse(p);
    } catch {
      profileObj = {};
    }

    setFullName(profileObj.fullName || rawName);
    setPhone(profileObj.phone || '');
    setDob(profileObj.dob || '');
    setGender(profileObj.gender || '');
    setCityState(profileObj.cityState || '');
    setLanguage(profileObj.language || 'English');

    setOccupation(profileObj.occupation || '');
    setIncomeRange(profileObj.incomeRange || '');
    setFinancialGoal(profileObj.financialGoal || '');
    setLiteracyLevel(profileObj.literacyLevel || '');

    const savedAvatar = localStorage.getItem('userAvatar');
    const initialAvatar = savedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileObj.fullName || rawName)}&background=c99f55&color=fff`;
    setAvatar(initialAvatar);
  }

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 3500);
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Image file is too large! Please select an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result;
      if (base64) {
        setAvatar(base64);
        localStorage.setItem('userAvatar', base64);
        showToast('Profile photo updated successfully!');
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSave(e) {
    e.preventDefault();

    // Password validation if entered
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('New passwords do not match. Please re-enter.');
        return;
      }
      // Update stored password if matching user in local storage
      const usersStr = localStorage.getItem('sheFinanceUsers');
      if (usersStr) {
        try {
          const users = JSON.parse(usersStr);
          const currentU = users.find(u => u.email === email || u.name === fullName);
          if (currentU) {
            currentU.password = newPassword;
            localStorage.setItem('sheFinanceUsers', JSON.stringify(users));
          }
        } catch {}
      }
    }

    const updatedProfile = {
      fullName,
      phone,
      dob,
      gender,
      cityState,
      language,
      occupation,
      incomeRange,
      financialGoal,
      literacyLevel
    };

    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    localStorage.setItem('userName', fullName);
    setIsEditing(false);
    setNewPassword('');
    setConfirmPassword('');
    showToast('Profile and settings updated successfully!');
  }

  function handleCancel() {
    loadProfileData();
    setIsEditing(false);
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="dashboard-body">
      <DashboardNav />

      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Profile Management</h2>
            <p>View and update your personal and financial profile settings.</p>
          </div>
          <div className="header-profile">
            <div className="profile-pic-wrapper">
              <img src={avatar} alt="Profile" />
              <span className="profile-badge-icon"><i className="fa-solid fa-gear"></i></span>
            </div>
            <div className="header-user-info">
              <span className="user-name">{fullName || 'User'}</span>
              <span className="profile-hint-text">Active Profile</span>
            </div>
          </div>
        </header>

        {/* Profile Card Layout */}
        <section className="dashboard-content" style={{ padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '30px', alignItems: 'start' }}>
            
            {/* Left Avatar Card */}
            <div style={{
              background: '#fff',
              borderRadius: '15px',
              padding: '30px 20px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div
                style={{
                  position: 'relative',
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  cursor: isEditing ? 'pointer' : 'default',
                  boxShadow: '0 8px 25px rgba(201,159,85,0.2)',
                  border: '3px solid var(--secondary-color)',
                  marginBottom: '15px'
                }}
                onClick={() => {
                  if (isEditing && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <img
                  src={avatar}
                  alt="User Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {isEditing && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    gap: '4px'
                  }}>
                    <i className="fa-solid fa-camera" style={{ fontSize: '1.2rem' }}></i>
                    <span>Change Photo</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', margin: '0 0 4px 0' }}>
                {fullName || 'User Name'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: '0 0 20px 0' }}>
                {email}
              </p>

              <div style={{
                fontSize: '0.85rem',
                color: 'var(--text-light)',
                textAlign: 'left',
                width: '100%',
                borderTop: '1px solid #eee',
                paddingTop: '15px'
              }}>
                <p style={{ margin: '6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-calendar-days" style={{ color: 'var(--secondary-color)' }}></i> Member Since: Aug 2026
                </p>
                <p style={{ margin: '6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: '#2ecc71' }}></i> Account Status: Active
                </p>
              </div>
            </div>

            {/* Right Details Form Card */}
            <div style={{ background: '#fff', borderRadius: '15px', padding: '35px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
              <form onSubmit={handleSave}>
                {/* 1. Personal Information */}
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-address-card" style={{ color: 'var(--secondary-color)' }}></i> Personal Information
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Full Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: isEditing ? '#fff' : '#f8f9fb',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Email Address (Read-Only)</label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: '#f8f9fb',
                        color: '#666',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Mobile Number</label>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: isEditing ? '#fff' : '#f8f9fb',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Date of Birth</label>
                    <input
                      type="date"
                      disabled={!isEditing}
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: isEditing ? '#fff' : '#f8f9fb',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Gender</label>
                    <select
                      disabled={!isEditing}
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: isEditing ? '#fff' : '#f8f9fb',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select Gender...</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>City &amp; State</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      placeholder="e.g., Ahmedabad, Gujarat"
                      value={cityState}
                      onChange={e => setCityState(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: isEditing ? '#fff' : '#f8f9fb',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Preferred Language</label>
                    <select
                      disabled={!isEditing}
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: isEditing ? '#fff' : '#f8f9fb',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Gujarati">Gujarati</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>
                </div>

                {/* 2. Financial Profile */}
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-chart-line" style={{ color: 'var(--secondary-color)' }}></i> Financial Profile
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '35px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Occupation</label>
                    <select
                      disabled={!isEditing}
                      value={occupation}
                      onChange={e => setOccupation(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: isEditing ? '#fff' : '#f8f9fb',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select Occupation...</option>
                      <option value="student">Student</option>
                      <option value="salaried">Salaried Employee</option>
                      <option value="business">Business Owner / Entrepreneur</option>
                      <option value="homemaker">Homemaker</option>
                      <option value="freelancer">Freelancer</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Monthly Income Range</label>
                    <select
                      disabled={!isEditing}
                      value={incomeRange}
                      onChange={e => setIncomeRange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: isEditing ? '#fff' : '#f8f9fb',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select Income Range...</option>
                      <option value="below_10k">Below ₹10,000</option>
                      <option value="10k_30k">₹10,000 – ₹30,000</option>
                      <option value="30k_60k">₹30,000 – ₹60,000</option>
                      <option value="above_60k">Above ₹60,000</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Primary Financial Goal</label>
                    <select
                      disabled={!isEditing}
                      value={financialGoal}
                      onChange={e => setFinancialGoal(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: isEditing ? '#fff' : '#f8f9fb',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select Goal...</option>
                      <option value="save_emergency">Build an Emergency Fund</option>
                      <option value="buy_house">Save for House / Car</option>
                      <option value="start_business">Start a Business</option>
                      <option value="retirement">Invest for Future / Retirement</option>
                      <option value="clear_debt">Clear Loans &amp; Debt</option>
                      <option value="education">Higher Education / Self-Growth</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Financial Literacy Level</label>
                    <select
                      disabled={!isEditing}
                      value={literacyLevel}
                      onChange={e => setLiteracyLevel(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        background: isEditing ? '#fff' : '#f8f9fb',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">Select Level...</option>
                      <option value="beginner">Beginner (Learning to save)</option>
                      <option value="intermediate">Intermediate (Basic banking awareness)</option>
                      <option value="advanced">Advanced (Understand investments)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Password Change (Editable only when editing) */}
                {isEditing && (
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fa-solid fa-lock" style={{ color: 'var(--secondary-color)' }}></i> Change Password
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', background: '#f4f7f9', padding: '10px 14px', borderLeft: '3px solid var(--secondary-color)', borderRadius: '4px', marginBottom: '18px' }}>
                      <i className="fa-solid fa-circle-info" style={{ marginRight: '6px', color: 'var(--secondary-color)' }}></i> Leave these fields empty if you do not wish to change your password.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>New Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Min 6 characters"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px 38px 10px 14px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                          />
                          <i
                            className={`fa-regular ${showNewPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                          ></i>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px 38px 10px 14px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                          />
                          <i
                            className={`fa-regular ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888' }}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  {!isEditing ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleCancel}
                      >
                        <i className="fa-solid fa-xmark"></i> Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        <i className="fa-solid fa-floppy-disk"></i> Save Changes
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>

          </div>
        </section>
      </main>

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

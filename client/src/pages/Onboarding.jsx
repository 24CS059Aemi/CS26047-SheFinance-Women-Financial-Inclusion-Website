import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Onboarding() {
  const [occupation, setOccupation] = useState('');
  const [income, setIncome] = useState('');
  const [experience, setExperience] = useState('beginner');
  const [goal, setGoal] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!occupation || !income || !experience || !goal) {
      alert('Please answer all 4 questions to personalize your experience.');
      return;
    }

    const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const updatedProfile = {
      ...currentProfile,
      occupation: occupation,
      incomeRange: income,
      literacyLevel: experience,
      financeExperience: experience,
      financialGoal: goal,
      onboardingDone: true
    };

    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    navigate('/dashboard');
  }

  return (
    <div className="auth-page">
      <div className="auth-container onboarding-container">
        <div className="logo">
          <Link to="/">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>
              Welcome to She<span>Finance</span> ✨
            </h2>
          </Link>
        </div>

        <h3 style={{ marginBottom: '10px', fontSize: '1.35rem', color: 'var(--primary-color)' }}>
          Let's Personalize Your Experience
        </h3>
        <p style={{ color: 'var(--text-light)', marginBottom: '30px', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Tell us a little bit about yourself so we can help you achieve your financial goals faster.
        </p>

        <form className="auth-form onboarding-form" onSubmit={handleSubmit}>
          {/* Question 1: Occupation */}
          <div className="input-group">
            <label htmlFor="occupation">1. What is your current occupation?</label>
            <select
              id="occupation"
              className="select-input"
              value={occupation}
              onChange={e => setOccupation(e.target.value)}
              required
            >
              <option value="" disabled>Select occupation...</option>
              <option value="student">Student</option>
              <option value="salaried">Salaried Employee</option>
              <option value="business">Business Owner / Entrepreneur</option>
              <option value="homemaker">Homemaker</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>

          {/* Question 2: Monthly Income */}
          <div className="input-group">
            <label htmlFor="income">2. Average Monthly Income</label>
            <select
              id="income"
              className="select-input"
              value={income}
              onChange={e => setIncome(e.target.value)}
              required
            >
              <option value="" disabled>Select income range...</option>
              <option value="below_10k">Below ₹10,000</option>
              <option value="10k_30k">₹10,000 - ₹30,000</option>
              <option value="30k_60k">₹30,000 - ₹60,000</option>
              <option value="above_60k">Above ₹60,000</option>
            </select>
          </div>

          {/* Question 3: Experience */}
          <div className="input-group">
            <label>3. Experience with Banking &amp; Finance</label>
            <div className="radio-group">
              <label className={`radio-label ${experience === 'beginner' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="experience"
                  value="beginner"
                  checked={experience === 'beginner'}
                  onChange={e => setExperience(e.target.value)}
                  required
                />
                Beginner (Just starting to save)
              </label>

              <label className={`radio-label ${experience === 'intermediate' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="experience"
                  value="intermediate"
                  checked={experience === 'intermediate'}
                  onChange={e => setExperience(e.target.value)}
                  required
                />
                Intermediate (Have accounts &amp; basic investments)
              </label>

              <label className={`radio-label ${experience === 'advanced' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="experience"
                  value="advanced"
                  checked={experience === 'advanced'}
                  onChange={e => setExperience(e.target.value)}
                  required
                />
                Advanced (Actively investing in mutual funds/stocks)
              </label>
            </div>
          </div>

          {/* Question 4: Primary Goal */}
          <div className="input-group">
            <label htmlFor="goal">4. What is your primary financial goal?</label>
            <select
              id="goal"
              className="select-input"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              required
            >
              <option value="" disabled>Select your main goal...</option>
              <option value="save_emergency">Build an Emergency Fund</option>
              <option value="buy_house">Save for a House/Car</option>
              <option value="start_business">Start a Business</option>
              <option value="retirement">Invest for the Future / Retirement</option>
              <option value="clear_debt">Clear Loans/Debt</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: '15px', fontSize: '1.05rem', padding: '14px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Complete Profile &amp; Go to Dashboard <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

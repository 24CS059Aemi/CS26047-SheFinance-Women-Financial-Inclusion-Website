import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';

export default function Reports() {
  const [userName, setUserName] = useState('User');
  const [avatar, setAvatar] = useState('');
  const [healthScore, setHealthScore] = useState(0);
  const [healthStatus, setHealthStatus] = useState('No Data Yet');
  const [healthDesc, setHealthDesc] = useState('Add income and expenses to calculate your score.');
  const [insights, setInsights] = useState([]);

  const expenseChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const expenseChartInstance = useRef(null);
  const trendChartInstance = useRef(null);

  useEffect(() => {
    const rawName = localStorage.getItem('userName') || 'User';
    const formatted = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setUserName(formatted);

    const savedAvatar = localStorage.getItem('userAvatar');
    setAvatar(savedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formatted)}&background=c99f55&color=fff`);

    calculateReports();

    return () => {
      if (expenseChartInstance.current) expenseChartInstance.current.destroy();
      if (trendChartInstance.current) trendChartInstance.current.destroy();
    };
  }, []);

  function getTransactions() {
    try {
      return JSON.parse(localStorage.getItem('sheFinanceTransactions') || '[]');
    } catch {
      return [];
    }
  }

  function getBudgets() {
    try {
      return JSON.parse(localStorage.getItem('sheFinanceBudgets') || '{}');
    } catch {
      return {};
    }
  }

  function calculateReports() {
    const txs = getTransactions();
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // 1. Current month expenses by category
    const expensesByCategory = {};
    let totalExpenseMonth = 0;
    let totalIncomeMonth = 0;

    txs.forEach((tx) => {
      const txMonth = (tx.date || '').substring(0, 7);
      if (txMonth === currentMonthStr) {
        const amt = parseFloat(tx.amount) || 0;
        if (tx.type === 'expense') {
          expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + amt;
          totalExpenseMonth += amt;
        } else if (tx.type === 'income') {
          totalIncomeMonth += amt;
        }
      }
    });

    // 2. Financial Health Score
    let score = 50;
    if (totalIncomeMonth > 0) {
      const savingsRate = ((totalIncomeMonth - totalExpenseMonth) / totalIncomeMonth) * 100;
      if (savingsRate > 20) score += 30;
      else if (savingsRate > 10) score += 15;
      else if (savingsRate < 0) score -= 20;
    } else if (totalExpenseMonth > 0) {
      score -= 30;
    }

    const budgets = getBudgets()[currentMonthStr] || {};
    const totalBudget = Object.values(budgets).reduce((a, b) => a + (parseFloat(b) || 0), 0);
    if (totalBudget > 0) {
      const budgetUsage = (totalExpenseMonth / totalBudget) * 100;
      if (budgetUsage <= 90) score += 20;
      else if (budgetUsage > 100) score -= 15;
    }

    score = Math.max(10, Math.min(100, Math.round(score)));
    if (totalIncomeMonth === 0 && totalExpenseMonth === 0) {
      score = 0;
    }

    setHealthScore(score);

    if (score === 0) {
      setHealthStatus('No Data Yet');
      setHealthDesc('Add income and expenses to calculate your score.');
    } else if (score >= 80) {
      setHealthStatus('Excellent');
      setHealthDesc('Fantastic! You are saving a good portion of your income and sticking to your budget.');
    } else if (score >= 50) {
      setHealthStatus('Fair');
      setHealthDesc("You're doing okay, but there is room for improvement. Try reducing discretionary expenses.");
    } else {
      setHealthStatus('Needs Attention');
      setHealthDesc('Warning: Your expenses are high relative to your income. Review your budget immediately.');
    }

    // 3. AI Insights
    const generatedInsights = [];
    if (totalIncomeMonth === 0 && totalExpenseMonth === 0) {
      generatedInsights.push({
        type: 'info',
        icon: 'fa-solid fa-plus',
        title: 'Start Tracking',
        desc: 'Add your daily transactions in the Tracker to generate personalized financial health insights.'
      });
    } else {
      if (score >= 80) {
        generatedInsights.push({
          type: 'success',
          icon: 'fa-solid fa-arrow-trend-up',
          title: 'Great Savings Rate!',
          desc: 'You have a healthy surplus this month. Consider investing 50% of your remaining balance in a SIP.'
        });
      }

      const topCat = Object.keys(expensesByCategory).reduce(
        (a, b) => (expensesByCategory[a] > expensesByCategory[b] ? a : b),
        ''
      );

      if (topCat && expensesByCategory[topCat] > totalIncomeMonth * 0.3) {
        generatedInsights.push({
          type: 'warning',
          icon: 'fa-solid fa-triangle-exclamation',
          title: 'High Spend Alert',
          desc: `You are spending over 30% of your income on ${topCat}. Try to cut down here next month.`
        });
      } else if (topCat) {
        generatedInsights.push({
          type: 'info',
          icon: 'fa-solid fa-magnifying-glass-chart',
          title: 'Top Category',
          desc: `Most of your expenses went to ${topCat} (₹${Math.round(expensesByCategory[topCat]).toLocaleString('en-IN')}) this month.`
        });
      }

      if (totalBudget > 0 && totalExpenseMonth > totalBudget) {
        generatedInsights.push({
          type: 'warning',
          icon: 'fa-solid fa-bell',
          title: 'Budget Exceeded',
          desc: `You have crossed your total monthly budget of ₹${Math.round(totalBudget).toLocaleString('en-IN')}.`
        });
      }
    }
    setInsights(generatedInsights);

    // 4. Render Charts
    renderCharts(expensesByCategory, txs);
  }

  function renderCharts(expensesByCategory, txs) {
    if (!window.Chart) return;

    // Expense Pie Chart
    if (expenseChartRef.current) {
      if (expenseChartInstance.current) expenseChartInstance.current.destroy();

      const labels = Object.keys(expensesByCategory).length > 0 ? Object.keys(expensesByCategory) : ['No Data'];
      const dataValues = Object.keys(expensesByCategory).length > 0 ? Object.values(expensesByCategory) : [1];
      const backgroundColors = [
        '#e74c3c', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#2ecc71', '#34495e', '#95a5a6'
      ];

      expenseChartInstance.current = new window.Chart(expenseChartRef.current, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: dataValues,
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' }
          },
          cutout: '70%'
        }
      });
    }

    // 6 Month Trend Chart
    if (trendChartRef.current) {
      if (trendChartInstance.current) trendChartInstance.current.destroy();

      const months = [];
      const incomeData = [];
      const expenseData = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthLabel = d.toLocaleString('default', { month: 'short' });
        months.push(i === 0 ? 'This Month' : monthLabel);

        const targetMonthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        let incSum = 0;
        let expSum = 0;

        txs.forEach((tx) => {
          if (tx.date && tx.date.substring(0, 7) === targetMonthStr) {
            const amt = parseFloat(tx.amount) || 0;
            if (tx.type === 'income') incSum += amt;
            else expSum += amt;
          }
        });

        if (incSum === 0 && expSum === 0) {
          const baseIncome = [38000, 42000, 40000, 45000, 43000, 45000];
          const baseExpense = [24000, 31000, 29000, 34000, 27000, 25000];
          incomeData.push(baseIncome[5 - i]);
          expenseData.push(baseExpense[5 - i]);
        } else {
          incomeData.push(incSum);
          expenseData.push(expSum);
        }
      }

      trendChartInstance.current = new window.Chart(trendChartRef.current, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Income (₹)',
              data: incomeData,
              borderColor: '#2ecc71',
              backgroundColor: 'rgba(46,204,113,0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Expense (₹)',
              data: expenseData,
              borderColor: '#e74c3c',
              backgroundColor: 'rgba(231,76,60,0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }

  const scoreBorderColor =
    healthScore === 0 ? '#95a5a6' : healthScore >= 80 ? '#2ecc71' : healthScore >= 50 ? '#f39c12' : '#e74c3c';

  return (
    <div className="dashboard-body">
      <DashboardNav />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h2>Reports &amp; Analytics</h2>
            <p>Visualize your financial habits and monitor your financial health score.</p>
          </div>
          <Link to="/profile" className="header-profile-link" title="Click to manage Profile & Settings">
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

        {/* Top Row: Expense Doughnut + Health Score */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', marginBottom: '25px' }}>
          
          {/* Expenses Chart */}
          <div style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
              <i className="fa-solid fa-chart-pie" style={{ color: 'var(--secondary-color)' }}></i> Expenses by Category
            </h3>
            <div style={{ position: 'relative', height: '280px', width: '100%' }}>
              <canvas ref={expenseChartRef}></canvas>
            </div>
          </div>

          {/* Health Score Card */}
          <div style={{
            background: 'linear-gradient(135deg, #fcfbf9, #f4eee2)',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <h3 style={{ border: 'none', marginBottom: '16px', fontSize: '1.2rem', color: 'var(--primary-color)' }}>
              Financial Health Score
            </h3>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              boxShadow: '0 10px 30px rgba(201,159,85,0.2)',
              marginBottom: '20px',
              border: `8px solid ${scoreBorderColor}`,
              transition: 'border-color 0.3s'
            }}>
              <div style={{ fontSize: '2.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'var(--primary-color)', lineHeight: 1 }}>
                {healthScore}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                Out of 100
              </div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: scoreBorderColor, marginBottom: '8px' }}>
              {healthStatus}
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-light)', padding: '0 15px', maxWidth: '340px' }}>
              {healthDesc}
            </p>
          </div>
        </div>

        {/* Bottom Row: 6 Month Trend + AI Insights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          
          {/* Trend Chart */}
          <div style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
              <i className="fa-solid fa-chart-line" style={{ color: 'var(--secondary-color)' }}></i> Income vs Expense (Last 6 Months)
            </h3>
            <div style={{ position: 'relative', height: '280px', width: '100%' }}>
              <canvas ref={trendChartRef}></canvas>
            </div>
          </div>

          {/* AI Insights Card */}
          <div style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
              <i className="fa-solid fa-lightbulb" style={{ color: 'var(--secondary-color)' }}></i> AI Financial Insights
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {insights.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: idx === insights.length - 1 ? 'none' : '1px solid #eee'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0,
                    background:
                      item.type === 'warning'
                        ? 'rgba(231,76,60,0.1)'
                        : item.type === 'success'
                        ? 'rgba(46,204,113,0.1)'
                        : 'rgba(52,152,219,0.1)',
                    color:
                      item.type === 'warning' ? '#e74c3c' : item.type === 'success' ? '#2ecc71' : '#3498db'
                  }}>
                    <i className={item.icon}></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', marginBottom: '4px', color: 'var(--primary-color)' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

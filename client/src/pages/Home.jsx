import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const features = [
  { icon: 'fa-solid fa-money-bill-transfer', title: 'Income & Expense', desc: 'Easily log and track all your daily income sources and expenses in one place.' },
  { icon: 'fa-solid fa-wallet', title: 'Budget Planner', desc: 'Create personalized monthly budgets and set spending limits to manage money effectively.' },
  { icon: 'fa-solid fa-bullseye', title: 'Savings Goal Tracker', desc: 'Set specific financial goals (like buying a car or emergency fund) and track your progress.' },
  { icon: 'fa-solid fa-robot', title: 'AI Chatbot & Prediction', desc: 'Get personalized financial advice and savings predictions driven by advanced machine learning.' },
  { icon: 'fa-solid fa-building-columns', title: 'Govt Schemes', desc: 'Explore financial schemes dedicated to women and learn how to easily apply for them.' },
  { icon: 'fa-solid fa-book-open-reader', title: 'Education Hub', desc: 'Access curated articles and video tutorials to boost your financial literacy step by step.' },
  { icon: 'fa-solid fa-heart-pulse', title: 'Financial Health Score', desc: 'Get a quick, clear analysis of your overall financial well-being based on your saving and spending habits.' },
  { icon: 'fa-solid fa-chart-pie', title: 'Dashboard & Analytics', desc: 'A secure, personalized dashboard that visualizes your financial data with beautiful charts and reports.' },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Your Journey to <br /><span>Financial Freedom.</span></h1>
            <p>Empowering women with smart money management, personalized budgeting tools, government scheme guidance, and AI-driven wealth building.</p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started Today <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <a href="#features" className="btn-text">Learn More</a>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop" alt="Smiling professional woman with a tablet" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-title">
            <h2>Everything you need in one place</h2>
            <p>Simple, secure, and powerful tools designed for your financial well-being.</p>
          </div>
          <div className="feature-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="icon"><i className={f.icon}></i></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container about-container">
          <div className="about-image">
            <img src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Women collaborating on finances" />
          </div>
          <div className="about-content">
            <h2>About SheFinance</h2>
            <p>Many women face challenges in managing personal finances due to scattered resources. SheFinance bridges that gap by bringing budgeting tools, AI guidance, and financial education into one unified platform.</p>
            <div className="support-box" id="support">
              <h3><i className="fa-solid fa-headset"></i> Need Help?</h3>
              <p>Our support team is here to guide you through your financial journey. Reach out anytime.</p>
              <a href="#" className="btn btn-outline">Contact Support</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

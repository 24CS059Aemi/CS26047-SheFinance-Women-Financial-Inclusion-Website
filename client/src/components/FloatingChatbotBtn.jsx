import { Link, useLocation } from 'react-router-dom';

export default function FloatingChatbotBtn() {
  const location = useLocation();

  const token = localStorage.getItem('token');
  const hiddenPages = ['/', '/login', '/register', '/onboarding', '/chatbot', '/admin'];

  // Hide button if user is unauthenticated or on Home/Login/Register/Chatbot pages
  if (!token || hiddenPages.includes(location.pathname)) {
    return null;
  }

  return (
    <Link 
      to="/chatbot" 
      className="floating-ai-fab"
      title="Click to open SheFinance AI Assistant"
      aria-label="Ask SheFinance AI"
    >
      <div className="fab-icon-wrapper">
        <i className="fa-solid fa-robot"></i>
        <span className="fab-sparkle-badge"><i className="fa-solid fa-sparkles"></i></span>
      </div>
      <span className="fab-tooltip">Ask AI</span>
    </Link>
  );
}

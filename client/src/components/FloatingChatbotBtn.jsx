import { Link, useLocation } from 'react-router-dom';

export default function FloatingChatbotBtn() {
  const location = useLocation();

  // Hide button if already on Chatbot page or Auth/Onboarding pages
  if (location.pathname === '/chatbot' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/onboarding') {
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

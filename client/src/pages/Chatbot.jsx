import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DashboardNav from '../components/DashboardNav';

const QUICK_QUESTIONS = [
  'Calculate SIP of 5000 for 5 years at 12%',
  'Show 50 30 20 budget for 50000 salary',
  'What government schemes are available for women?',
  'How to build an emergency fund?',
  'Calculate EMI for 500000 loan at 10% for 3 years',
  'Best investment options for beginners',
];

const WELCOME_MSG = {
  role: 'bot',
  text: 'Hello! 👋 I am **SheFinance AI**, your intelligent financial advisor powered by Machine Learning & Grok Math Engine. I can assist you with:\n\n• 💡 Budgeting strategies & 50/30/20 rule\n• 🧮 SIP, EMI, Compound Interest calculations\n• 🏛️ Government schemes for women\n• 📈 Investment basics & savings tips\n• ⚡ Debt management strategies\n\nHow can I help you today?',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n• /g, '<br/>• ')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function Chatbot() {
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('User');
  const [avatar, setAvatar] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(() => Date.now().toString());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'User';
    const formatted = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setUserName(formatted);
    const saved = localStorage.getItem('userAvatar');
    setAvatar(saved || `https://ui-avatars.com/api/?name=${encodeURIComponent(formatted)}&background=c99f55&color=fff`);
    try {
      const hist = JSON.parse(localStorage.getItem('sheFinanceChatHistory') || '[]');
      setChatHistory(hist);
    } catch { }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text) {
    const msgText = text || input.trim();
    if (!msgText || loading) return;
    setInput('');

    const userMsg = { role: 'user', text: msgText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const groqKey = localStorage.getItem('groqApiKey') || '';
      const res = await fetch('/api/chatbot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText, user_profile: profile, api_key: groqKey }),
      });
      const data = await res.json();
      const botMsg = {
        role: 'bot',
        text: data.reply || 'Sorry, I could not understand that.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: data.intent, confidence: data.confidence, algorithm: data.algorithm,
        suggestions: data.suggested_questions,
      };
      setMessages(prev => {
        const updated = [...prev, botMsg];
        saveChat(updated, msgText);
        return updated;
      });
    } catch {
      const botMsg = {
        role: 'bot',
        text: '⚠️ **Connection Error**: Could not reach the SheFinance AI server. Please ensure the Python backend is running on port 5000.\n\n**Quick Tip:** Run `python app.py` in your project folder to start the AI engine.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  function saveChat(msgs, firstMsg) {
    try {
      const hist = JSON.parse(localStorage.getItem('sheFinanceChatHistory') || '[]');
      const existing = hist.findIndex(h => h.id === currentChatId);
      const entry = {
        id: currentChatId,
        title: firstMsg.length > 40 ? firstMsg.substring(0, 40) + '...' : firstMsg,
        messages: msgs,
        date: new Date().toLocaleDateString('en-IN'),
      };
      if (existing >= 0) hist[existing] = entry;
      else hist.unshift(entry);
      localStorage.setItem('sheFinanceChatHistory', JSON.stringify(hist.slice(0, 20)));
      setChatHistory(hist.slice(0, 20));
    } catch { }
  }

  function startNewChat() {
    setCurrentChatId(Date.now().toString());
    setMessages([WELCOME_MSG]);
    setInput('');
  }

  function loadChat(entry) {
    setCurrentChatId(entry.id);
    setMessages(entry.messages);
  }

  function clearHistory() {
    localStorage.removeItem('sheFinanceChatHistory');
    setChatHistory([]);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div className="dashboard-body">
      <DashboardNav />
      <main className="dashboard-main" style={{ padding: '30px 40px' }}>
        <header className="dashboard-header" style={{ marginBottom: '25px' }}>
          <div className="header-title">
            <h2>SheFinance AI 🤖</h2>
            <p>Ask anything about budgeting, investments, government schemes, or debt management.</p>
          </div>
          <Link to="/profile" className="header-profile-link">
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

        <div className="chatbot-wrapper">
          {/* Chat History Sidebar */}
          <div className="chat-history-sidebar">
            <div className="chat-history-header">
              <h3>Chat History</h3>
              <button className="new-chat-btn" onClick={startNewChat} title="New Chat">
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
            <div className="chat-history-list">
              {chatHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 15px', color: '#aaa' }}>
                  <i className="fa-solid fa-comments" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
                  <p style={{ fontSize: '0.85rem' }}>No chat history yet.</p>
                </div>
              ) : (
                chatHistory.map(entry => (
                  <div key={entry.id} className={`chat-history-item ${entry.id === currentChatId ? 'active' : ''}`} onClick={() => loadChat(entry)}
                    style={{ padding: '12px 15px', borderRadius: '10px', cursor: 'pointer', marginBottom: '4px', background: entry.id === currentChatId ? 'rgba(201,159,85,0.1)' : 'transparent', borderLeft: entry.id === currentChatId ? '3px solid var(--secondary-color)' : '3px solid transparent', transition: 'all 0.2s' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 500, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#aaa' }}>{entry.date}</p>
                  </div>
                ))
              )}
            </div>
            {chatHistory.length > 0 && (
              <div style={{ padding: '15px', borderTop: '1px solid #eee' }}>
                <button onClick={clearHistory} style={{ width: '100%', padding: '8px', background: 'rgba(231,76,60,0.08)', color: '#e74c3c', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', fontWeight: 600 }}>
                  <i className="fa-solid fa-trash" style={{ marginRight: '6px' }}></i> Clear History
                </button>
              </div>
            )}
          </div>

          {/* Chat Main Area */}
          <div className="chatbot-card">
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-header-icon"><i className="fa-solid fa-robot"></i></div>
                <div className="chatbot-header-text">
                  <h3>SheFinance AI</h3>
                  <p><span className="status-dot"></span> Online • Intelligent Financial Assistant</p>
                </div>
              </div>
              <div className="chatbot-header-badge">
                <span style={{ padding: '4px 12px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.4)', color: 'white', borderRadius: '20px' }}>
                  <i className="fa-solid fa-microchip"></i> AI Powered
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                  {msg.role === 'bot' && (
                    <div className="chat-avatar bot-avatar"><i className="fa-solid fa-robot"></i></div>
                  )}
                  <div className="bubble-content">
                    <div className="bubble-text" dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}></div>
                    {msg.role === 'bot' && msg.algorithm && (
                      <div className="bubble-meta">
                        <i className="fa-solid fa-microchip"></i> {msg.algorithm}
                        {msg.confidence && <> • Confidence: {(msg.confidence * 100).toFixed(0)}%</>}
                      </div>
                    )}
                    {msg.role === 'bot' && msg.suggestions && (
                      <div className="chat-suggestions">
                        {msg.suggestions.map((s, si) => (
                          <button key={si} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
                        ))}
                      </div>
                    )}
                    <span className="bubble-time">{msg.time}</span>
                  </div>
                  {msg.role === 'user' && (
                    <div className="chat-avatar user-avatar"><img src={avatar} alt="You" /></div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="chat-bubble bot-bubble">
                  <div className="chat-avatar bot-avatar"><i className="fa-solid fa-robot"></i></div>
                  <div className="bubble-content">
                    <div className="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Suggested Prompts */}
            <div className="quick-prompts-section">
              <div className="quick-prompts-title"><i className="fa-solid fa-sparkles" style={{ color: 'var(--secondary-color)', marginRight: '6px' }}></i> Suggested Prompts</div>
              <div className="quick-prompt-pills">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} className="prompt-pill" onClick={() => sendMessage(q)}>{q}</button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="chat-input-area">
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Ask me anything about finance... (Press Enter to send)"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                style={{ resize: 'none' }}
              />
              <button className="chat-send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* SheFinance Reusable Floating AI Chatbot Widget */
(function() {
    document.addEventListener("DOMContentLoaded", function() {
        // Do not insert floating widget on the full chatbot.html page
        if (window.location.pathname.endsWith("chatbot.html")) {
            return;
        }

        // 1. Inject Floating Trigger Button and Floating Window HTML
        var widgetContainer = document.createElement("div");
        widgetContainer.id = "shefinance-floating-widget-root";
        widgetContainer.innerHTML = `
            <!-- Floating Launcher Button -->
            <button id="floating-chat-trigger" class="floating-chat-trigger" title="Ask SheFinance AI Assistant">
                <i class="fa-solid fa-robot"></i>
            </button>

            <!-- Floating Chat Window -->
            <div id="floating-chat-box" class="floating-chat-box">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-header-icon" style="width:38px; height:38px; font-size:1.1rem;">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div class="chatbot-header-text">
                            <h3 style="font-size:1.05rem;">SheFinance AI</h3>
                            <p style="font-size:0.75rem;"><span class="status-dot"></span> Intelligent Financial Assistant</p>
                        </div>
                    </div>
                    <button id="close-floating-chat" style="background:none; border:none; color:#a0b2bd; font-size:1.2rem; cursor:pointer;" title="Close Chat">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div class="chat-messages" id="floating-chat-messages" style="padding:15px; gap:12px;">
                    <div class="chat-bubble bot-bubble" style="font-size:0.88rem; padding:12px 15px;">
                        Hi! 👋 I'm <strong>SheFinance AI</strong>. How can I assist your financial journey today?
                        <div class="chat-meta"><span>SheFinance AI</span></div>
                    </div>
                </div>

                <div class="quick-prompts-section" style="padding:8px 12px;">
                    <div class="quick-prompt-pills" id="floating-quick-prompts">
                        <button class="prompt-pill" style="font-size:0.75rem; padding:4px 10px;" onclick="window.sendFloatingPrompt('How to budget?')">💡 Budgeting</button>
                        <button class="prompt-pill" style="font-size:0.75rem; padding:4px 10px;" onclick="window.sendFloatingPrompt('Women government schemes')">🏛️ Schemes</button>
                        <button class="prompt-pill" style="font-size:0.75rem; padding:4px 10px;" onclick="window.sendFloatingPrompt('How to start SIP?')">📈 Investing</button>
                    </div>
                </div>

                <form class="chat-input-area" id="floating-chat-form" style="padding:10px 15px;" onsubmit="window.handleFloatingSubmit(event)">
                    <input type="text" id="floating-user-input" placeholder="Ask AI financial bot..." autocomplete="off" style="padding:10px 15px; font-size:0.88rem;">
                    <button type="submit" class="chat-send-btn" style="width:38px; height:38px; font-size:0.95rem;">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(widgetContainer);

        // 2. Toggle Behavior
        var triggerBtn = document.getElementById("floating-chat-trigger");
        var chatBox = document.getElementById("floating-chat-box");
        var closeBtn = document.getElementById("close-floating-chat");

        triggerBtn.addEventListener("click", function() {
            chatBox.classList.toggle("active");
        });

        closeBtn.addEventListener("click", function() {
            chatBox.classList.remove("active");
        });
    });

    // Helper functions on window
    window.handleFloatingSubmit = function(e) {
        e.preventDefault();
        var inputEl = document.getElementById("floating-user-input");
        var msg = inputEl.value.trim();
        if (!msg) return;
        inputEl.value = "";
        window.sendFloatingPrompt(msg);
    };

    window.sendFloatingPrompt = function(msgText) {
        var msgContainer = document.getElementById("floating-chat-messages");
        
        // Append user bubble
        var userDiv = document.createElement("div");
        userDiv.className = "chat-bubble user-bubble";
        userDiv.style.fontSize = "0.88rem";
        userDiv.style.padding = "10px 14px";
        userDiv.innerHTML = escapeHtml(msgText);
        msgContainer.appendChild(userDiv);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        // Append loading
        var loadingDiv = document.createElement("div");
        loadingDiv.id = "floating-typing";
        loadingDiv.className = "chat-bubble bot-bubble";
        loadingDiv.style.fontSize = "0.85rem";
        loadingDiv.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...`;
        msgContainer.appendChild(loadingDiv);
        msgContainer.scrollTop = msgContainer.scrollHeight;

        var grokKey = localStorage.getItem('grok_api_key') || '';

        fetch("http://127.0.0.1:5000/api/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msgText, user_profile: profileData, grok_api_key: grokKey })
        })
        .then(res => res.json())
        .then(data => {
            var loader = document.getElementById("floating-typing");
            if (loader) loader.remove();
            
            var botDiv = document.createElement("div");
            botDiv.className = "chat-bubble bot-bubble";
            botDiv.style.fontSize = "0.88rem";
            botDiv.style.padding = "10px 14px";

            var text = (data.status === "success" ? data.reply : getLocalFallback(msgText))
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            botDiv.innerHTML = text;
            msgContainer.appendChild(botDiv);
            msgContainer.scrollTop = msgContainer.scrollHeight;
        })
        .catch(err => {
            var loader = document.getElementById("floating-typing");
            if (loader) loader.remove();

            var botDiv = document.createElement("div");
            botDiv.className = "chat-bubble bot-bubble";
            botDiv.style.fontSize = "0.88rem";
            botDiv.style.padding = "10px 14px";
            botDiv.innerHTML = getLocalFallback(msgText).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            msgContainer.appendChild(botDiv);
            msgContainer.scrollTop = msgContainer.scrollHeight;
        });
    };

    function getLocalFallback(userMessage) {
        var q = userMessage.toLowerCase();
        if (q.includes("budget") || q.includes("spend")) {
            return "💡 **50/30/20 Rule:** 50% Needs, 30% Wants, 20% Savings. Track expenses in your SheFinance Tracker!";
        } else if (q.includes("scheme") || q.includes("mudra") || q.includes("loan")) {
            return "🏛️ **Mudra Loan:** Collateral-free business loans up to ₹10 Lakhs for women entrepreneurs!";
        } else if (q.includes("invest") || q.includes("sip")) {
            return "📈 **Investing:** Start small with ₹500/month index mutual fund SIPs for wealth growth.";
        }
        return "Hello! I am SheFinance AI. Ask me about budget planning, savings goals, or government schemes!";
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
})();

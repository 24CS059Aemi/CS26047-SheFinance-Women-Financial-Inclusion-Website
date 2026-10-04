const express = require('express');
const router = express.Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODELS = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];

const SYSTEM_PROMPT = `You are "SheFinance AI", an intelligent, warm, and empowering financial advisor chatbot for women in India.

CRITICAL FORMATTING & STRUCTURE RULES — FOLLOW STRICTLY:

1. ABSOLUTELY NO LATEX — ZERO TOLERANCE:
   - NEVER use backslash notation: no \\(...\\), no \\[...\\], no \\frac{}{}, no \\text{}, no \\times, no \\div
   - NEVER wrap math in dollar signs: no $...$ or $$...$$
   - ALL math must be written as plain Unicode text using:
     × for multiply, ÷ for divide, ^ for power, ₹ for rupees, % for percent
   - CORRECT formula format:
     EMI = [P × r × (1 + r)^n] ÷ [(1 + r)^n - 1]
   - CORRECT calculation step format:
     • Monthly Rate (r) = 12% ÷ 12 ÷ 100 = 0.01
     • Months (n) = 5 × 12 = 60
     • (1 + 0.01)^60 ≈ 1.8194
     • EMI = ₹10,367

2. RESPONSE COMPLETENESS:
   - Always complete your response. Never cut off mid-sentence.
   - Keep responses concise but complete.

3. MATCH USER INTENT:
   - Greetings ("hi", "hello", "namaste"): 2-3 warm sentences only.
   - Math/calculation queries: structured response with headings, bullet points, tables.

4. TONE:
   - Friendly, encouraging, empowering.
   - Support English, Gujarati, Hindi, or Hinglish.`;

function generateSuggestedQuestions(userQuery) {
  const q = (userQuery || '').toLowerCase();
  if (q.includes('sip') || q.includes('invest') || q.includes('mutual fund')) {
    return [
      'Calculate SIP of ₹3,000 for 5 years at 12%',
      'What are the best low-risk investments for beginners?',
      'Difference between PPF and Mutual Funds'
    ];
  } else if (q.includes('scheme') || q.includes('government') || q.includes('mudra') || q.includes('yojana')) {
    return [
      'How to apply for Mudra Loan without collateral?',
      'Benefits of Mahila Samman Savings Certificate',
      'What is Lakhpati Didi scheme for women SHGs?'
    ];
  } else if (q.includes('budget') || q.includes('salary') || q.includes('50') || q.includes('expense')) {
    return [
      'Show 50/30/20 budget for ₹40,000 monthly income',
      'How can a homemaker save from household expenses?',
      'Simple tips to track daily expenses'
    ];
  } else if (q.includes('emi') || q.includes('loan') || q.includes('debt')) {
    return [
      'Calculate EMI for ₹3 Lakh loan at 10.5% for 3 years',
      'How does the Debt Snowball method work?',
      'How to improve my credit (CIBIL) score?'
    ];
  }
  return [
    'Calculate SIP of ₹5,000 for 5 years',
    'Which government schemes are best for women?',
    'How to build an emergency fund from scratch?'
  ];
}

async function callGroqWithFallback(messages, apiKey) {
  let lastError = null;

  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
          'User-Agent': 'Mozilla/5.0'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.5,
          max_tokens: 800,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Groq model ${model} failed (${response.status}):`, errorText);
        lastError = new Error(`Groq ${model} error: ${response.status}`);
        continue;
      }

      const data = await response.json();
      let text = data.choices?.[0]?.message?.content || '';

      // Strip internal <think>...</think> reasoning blocks if any
      text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

      // ── Server-side LaTeX sanitization (safety net) ──────────────────────
      // Remove \(...\) and \[...\] wrappers, keep inner content
      text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => inner.trim());
      text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => inner.trim());
      // Remove \frac{a}{b} → (a ÷ b)
      text = text.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1 ÷ $2)');
      // Remove other common LaTeX commands
      text = text.replace(/\\(text|mathrm|mathbf|mathit|times|div|cdot|approx|geq|leq)\b/g, (_, cmd) => {
        const map = { times: '×', div: '÷', cdot: '·', approx: '≈', geq: '≥', leq: '≤' };
        return map[cmd] || '';
      });
      // Remove any remaining lone backslashes before letters
      text = text.replace(/\\([a-zA-Z]+)/g, '$1');
      // Remove $...$ and $$...$$ math wrappers
      text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => inner.trim());
      text = text.replace(/\$([^$\n]+?)\$/g, (_, inner) => inner.trim());
      // ─────────────────────────────────────────────────────────────────────

      if (text) {
        return { text, model };
      }
    } catch (err) {
      console.warn(`Groq model ${model} fetch exception:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Groq models failed to return a response.');
}

// ─── POST /api/chatbot ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { message, user_profile, api_key } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        status: 'error',
        reply: 'Please ask a question to get financial advice or calculations.'
      });
    }

    const apiKey = (api_key && api_key.trim()) || process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        status: 'error',
        reply: '⚠️ **Groq API Key Not Configured**: Please ensure `GROQ_API_KEY` is set in your `.env` file.'
      });
    }

    // Build context
    let profileContext = '';
    if (user_profile && typeof user_profile === 'object') {
      const parts = [];
      if (user_profile.occupation) parts.push(`Occupation: ${user_profile.occupation}`);
      if (user_profile.income || user_profile.incomeRange) parts.push(`Monthly Income: ₹${user_profile.income || user_profile.incomeRange}`);
      if (user_profile.financialGoal) parts.push(`Primary Goal: ${user_profile.financialGoal}`);
      if (user_profile.literacyLevel) parts.push(`Financial Literacy: ${user_profile.literacyLevel}`);
      if (parts.length > 0) {
        profileContext = `\n[User Profile Context: ${parts.join(', ')}]`;
      }
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `${message.trim()}${profileContext}` }
    ];

    const result = await callGroqWithFallback(messages, apiKey);

    return res.json({
      status: 'success',
      reply: result.text,
      intent: 'shefinance_ai_advisory',
      confidence: 0.99,
      algorithm: 'SheFinance AI Engine',
      suggested_questions: generateSuggestedQuestions(message)
    });
  } catch (err) {
    console.error('Chatbot API error:', err);
    return res.status(500).json({
      status: 'error',
      reply: '⚠️ **Service Notice**: Unable to connect to SheFinance AI engine at the moment. Please check your network connection and try again.',
      error: err.message
    });
  }
});

module.exports = router;

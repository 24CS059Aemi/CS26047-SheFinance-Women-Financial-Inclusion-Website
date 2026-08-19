import sys
import subprocess
import os

# ----------------------------------------------------
# Auto-Install Dependencies if missing
# ----------------------------------------------------
def install_dependencies():
    packages = {
        "flask": "flask",
        "flask-cors": "flask_cors",
        "pandas": "pandas",
        "scikit-learn": "sklearn"
    }
    for pkg, imp in packages.items():
        try:
            __import__(imp)
        except ImportError:
            print(f"Installing missing dependency: {pkg}...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])
            except Exception as e:
                print(f"Failed to install {pkg}. Error: {e}")

install_dependencies()

# ----------------------------------------------------
# Imports
# ----------------------------------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from frontend HTML pages

CSV_PATH = 'mock_savings_data.csv'

# ----------------------------------------------------
# ML NLP Chatbot Model Definition & Training Data
# ----------------------------------------------------
TRAINING_DATA = [
    # Greeting
    {"intent": "greeting", "pattern": "hi hello hey good morning good evening namaste who are you what can you do help me start greetings intro chatbot"},
    {"intent": "greeting", "pattern": "hello shefinance bot what is your role assist me hi there"},
    
    # Budgeting
    {"intent": "budgeting_advice", "pattern": "how to create a budget 50 30 20 rule expense tracking monthly budget guidance control spending manage money limit spending"},
    {"intent": "budgeting_advice", "pattern": "tips to cut down expenses household budget budget planner recommendations how to save on groceries discretionary expenses"},
    
    # Government Schemes
    {"intent": "government_schemes", "pattern": "government financial schemes for women sukanya samriddhi yojana mudra loan stand up india mahila samriddhi female subsidies government support"},
    {"intent": "government_schemes", "pattern": "what schemes are available for women entrepreneurs small business loans govt aid funding for female business lakhpati didi"},
    
    # Emergency Fund
    {"intent": "emergency_fund", "pattern": "what is an emergency fund how much emergency savings should i have rainy day fund unexpected expenses medical emergency liquid savings"},
    {"intent": "emergency_fund", "pattern": "how to build safety net emergency money savings deposit cash reserve"},
    
    # Investments & SIP
    {"intent": "investments_basics", "pattern": "how to invest money SIP systematic investment plan mutual funds stocks gold bond sovereign gold PPF public provident fund safe investment beginners"},
    {"intent": "investments_basics", "pattern": "where to invest small amount high return safe investment options for women wealth creation compounding interest"},
    
    # Savings Strategies
    {"intent": "savings_strategies", "pattern": "how to save more money monthly savings habit fixed deposit recurring deposit FD RD interest rate passive savings"},
    {"intent": "savings_strategies", "pattern": "tips for saving extra cash increment savings goal peer savings benchmarking auto savings"},
    
    # Debt & Loans
    {"intent": "debt_management", "pattern": "how to clear loans pay off credit card debt debt snowball debt avalanche reduce EMI interest loan repayment balance transfer"},
    {"intent": "debt_management", "pattern": "debt freedom strategies managing personal loan liabilities borrow smart high interest rate"},
    
    # Financial Health Score
    {"intent": "financial_health_score", "pattern": "what is financial health score CIBIL score credit score how to calculate health score improve financial score rating"},
    
    # Homemaker Finance
    {"intent": "homemaker_finance", "pattern": "financial advice for homemakers house wife savings pocket money control household budget financial independence at home savings from kitchen budget"},
    
    # Student Finance
    {"intent": "student_finance", "pattern": "financial guidance for female students pocket money savings college budget student emergency fund pocket allowance daily expenses student investment"},
    
    # Tax Planning
    {"intent": "tax_planning", "pattern": "tax saving tips for working women section 80C income tax rebate standard deduction tax return filing saving tax legally tax exemptions"},
    
    # Financial Mathematics & Calculations
    {"intent": "financial_mathematics", "pattern": "calculate math formula mathematics sip return emi calculator compound interest 50 30 20 math salary breakdown calculation steps equations grok api"}
]

RESPONSES = {
    "greeting": "Hello! 👋 I am **SheFinance AI**, your intelligent financial advisor powered by Machine Learning & Grok Math Engine. I can assist you with budgeting strategies, detailed mathematical calculations (SIP, EMI, compound interest, 50/30/20 breakdown), investment basics, government schemes for women, debt management, and emergency savings. How can I help you today?",
    "budgeting_advice": "💡 **Smart Budgeting Tip (50/30/20 Rule):**\n• **50% Needs:** Rent, groceries, utilities, and essential bills.\n• **30% Wants:** Dining out, shopping, hobbies, and leisure.\n• **20% Savings:** Emergency funds, SIPs, and goal savings.\n\nTry asking me: *'Calculate 50 30 20 budget for 50000 salary'* for an exact step-by-step mathematical breakdown!",
    "government_schemes": "🏛️ **Top Government Financial Schemes for Women:**\n1. **Sukanya Samriddhi Yojana (SSY):** High-interest savings scheme for girl children.\n2. **Mudra Yojana for Women:** Collateral-free business loans up to ₹10 Lakhs.\n3. **Stand-Up India:** Credit facility between ₹10 Lakh to ₹1 Crore for women entrepreneurs.\n4. **Mahila Samman Savings Certificate:** Fixed interest scheme with partial withdrawal flexibility.",
    "emergency_fund": "🛡️ **Emergency Fund Benchmark:**\nFinancial experts recommend keeping **3 to 6 months of living expenses** in a liquid savings account or liquid mutual fund. Never invest emergency money in volatile stocks or locked-in assets!",
    "investments_basics": "📈 **Beginner Investment Roadmap:**\n1. **Low Risk:** Public Provident Fund (PPF), Fixed Deposits (FD), Sovereign Gold Bonds (SGB).\n2. **Moderate Risk:** Index Mutual Funds & SIPs (Systematic Investment Plans starting at ₹500/month).\n3. **Rule of Thumb:** Invest early to leverage the power of compound interest! Try asking: *'Calculate SIP of 5000 for 5 years at 12%'*.",
    "savings_strategies": "💰 **Practical Savings Boosters:**\n• **Pay Yourself First:** Automate 15-20% of your income into savings on salary day.\n• **24-Hour Rule:** Wait 24 hours before making impulse non-essential purchases.\n• **Recurring Deposits (RD):** Set up monthly auto-debits into high-yield RDs.",
    "debt_management": "⚡ **Debt Repayment Strategies:**\n• **Snowball Method:** Pay off the smallest debt first for psychological wins.\n• **Avalanche Method:** Pay off the highest interest loan first to minimize total interest paid.\n• Avoid paying only minimum dues on credit cards (interest can reach 40%+ per year)! Try: *'Calculate EMI for 5 lakh loan at 10% for 3 years'*.",
    "financial_health_score": "📊 **Understanding Your Health Score:**\nYour SheFinance Health Score is computed based on your Savings Ratio (>20% = +30 pts), Budget Adherence (within limit = +20 pts), and Income-to-Expense ratio. Aim for a score above 80/100!",
    "homemaker_finance": "🏠 **Homemaker Financial Empowerment:**\n• Maintain an independent bank account in your own name.\n• Use digital envelope budgeting for daily household expenses.\n• Explore Mahila Samman Savings Certificate for high-yield savings from household reserves.",
    "student_finance": "🎓 **Student Savings Guide:**\n• Track every small expense (canteen, stationery, transport) using our **Income & Expense Tracker**.\n• Save at least ₹500-₹1,000 every month from allowance into a high-interest savings account.",
    "tax_planning": "📝 **Tax Saving Tips for Working Women:**\n• Utilize Section 80C limits (up to ₹1.5 Lakhs) via ELSS Mutual Funds, PPF, or EPF.\n• Claim Section 80D deductions for health insurance premiums for yourself and parents.",
    "financial_mathematics": "🧮 **Financial Mathematics Engine:**\nI can calculate exact step-by-step mathematical formulas for your finances!\n\n**Try asking:**\n• *'Calculate SIP of 5000 for 5 years at 12%'*\n• *'Calculate EMI for 500000 loan at 10.5% for 3 years'*\n• *'Show 50 30 20 budget for 60000 salary'*\n• *'Calculate compound interest on 100000 at 7.5% for 3 years'*"
}

SUGGESTIONS = {
    "greeting": ["Calculate SIP of 5000 for 5 years", "Show 50 30 20 budget for 50k", "What schemes are available for women?"],
    "budgeting_advice": ["Calculate 50 30 20 budget for 60k salary", "How to track daily expenses?", "Calculate health score"],
    "government_schemes": ["Tell me about Mudra Loan", "What is Sukanya Samriddhi?", "Schemes for small business"],
    "emergency_fund": ["Where to store emergency fund?", "How to set up savings goal?", "How much should I save?"],
    "investments_basics": ["Calculate SIP of 5000 at 12%", "Low risk investment options", "Gold bond vs Mutual funds"],
    "savings_strategies": ["Calculate compound interest on 1 lakh", "Automated savings tips", "Set savings goal"],
    "debt_management": ["Calculate EMI for 500000 loan", "Debt snowball vs avalanche", "Manage high EMI"],
    "financial_health_score": ["How is score calculated?", "Improve health score", "View dashboard summary"],
    "homemaker_finance": ["Savings tips for housewives", "Mahila Samman Scheme", "Open personal bank account"],
    "student_finance": ["Manage pocket money", "Student budget tips", "Start investing with ₹500"],
    "tax_planning": ["Section 80C tax math", "ELSS vs PPF for tax", "Health insurance tax benefit"],
    "financial_mathematics": ["Calculate SIP of 10000 for 10 yrs", "Calculate EMI for 10 lakh loan", "50 30 20 budget math for 80k"]
}

# ----------------------------------------------------
# Grok API & Mathematical Financial Solver Integration
# ----------------------------------------------------
# Groq API Integration (FREE - Llama 3 Model)
# ----------------------------------------------------
import urllib.request
import urllib.parse
import json
import os

def call_grok_api(prompt_text, user_profile=None, custom_api_key=None):
    api_key = custom_api_key or os.environ.get("GROQ_API_KEY")
    if not api_key:
        return None

    url = "https://api.groq.com/openai/v1/chat/completions"
    occ = user_profile.get("occupation", "women financial user") if user_profile else "women financial user"

    system_prompt = (
        "You are SheFinance AI, an intelligent and friendly financial advisor chatbot. "
        "Answer ANY question asked by the user clearly, accurately and helpfully — just like Gemini or ChatGPT. "
        "For financial math questions (SIP, EMI, 50/30/20 budgeting, compound interest, tax saving), provide step-by-step calculations with exact formulas. "
        "For general or educational questions, give well-structured, easy-to-understand answers in markdown format."
    )

    payload = {
        "model": "qwen/qwen3.6-27b",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"User Occupation: {occ}\nQuestion: {prompt_text}"}
        ],
        "temperature": 0.4,
        "max_tokens": 2048
    }

    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key.strip()}",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            raw = res_data["choices"][0]["message"]["content"]
            # Strip internal <think>...</think> reasoning blocks
            import re as _re
            clean = _re.sub(r'<think>.*?</think>', '', raw, flags=_re.DOTALL).strip()
            return clean if clean else raw
    except Exception as e:
        print(f"Groq API error: {e}")
        return None


def solve_financial_math(cleaned_text, raw_text):
    """
    Mathematical Financial Engine: Extracts numbers and context from user query
    and computes exact step-by-step mathematical formulas for SIP, EMI, 50/30/20 Budget, and Compound Interest.
    """
    text = raw_text.lower()
    numbers = [float(num) for num in re.findall(r'\d+(?:\.\d+)?', text)]
    
    # Helper to find numbers following specific keywords
    def find_num_after(keywords):
        for kw in keywords:
            match = re.search(rf'{kw}\s*:?\s*(\d+(?:\.\d+)?)', text)
            if match:
                return float(match.group(1))
        return None

    # 1. SIP Return Math
    if any(k in text for k in ["sip", "systematic investment", "mutual fund return", "invest return"]):
        p_val = find_num_after(["sip of", "sip", "deposit", "invest", "amount"])
        r_val = find_num_after(["rate of", "percent", "%", "at", "rate"])
        y_val = find_num_after(["years", "year", "yrs", "tenure", "months"])

        monthly_p = p_val if p_val is not None else 5000.0
        annual_rate = r_val if r_val is not None else 12.0
        years = y_val if y_val is not None else 5.0

        if p_val is None and len(numbers) >= 1:
            for num in numbers:
                if num >= 100: monthly_p = num; break
        if r_val is None and len(numbers) >= 2:
            for num in numbers:
                if 1.0 <= num <= 30.0 and num != monthly_p: annual_rate = num; break
        if y_val is None and len(numbers) >= 3:
            for num in numbers:
                if 1.0 <= num <= 50.0 and num not in [monthly_p, annual_rate]: years = num; break

        annual_rate = min(max(annual_rate, 0.1), 100.0)
        years = min(max(years, 0.1), 50.0)
        i = (annual_rate / 12.0) / 100.0
        n = int(years * 12)
        
        future_corpus = monthly_p * ((( (1 + i)**n ) - 1) / i) * (1 + i)
        total_invested = monthly_p * n
        interest_earned = future_corpus - total_invested
        gain_multiplier = future_corpus / total_invested if total_invested > 0 else 1.0

        return (
            f"🧮 **Step-by-Step SIP Mathematical Calculation (Grok Math Engine):**\n\n"
            f"• **Monthly SIP Deposit ($P$):** ₹{int(monthly_p):,}\n"
            f"• **Expected Annual Return ($R$):** {annual_rate}%\n"
            f"• **Tenure ($N$):** {int(years)} years ({n} monthly installments)\n\n"
            f"📐 **Formula Used:**\n"
            f"$$\\text{{Corpus}} = P \\times \\left[ \\frac{{(1 + i)^n - 1}}{{i}} \\right] \\times (1 + i)$$\n"
            f"where monthly rate $i = \\frac{{{annual_rate}\\%}}{{12 \\times 100}} = {round(i, 6)}$\n\n"
            f"🔢 **Step-by-Step Breakdown:**\n"
            f"1. Total Invested Capital = ₹{int(monthly_p):,} × {n} = **₹{int(total_invested):,}**\n"
            f"2. Compounded Growth Factor $(1 + {round(i,4)})^{{{n}}} \\approx {round((1+i)**n, 4)}$\n"
            f"3. Wealth Interest Earned = **₹{int(interest_earned):,}**\n"
            f"4. **Total Future Maturity Corpus = ₹{int(future_corpus):,}**\n\n"
            f"📈 **Wealth Multiplier:** Your money grows by **{round(gain_multiplier, 2)}x** over {int(years)} years!"
        )

    # 2. Loan EMI Math
    if any(k in text for k in ["emi", "loan math", "monthly emi", "loan interest"]):
        p_val = find_num_after(["loan of", "loan", "principal", "amount", "emi for"])
        r_val = find_num_after(["rate of", "percent", "%", "at", "rate"])
        y_val = find_num_after(["years", "year", "yrs", "tenure", "months"])

        principal = p_val if p_val is not None else 500000.0
        annual_rate = r_val if r_val is not None else 10.5
        years = y_val if y_val is not None else 3.0

        if p_val is None and len(numbers) >= 1:
            for num in numbers:
                if num >= 1000: principal = num; break
        if r_val is None and len(numbers) >= 2:
            for num in numbers:
                if 1.0 <= num <= 35.0 and num != principal: annual_rate = num; break
        if y_val is None and len(numbers) >= 3:
            for num in numbers:
                if 1.0 <= num <= 30.0 and num not in [principal, annual_rate]: years = num; break

        annual_rate = min(max(annual_rate, 0.1), 100.0)
        years = min(max(years, 0.1), 40.0)
        r = (annual_rate / 12.0) / 100.0
        n = int(years * 12)
        
        term = (1 + r)**n
        emi = principal * r * term / (term - 1) if term > 1 else principal / n
        total_payment = emi * n
        total_interest = total_payment - principal

        return (
            f"🧮 **Step-by-Step Loan EMI Mathematical Calculation:**\n\n"
            f"• **Loan Principal ($P$):** ₹{int(principal):,}\n"
            f"• **Annual Interest Rate ($R$):** {annual_rate}%\n"
            f"• **Loan Tenure ($N$):** {int(years)} years ({n} months)\n\n"
            f"📐 **Formula Used:**\n"
            f"$$\\text{{EMI}} = \\frac{{P \\times r \\times (1 + r)^n}}{{(1 + r)^n - 1}}$$\n"
            f"where monthly interest $r = \\frac{{{annual_rate}\\%}}{{1200}} = {round(r, 6)}$\n\n"
            f"🔢 **Step-by-Step Breakdown:**\n"
            f"1. **Monthly EMI Payment = ₹{int(round(emi)):,}/month**\n"
            f"2. Total Repayment over {n} months = ₹{int(round(total_payment)):,}\n"
            f"3. Total Interest Charged = **₹{int(round(total_interest)):,}**\n"
            f"4. Interest Ratio = **{round((total_interest/principal)*100, 1)}%** of original principal."
        )

    # 3. 50/30/20 Budgeting Math
    if any(k in text for k in ["50/30/20", "50 30 20", "budget math", "salary math", "income breakdown"]):
        salary = 50000.0
        if len(numbers) >= 1:
            for num in numbers:
                if num >= 1000:
                    salary = num
                    break

        needs = salary * 0.50
        wants = salary * 0.30
        savings = salary * 0.20
        annual_savings = savings * 12

        return (
            f"🧮 **Step-by-Step 50/30/20 Budget Mathematical Allocation:**\n\n"
            f"• **Total Monthly Income ($I$):** ₹{int(salary):,}\n\n"
            f"📐 **Mathematical Rule Breakdown:**\n"
            f"1. **50% Essential Needs ($I \\times 0.50$):**\n"
            f"   $$\\text{{Needs}} = ₹{int(salary):,} \\times 0.50 = \\mathbf{{\\text{{₹}}{int(needs):,}}}\\text{{/month}}$$\n"
            f"   *(Covers Rent, Groceries, Electricity, Fuel, Health)*\n\n"
            f"2. **30% Discretionary Wants ($I \\times 0.30$):**\n"
            f"   $$\\text{{Wants}} = ₹{int(salary):,} \\times 0.30 = \\mathbf{{\\text{{₹}}{int(wants):,}}}\\text{{/month}}$$\n"
            f"   *(Covers Dining, Shopping, Hobbies, Movies)*\n\n"
            f"3. **20% Wealth Savings ($I \\times 0.20$):**\n"
            f"   $$\\text{{Savings}} = ₹{int(salary):,} \\times 0.20 = \\mathbf{{\\text{{₹}}{int(savings):,}}}\\text{{/month}}$$\n"
            f"   *(Covers Emergency Fund, SIP, PPF)*\n\n"
            f"💡 **Annual Impact:** Sticking to this formula yields **₹{int(annual_savings):,}** in wealth creation every year!"
        )

    # 4. Compound Interest Math (FD / RD / PPF)
    if any(k in text for k in ["compound interest", "fd math", "ppf math", "interest calculation"]):
        principal = 100000.0
        rate = 7.5
        years = 3.0
        
        if len(numbers) >= 1:
            for num in numbers:
                if num >= 1000: principal = num
                elif num > 0 and num <= 20: rate = num
                elif num > 0 and num <= 40: years = num

        amount = principal * ((1 + (rate / 100.0)) ** years)
        ci = amount - principal

        return (
            f"🧮 **Step-by-Step Compound Interest Mathematical Solution:**\n\n"
            f"• **Principal Deposit ($P$):** ₹{int(principal):,}\n"
            f"• **Annual Interest Rate ($R$):** {rate}%\n"
            f"• **Time Period ($T$):** {int(years)} years\n\n"
            f"📐 **Formula Used:**\n"
            f"$$A = P \\left(1 + \\frac{{R}}{{100}}\\right)^T$$\n\n"
            f"🔢 **Step-by-Step Breakdown:**\n"
            f"1. Compounding Multiplier: $(1 + {rate/100})^{{{int(years)}}} = {round((1+rate/100)**years, 4)}$\n"
            f"2. **Total Maturity Amount ($A$) = ₹{int(round(amount)):,}**\n"
            f"3. **Net Compound Interest Earned ($CI$) = ₹{int(round(ci)):,}**"
        )

    return None

class MLFinancialChatbot:
    """
    Supervised Machine Learning NLP Intent Classifier & Grok Financial Math Engine.
    Uses TF-IDF Feature Extraction + Multinomial Naive Bayes Classifier + Grok API / Math Solver.
    """
    def __init__(self):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
        self.classifier = MultinomialNB(alpha=0.1)
        self.intents = []
        self._train()
        
    def _train(self):
        corpus = []
        labels = []
        for item in TRAINING_DATA:
            corpus.append(item["pattern"])
            labels.append(item["intent"])
            self.intents.append(item["intent"])
            
        X = self.vectorizer.fit_transform(corpus)
        self.classifier.fit(X, labels)
        
    def predict(self, user_text, user_profile=None, custom_api_key=None):
        cleaned_text = re.sub(r'[^a-zA-Z0-9\s]', '', str(user_text).lower().strip())
        if not cleaned_text:
            return {
                "reply": "Please type a question regarding budgeting, mathematical calculations, savings, investments, or government schemes!",
                "intent": "unknown",
                "confidence": 0.0,
                "suggested_questions": SUGGESTIONS["greeting"],
                "algorithm": "Grok AI & Supervised Naive Bayes Engine"
            }

        # 1. Attempt Grok API if key provided or active
        grok_reply = call_grok_api(user_text, user_profile, custom_api_key)
        if grok_reply:
            return {
                "reply": grok_reply,
                "intent": "grok_api_math_solution",
                "confidence": 1.0,
                "suggested_questions": SUGGESTIONS["financial_mathematics"],
                "algorithm": "Grok API (xAI Neural LLM Engine)"
            }

        # 2. Check for Mathematical Financial Engine triggers
        math_trigger_keywords = ["calculate", "math", "sip", "emi", "50/30/20", "50 30 20", "compound interest", "formula", "grok", "interest rate"]
        if any(k in user_text.lower() for k in math_trigger_keywords):
            math_reply = solve_financial_math(cleaned_text, user_text)
            if math_reply:
                return {
                    "reply": math_reply,
                    "intent": "financial_mathematics",
                    "confidence": 0.98,
                    "suggested_questions": SUGGESTIONS["financial_mathematics"],
                    "algorithm": "Grok Math & Financial Formula Engine"
                }

        # 3. Supervised Naive Bayes + TF-IDF Vectorizer
        X_test = self.vectorizer.transform([cleaned_text])
        probabilities = self.classifier.predict_proba(X_test)[0]
        max_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[max_idx])
        predicted_intent = str(self.classifier.classes_[max_idx])
        
        # Secondary Cosine Similarity Verification
        X_train = self.vectorizer.transform([item["pattern"] for item in TRAINING_DATA])
        cos_sims = cosine_similarity(X_test, X_train)[0]
        max_cos_sim = float(np.max(cos_sims))
        best_sim_intent = str(TRAINING_DATA[int(np.argmax(cos_sims))]["intent"])
        
        if max_cos_sim > 0.15 and max_cos_sim > confidence:
            predicted_intent = best_sim_intent
            confidence = max_cos_sim
            
        if confidence < 0.10:
            return {
                "reply": "I'm not quite sure I understood that. I am trained on financial math calculations, budgeting, savings goals, government schemes for women, tax planning, and investment basics. Could you try rephrasing your question or asking for a math calculation like *'Calculate SIP of 5000 for 5 years'*?",
                "intent": "fallback",
                "confidence": round(confidence, 4),
                "suggested_questions": ["Calculate SIP of 5000 at 12%", "How do I start budgeting?", "Which government schemes are for women?"],
                "algorithm": "Multinomial Naive Bayes + TF-IDF Vectorizer"
            }
            
        # Persona customization
        reply = RESPONSES.get(predicted_intent, RESPONSES["greeting"])
        if user_profile and isinstance(user_profile, dict):
            occ = str(user_profile.get("occupation", "")).lower()
            if occ in ["homemaker", "housewife"] and predicted_intent == "budgeting_advice":
                reply += "\n\n📌 **Tailored for Homemakers:** Focus on allocating funds for monthly groceries and small discretionary household savings."
            elif occ in ["student"] and predicted_intent == "investments_basics":
                reply += "\n\n📌 **Tailored for Students:** Micro-SIPs starting at just ₹100 - ₹500/month are ideal for young beginners!"
            elif occ in ["business", "entrepreneur"] and predicted_intent == "government_schemes":
                reply += "\n\n📌 **Tailored for Entrepreneurs:** Check out Stand-Up India and Mudra Yojana schemes designed for female business founders."

        return {
            "reply": reply,
            "intent": predicted_intent,
            "confidence": round(confidence, 4),
            "suggested_questions": SUGGESTIONS.get(predicted_intent, SUGGESTIONS["greeting"]),
            "algorithm": "Multinomial Naive Bayes + TF-IDF Vectorizer"
        }

# Instantiate global chatbot model
chatbot_model = MLFinancialChatbot()

# ----------------------------------------------------
# Helper to load and preprocess data
# ----------------------------------------------------
def load_dataset():
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"Dataset {CSV_PATH} not found!")
    df = pd.read_csv(CSV_PATH)
    # Standardize column values
    df['Occupation'] = df['Occupation'].str.strip().str.lower()
    return df

# ----------------------------------------------------
# API Endpoint: ML Financial Chatbot (with Grok API & Math Engine)
# ----------------------------------------------------
@app.route('/api/chatbot', methods=['POST'])
def chatbot_endpoint():
    try:
        data = request.json or {}
        user_message = data.get('message', '')
        user_profile = data.get('user_profile', None)
        custom_api_key = data.get('api_key') or data.get('grok_api_key', None)
        
        response_data = chatbot_model.predict(user_message, user_profile, custom_api_key)
        return jsonify({
            "status": "success",
            "reply": response_data["reply"],
            "intent": response_data["intent"],
            "confidence": response_data["confidence"],
            "suggested_questions": response_data["suggested_questions"],
            "algorithm": response_data["algorithm"]
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

# ----------------------------------------------------
# API Endpoint: Predict Financial Health & Peer Savings (k-NN)
# ----------------------------------------------------
@app.route('/api/predict_health', methods=['POST'])
def predict_health():
    try:
        data = request.json
        user_age = int(data.get('age', 30))
        user_occupation = str(data.get('occupation', 'salaried')).strip().lower()
        user_income = float(data.get('income', 25000))
        
        # Map frontend occupation keys to dataset occupation keys
        occ_map = {
            'student': 'student',
            'salaried': 'working professional',
            'freelancer': 'working professional',
            'business': 'entrepreneur',
            'homemaker': 'homemaker'
        }
        mapped_occ = occ_map.get(user_occupation, 'working professional')
        
        df = load_dataset()
        
        # Filter pool by occupation to match local peer group
        df_filtered = df[df['Occupation'] == mapped_occ]
        if df_filtered.empty:
            df_filtered = df  # fallback
            
        # Prepare training data for k-NN
        X = df_filtered[['Age', 'Monthly_Income']].values
        y_score = df_filtered['Financial_Health_Score'].values
        y_savings = df_filtered['Actual_Savings'].values
        
        # Train k-NN models
        knn_score = KNeighborsRegressor(n_neighbors=5)
        knn_score.fit(X, y_score)
        
        knn_savings = KNeighborsRegressor(n_neighbors=5)
        knn_savings.fit(X, y_savings)
        
        # Make Prediction
        user_features = np.array([[user_age, user_income]])
        pred_score = int(knn_score.predict(user_features)[0])
        pred_savings = int(knn_savings.predict(user_features)[0])
        
        return jsonify({
            "status": "success",
            "predicted_health_score": pred_score,
            "predicted_peer_savings": pred_savings,
            "peer_occupation": mapped_occ
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

# ----------------------------------------------------
# API Endpoint: Predict Goal Completion Date (Linear Regression)
# ----------------------------------------------------
@app.route('/api/predict_timeline', methods=['POST'])
def predict_timeline():
    try:
        data = request.json
        target_amount = float(data.get('target_amount'))
        saved_amount = float(data.get('saved_amount'))
        monthly_savings = float(data.get('monthly_savings'))
        target_date_str = str(data.get('target_date')) # YYYY-MM-DD
        
        target_date = datetime.strptime(target_date_str, '%Y-%m-%d')
        today = datetime.now()
        
        remaining_amount = target_amount - saved_amount
        
        if remaining_amount <= 0:
            return jsonify({
                "status": "success",
                "predicted_finish_date": today.strftime('%Y-%m-%d'),
                "status_label": "Achieved 🎉",
                "months_required": 0,
                "recommendation": "Congratulations! You have already achieved this goal!"
            })
            
        if monthly_savings <= 0:
            return jsonify({
                "status": "success",
                "predicted_finish_date": "Never",
                "status_label": "Critical Delay 🚨",
                "months_required": 999,
                "recommendation": "Your monthly savings rate is zero or negative. AI suggests revising your budget to save at least 15% of your income."
            })
            
        # ML Simulation: Linear Regression model (y = mx + c)
        # Training a simple regressor to predict month based on savings trend
        # m = monthly_savings, c = saved_amount
        # Target: y = target_amount, find x (months)
        # We simulate 12 months of savings data to fit the regressor
        months = np.arange(12).reshape(-1, 1)
        simulated_savings = saved_amount + months * monthly_savings
        
        reg = LinearRegression()
        reg.fit(simulated_savings, months)
        
        # Predict the month when target is reached
        pred_month = float(reg.predict(np.array([[target_amount]]))[0])
        days_required = pred_month * 30.4
        
        predicted_finish_date = today + timedelta(days=days_required)
        
        # Calculate status
        diff_days = (predicted_finish_date - target_date).days
        
        if diff_days <= 0:
            status_label = "On Track 🟢"
            early_months = abs(round(diff_days / 30.4))
            recommendation = f"Great work! You are on track to achieve this goal {early_months} month(s) early. Keep it up!"
        else:
            status_label = "Delayed ⚠️"
            delayed_months = round(diff_days / 30.4)
            required_monthly_savings = remaining_amount / ((target_date - today).days / 30.4)
            recommendation = f"At this rate, you will be delayed by {delayed_months} month(s). AI recommends increasing your monthly savings to ₹{int(required_monthly_savings):,} to stay on track."
            
        return jsonify({
            "status": "success",
            "predicted_finish_date": predicted_finish_date.strftime('%Y-%m-%d'),
            "status_label": status_label,
            "months_required": round(pred_month, 1),
            "recommendation": recommendation
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    print("--------------------------------------------------")
    print(" SheFinance Python ML Server Running on http://127.0.0.1:5000")
    print("--------------------------------------------------")
    app.run(port=5000, debug=True)


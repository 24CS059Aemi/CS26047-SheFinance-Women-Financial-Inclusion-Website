# SheFinance - Women Financial Inclusion Website
SheFinance is a dedicated web platform designed to empower women through financial literacy, automated budgeting, and awareness of government schemes.

---

## 1. Introduction & Problem Definition Statement
Many women face challenges in managing their personal finances due to limited financial awareness and the lack of a single platform that provides budgeting tools, savings guidance, financial education, and information about government schemes. Financial resources are scattered across different websites, making them difficult to access and understand.

**SheFinance** is a web-based platform that aims to improve women's financial literacy by providing financial management tools, AI-based guidance, and educational resources in one place.

---

## 2. Product Overview

### 2.1 Target Users
*   **Women Students:** To help them manage pocket money and build early savings habits.
*   **Homemakers:** To manage household budgets, track daily expenses, and discover savings goals.
*   **Working Professionals:** To plan monthly budgets, calculate tax, and invest wisely.
*   **Women Entrepreneurs:** To track small business income, expenses, and explore government funding.
*   **System Administrator:** To manage portal contents, update schemes, and monitor system health.

### 2.2 Core Functionality
*   **User Registration & Login:** Secure authentication using Google OAuth 2.0 and manual registration.
*   **User Profile Management:** Customized profile details including occupation, monthly income, and financial goals.
*   **Income & Expense Tracker:** Easy log to input and categorize daily financial transactions.
*   **Monthly Budget Planner:** Set limits for different categories (groceries, education, entertainment).
*   **Savings Goal Tracker:** Create, monitor, and visualize target savings achievements.
*   **Government Scheme Information:** A curated database of government financial welfare schemes for women.
*   **Financial Education:** Unified resource hub containing articles and video tutorials.
*   **AI Financial Chatbot:** Interactive assistant to answer basic financial questions.
*   **AI-Based Savings Prediction:** Machine Learning module to predict future savings trends based on history.
*   **Financial Health Score:** Calculated rating showing the overall financial stability of the user.
*   **Reports & Dashboard:** Modern visual analytics showing spending charts and monthly summaries.

---

## 3. Proposed Solution & Architecture

### 3.1 Technology Stack
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (Modern Glassmorphic Responsive Dashboard)
*   **Backend:** Python Flask ML API (`app.py` on Port 5000) & Node.js Express Server (`server.js` on Port 3000)
*   **Machine Learning Library:** Scikit-Learn (TF-IDF Vectorizer, Multinomial Naive Bayes Classifier, k-NN Regressor, Linear Regression)
*   **Database & Storage:** Client-side HTML5 LocalStorage & Session persistence
*   **Tools:** VS Code, Git, GitHub for version control

### 3.2 AI Financial Chatbot & Machine Learning Pipeline
SheFinance features a step-by-step Supervised NLP Machine Learning Chatbot designed specifically for women's financial literacy:

1. **Step 1: Text Preprocessing & Tokenization**
   • Lowercasing, regex special character stripping, and whitespace standardization.

2. **Step 2: Feature Extraction (TF-IDF Vectorization)**
   • Uses Scikit-Learn `TfidfVectorizer(ngram_range=(1, 2))` to extract unigrams and bigrams from user financial queries.

3. **Step 3: Intent Classification Model (Multinomial Naive Bayes)**
   • Classifies query into 11 distinct intent categories (`budgeting_advice`, `government_schemes`, `emergency_fund`, `investments_basics`, `savings_strategies`, `debt_management`, `financial_health_score`, `homemaker_finance`, `student_finance`, `tax_planning`, `greeting`).

4. **Step 4: Cosine Similarity Verification & Fallback**
   • Calculates cosine similarity scores against training patterns to refine prediction confidence and handle ambiguous phrasing safely.

5. **Step 5: Dynamic Persona-based Context Customization**
   • Customizes responses dynamically based on user persona (`occupation`: Student, Homemaker, Working Professional, Entrepreneur).

6. **API Endpoint (`POST /api/chatbot`)**
   ```json
   {
     "message": "What government loan schemes exist for female entrepreneurs?",
     "user_profile": { "occupation": "business" }
   }
   ```
   **Returns:**
   ```json
   {
     "status": "success",
     "reply": "🏛️ Top Government Financial Schemes for Women:...",
     "intent": "government_schemes",
     "confidence": 0.54,
     "algorithm": "Multinomial Naive Bayes + TF-IDF Vectorizer",
     "suggested_questions": ["Tell me about Mudra Loan", "What is Sukanya Samriddhi?"]
   }
   ```

---

## 4. Expected Outcome & Future Scope

### 4.1 Expected Outcomes
*   Significantly improve financial literacy and independence among women.
*   Provide an easy-to-use, unified interface for household and professional budgeting.
*   Encourage consistent savings habits with progress visualization.
*   Increase direct awareness and adoption of central/state government financial schemes.
*   Deliver automated, personalized guidance using AI without requiring human advisors.

### 4.2 Future Enhancements
*   **Smart Reminders:** Push notifications for budget limits and deposit goals.
*   **Family Sharing:** Shared household budget planning with family members.
*   **AI Budget Recommendations:** Automated cost-cutting suggestions.
*   **Gamified Learning:** Financial quizzes with downloadable completion certificates.

---

## 5. Potential Challenges
*   **Security & Privacy:** Securing sensitive personal financial information.
*   **AI Accuracy:** Ensuring the chatbot and prediction algorithms provide reliable calculations.
*   **Content Freshness:** Keeping the database of government schemes updated regularly.
*   **UI/UX Simplicity:** Creating a clean, non-intimidating design for beginners.

---

## 6. References
*   Smart India Hackathon (SIH) Problem Statements
*   Reserve Bank of India (RBI) Financial Literacy Guidelines
*   Ministry of Women and Child Development, Government of India
*   Pradhan Mantri Jan Dhan Yojana (PMJDY) Portal
*   Academic Research Papers on Women Financial Inclusion and Empowerment
*   Official React.js & Node.js Documentation

---

**Developed by:** Aemi Patel
**Subject:** Project-I CEUP301 (Semester V)

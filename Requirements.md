# System Requirements & Technology Specifications

## 🖥️ Hardware Requirements
- **Processor:** Intel Core i3 / AMD Ryzen 3 or higher (minimum)
- **Memory (RAM):** 4 GB RAM minimum (8 GB recommended for simultaneous Flask & Express runtime)
- **Disk Storage:** 500 MB free storage space
- **Network:** Active Internet Connection for live web scraping, MongoDB Atlas database connectivity, and API testing

---

## 💻 Software & Tech Stack Specifications

### 🎨 Frontend Architecture
- **Framework:** React.js (Vite environment)
- **Routing:** React Router DOM v6
- **Styling:** Vanilla CSS3 (Custom design tokens, Glassmorphic UI theme, Responsive Flex & Grid layouts)
- **Icons & Visuals:** FontAwesome 6, Lucide Icons, UI Avatars API

### ⚙️ Backend Architecture
- **Primary Web Server:** Node.js & Express.js (`server.js` running on Port 3000)
- **Machine Learning Server:** Python 3 Flask API (`app.py` running on Port 5000)
- **Database:** MongoDB Atlas Cloud Database (`mongoose` Object Data Modeling)
- **Web Scraper & Parsing:** `axios` HTTP client + `cheerio` server-side DOM parser
- **Task Automation:** `node-cron` background scheduler (2:00 AM IST daily auto-sync)
- **Authentication:** JWT (JSON Web Tokens), `bcryptjs` password hashing, Google OAuth 2.0

### 🤖 Machine Learning Libraries
- **Scikit-Learn:** `TfidfVectorizer` (N-gram NLP text feature extraction) & `MultinomialNB` (Multinomial Naive Bayes intent classification)
- **NumPy & Pandas:** Data preprocessing, matrix operations, and dataset transformations

### 🛠️ Developer & Build Tools
- **Code Editor:** Visual Studio Code (VS Code)
- **Version Control:** Git & GitHub
- **API Testing:** Automated JavaScript verification suite (`verify-all.js`), Postman / ThunderClient

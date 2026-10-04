const educationData = [
    {
        level: "Level 0: Financial Awareness",
        icon: "fa-solid fa-seedling",
        topics: [
            {
                id: "l0-what-is-money",
                title: "1. What is Money?",
                icon: "fa-solid fa-coins",
                content: `
                    <h2>What is Money?</h2>
                    <p>Money is a universally accepted medium of exchange used to buy goods, pay for services, and store wealth for the future.</p>
                    
                    <h3>Why do we need money?</h3>
                    <p>Without money, we would have to rely on the <strong>barter system</strong> (trading item for item). Money provides a standard value, making trade easy, predictable, and fair.</p>
                    
                    <h3>Income vs Expenses</h3>
                    <ul>
                        <li><strong>Income:</strong> Any money coming into your pocket (Salary, business profit, gifts, interest).</li>
                        <li><strong>Expenses:</strong> Money leaving your pocket (Rent, groceries, bill payments, shopping).</li>
                    </ul>

                    <h3>Needs vs Wants (The Golden Rule)</h3>
                    <ul>
                        <li><strong>Needs:</strong> Survival essentials (Food, shelter, basic clothing, medicine, electricity).</li>
                        <li><strong>Wants:</strong> Lifestyle choices (Dining out, latest smartphones, designer clothes, video streaming subscriptions).</li>
                    </ul>

                    <h3>Good Financial Habits for Beginners</h3>
                    <ol>
                        <li>Track every rupee you spend daily.</li>
                        <li>Spend less than you earn.</li>
                        <li>Save before you spend (Pay yourself first).</li>
                        <li>Avoid unnecessary debt.</li>
                    </ol>
                `
            },
            {
                id: "l0-understanding-income",
                title: "2. Understanding Income",
                icon: "fa-solid fa-money-bill-wave",
                content: `
                    <h2>Understanding Income</h2>
                    <p>Income is the starting point of financial independence. Diversity in income sources creates financial safety.</p>
                    
                    <h3>Types of Income</h3>
                    <ul>
                        <li><strong>Salary:</strong> Regular fixed compensation paid by an employer.</li>
                        <li><strong>Freelancing Income:</strong> Earnings from project-based work or clients.</li>
                        <li><strong>Business Income:</strong> Profits earned by running a trade, commercial enterprise, or service.</li>
                        <li><strong>Part-time Income:</strong> Earnings from secondary jobs or hourly gigs.</li>
                        <li><strong>Passive Income:</strong> Money generated automatically with minimal ongoing effort (Rent, Stock Dividends, Royalties, Savings Interest).</li>
                    </ul>

                    <h3>Gross Salary vs Net Salary</h3>
                    <div style="background: #f4f7f9; padding: 20px; border-left: 4px solid var(--secondary-color); border-radius: 8px; margin: 20px 0;">
                        <p><strong>Gross Salary:</strong> The total agreed salary before any deductions (e.g., ₹50,000/month).</p>
                        <p><strong>Deductions:</strong> Provident Fund (PF), Professional Tax (PT), Income Tax (TDS).</p>
                        <p><strong>Net Salary (Take-Home):</strong> The actual money deposited into your bank account after deductions (e.g., ₹44,500/month).</p>
                    </div>
                `
            },
            {
                id: "l0-understanding-expenses",
                title: "3. Understanding Expenses",
                icon: "fa-solid fa-receipt",
                content: `
                    <h2>Understanding Expenses</h2>
                    <p>Controlling expenses is often easier than instantly increasing your income.</p>
                    
                    <h3>Categorizing Your Expenses</h3>
                    <ul>
                        <li><strong>Fixed Expenses:</strong> Amounts that stay constant every month (Rent, Loan EMIs, School Fees).</li>
                        <li><strong>Variable Expenses:</strong> Amounts that fluctuate (Groceries, Electricity bill, Mobile recharge).</li>
                        <li><strong>Essential Expenses:</strong> Costs required for health, safety, and basic work capability.</li>
                        <li><strong>Non-essential Expenses:</strong> Impulsive purchases, entertainment, luxury goods.</li>
                    </ul>

                    <h3>Monthly Expense Tracking</h3>
                    <p>Use the <a href="tracker.html" style="color: var(--secondary-color); font-weight: 600;">SheFinance Income & Expense Tracker</a> to log transactions. Tracking reveals invisible money leaks like daily snacks, unused subscriptions, or impulse buys.</p>
                `
            },
            {
                id: "l0-needs-vs-wants",
                title: "4. Needs vs Wants & Smart Shopping",
                icon: "fa-solid fa-cart-shopping",
                content: `
                    <h2>Needs vs Wants & Smart Shopping</h2>
                    <p>Mastering impulse control can save thousands of rupees every year.</p>

                    <h3>What is Impulse Buying?</h3>
                    <p>Impulse buying is buying something on the spur of the moment, driven by emotions, advertisements, or sales discounts, rather than genuine need.</p>

                    <h3>The 48-Hour Rule for Smart Shopping</h3>
                    <p>Before making a non-essential purchase over ₹1,000, wait <strong>48 hours</strong>. If you still feel it is essential after 2 days, consider buying it. Most impulse urges fade within 48 hours!</p>

                    <h3>Tips to Avoid Unnecessary Spending</h3>
                    <ul>
                        <li>Never go grocery shopping on an empty stomach.</li>
                        <li>Unsubscribe from promotional shopping emails and sale alerts.</li>
                        <li>Compare prices across multiple apps/stores before purchasing.</li>
                        <li>Ask yourself: <em>"How many hours of my hard work does this item cost?"</em></li>
                    </ul>
                `
            },
            {
                id: "l0-banking-basics",
                title: "5. Banking Basics",
                icon: "fa-solid fa-building-columns",
                content: `
                    <h2>Banking Basics</h2>
                    <p>Banks keep your money safe, enable digital transactions, and offer interest on savings.</p>

                    <h3>Types of Accounts</h3>
                    <ul>
                        <li><strong>Savings Account:</strong> Designed for individuals to store money safely while earning 2.5%–4% interest per annum.</li>
                        <li><strong>Current Account:</strong> Designed for business owners with no daily transaction limits (does not pay interest).</li>
                    </ul>

                    <h3>Key Banking Terms</h3>
                    <ul>
                        <li><strong>Bank Statement:</strong> An official summary of all incoming and outgoing financial transactions in your account.</li>
                        <li><strong>ATM / Debit Card:</strong> A card linked directly to your savings account to withdraw cash or pay at shops.</li>
                        <li><strong>UPI (Unified Payments Interface):</strong> Instant real-time payment system (GPay, PhonePe, Paytm) directly linked to your bank account.</li>
                        <li><strong>NEFT / RTGS / IMPS:</strong> Electronic bank transfer mechanisms used for online money transfers across banks in India.</li>
                    </ul>
                `
            }
        ]
    },
    {
        level: "Level 1: Personal Finance Basics",
        icon: "fa-solid fa-wallet",
        topics: [
            {
                id: "l1-budgeting",
                title: "1. Budgeting Principles",
                icon: "fa-solid fa-calculator",
                content: `
                    <h2>Budgeting Principles</h2>
                    <p>A budget is a roadmap for your financial journey. It ensures your money serves your goals.</p>

                    <h3>The 50/30/20 Budget Rule</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
                        <div style="background: #e8f8f5; padding: 15px; border-radius: 10px; text-align: center;">
                            <h3 style="color: #2ecc71; margin:0;">50%</h3>
                            <p><strong>Needs</strong><br>Rent, food, bills, health</p>
                        </div>
                        <div style="background: #fef9e7; padding: 15px; border-radius: 10px; text-align: center;">
                            <h3 style="color: #f1c40f; margin:0;">30%</h3>
                            <p><strong>Wants</strong><br>Dining, shopping, movies</p>
                        </div>
                        <div style="background: #eaf2f8; padding: 15px; border-radius: 10px; text-align: center;">
                            <h3 style="color: #3498db; margin:0;">20%</h3>
                            <p><strong>Savings</strong><br>Emergency fund, investments</p>
                        </div>
                    </div>

                    <h3>Zero-Based Budgeting</h3>
                    <p>In zero-based budgeting, <code>Income - Expenses - Savings = ₹0</code>. Every single rupee is given a dedicated role before the month starts.</p>

                    <h3>Common Budgeting Mistakes</h3>
                    <ul>
                        <li>Forgetting irregular expenses (festivals, car servicing, annual insurance).</li>
                        <li>Setting unrealistic restrictions that lead to binge spending.</li>
                        <li>Not adjusting the budget when income or prices change.</li>
                    </ul>
                    <a href="budget.html" class="btn btn-primary" style="margin-top: 15px;">Open SheFinance Budget Planner</a>
                `
            },
            {
                id: "l1-expense-management",
                title: "2. Expense Management",
                icon: "fa-solid fa-chart-pie",
                content: `
                    <h2>Expense Management & Analysis</h2>
                    <p>Connecting your knowledge with action: How to actively manage daily outflow.</p>

                    <h3>5 Steps to Effective Expense Control</h3>
                    <ol>
                        <li><strong>Record:</strong> Write down every expense immediately when it happens.</li>
                        <li><strong>Categorize:</strong> Group into Groceries, Utilities, Transport, Fun, Health, etc.</li>
                        <li><strong>Identify Patterns:</strong> Do you spend more on weekends? Do you shop when stressed?</li>
                        <li><strong>Cut Waste:</strong> Cancel subscriptions you haven't used in 30 days.</li>
                        <li><strong>Compare:</strong> Compare this month's totals with last month to measure progress.</li>
                    </ol>
                    <a href="tracker.html" class="btn btn-outline" style="margin-top: 15px;"><i class="fa-solid fa-arrow-right"></i> Open Expense Tracker</a>
                `
            },
            {
                id: "l1-saving-money",
                title: "3. Saving Money",
                icon: "fa-solid fa-piggy-bank",
                content: `
                    <h2>Saving Money</h2>
                    <p>Saving is keeping money safe for future needs, while investing is growing money to outpace inflation.</p>

                    <h3>Automate Your Savings</h3>
                    <p>Don't save what is left after spending; spend what is left after saving! Set an auto-debit standing instruction in your bank account on your salary day to transfer 20% directly to a recurring deposit or savings goal.</p>

                    <h3>Savings Timelines</h3>
                    <ul>
                        <li><strong>Short-term Savings (< 1 year):</strong> New gadgets, vacations, festival gifts.</li>
                        <li><strong>Long-term Savings (3+ years):</strong> Down payments, higher education, house purchase.</li>
                    </ul>
                `
            },
            {
                id: "l1-emergency-fund",
                title: "4. Emergency Fund",
                icon: "fa-solid fa-vault",
                content: `
                    <h2>Emergency Fund</h2>
                    <p>An emergency fund is your financial security cushion against life's unexpected crises.</p>

                    <h3>Why do you need an Emergency Fund?</h3>
                    <p>Without an emergency fund, unexpected events like job loss, medical emergencies, or urgent house repairs force people into high-interest debt or selling family assets.</p>

                    <h3>How Much Should You Keep?</h3>
                    <div style="background: #fcf3cf; border-left: 5px solid #f1c40f; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p style="margin: 0; font-weight: 600;">Minimum: 3 to 6 months of living expenses.</p>
                        <p style="margin: 5px 0 0 0; font-size: 0.95rem;">If your monthly basic expenses are ₹25,000, your emergency fund should be ₹75,000 to ₹1,50,000.</p>
                    </div>

                    <h3>Where Should Emergency Money Be Kept?</h3>
                    <ul>
                        <li>High-yield Savings Account</li>
                        <li>Liquid Mutual Funds (can withdraw within 24 hours)</li>
                        <li>Short-term Fixed Deposit (FD) with instant sweep-in facility</li>
                    </ul>
                `
            },
            {
                id: "l1-financial-goals",
                title: "5. Financial Goals",
                icon: "fa-solid fa-bullseye",
                content: `
                    <h2>Setting Financial Goals</h2>
                    <p>Having clear goals turns abstract saving into purpose-driven milestone building.</p>

                    <h3>Goal Horizon Examples</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border: 1px solid #ddd;">
                            <h4 style="color: var(--primary-color);">Short-Term (0-1 yr)</h4>
                            <ul><li>Course certifications</li><li>New phone</li><li>Vacation</li></ul>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border: 1px solid #ddd;">
                            <h4 style="color: var(--primary-color);">Medium-Term (1-5 yrs)</h4>
                            <ul><li>Two-wheeler/Car</li><li>Higher education</li><li>Marriage fund</li></ul>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border: 1px solid #ddd;">
                            <h4 style="color: var(--primary-color);">Long-Term (5+ yrs)</h4>
                            <ul><li>Buying a house</li><li>Children's education</li><li>Retirement corpus</li></ul>
                        </div>
                    </div>
                    <a href="savings.html" class="btn btn-primary">Go to SheFinance Savings Goal Tracker</a>
                `
            }
        ]
    },
    {
        level: "Level 2: Credit, Loans & Insurance",
        icon: "fa-solid fa-credit-card",
        topics: [
            {
                id: "l2-credit-score",
                title: "1. Credit & Credit Score",
                icon: "fa-solid fa-gauge-high",
                content: `
                    <h2>Credit & Credit Score</h2>
                    <p>Credit is borrowing capacity based on trust that you will repay key financial obligations on time.</p>

                    <h3>What is a Credit Score (CIBIL)?</h3>
                    <p>A 3-digit number between <strong>300 and 900</strong> representing your creditworthiness. A score above <strong>750</strong> is considered excellent and gets you fast loan approvals at lower interest rates.</p>

                    <h3>How Credit Cards Work</h3>
                    <ul>
                        <li><strong>Credit Limit:</strong> Maximum amount you can spend on the card.</li>
                        <li><strong>Credit Utilization:</strong> Keep card spending below 30% of your total limit to boost your score.</li>
                        <li><strong>Minimum Payment Trap:</strong> Paying only the minimum due (usually 5%) incurs massive interest (36%–42% per year) on the balance! <strong>Always pay 100% full balance before the due date.</strong></li>
                    </ul>

                    <h3>Good Debt vs Bad Debt</h3>
                    <p><strong>Good Debt:</strong> Loans that build long-term value or income (Education loan, Business loan, Home loan).</p>
                    <p><strong>Bad Debt:</strong> High-interest loans for depreciating assets or lifestyle spending (Credit card rollover debt, Personal loans for vacations).</p>
                `
            },
            {
                id: "l2-loans-emi-calculator",
                title: "2. Loans & EMI Calculator",
                icon: "fa-solid fa-calculator",
                content: `
                    <h2>Loans & Loan EMI Calculator</h2>
                    <p>Understand key terms before signing any loan document: Principal, Interest Rate, Loan Tenure, and EMI (Equated Monthly Installment).</p>

                    <h3>Types of Loans</h3>
                    <ul>
                        <li><strong>Education Loan:</strong> Tax benefit available under Section 80E.</li>
                        <li><strong>Home Loan:</strong> Secured against property, lower interest rates, long tenure (up to 30 yrs).</li>
                        <li><strong>Personal Loan:</strong> Unsecured, fast approval but higher interest rate (11%–24%).</li>
                        <li><strong>Vehicle / Business Loan:</strong> Secured against the vehicle or business assets.</li>
                    </ul>

                    <div style="background: #f4eee2; padding: 25px; border-radius: 15px; margin-top: 30px; border: 1px solid var(--secondary-color);">
                        <h3>🧮 Interactive Loan EMI Calculator</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                            <div>
                                <label style="font-weight:600; display:block;">Loan Amount (₹)</label>
                                <input type="number" id="emiAmount" value="500000" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-top:5px;">
                            </div>
                            <div>
                                <label style="font-weight:600; display:block;">Interest Rate (% p.a.)</label>
                                <input type="number" id="emiRate" value="9.5" step="0.1" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-top:5px;">
                            </div>
                            <div>
                                <label style="font-weight:600; display:block;">Tenure (Years)</label>
                                <input type="number" id="emiTenure" value="5" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-top:5px;">
                            </div>
                        </div>
                        <button onclick="calculateEMI()" class="btn btn-primary" style="margin-top:15px; width:100%;">Calculate EMI</button>
                        
                        <div id="emiResult" style="margin-top:20px; padding:15px; background:#fff; border-radius:10px; display:none;">
                            <p style="margin:5px 0;">Monthly EMI: <strong id="resEmi" style="font-size:1.3rem; color:var(--primary-color);">₹0</strong></p>
                            <p style="margin:5px 0;">Total Interest Payable: <strong id="resInterest" style="color:#e74c3c;">₹0</strong></p>
                            <p style="margin:5px 0;">Total Repayment Amount: <strong id="resTotal" style="color:#2ecc71;">₹0</strong></p>
                        </div>
                    </div>
                `
            },
            {
                id: "l2-insurance",
                title: "3. Insurance Essentials",
                icon: "fa-solid fa-shield-halved",
                content: `
                    <h2>Insurance Essentials</h2>
                    <p>Insurance is a safety net designed to protect your wealth from unexpected catastrophic costs.</p>

                    <h3>1. Health Insurance</h3>
                    <ul>
                        <li><strong>Sum Insured:</strong> Maximum amount the insurer pays in a year for hospitalization.</li>
                        <li><strong>Deductible / Co-pay:</strong> Amount you pay before insurance kicks in.</li>
                        <li><strong>Waiting Period:</strong> Time period before coverage starts for specific pre-existing conditions.</li>
                    </ul>

                    <h3>2. Life Insurance</h3>
                    <p><strong>Term Insurance:</strong> Pure risk coverage. Provides a large payout (Sum Assured) to your nominee if you pass away during the policy tenure. It is affordable and essential for anyone with financial dependents.</p>

                    <h3>CRITICAL CONCEPT: Insurance ≠ Investment</h3>
                    <div style="background:#fdf2e9; border-left: 5px solid #e67e22; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <p style="margin:0; font-weight:600; color:#d35400;">Do not buy Endowment or ULIP plans that blend insurance with investment!</p>
                        <p style="margin:5px 0 0 0; font-size:0.95rem;">They offer low insurance coverage and poor investment returns (4%–5%). Keep insurance separate (Pure Term Insurance) and invest the rest in Mutual Funds/PPF for 10%–12% returns.</p>
                    </div>
                `
            }
        ]
    },
    {
        level: "Level 3: Investment & Mutual Funds",
        icon: "fa-solid fa-chart-line",
        topics: [
            {
                id: "l3-investment-basics",
                title: "1. What is Investment?",
                icon: "fa-solid fa-seedling",
                content: `
                    <h2>What is Investment?</h2>
                    <p>Investing is committing money to financial assets with the goal of generating profit and growing wealth over time.</p>

                    <h3>Inflation: The Silent Wealth Destroyer</h3>
                    <p>If inflation in India is 6% per year, an item costing ₹100 today will cost ₹106 next year. Money sitting idle in a savings account at 3% interest actually loses purchasing power!</p>

                    <h3>The Magic of Compounding</h3>
                    <p>Compounding means earning interest on your interest. Albert Einstein called compounding the 8th wonder of the world!</p>
                    <p>Formula: <code>A = P(1 + r/n)^(nt)</code>. Time is your greatest asset in compounding.</p>
                `
            },
            {
                id: "l3-investment-types",
                title: "2. Investment Avenues",
                icon: "fa-solid fa-vault",
                content: `
                    <h2>Investment Avenues Overview</h2>

                    <h3>1. Bank Deposits</h3>
                    <ul>
                        <li><strong>Fixed Deposit (FD):</strong> Lock a lump sum for a fixed period at fixed interest (6%–7.5%). Guaranteed safety.</li>
                        <li><strong>Recurring Deposit (RD):</strong> Deposit a fixed monthly sum for a set tenure.</li>
                    </ul>

                    <h3>2. Government Schemes</h3>
                    <ul>
                        <li><strong>PPF (Public Provident Fund):</strong> 15-year tax-free scheme backed by the Indian Government.</li>
                        <li><strong>Sovereign Gold Bonds (SGB) / Digital Gold:</strong> Paperless gold investment earning 2.5% extra interest per year without storage risks.</li>
                    </ul>

                    <h3>3. Market Investments</h3>
                    <ul>
                        <li><strong>Stocks:</strong> Partial ownership in companies. High return, high risk.</li>
                        <li><strong>Mutual Funds & ETFs:</strong> Diversified basket of stocks/bonds managed by professionals.</li>
                    </ul>
                `
            },
            {
                id: "l3-mutual-funds-sip-calc",
                title: "3. Mutual Funds & SIP Calculator",
                icon: "fa-solid fa-chart-line",
                content: `
                    <h2>Mutual Funds & SIPs</h2>
                    <p>Mutual funds pool money from thousands of small investors to purchase stocks, bonds, or money market assets.</p>

                    <h3>Types of Mutual Funds</h3>
                    <ul>
                        <li><strong>Equity Funds:</strong> Invest in company shares. Best for long-term growth (5+ years).</li>
                        <li><strong>Debt Funds:</strong> Invest in government and corporate bonds. Stable and low risk.</li>
                        <li><strong>Index Funds:</strong> Automatically copy stock market indices like Nifty 50 with ultra-low expense ratios.</li>
                    </ul>

                    <h3>What is a SIP (Systematic Investment Plan)?</h3>
                    <p>A method of investing fixed amounts regularly (e.g. ₹1,000 every month) into a mutual fund. It instills discipline and averages out market fluctuations (Rupee Cost Averaging).</p>

                    <div style="background: #e8f8f5; padding: 25px; border-radius: 15px; margin-top: 30px; border: 1px solid #2ecc71;">
                        <h3>📈 Interactive SIP Calculator</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                            <div>
                                <label style="font-weight:600; display:block;">Monthly Investment (₹)</label>
                                <input type="number" id="sipMonthly" value="5000" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-top:5px;">
                            </div>
                            <div>
                                <label style="font-weight:600; display:block;">Expected Return Rate (% p.a.)</label>
                                <input type="number" id="sipRate" value="12" step="0.5" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-top:5px;">
                            </div>
                            <div>
                                <label style="font-weight:600; display:block;">Time Period (Years)</label>
                                <input type="number" id="sipYears" value="10" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-top:5px;">
                            </div>
                        </div>
                        <button onclick="calculateSIP()" class="btn btn-primary" style="margin-top:15px; width:100%; background:#2ecc71; border-color:#2ecc71;">Calculate Future Wealth</button>
                        
                        <div id="sipResult" style="margin-top:20px; padding:15px; background:#fff; border-radius:10px; display:none;">
                            <p style="margin:5px 0;">Total Amount Invested: <strong id="resSipInvested" style="font-size:1.1rem; color:var(--primary-color);">₹0</strong></p>
                            <p style="margin:5px 0;">Estimated Returns: <strong id="resSipReturns" style="color:#2ecc71;">₹0</strong></p>
                            <p style="margin:5px 0;">Total Corpus Value: <strong id="resSipTotal" style="font-size:1.4rem; color:var(--secondary-color);">₹0</strong></p>
                        </div>
                    </div>
                `
            }
        ]
    },
    {
        level: "Level 4: Advanced Financial Knowledge",
        icon: "fa-solid fa-briefcase",
        topics: [
            {
                id: "l4-stock-market",
                title: "1. Stock Market Fundamentals",
                icon: "fa-solid fa-arrow-trend-up",
                content: `
                    <h2>Stock Market Fundamentals</h2>
                    <p>A stock exchange (like NSE or BSE in India) is a marketplace where shares of publicly listed companies are bought and sold.</p>

                    <h3>Key Concepts</h3>
                    <ul>
                        <li><strong>IPO (Initial Public Offering):</strong> When a private company sells its shares to the public for the first time.</li>
                        <li><strong>Market Capitalization:</strong> Total market value of a company's outstanding shares (Large-cap, Mid-cap, Small-cap).</li>
                        <li><strong>Dividends:</strong> Cash distribution of company profits directly to shareholders.</li>
                        <li><strong>Bull vs Bear Market:</strong> Bull market = stock prices rising; Bear market = stock prices falling by 20% or more.</li>
                    </ul>
                `
            },
            {
                id: "l4-portfolio-management",
                title: "2. Portfolio Management",
                icon: "fa-solid fa-chart-pie",
                content: `
                    <h2>Portfolio Management & Diversification</h2>
                    <p><em>"Do not put all your eggs in one basket."</em> Portfolio management is allocating assets across different investments to manage risk.</p>

                    <h3>Sample Asset Allocation Strategy</h3>
                    <ul>
                        <li><strong>Equity (60%):</strong> Growth driver for long-term wealth.</li>
                        <li><strong>Debt/Fixed Income (30%):</strong> Provides stability and cushion during market crashes.</li>
                        <li><strong>Gold/Real Estate (10%):</strong> Hedge against inflation and currency devaluation.</li>
                    </ul>
                `
            },
            {
                id: "l4-retirement-calculator",
                title: "3. Retirement Planning & Calculator",
                icon: "fa-solid fa-umbrella",
                content: `
                    <h2>Retirement Planning</h2>
                    <p>Retirement planning ensures you can maintain your lifestyle after you stop earning a active salary.</p>

                    <div style="background: #eaecee; padding: 25px; border-radius: 15px; margin-top: 30px; border: 1px solid var(--primary-color);">
                        <h3>🧮 Interactive Retirement Corpus Calculator</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                            <div>
                                <label style="font-weight:600; display:block;">Current Age</label>
                                <input type="number" id="retAgeNow" value="25" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-top:5px;">
                            </div>
                            <div>
                                <label style="font-weight:600; display:block;">Target Retirement Age</label>
                                <input type="number" id="retAgeTarget" value="60" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-top:5px;">
                            </div>
                            <div>
                                <label style="font-weight:600; display:block;">Current Monthly Expenses (₹)</label>
                                <input type="number" id="retExpNow" value="30000" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-top:5px;">
                            </div>
                            <div>
                                <label style="font-weight:600; display:block;">Expected Inflation (% p.a.)</label>
                                <input type="number" id="retInf" value="6" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ccc; margin-top:5px;">
                            </div>
                        </div>
                        <button onclick="calculateRetirement()" class="btn btn-primary" style="margin-top:15px; width:100%;">Calculate Required Corpus</button>
                        
                        <div id="retResult" style="margin-top:20px; padding:15px; background:#fff; border-radius:10px; display:none;">
                            <p style="margin:5px 0;">Monthly Expense at Retirement: <strong id="resRetExp" style="font-size:1.1rem; color:#e74c3c;">₹0</strong></p>
                            <p style="margin:5px 0;">Estimated Corpus Needed: <strong id="resRetCorpus" style="font-size:1.4rem; color:var(--primary-color);">₹0</strong></p>
                        </div>
                    </div>
                `
            }
        ]
    },
    {
        level: "Level 5: Cyber Safety & Fraud Prevention",
        icon: "fa-solid fa-shield-halved",
        topics: [
            {
                id: "l5-tax-awareness",
                title: "1. Income Tax & 80C Savings",
                icon: "fa-solid fa-file-invoice-dollar",
                content: `
                    <h2>Income Tax & 80C Tax Savings</h2>
                    <p>Tax literacy helps you legally minimize your tax outflow and redirect savings into wealth-building instruments.</p>

                    <h3>Key Definitions</h3>
                    <ul>
                        <li><strong>Financial Year (FY):</strong> April 1 to March 31. Tax returns must be filed by July 31 of the following year.</li>
                        <li><strong>Assessment Year (AY):</strong> The year in which income of the previous FY is assessed and taxed.</li>
                        <li><strong>TDS (Tax Deducted at Source):</strong> Your employer or bank deducts tax before crediting salary or interest into your account.</li>
                    </ul>

                    <h3>Major Tax-Saving Deductions</h3>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px; margin:20px 0;">
                        <div style="background:#eaf2f8; padding:16px; border-radius:10px; border-top:3px solid #3498db;">
                            <h4 style="margin:0 0 8px 0; color:#2980b9;">Section 80C — ₹1.5 Lakh</h4>
                            <ul style="margin:0; padding-left:18px; font-size:0.92rem;">
                                <li>PPF contributions</li>
                                <li>ELSS Mutual Funds (3-yr lock)</li>
                                <li>EPF / Employee PF</li>
                                <li>School tuition fees</li>
                                <li>Home loan principal repayment</li>
                            </ul>
                        </div>
                        <div style="background:#e8f8f5; padding:16px; border-radius:10px; border-top:3px solid #2ecc71;">
                            <h4 style="margin:0 0 8px 0; color:#27ae60;">Section 80D — ₹25,000</h4>
                            <ul style="margin:0; padding-left:18px; font-size:0.92rem;">
                                <li>Health insurance premium for self</li>
                                <li>Family health cover</li>
                                <li>Extra ₹25k for senior-citizen parents</li>
                            </ul>
                        </div>
                        <div style="background:#fef9e7; padding:16px; border-radius:10px; border-top:3px solid #f1c40f;">
                            <h4 style="margin:0 0 8px 0; color:#b7950b;">Other Sections</h4>
                            <ul style="margin:0; padding-left:18px; font-size:0.92rem;">
                                <li>80E — Education loan interest</li>
                                <li>80G — Donations to NGOs</li>
                                <li>HRA — House Rent Allowance exemption</li>
                            </ul>
                        </div>
                    </div>

                    <div style="background:#fdf2e9; border-left:5px solid #e67e22; padding:16px; border-radius:8px; margin-top:20px;">
                        <h4 style="margin:0; color:#d35400;">⚠️ Old vs New Tax Regime</h4>
                        <p style="margin:8px 0 0 0; font-size:0.95rem;">The <strong>New Regime</strong> has lower slab rates but disallows most deductions (80C, HRA, etc.). The <strong>Old Regime</strong> allows all deductions — beneficial if your total 80C + 80D + HRA exemptions exceed ₹3 Lakhs. Choose carefully every financial year at the time of filing ITR.</p>
                    </div>
                `
            },
            {
                id: "l5-upi-fraud",
                title: "2. UPI & Digital Payment Fraud",
                icon: "fa-solid fa-mobile-screen-button",
                content: `
                    <h2>UPI & Digital Payment Fraud — Complete Guide</h2>
                    <p>UPI has made payments instant and convenient, but scammers exploit this same speed to steal money in seconds.</p>

                    <div style="background:#fff5f5; border-left:5px solid #e74c3c; padding:20px; border-radius:12px; margin:20px 0;">
                        <h3 style="color:#c0392b; margin-top:0;">The Single Most Important Rule</h3>
                        <p style="font-size:1.1rem; font-weight:600; margin:0;">Your UPI PIN is ONLY entered to <span style="color:#c0392b;">SEND / DEBIT</span> money. You NEVER need to enter any PIN, scan any QR code, or click any link to <span style="color:#27ae60;">RECEIVE</span> money. Anyone who tells you otherwise is a scammer!</p>
                    </div>

                    <h3>6 Most Common UPI Scam Patterns</h3>
                    <ol style="line-height:1.9;">
                        <li><strong>Fake Collect Request:</strong> Scammer sends a ₹X "collect money" notification via GPay/PhonePe saying they transferred by mistake. Approving it DEDUCTS money from YOUR account!</li>
                        <li><strong>Fake QR Code Scan:</strong> Victim is told to scan a QR code to receive a refund or prize. Scanning and entering PIN sends money OUT of your account.</li>
                        <li><strong>Screen Mirroring Apps:</strong> Fraudster convinces victim to install AnyDesk/TeamViewer, then watches screen to steal UPI PIN and OTPs live.</li>
                        <li><strong>SIM Swap Attack:</strong> Scammer calls telecom company pretending to be you, gets your number ported to a new SIM, and intercepts all OTPs.</li>
                        <li><strong>Fake Bank Customer Care:</strong> Scammer Google-lists a fake customer care number, calls victims and asks for full 16-digit card number + OTP + CVV under the guise of "account verification".</li>
                        <li><strong>Telegram/WhatsApp Task Scam:</strong> "Earn ₹5,000/day liking YouTube videos" — requires initial deposit that is never returned.</li>
                    </ol>

                    <h3>Immediate Steps If Money Is Deducted Fraudulently</h3>
                    <div style="background:#eaf2f8; border:2px dashed #3498db; padding:18px; border-radius:10px; margin-top:15px;">
                        <ol style="margin:0; padding-left:20px; line-height:1.9;">
                            <li>Call <strong style="color:#c0392b; font-size:1.1rem;">1930</strong> — National Cyber Crime Helpline (available 24x7).</li>
                            <li>File complaint at <strong>cybercrime.gov.in</strong> within 2 hours for best chance of fund reversal.</li>
                            <li>Call your bank's emergency number and freeze your UPI + netbanking immediately.</li>
                            <li>File an FIR at the nearest police station (Cyber Cell) with screenshots and transaction IDs.</li>
                        </ol>
                    </div>
                `
            },
            {
                id: "l5-phishing",
                title: "3. Phishing, Smishing & Email Scams",
                icon: "fa-solid fa-envelope-open-text",
                content: `
                    <h2>Phishing, Smishing & Email Scams — Detailed Guide</h2>
                    <p>Phishing is the art of deceiving victims into surrendering confidential financial credentials through fake websites, SMS, or emails that look 100% genuine.</p>

                    <h3>Types of Phishing Attacks</h3>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:15px; margin:20px 0;">
                        <div style="background:#fff5f5; padding:16px; border-radius:10px; border-top:3px solid #e74c3c;">
                            <h4 style="margin:0 0 8px 0; color:#c0392b;">Phishing (Email)</h4>
                            <p style="margin:0; font-size:0.92rem;">Fake bank emails with links to clone websites. URL looks like <code>sbi-secure-login.com</code> instead of <code>sbi.co.in</code>. Entering credentials gives scammers direct account access.</p>
                        </div>
                        <div style="background:#fdf2e9; padding:16px; border-radius:10px; border-top:3px solid #e67e22;">
                            <h4 style="margin:0 0 8px 0; color:#d35400;">Smishing (SMS)</h4>
                            <p style="margin:0; font-size:0.92rem;">"Your KYC is pending! Click here within 24 hours or account will be blocked" — fake urgency with a malicious link embedded in SMS.</p>
                        </div>
                        <div style="background:#eaf2f8; padding:16px; border-radius:10px; border-top:3px solid #3498db;">
                            <h4 style="margin:0 0 8px 0; color:#2980b9;">Vishing (Voice Call)</h4>
                            <p style="margin:0; font-size:0.92rem;">Caller pretends to be TRAI officer, IT Department, or bank representative. Creates fake urgency ("your SIM will be blocked in 2 hours") to extract sensitive information.</p>
                        </div>
                    </div>

                    <h3>How to Identify a Phishing Website</h3>
                    <ul>
                        <li>Check the URL carefully — real banks use <code>.co.in</code> or <code>.com</code> exact domains, not slight variations.</li>
                        <li>Look for the padlock icon (HTTPS) — but note: even fake sites can have HTTPS. Always type bank URLs directly.</li>
                        <li>Phishing sites often have typos, poor formatting, or missing images.</li>
                        <li>Real banks NEVER redirect you from an SMS link to a page asking for full credentials.</li>
                    </ul>

                    <div style="background:#e8f8f5; border-left:4px solid #2ecc71; padding:16px; border-radius:8px; margin-top:15px;">
                        <h4 style="margin:0; color:#27ae60;">Safe Browsing Checklist</h4>
                        <ul style="margin:8px 0 0 0; padding-left:20px;">
                            <li>Bookmark your bank website — never search it on Google each time.</li>
                            <li>Enable login alerts (SMS + email) on all bank accounts.</li>
                            <li>Use a dedicated email address only for banking — never for shopping or social media.</li>
                            <li>Enable two-factor authentication (2FA) on all financial apps.</li>
                        </ul>
                    </div>
                `
            },
            {
                id: "l5-social-engineering",
                title: "4. Social Engineering & Digital Arrest",
                icon: "fa-solid fa-user-secret",
                content: `
                    <h2>Social Engineering & Digital Arrest Scams</h2>
                    <p>Social engineering manipulates human psychology — trust, fear, urgency, and greed — rather than hacking technology directly. It is the most dangerous form of financial fraud.</p>

                    <h3>The "Digital Arrest" Scam — India's Biggest 2024 Fraud</h3>
                    <div style="background:#fff5f5; border-left:5px solid #e74c3c; padding:20px; border-radius:10px; margin:20px 0;">
                        <h4 style="color:#c0392b; margin-top:0;">How it Works (Step-by-Step)</h4>
                        <ol style="line-height:1.9; margin:0; padding-left:20px;">
                            <li>Victim receives a video call from someone dressed as CBI officer, Customs officer, or Police inspector in a fake "office" background.</li>
                            <li>Scammer claims: "A parcel in your name contains drugs/fake currency. You are under Digital Arrest. Do NOT tell anyone."</li>
                            <li>Victim is kept on video call for hours or days (psychological isolation), not allowed to speak to family.</li>
                            <li>Scammer demands "bail money" or "verification deposit" via wire transfer to clear the victim's name.</li>
                        </ol>
                        <p style="margin:12px 0 0 0; font-weight:700; color:#c0392b; font-size:1rem;">TRUTH: No law in India allows police, CBI, TRAI, or customs to conduct arrests via video call. This is 100% fraud. Hang up immediately and call 1930.</p>
                    </div>

                    <h3>Other Social Engineering Tactics</h3>
                    <ul style="line-height:1.9;">
                        <li><strong>Lottery / KBC Scam:</strong> "You have won ₹25 Lakhs in KBC. Pay ₹5,000 processing fee to claim." Real lottery winnings never require upfront fees.</li>
                        <li><strong>Romance Scam:</strong> Fake profile builds emotional relationship online over months, then asks for money for "emergency", "visa", or "medical treatment".</li>
                        <li><strong>Impersonation of Relatives:</strong> Scammer calls claiming to be your son/daughter in an accident and needing money urgently. Always verify by calling the family member directly.</li>
                        <li><strong>Fake Government Officer:</strong> Caller claims your Aadhaar/PAN has been misused and demands immediate payment to avoid arrest.</li>
                    </ul>

                    <div style="background:#eaf2f8; border:1px solid #3498db; padding:16px; border-radius:10px; margin-top:15px;">
                        <h4 style="margin:0; color:#2980b9;">Psychological Defense: STOP — VERIFY — ACT</h4>
                        <ul style="margin:8px 0 0 0; padding-left:20px;">
                            <li><strong>STOP:</strong> Any real urgent financial threat will give you time. Artificial urgency is a red flag.</li>
                            <li><strong>VERIFY:</strong> Hang up. Call the official organization's number directly from their official website.</li>
                            <li><strong>ACT:</strong> If confirmed fraud, report to 1930 and cybercrime.gov.in immediately.</li>
                        </ul>
                    </div>
                `
            },
            {
                id: "l5-emergency-response",
                title: "5. Cyber Crime Emergency Response",
                icon: "fa-solid fa-truck-medical",
                content: `
                    <h2>Cyber Crime Emergency Response Plan</h2>
                    <p>Speed is everything. Acting within the <strong>first 2 hours</strong> after a financial cyber crime significantly increases the chance of fund recovery.</p>

                    <div style="background:#fff5f5; border:2px solid #e74c3c; border-radius:14px; padding:25px; margin:20px 0;">
                        <h3 style="color:#c0392b; margin-top:0;">⚡ 2-Hour Golden Window Action Plan</h3>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:15px; margin-top:15px;">
                            <div style="background:#fff; padding:16px; border-radius:10px; border-top:3px solid #e74c3c; text-align:center;">
                                <div style="font-size:1.8rem; color:#e74c3c; margin-bottom:8px;">1</div>
                                <h4 style="margin:0 0 6px 0;">Call 1930</h4>
                                <p style="margin:0; font-size:0.9rem;">National Cyber Crime Financial Helpline — active 24x7. Report the fraud immediately and request a hold on the fraudulent transaction.</p>
                            </div>
                            <div style="background:#fff; padding:16px; border-radius:10px; border-top:3px solid #e67e22; text-align:center;">
                                <div style="font-size:1.8rem; color:#e67e22; margin-bottom:8px;">2</div>
                                <h4 style="margin:0 0 6px 0;">Freeze Your Bank</h4>
                                <p style="margin:0; font-size:0.9rem;">Call your bank's 24x7 helpline and request immediate freeze of netbanking, UPI, and debit/credit cards.</p>
                            </div>
                            <div style="background:#fff; padding:16px; border-radius:10px; border-top:3px solid #3498db; text-align:center;">
                                <div style="font-size:1.8rem; color:#3498db; margin-bottom:8px;">3</div>
                                <h4 style="margin:0 0 6px 0;">File Online Report</h4>
                                <p style="margin:0; font-size:0.9rem;">Register a complaint at <strong>cybercrime.gov.in</strong> with screenshots, transaction IDs, and call recordings if available.</p>
                            </div>
                            <div style="background:#fff; padding:16px; border-radius:10px; border-top:3px solid #2ecc71; text-align:center;">
                                <div style="font-size:1.8rem; color:#2ecc71; margin-bottom:8px;">4</div>
                                <h4 style="margin:0 0 6px 0;">File FIR</h4>
                                <p style="margin:0; font-size:0.9rem;">Visit the nearest police station and file an FIR at the Cyber Crime Cell. Bring your complaint reference number from Step 3.</p>
                            </div>
                        </div>
                    </div>

                    <h3>Critical Official Helplines</h3>
                    <div style="background:#f8f9fa; padding:20px; border-radius:12px; border:1px solid #e0e0e0;">
                        <table style="width:100%; border-collapse:collapse; font-size:0.95rem;">
                            <thead>
                                <tr style="background:var(--primary-color); color:white;">
                                    <th style="padding:10px 14px; text-align:left; border-radius:6px 0 0 0;">Authority / Helpline</th>
                                    <th style="padding:10px 14px; text-align:left;">Contact</th>
                                    <th style="padding:10px 14px; text-align:left; border-radius:0 6px 0 0;">Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom:1px solid #eee;">
                                    <td style="padding:10px 14px; font-weight:600;">National Cyber Crime Helpline</td>
                                    <td style="padding:10px 14px; color:#c0392b; font-weight:700;">1930</td>
                                    <td style="padding:10px 14px;">Report financial cyber fraud 24x7</td>
                                </tr>
                                <tr style="border-bottom:1px solid #eee; background:#fafafa;">
                                    <td style="padding:10px 14px; font-weight:600;">Cyber Crime Portal</td>
                                    <td style="padding:10px 14px;">cybercrime.gov.in</td>
                                    <td style="padding:10px 14px;">Online FIR & complaint filing</td>
                                </tr>
                                <tr style="border-bottom:1px solid #eee;">
                                    <td style="padding:10px 14px; font-weight:600;">SIM Block / TAFCOP</td>
                                    <td style="padding:10px 14px;">tafcop.sancharsaathi.gov.in</td>
                                    <td style="padding:10px 14px;">Block stolen/lost SIM cards</td>
                                </tr>
                                <tr style="border-bottom:1px solid #eee; background:#fafafa;">
                                    <td style="padding:10px 14px; font-weight:600;">RBI Ombudsman</td>
                                    <td style="padding:10px 14px;">cms.rbi.org.in</td>
                                    <td style="padding:10px 14px;">Escalate unresolved bank disputes</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 14px; font-weight:600;">Women Helpline</td>
                                    <td style="padding:10px 14px; color:#c0392b; font-weight:700;">181</td>
                                    <td style="padding:10px 14px;">Financial exploitation & harassment</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 style="margin-top:25px;">How to Protect Yourself Going Forward</h3>
                    <ul style="line-height:1.9;">
                        <li>Set daily UPI transaction limits under ₹5,000 in your bank app settings.</li>
                        <li>Enable app lock and biometric authentication on all banking apps.</li>
                        <li>Regularly check your CIBIL report for unauthorized loan applications at <strong>cibil.com</strong>.</li>
                        <li>Verify all SIM cards registered to your Aadhaar at <strong>tafcop.sancharsaathi.gov.in</strong>.</li>
                        <li>Never use public Wi-Fi for internet banking or UPI transactions.</li>
                    </ul>
                `
            }
        ]
    },
    {
        level: "Special Module: Women's Finance",
        icon: "fa-solid fa-award",
        topics: [
            {
                id: "women-students",
                title: "Women Students",
                icon: "fa-solid fa-user-graduate",
                content: `
                    <h2>Step-by-Step Financial Management for Female Students</h2>
                    <p>Building strong money habits during student life lays the groundwork for lifelong independence and confidence.</p>

                    <h3>Step 1: Managing Pocket Money (The 70/20/10 Rule)</h3>
                    <ul>
                        <li><strong>70% Daily Essentials:</strong> Canteen, prints, college commute, basic stationery.</li>
                        <li><strong>20% Personal Savings:</strong> Keep this untouched in a separate savings account for unexpected emergencies or tech upgrades.</li>
                        <li><strong>10% Skill Growth:</strong> Invest in online certifications, books, workshops, or career courses.</li>
                    </ul>

                    <h3>Step 2: Opening Your First Bank Account & Digital Safety</h3>
                    <p>Open a Zero-Balance Student Savings Account (e.g., SBI Pehla Kadam or ICICI Campus Account). Set up UPI on GPay/PhonePe and keep daily transaction limits under ₹2,000 for security.</p>

                    <h3>Step 3: Building Early Financial Discipline</h3>
                    <ul>
                        <li>Avoid BNPL (Buy Now Pay Later) apps that trap students in early debt.</li>
                        <li>Track expenses weekly using the <a href="tracker.html">SheFinance Expense Tracker</a>.</li>
                    </ul>
                `
            },
            {
                id: "homemakers",
                title: "Homemakers",
                icon: "fa-solid fa-house-chimney-user",
                content: `
                    <h2>Step-by-Step Financial Management for Homemakers</h2>
                    <p>Homemakers manage the operational budget of the home. Here is how to turn household savings into personal wealth.</p>

                    <h3>Step 1: The Envelope / Bucket System for Household Expenses</h3>
                    <p>Divide monthly household money into dedicated physical or digital envelopes:</p>
                    <ul>
                        <li><strong>Envelope 1 (Groceries & Milk):</strong> Fixed allocation at month start.</li>
                        <li><strong>Envelope 2 (Utility Bills):</strong> Electricity, gas cylinder, internet, water.</li>
                        <li><strong>Envelope 3 (Children & Health):</strong> Medicines, school activities.</li>
                        <li><strong>Envelope 4 (Personal Savings):</strong> Minimum 10% reserved for yourself.</li>
                    </ul>

                    <h3>Step 2: Building Your Own Personal Stree Dhan / Emergency Fund</h3>
                    <p>Do not keep savings hidden in cash inside kitchen containers where inflation erodes its value! Open a personal savings account in your name and deposit your savings electronically.</p>

                    <h3>Step 3: Financial Rights & Nominations</h3>
                    <p>Ensure you are listed as a <strong>Joint Holder</strong> or primary <strong>Nominee</strong> on family bank accounts, property documents, and insurance policies.</p>
                `
            },
            {
                id: "working-women",
                title: "Working Women",
                icon: "fa-solid fa-briefcase",
                content: `
                    <h2>Step-by-Step Financial Management for Working Women</h2>
                    <p>Earning an income is only half the journey; actively managing, protecting, and investing it creates true independence.</p>

                    <h3>Step 1: First Salary & Pay Slip Breakdown</h3>
                    <ul>
                        <li><strong>Basic Salary:</strong> Basis for Provident Fund (EPF) and Gratuity.</li>
                        <li><strong>EPF (Employee Provident Fund):</strong> 12% auto-deducted from salary and matched by employer—a long-term tax-free retirement cushion under Section 80C.</li>
                        <li><strong>Net Take-Home:</strong> Allocate this using the 50/30/20 budget framework.</li>
                    </ul>

                    <h3>Step 2: Building Your 6-Month Emergency Cushion</h3>
                    <p>Before buying luxury items or taking major loans, accumulate 6 months of basic living costs in a liquid mutual fund or high-interest savings account.</p>

                    <h3>Step 3: Independent Tax & Investment Planning</h3>
                    <div style="background:#e8f8f5; padding:15px; border-radius:10px; border-left:4px solid #2ecc71; margin:15px 0;">
                        <h4 style="margin:0; color:#27ae60;">💡 Investing Strategy:</h4>
                        <ul style="margin-top:10px;">
                            <li>Start a monthly <strong>SIP (Systematic Investment Plan)</strong> in Low-Cost Index Funds (Nifty 50) for long-term wealth.</li>
                            <li>Utilize <strong>ELSS Mutual Funds</strong> for tax saving under Section 80C (lowest lock-in period of 3 years).</li>
                        </ul>
                    </div>

                    <h3>Step 4: Personal Insurance & Retirement Independence</h3>
                    <p>Do not depend solely on corporate health cover or a spouse's policy. Purchase individual <strong>Health Insurance</strong> (₹5-10 Lakhs sum insured) and a pure <strong>Term Insurance</strong> policy early when premiums are low.</p>
                `
            },
            {
                id: "women-entrepreneurs",
                title: "Women Entrepreneurs",
                icon: "fa-solid fa-rocket",
                content: `
                    <h2>Step-by-Step Financial Management for Female Founders</h2>
                    <p>Whether running a home boutique, freelance agency, tech startup, or retail shop, structured financial management is critical for business survival.</p>

                    <h3>Step 1: Separate Business & Personal Money Immediately</h3>
                    <ul>
                        <li>Open a dedicated <strong>Current Account</strong> for your business entity.</li>
                        <li>Never pay personal grocery or home bills directly from business sales.</li>
                        <li>Pay yourself a fixed monthly salary from your business revenue.</li>
                    </ul>

                    <h3>Step 2: Managing Business Cash Flow & Working Capital</h3>
                    <p>Track cash coming in vs going out weekly. Maintain a 3-month operational buffer for rent, supplier payments, and staff wages.</p>

                    <h3>Step 3: Basic Accounting & Tax Compliance</h3>
                    <p>Keep invoices organized and register for GST if your annual turnover exceeds ₹20 Lakhs (services) or ₹40 Lakhs (goods).</p>
                `
            }
        ]
    },
    {
        level: "Government Schemes for Women",
        icon: "fa-solid fa-landmark",
        topics: [
            {
                id: "gov-savings-schemes",
                title: "1. Savings & Long-Term Deposit Schemes",
                icon: "fa-solid fa-piggy-bank",
                content: `
                    <h2>Government Savings & Deposit Schemes for Women</h2>
                    <p>The Government of India offers government-backed, high-yield, tax-exempt savings options specifically designed to secure the financial future of women and girl children.</p>

                    <!-- 1. SSY -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Savings & Girl Child Welfare</span>
                            <h3 class="scheme-title">👧 Sukanya Samriddhi Yojana (SSY)</h3>
                            <div class="scheme-target-tag">For: Girl child below 10 years of age</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Interest Rate</strong>
                                8.2% p.a. (Highest Govt Small Savings Rate)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Min Deposit</strong>
                                ₹250 per financial year
                            </div>
                            <div class="stat-pill-item">
                                <strong>Max Deposit</strong>
                                ₹1.5 Lakh per financial year
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Eligibility Criteria</h4>
                                <ul>
                                    <li>Girl child under 10 years of age</li>
                                    <li>Must be an Indian resident</li>
                                    <li>Maximum 2 girl children per family (exceptions for twins/triplets)</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-gift" style="color:#e67e22;"></i> Key Benefits</h4>
                                <ul>
                                    <li>Highest interest rate among government small savings schemes</li>
                                    <li>100% Tax-Exempt under EEE (Exempt on deposit, interest, and maturity)</li>
                                    <li>Partial withdrawal (up to 50%) permitted for higher education after age 18</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-file-lines" style="color:#2980b9;"></i> Required Documents</h4>
                                <p>Birth Certificate of Girl Child, Aadhaar Card of Parent/Guardian, Address Proof, Passport Photographs.</p>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Apply</h4>
                                <p>Visit any India Post Office or authorized commercial bank branch (SBI, PNB, ICICI, Bank of Baroda) with required documents.</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.indiapost.gov.in/banking-services/savings" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>

                    <!-- 2. PPF -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Long-Term Savings & Tax Planning</span>
                            <h3 class="scheme-title">🏦 Public Provident Fund (PPF)</h3>
                            <div class="scheme-target-tag">For: Indian citizens (Women & Individuals)</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Interest Rate</strong>
                                7.1% p.a. (Government Guaranteed)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Min Deposit</strong>
                                ₹500 per year
                            </div>
                            <div class="stat-pill-item">
                                <strong>Max Deposit / Tenure</strong>
                                ₹1.5 Lakh / year | 15 Years Tenure
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Eligibility Criteria</h4>
                                <ul>
                                    <li>Indian resident individual of any age</li>
                                    <li>Can open single account in own name or on behalf of a minor</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-gift" style="color:#e67e22;"></i> Key Benefits</h4>
                                <ul>
                                    <li>100% Tax-Free returns under Section 80C (EEE status)</li>
                                    <li>Loan facility available from 3rd to 6th financial year</li>
                                    <li>Account cannot be attached by court order for debts</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-file-lines" style="color:#2980b9;"></i> Required Documents</h4>
                                <p>PAN Card, Aadhaar Card, Passport Size Photos, Bank Savings Account details.</p>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Apply</h4>
                                <p>Apply online via NetBanking in major banks (SBI, HDFC, ICICI) or visit any India Post Office / Bank Branch.</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.nsiindia.gov.in/" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>

                    <!-- 3. MSSC -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: High-Yield Women Savings</span>
                            <h3 class="scheme-title">🏦 Mahila Samman Savings Certificate (MSSC)</h3>
                            <div class="scheme-target-tag">For: All Indian Women & Girl Children</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Interest Rate</strong>
                                7.5% p.a. (Compounded Quarterly)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Tenure</strong>
                                2 Years Fixed Deposit
                            </div>
                            <div class="stat-pill-item">
                                <strong>Deposit Limit</strong>
                                ₹1,000 to ₹2,000,000 (₹2 Lakhs)
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Eligibility Criteria</h4>
                                <ul>
                                    <li>Any woman resident of India or a minor girl child represented by a guardian</li>
                                    <li>Flexible deposit range from ₹1,000 up to ₹2 Lakhs in multiples of ₹100</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-gift" style="color:#e67e22;"></i> Key Benefits</h4>
                                <ul>
                                    <li>Fixed 7.5% guaranteed interest backed by the Union Ministry of Finance</li>
                                    <li>Partial withdrawal up to 40% of eligible balance permitted after 1 year</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-file-lines" style="color:#2980b9;"></i> Required Documents</h4>
                                <p>Aadhaar Card, PAN Card, Account Opening Form, Passport Size Photograph.</p>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Apply</h4>
                                <p>Visit any India Post Office branch or authorized public/private commercial bank (SBI, Bank of Baroda, Canara Bank, PNB).</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Savings-Schemes.aspx" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>
                `
            },
            {
                id: "gov-scholarship-schemes",
                title: "2. Scholarships for Women & Girls",
                icon: "fa-solid fa-graduation-cap",
                content: `
                    <h2>🎓 Government Scholarships for Women & Girls</h2>
                    <p>Financial grants and scholarships offered by Central Ministries and UGC to promote education and technical training for female students.</p>

                    <!-- 3. AICTE Pragati -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Technical Education</span>
                            <h3 class="scheme-title">🎓 AICTE Pragati Scholarship for Girl Students</h3>
                            <div class="scheme-target-tag">For: Eligible girl students in AICTE-approved Degree / Diploma courses</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Scholarship Amount</strong>
                                ₹50,000 / year (DBT directly to bank)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Course Level</strong>
                                AICTE Technical Degree / Diploma
                            </div>
                            <div class="stat-pill-item">
                                <strong>Family Income Ceiling</strong>
                                &lt; ₹8 Lakhs per year
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Eligibility Criteria</h4>
                                <ul>
                                    <li>Girl student admitted to 1st year of Degree/Diploma in AICTE approved institution</li>
                                    <li>Family income less than ₹8 Lakh per annum</li>
                                    <li>Maximum 2 girl children per family eligible</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-gift" style="color:#e67e22;"></i> Scholarship Benefits</h4>
                                <ul>
                                    <li>₹50,000 per annum credited directly via Direct Benefit Transfer (DBT)</li>
                                    <li>Covers college tuition fee, books, laptop/computer, and hostel expenses</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-file-lines" style="color:#2980b9;"></i> Required Documents</h4>
                                <p>10th/12th Marksheets, Family Income Certificate from Tehsildar/SDM, Admission Letter, Aadhaar-linked Bank Account.</p>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Apply</h4>
                                <p>Register and submit online application on the AICTE Scholarship Portal or National Scholarship Portal (NSP).</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://fellowship.aicte.gov.in/" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>

                    <!-- 4. CBSE Single Girl Child -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: School Education</span>
                            <h3 class="scheme-title">👧 CBSE Single Girl Child Merit Scholarship</h3>
                            <div class="scheme-target-tag">For: Eligible single girl children pursuing XI & XII in CBSE</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Qualifying Criteria</strong>
                                60%+ marks in CBSE Class X
                            </div>
                            <div class="stat-pill-item">
                                <strong>School Type</strong>
                                CBSE-affiliated schools
                            </div>
                            <div class="stat-pill-item">
                                <strong>Benefit Mode</strong>
                                Direct Bank Transfer
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Eligibility Criteria</h4>
                                <ul>
                                    <li>Single girl child of parents (only child in family)</li>
                                    <li>Passed Class X from CBSE with minimum 60% aggregate marks</li>
                                    <li>Currently studying in Class XI or XII in a CBSE affiliated school</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-gift" style="color:#e67e22;"></i> Key Benefits</h4>
                                <ul>
                                    <li>Direct monthly financial scholarship credited to student's bank account</li>
                                    <li>Supports completion of higher secondary education without financial strain</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-file-lines" style="color:#2980b9;"></i> Required Documents</h4>
                                <p>Class X Marksheet, Affidavit of Single Girl Child on non-judicial stamp paper, School Principal verification form, Bank Passbook.</p>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Apply</h4>
                                <p>Apply online through the official CBSE Scholarship Portal during the open notification window.</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.cbse.gov.in/cbsenew/scholar.html" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>

                    <!-- 5. UGC Single Girl Child -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Higher / Post-Graduate Education</span>
                            <h3 class="scheme-title">🎓 UGC Indira Gandhi Scholarship for Single Girl Child</h3>
                            <div class="scheme-target-tag">For: Single girl child pursuing regular Master's (PG) course</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Financial Support</strong>
                                ₹36,200 / year (for 2 years)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Level</strong>
                                1st Year Post-Graduation (PG)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Age Limit</strong>
                                Up to 30 years at admission
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Eligibility Criteria</h4>
                                <ul>
                                    <li>Single girl child of her parents</li>
                                    <li>Enrolled in regular, full-time 1st year Master's degree in recognized university</li>
                                    <li>Age below 30 years at the time of admission</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-gift" style="color:#e67e22;"></i> Key Benefits</h4>
                                <ul>
                                    <li>₹36,200 per annum paid directly to bank account for full 2-year tenure</li>
                                    <li>Covers PG tuition fees, research materials, and living expenses</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-file-lines" style="color:#2980b9;"></i> Required Documents</h4>
                                <p>PG Admission proof, Single Girl Child Affidavit, Aadhaar Card, Student Bank Account Passbook.</p>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Apply</h4>
                                <p>Apply online on the National Scholarship Portal (NSP) under the UGC section.</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.ugc.gov.in/Scholarships/stu_Scholarship4" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>
                `
            },
            {
                id: "gov-business-schemes",
                title: "3. Business & Entrepreneurship Loans",
                icon: "fa-solid fa-briefcase",
                content: `
                    <h2>👩💼 Business & Entrepreneurship Loan Schemes for Women</h2>
                    <p>Government initiatives providing collateral-free credit, subsidized loans, and enterprise support to empower female entrepreneurs.</p>

                    <!-- 6. PMMY -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Micro Enterprise Credit</span>
                            <h3 class="scheme-title">👩💼 Pradhan Mantri MUDRA Yojana (PMMY)</h3>
                            <div class="scheme-target-tag">For: Micro & Small Enterprises, Non-Farm Women Entrepreneurs</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Loan Ceiling</strong>
                                Up to ₹20 Lakhs (Updated Guideline)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Collateral</strong>
                                ZERO Collateral / Guarantor Required
                            </div>
                            <div class="stat-pill-item">
                                <strong>Categories</strong>
                                Shishu | Kishore | Tarun
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-layer-group" style="color:#8e44ad;"></i> Loan Categories</h4>
                                <ul>
                                    <li><strong>Shishu:</strong> Loans up to ₹50,000 for starting micro-units</li>
                                    <li><strong>Kishore:</strong> Loans from ₹50,000 to ₹5 Lakhs for expanding business</li>
                                    <li><strong>Tarun:</strong> Loans from ₹5 Lakhs up to ₹20 Lakhs for established enterprises</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-gift" style="color:#e67e22;"></i> Key Benefits</h4>
                                <ul>
                                    <li>No collateral or third-party guarantor needed</li>
                                    <li>Includes Mudra Debit Card for seamless cash withdrawal and working capital management</li>
                                    <li>Special priority and interest concessions for women entrepreneurs</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-file-lines" style="color:#2980b9;"></i> Required Documents</h4>
                                <p>Business Plan / Proposal, ID & Address Proof (Aadhaar/PAN), Machine/Equipment Quotations, Bank Statements (last 6 months).</p>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Apply</h4>
                                <p>Apply online via government JanSamarth portal or visit any public/private sector bank branch.</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.mudra.org.in/" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>

                    <!-- 7. WEP (Women Entrepreneurship Platform - NITI Aayog) -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Women Entrepreneurship & Incubation</span>
                            <h3 class="scheme-title">👩💼 Women Entrepreneurship Platform (WEP - NITI Aayog)</h3>
                            <div class="scheme-target-tag">For: Women Founders, Startup Aspirants & Micro-Entrepreneurs</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Government Nodal Agency</strong>
                                NITI Aayog, Govt. of India
                            </div>
                            <div class="stat-pill-item">
                                <strong>Key Pillars</strong>
                                Incubation, Funding & Credit Access
                            </div>
                            <div class="stat-pill-item">
                                <strong>Support Type</strong>
                                Mentorship & Market Linkages
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Eligibility Criteria</h4>
                                <ul>
                                    <li>Any Indian woman entrepreneur or aspiring founder starting a business</li>
                                    <li>Women-led micro, small, and medium enterprises (MSMEs)</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-gift" style="color:#e67e22;"></i> Key Benefits</h4>
                                <ul>
                                    <li>Direct connection to government funding schemes, venture capital, and SIDBI loan programs</li>
                                    <li>Free legal, accounting, and compliance assistance along with corporate mentorship</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-file-lines" style="color:#2980b9;"></i> Required Documents</h4>
                                <p>Aadhaar Card, Business Registration/Udyam Certificate (if available), PAN Card, Bank Details.</p>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Register</h4>
                                <p>Register online directly on NITI Aayog's official WEP portal (wep.gov.in).</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://wep.gov.in/" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>
                `
            },
            {
                id: "gov-welfare-schemes",
                title: "4. Financial Inclusion, Insurance & Pension",
                icon: "fa-solid fa-shield-halved",
                content: `
                    <h2>🛡️ Financial Inclusion, Insurance & Pension Schemes</h2>
                    <p>Government initiatives promoting direct bank accounts, affordable insurance cover, and retirement security for women.</p>

                    <!-- 8. PMJDY -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Financial Inclusion & Banking</span>
                            <h3 class="scheme-title">🏦 Pradhan Mantri Jan-Dhan Yojana (PMJDY)</h3>
                            <div class="scheme-target-tag">For: Unbanked & Underbanked Women / Citizens</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Minimum Balance</strong>
                                ₹0 (Zero Balance Account)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Accident Insurance</strong>
                                ₹2 Lakhs Free RuPay Cover
                            </div>
                            <div class="stat-pill-item">
                                <strong>Overdraft Facility</strong>
                                Up to ₹10,000 (Priority for female head)
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-gift" style="color:#e67e22;"></i> Key Benefits</h4>
                                <ul>
                                    <li>Free RuPay Debit Card with built-in ₹2 Lakh accidental insurance</li>
                                    <li>Direct receipt of all Government DBT subsidies (LPG, MNREGA, PM-KISAN)</li>
                                    <li>Access to pension, micro-insurance, and ₹10,000 overdraft facility</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-file-lines" style="color:#2980b9;"></i> Required Documents</h4>
                                <p>Aadhaar Card (or Voter ID / Driving License / NREGA card) and Passport Photo.</p>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Open Account</h4>
                                <p>Visit any commercial bank branch or Bank Mitra kiosk with your Aadhaar card.</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://pmjdy.gov.in/" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>

                    <!-- 9. PMJJBY -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Life Insurance</span>
                            <h3 class="scheme-title">🛡️ PM Jeevan Jyoti Bima Yojana (PMJJBY)</h3>
                            <div class="scheme-target-tag">For: Bank Account Holders aged 18 to 50 years</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Life Coverage</strong>
                                ₹2 Lakhs (Death due to any cause)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Age Limit</strong>
                                18 – 50 years
                            </div>
                            <div class="stat-pill-item">
                                <strong>Enrollment</strong>
                                Auto-debited annual premium
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Eligibility Criteria</h4>
                                <ul>
                                    <li>Savings bank account holder aged 18-50 years</li>
                                    <li>Consent to join auto-debit facility for annual premium</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-gift" style="color:#e67e22;"></i> Key Benefits</h4>
                                <ul>
                                    <li>₹2 Lakh life insurance sum paid to nominee upon death of subscriber due to any cause</li>
                                    <li>Hassle-free automatic annual renewal</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Enrol</h4>
                                <p>Enable through your bank's NetBanking app or submit auto-debit consent form at your bank branch.</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.jansuraksha.gov.in/" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>

                    <!-- 10. PMSBY -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Personal Accident Insurance</span>
                            <h3 class="scheme-title">🛡️ PM Suraksha Bima Yojana (PMSBY)</h3>
                            <div class="scheme-target-tag">For: Bank Account Holders aged 18 to 70 years</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Accident Coverage</strong>
                                ₹2 Lakhs (Death / Full Disability)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Annual Premium</strong>
                                ₹20 / year (Auto-debited)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Age Limit</strong>
                                18 – 70 years
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Eligibility & Cover Details</h4>
                                <ul>
                                    <li>₹2 Lakhs cover for accidental death or permanent total disability</li>
                                    <li>₹1 Lakh cover for permanent partial disability</li>
                                    <li>Only ₹20 per year premium auto-debited from bank savings account</li>
                                </ul>
                            </div>

                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-route" style="color:#8e44ad;"></i> How to Enrol</h4>
                                <p>Enable via bank NetBanking / Mobile app or consent form at bank branch.</p>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.jansuraksha.gov.in/" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>

                    <!-- 11. APY -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Guaranteed Pension & Retirement</span>
                            <h3 class="scheme-title">👵 Atal Pension Yojana (APY)</h3>
                            <div class="scheme-target-tag">For: Unorganized sector workers & women aged 18 to 40 years</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Monthly Pension</strong>
                                ₹1,000 to ₹5,000 / month after age 60
                            </div>
                            <div class="stat-pill-item">
                                <strong>Age at Entry</strong>
                                18 – 40 years
                            </div>
                            <div class="stat-pill-item">
                                <strong>Spouse Benefit</strong>
                                Guaranteed same pension to spouse
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Key Benefits</h4>
                                <ul>
                                    <li>Guaranteed monthly pension (₹1k/₹2k/₹3k/₹4k/₹5k) after reaching age 60 based on contribution</li>
                                    <li>In case of death of subscriber, spouse receives same pension for life</li>
                                    <li>Accumulated pension corpus returned to nominee after death of both subscriber and spouse</li>
                                </ul>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.pfrda.org.in/" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>

                    <!-- 12. PM-KISAN -->
                    <div class="scheme-card-box">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge">Category: Agriculture & Rural Support</span>
                            <h3 class="scheme-title">👩🌾 PM-KISAN (Kisan Samman Nidhi)</h3>
                            <div class="scheme-target-tag">For: Landholding female & male farmer families</div>
                        </div>

                        <div class="scheme-stats-grid">
                            <div class="stat-pill-item">
                                <strong>Financial Support</strong>
                                ₹6,000 / year (3 installments of ₹2,000)
                            </div>
                            <div class="stat-pill-item">
                                <strong>Mode</strong>
                                100% Direct Benefit Transfer (DBT)
                            </div>
                        </div>

                        <div class="scheme-details-collapsible">
                            <div class="scheme-detail-block">
                                <h4><i class="fa-solid fa-circle-check" style="color:#27ae60;"></i> Eligibility & Application</h4>
                                <ul>
                                    <li>Cultivable landholding farmer families in state records</li>
                                    <li>Direct cash transfer to bank account linked with Aadhaar</li>
                                    <li>Apply online via PM-KISAN portal or Common Service Center (CSC)</li>
                                </ul>
                            </div>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://pmkisan.gov.in/" target="_blank" class="btn-official-source"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Official Portal ↗</a>
                        </div>
                    </div>
                `
            },
            {
                id: "gov-scheme-finder",
                title: "5. Official Government Scheme Portals",
                icon: "fa-solid fa-magnifying-glass",
                content: `
                    <h2>🔎 Find Central & State Government Schemes</h2>
                    <p>Discover and explore official government portals designed to help women find financial schemes, micro-loans, scholarships, and welfare benefits across India.</p>

                    <!-- myScheme Portal Box -->
                    <div class="scheme-card-box" style="border: 2px solid var(--secondary-color); background: #ffffff;">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge" style="background:var(--secondary-color); color:#fff;">National Scheme Aggregator</span>
                            <h3 class="scheme-title">🌐 myScheme — National Government Scheme Portal</h3>
                            <div class="scheme-target-tag">Single-window platform for discovering 1,000+ government schemes</div>
                        </div>

                        <div style="background:#f8fafc; padding:18px; border-radius:10px; margin:16px 0; border:1px solid #e2e8f0;">
                            <strong style="color:var(--primary-color); display:block; margin-bottom:10px; font-size:1rem;"><i class="fa-solid fa-sliders" style="color:var(--secondary-color);"></i> How to search schemes on myScheme:</strong>
                            <ul style="line-height:1.8; margin:0; padding-left:20px; color:#475569; font-size:0.92rem;">
                                <li>Filter schemes by <strong>Gender, Age, Occupation, and Family Income</strong></li>
                                <li>Explore categories: <em>Banking, Micro-Loans, Women Welfare, Education, and Agriculture</em></li>
                                <li>Check detailed eligibility, documents checklist, and official application links directly</li>
                            </ul>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.myscheme.gov.in/" target="_blank" class="btn-official-source" style="background:var(--primary-color); color:#fff; border:none; padding:10px 22px; font-size:0.95rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit myScheme Portal ↗</a>
                        </div>
                    </div>

                    <!-- JanSamarth Credit Portal Box -->
                    <div class="scheme-card-box" style="border: 1px solid #e2e8f0; background: #ffffff;">
                        <div class="scheme-card-header">
                            <span class="scheme-category-badge" style="background:#eaf2f8; color:#2980b9;">Government Credit Loans</span>
                            <h3 class="scheme-title">🏛️ JanSamarth — National Credit Linked Portal</h3>
                            <div class="scheme-target-tag">Digital portal connecting borrowers directly with banks for credit schemes</div>
                        </div>

                        <div style="background:#f8fafc; padding:18px; border-radius:10px; margin:16px 0; border:1px solid #e2e8f0;">
                            <strong style="color:var(--primary-color); display:block; margin-bottom:10px; font-size:1rem;"><i class="fa-solid fa-building-columns" style="color:#2980b9;"></i> Credit Schemes Available:</strong>
                            <ul style="line-height:1.8; margin:0; padding-left:20px; color:#475569; font-size:0.92rem;">
                                <li><strong>Pradhan Mantri MUDRA Yojana (PMMY)</strong> — Loans up to ₹20 Lakhs</li>
                                <li><strong>Livelihood & Business Loans</strong> — Subsidized credit for women entrepreneurs</li>
                                <li>Direct online eligibility check, bank selection, and digital loan application approval</li>
                            </ul>
                        </div>

                        <div class="scheme-card-footer" style="justify-content: flex-end;">
                            <a href="https://www.jansamarth.in/" target="_blank" class="btn-official-source" style="background:#2980b9; color:#fff; border:none; padding:10px 22px; font-size:0.95rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit JanSamarth Credit Portal ↗</a>
                        </div>
                    </div>

                    <!-- Quick Official Portals Directory -->
                    <div style="background:#fdfdfd; padding:22px; border-radius:12px; border:2px dashed var(--secondary-color); margin-top:24px;">
                        <h3 style="margin:0 0 14px 0; color:var(--primary-color); font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-link" style="color:var(--secondary-color);"></i> Official Women Empowerment Portals Directory
                        </h3>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:14px;">
                            <a href="https://wcd.nic.in" target="_blank" style="display:block; padding:12px 16px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; text-decoration:none; color:var(--primary-color); font-weight:600; font-size:0.9rem; transition:all 0.2s;">
                                👩💼 Ministry of Women & Child Dev <i class="fa-solid fa-arrow-up-right-from-square" style="float:right; font-size:0.8rem; margin-top:3px;"></i>
                            </a>
                            <a href="https://nari.nic.in" target="_blank" style="display:block; padding:12px 16px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; text-decoration:none; color:var(--primary-color); font-weight:600; font-size:0.9rem; transition:all 0.2s;">
                                🌟 NARI Portal (Women Empowerment) <i class="fa-solid fa-arrow-up-right-from-square" style="float:right; font-size:0.8rem; margin-top:3px;"></i>
                            </a>
                            <a href="https://wep.gov.in/" target="_blank" style="display:block; padding:12px 16px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; text-decoration:none; color:var(--primary-color); font-weight:600; font-size:0.9rem; transition:all 0.2s;">
                                🚀 WEP Platform (NITI Aayog) <i class="fa-solid fa-arrow-up-right-from-square" style="float:right; font-size:0.8rem; margin-top:3px;"></i>
                            </a>
                            <a href="https://www.india.gov.in" target="_blank" style="display:block; padding:12px 16px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; text-decoration:none; color:var(--primary-color); font-weight:600; font-size:0.9rem; transition:all 0.2s;">
                                 National Portal of India <i class="fa-solid fa-arrow-up-right-from-square" style="float:right; font-size:0.8rem; margin-top:3px;"></i>
                            </a>
                        </div>
                    </div>
                `
            }
        ]
    }
];

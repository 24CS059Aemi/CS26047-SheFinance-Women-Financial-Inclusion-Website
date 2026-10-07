const express = require('express');
const router = express.Router();
const axios = require('axios');
const Scheme = require('../models/Scheme');

// ─── Seed data: curated women-focused govt schemes ────────────────────────────
// Used as fallback when API is unavailable and DB is empty
const SEED_SCHEMES = [
  {
    title: 'Mahila Samman Savings Certificate (MSSC)',
    category: 'Savings',
    ministry: 'Ministry of Finance',
    benefits: '7.5% Fixed Interest per annum. Tax benefits under Section 80C.',
    eligibility: 'Any woman of any age. Can also be opened for a minor girl child.',
    documents: ['Aadhaar Card', 'PAN Card', 'Account Opening Form', 'Passport Photograph'],
    officialLink: 'https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Savings-Schemes.aspx',
    deadline: '31 March 2025',
    tags: ['women', 'savings', 'post office', 'fixed interest'],
    description: 'A one-time deposit scheme exclusively for women offering 7.5% p.a. fixed interest for 2-year tenure. Backed by Ministry of Finance, available at all Post Offices across India.',
    source: 'seed'
  },
  {
    title: 'Pradhan Mantri Mudra Yojana (PMMY)',
    category: 'Business Loan',
    ministry: 'Ministry of Finance',
    benefits: 'Collateral-free loans up to ₹20 Lakhs for micro/small businesses.',
    eligibility: 'Women entrepreneurs running or planning non-farm micro/small businesses.',
    documents: ['Business Plan/Proposal', 'KYC Documents (Aadhaar & PAN)', 'Quotation of Machinery/Equipment', 'Bank Statements (last 6 months)'],
    officialLink: 'https://www.mudra.org.in',
    deadline: 'Ongoing',
    tags: ['women', 'business', 'loan', 'mudra', 'entrepreneur'],
    description: 'Under PMMY, loans under Shishu (up to ₹50,000), Kishore (₹50,000–₹5 Lakh) and Tarun (₹5 Lakh–₹20 Lakh) categories are provided to women entrepreneurs without collateral.',
    source: 'seed'
  },
  {
    title: 'Sukanya Samriddhi Yojana (SSY)',
    category: 'Girl Child',
    ministry: 'Ministry of Women & Child Development',
    benefits: '8.2% Tax-Free Interest Rate. Eligible for deduction under Section 80C.',
    eligibility: 'Parents/guardians of girl child below 10 years of age. Max 2 accounts per family.',
    documents: ['Birth Certificate of Girl Child', 'Aadhaar/ID Proof of Parent/Guardian', 'Address Proof', 'Passport Photographs'],
    officialLink: 'https://www.indiapost.gov.in',
    deadline: 'Ongoing',
    tags: ['girl child', 'savings', 'education', 'tax benefit'],
    description: "A government-backed savings scheme to secure the girl child's future for education and marriage. Offers highest interest rates among small savings schemes with full tax exemption.",
    source: 'seed'
  },
  {
    title: 'Stand-Up India Scheme',
    category: 'Entrepreneurship',
    ministry: 'Ministry of Finance / SIDBI',
    benefits: 'Bank loans from ₹10 Lakhs to ₹1 Crore for greenfield enterprises.',
    eligibility: 'SC/ST and Women Entrepreneurs above 18 years of age. At least one per bank branch.',
    documents: ['Business Plan', 'KYC Documents', 'Educational Qualification Proof', 'SC/ST Certificate if applicable'],
    officialLink: 'https://www.standupmitra.in',
    deadline: 'Ongoing',
    tags: ['entrepreneurship', 'SC/ST', 'women', 'loan', 'greenfield'],
    description: 'Facilitates bank loans between ₹10 Lakh to ₹1 Crore to at least one SC/ST borrower and one woman borrower per bank branch for setting up a greenfield enterprise.',
    source: 'seed'
  },
  {
    title: 'Pradhan Mantri Jan-Dhan Yojana (PMJDY)',
    category: 'Banking',
    ministry: 'Ministry of Finance',
    benefits: 'Zero-balance savings account, RuPay debit card, ₹2 Lakh accident insurance, overdraft facility up to ₹10,000.',
    eligibility: 'Any Indian citizen above 10 years of age without a bank account.',
    documents: ['Aadhaar Card (or PAN / Voter ID)', 'Passport Photograph'],
    officialLink: 'https://pmjdy.gov.in/',
    deadline: 'Ongoing',
    tags: ['banking', 'zero balance', 'financial inclusion', 'DBT'],
    description: 'National financial inclusion mission ensuring access to basic banking, remittance, credit, insurance and pension facilities. Special focus on women for Direct Benefit Transfer (DBT).',
    source: 'seed'
  },
  {
    title: 'Women Entrepreneurship Platform (WEP – NITI Aayog)',
    category: 'Entrepreneurship',
    ministry: 'NITI Aayog',
    benefits: 'Access to mentorship, credit, incubation, technology, legal support and market linkages.',
    eligibility: 'Women founders, aspiring entrepreneurs, or women managing MSMEs across India.',
    documents: ['Aadhaar Card', 'Udyam/Business Registration (if available)', 'PAN Card', 'Bank Account Details'],
    officialLink: 'https://wep.gov.in/',
    deadline: 'Ongoing',
    tags: ['entrepreneur', 'MSME', 'NITI Aayog', 'mentorship', 'credit'],
    description: 'WEP is a government-backed platform by NITI Aayog providing a unified ecosystem for women entrepreneurs with access to funding, mentorship, market networks and technology support.',
    source: 'seed'
  },
  {
    title: 'AICTE Pragati Scholarship for Women',
    category: 'Education',
    ministry: 'Ministry of Education / AICTE',
    benefits: '₹50,000 per year tuition fee + ₹2,000 per month incidental charges.',
    eligibility: 'Female students admitted to 1st year of AICTE-approved Degree/Diploma. Family income < ₹8 Lakhs. Max 2 girl children per family.',
    documents: ['10th & 12th Marksheets', 'Family Income Certificate', 'College Admission Letter', 'Bank Account linked with Aadhaar'],
    officialLink: 'https://fellowship.aicte.gov.in/',
    deadline: 'Annual - Check AICTE portal',
    tags: ['scholarship', 'education', 'engineering', 'diploma', 'AICTE'],
    description: 'AICTE Pragati Scholarship promotes technical education among women students by providing financial support to pursue Degree and Diploma level education at AICTE-approved institutions.',
    source: 'seed'
  },
  {
    title: 'PM Jeevan Jyoti Bima Yojana (PMJJBY)',
    category: 'Insurance',
    ministry: 'Ministry of Finance',
    benefits: '₹2 Lakh life insurance coverage at just ₹436 annual premium.',
    eligibility: 'Age 18–50 years with an active savings bank account. Auto-debit consent required.',
    documents: ['Savings Bank Account Number', 'Aadhaar Card', 'Nominee Details'],
    officialLink: 'https://www.jansuraksha.gov.in/',
    deadline: 'Ongoing (Annual Renewal)',
    tags: ['insurance', 'life insurance', 'low premium', 'jansuraksha'],
    description: 'A low-cost term life insurance scheme providing ₹2 Lakh coverage for death due to any cause at just ₹436/year premium, auto-debited from savings bank account.',
    source: 'seed'
  },
  {
    title: 'PM Suraksha Bima Yojana (PMSBY)',
    category: 'Insurance',
    ministry: 'Ministry of Finance',
    benefits: '₹2 Lakh accidental death/disability insurance at only ₹20 per year.',
    eligibility: 'Age 18–70 years with active savings bank account.',
    documents: ['Savings Bank Account', 'Aadhaar Card', 'Nominee Details'],
    officialLink: 'https://www.jansuraksha.gov.in/',
    deadline: 'Ongoing (Annual Renewal)',
    tags: ['insurance', 'accident', 'disability', 'affordable'],
    description: 'Accidental death and disability insurance scheme providing ₹2 Lakh cover for accidental death and full disability, and ₹1 Lakh for partial disability at just ₹20/year premium.',
    source: 'seed'
  },
  {
    title: 'Atal Pension Yojana (APY)',
    category: 'Pension',
    ministry: 'Ministry of Finance / PFRDA',
    benefits: 'Guaranteed pension of ₹1,000–₹5,000/month after age 60. Govt co-contributes 50% of premium.',
    eligibility: 'Age 18–40 years with a savings bank account. Not a taxpayer.',
    documents: ['Savings Bank Account Number', 'Aadhaar Card', 'Mobile Number'],
    officialLink: 'https://www.pfrda.org.in/',
    deadline: 'Ongoing',
    tags: ['pension', 'retirement', 'APY', 'PFRDA', 'government guarantee'],
    description: 'APY guarantees a minimum monthly pension of ₹1,000–₹5,000 to subscribers from age 60. The government co-contributes 50% for eligible subscribers, making it ideal for women in informal sectors.',
    source: 'seed'
  },
  {
    title: 'Dena Shakti Scheme',
    category: 'Micro-Loan',
    ministry: 'Bank of Baroda',
    benefits: '0.25% interest concession on all loans. Coverage across agriculture, retail, education, housing.',
    eligibility: 'Women borrowers in agriculture, retail trade, micro credit, education and housing sectors.',
    documents: ['KYC Documents', 'Income Proof', 'Business/Land Documents as applicable'],
    officialLink: 'https://www.bankofbaroda.in',
    deadline: 'Ongoing',
    tags: ['loan', 'concession', 'agriculture', 'retail', 'micro-credit'],
    description: 'Bank of Baroda\'s scheme to empower women by providing loans across multiple sectors with a 0.25% interest rate concession, making credit more affordable for women entrepreneurs and homemakers.',
    source: 'seed'
  },
  {
    title: 'Beti Bachao Beti Padhao Scheme',
    category: 'Social Welfare',
    ministry: 'Ministry of Women & Child Development',
    benefits: 'Education support, awareness programs, cash incentives for girl child education and welfare.',
    eligibility: 'Open to all citizens. Focused on districts with low Child Sex Ratio.',
    documents: ['Registration at nearest Anganwadi center or district office'],
    officialLink: 'https://wcd.nic.in/bbbp-schemes',
    deadline: 'Ongoing',
    tags: ['girl child', 'education', 'social welfare', 'awareness', 'BBBP'],
    description: 'A joint initiative by three ministries to address the declining Child Sex Ratio and promote welfare and education of the girl child through awareness campaigns, incentives and education support.',
    source: 'seed'
  }
];

// ─── Helper: Seed the DB if empty ────────────────────────────────────────────
async function seedSchemesIfEmpty() {
  const count = await Scheme.countDocuments();
  if (count === 0) {
    console.log('🌱 Seeding initial government schemes to MongoDB...');
    await Scheme.insertMany(SEED_SCHEMES);
    console.log(`✅ Seeded ${SEED_SCHEMES.length} schemes successfully.`);
  }
}

// ─── Helper: Web Scraper — fetch live schemes from govt websites ────────────
// Uses cheerio + axios to scrape real data. NO API key needed.

const cheerio = require('cheerio');

// Scraping targets — official govt websites with women's scheme listings
const SCRAPE_SOURCES = [
  {
    name: 'Ministry of Women & Child Development (WCD Portal)',
    url: 'https://wcd.gov.in/offerings/schemes-and-services',
    parser: parseWCDGov,
  },
  {
    name: 'MyScheme.gov.in — Women',
    url: 'https://www.myscheme.gov.in/search/category/Women%20and%20Child',
    parser: parseMyScheme,
  },
  {
    name: 'MyScheme.gov.in — Financial Inclusion',
    url: 'https://www.myscheme.gov.in/search/category/Banking%2CFinancial%20Services%20and%20Insurance',
    parser: parseMyScheme,
  },
  {
    name: 'India.gov.in — Women Schemes',
    url: 'https://www.india.gov.in/topics/women-child-development',
    parser: parseIndiaGov,
  },
];

// ── Parser for wcd.gov.in ───────────────────────────────────────────────────────
function parseWCDGov(html, sourceUrl) {
  const $ = cheerio.load(html);
  const schemes = [];

  $('a').each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href') || '';
    if (text && text.length > 5 && !text.toLowerCase().includes('more') && !text.toLowerCase().includes('read')) {
      if (/scheme|mission|poshan|saksham|shakti|vatsalya|beti|nari|swadhar|ujjawala|working women|creche|gender|mahila|welfare/i.test(text)) {
        const link = href.startsWith('http') ? href : `https://wcd.gov.in${href.startsWith('/') ? '' : '/'}${href}`;
        schemes.push({
          title: text,
          description: `Official scheme listing under Ministry of Women & Child Development (WCD).`,
          category: 'Women & Child',
          officialLink: link,
          ministry: 'Ministry of Women and Child Development',
          benefits: 'Government welfare and financial support initiative.',
          eligibility: 'Eligible Indian women and child beneficiaries.'
        });
      }
    }
  });

  return schemes;
}

// ── Parser for myscheme.gov.in ────────────────────────────────────────────────
function parseMyScheme(html, sourceUrl) {
  const $ = cheerio.load(html);
  const schemes = [];

  // MyScheme uses JSON-LD or card-based listings
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.name) {
            schemes.push({
              title: item.name,
              description: item.description || '',
              category: 'Women & Child',
              officialLink: item.url || sourceUrl,
              ministry: item.provider?.name || '',
            });
          }
        });
      }
    } catch (e) { /* skip invalid JSON-LD */ }
  });

  // Also try parsing card elements
  $('.scheme-card, .card, [class*="scheme"], [class*="Scheme"]').each((_, el) => {
    const title = $(el).find('h2, h3, h4, .title, .scheme-title, [class*="title"]').first().text().trim();
    const desc = $(el).find('p, .description, .scheme-desc, [class*="desc"]').first().text().trim();
    const link = $(el).find('a').first().attr('href') || '';

    if (title && title.length > 5) {
      schemes.push({
        title,
        description: desc,
        category: 'Women & Child',
        officialLink: link.startsWith('http') ? link : `https://www.myscheme.gov.in${link}`,
        ministry: '',
      });
    }
  });

  // Fallback: try any list items or divs with scheme-like content
  if (schemes.length === 0) {
    $('a[href*="/scheme/"]').each((_, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr('href') || '';
      if (title && title.length > 5 && !title.toLowerCase().includes('login')) {
        schemes.push({
          title,
          description: '',
          category: 'Women & Child',
          officialLink: link.startsWith('http') ? link : `https://www.myscheme.gov.in${link}`,
          ministry: '',
        });
      }
    });
  }

  return schemes;
}

// ── Parser for india.gov.in ───────────────────────────────────────────────────
function parseIndiaGov(html) {
  const $ = cheerio.load(html);
  const schemes = [];

  $('a').each((_, el) => {
    const title = $(el).text().trim();
    const href = $(el).attr('href') || '';
    // Filter for scheme-like links
    if (
      title.length > 10 &&
      (title.toLowerCase().includes('yojana') ||
       title.toLowerCase().includes('scheme') ||
       title.toLowerCase().includes('mission') ||
       title.toLowerCase().includes('women') ||
       title.toLowerCase().includes('mahila') ||
       title.toLowerCase().includes('beti'))
    ) {
      schemes.push({
        title,
        description: '',
        category: 'Government',
        officialLink: href.startsWith('http') ? href : `https://www.india.gov.in${href}`,
        ministry: 'Government of India',
      });
    }
  });

  return schemes;
}

// ── Main scraper function ─────────────────────────────────────────────────────
async function syncFromGovtAPI() {
  console.log('🕷️  Starting web scraper — fetching live schemes from govt websites...');

  let totalScraped = 0;

  for (const source of SCRAPE_SOURCES) {
    try {
      console.log(`  📡 Scraping: ${source.name}`);
      const response = await axios.get(source.url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
        },
      });

      const scraped = source.parser(response.data, source.url);
      console.log(`     → Found ${scraped.length} schemes from ${source.name}`);

      // Deduplicate and upsert into MongoDB
      for (const item of scraped) {
        // Skip if title is too short or generic
        if (!item.title || item.title.length < 6) continue;

        // Use title as unique key for upsert
        const exists = await Scheme.findOne({
          title: { $regex: `^${item.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
        });

        if (!exists) {
          await Scheme.create({
            title: item.title,
            description: item.description || '',
            category: item.category || 'General',
            ministry: item.ministry || '',
            benefits: item.benefits || '',
            eligibility: item.eligibility || '',
            documents: item.documents || [],
            officialLink: item.officialLink || '',
            deadline: 'Ongoing',
            tags: ['women', 'government', 'scraped'],
            source: 'govt_api',
            govtApiId: `scraped_${item.title.substring(0, 50)}`,
            lastSyncedAt: new Date(),
            isActive: true,
          });
          totalScraped++;
        }
      }
    } catch (err) {
      console.log(`     ⚠️  Could not scrape ${source.name}: ${err.message}`);
    }
  }

  if (totalScraped > 0) {
    console.log(`✅ Web scraper complete. ${totalScraped} NEW schemes added to database.`);
  } else {
    console.log('ℹ️  Web scraper complete. No new schemes found (all already in DB).');
  }

  // Log total count
  const total = await Scheme.countDocuments({ isActive: true });
  console.log(`📊 Total schemes in database: ${total}`);
}

// ─── Export so server.js can call on startup & cron ──────────────────────────
module.exports.syncFromGovtAPI = syncFromGovtAPI;
module.exports.seedSchemesIfEmpty = seedSchemesIfEmpty;

// ─── PUBLIC Route: GET /api/schemes ──────────────────────────────────────────
// No auth required — anyone can browse govt schemes

// GET /api/schemes  (with optional ?category=&search=&source=)
router.get('/', async (req, res) => {
  try {
    const { category, search, source } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (source && source !== 'all') {
      filter.source = source;
    }
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { benefits:    { $regex: search, $options: 'i' } },
        { eligibility: { $regex: search, $options: 'i' } },
        { ministry:    { $regex: search, $options: 'i' } },
        { tags:        { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    const schemes = await Scheme.find(filter)
      .sort({ source: 1, createdAt: -1 }) // admin-added first, then govt_api, then seed
      .lean();

    // Get distinct categories for filter UI
    const categories = await Scheme.distinct('category', { isActive: true });

    res.json({
      success: true,
      count: schemes.length,
      lastSynced: schemes.find(s => s.lastSyncedAt)?.lastSyncedAt || null,
      categories: ['All', ...categories.sort()],
      schemes
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/schemes/:id
router.get('/:id', async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id).lean();
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found.' });
    res.json({ success: true, scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports.router = router;

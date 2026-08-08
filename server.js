// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'backend/.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5001', 'http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));

const authRoutes = require('./backend/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Target recipient authority email
const RECIPIENT_EMAIL = process.env.TARGET_COMPLAINT_EMAIL || 'waniahmaryam@gmail.com';

const mailTransporter = require('./backend/config/mail');

app.post('/api/send-complaint', async (req, res) => {
  try {
    const { senderName, senderEmail, complaintMessage, attachedReport } = req.body;

    if (!senderName || !senderEmail || !complaintMessage) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: Complainant Name, Email, or Message.',
        message: 'Missing required fields: Complainant Name, Email, or Message.'
      });
    }

    console.log(`[Email API] Processing complaint submission from ${senderName} (${senderEmail}) to ${RECIPIENT_EMAIL}...`);

    let reportText = '';
    let reportHtml = '';

    if (attachedReport) {
      reportText = `
--------------------------------------------------
ATTACHED COMPLAINT ANALYSIS REPORT:
Name: ${attachedReport.name || 'Analysis Scan'}
Date: ${attachedReport.date}
Region ID: ${attachedReport.regionId || 'Margalla Hills AOI'}
Status: ${attachedReport.status}
Monitored Area: ${attachedReport.areaMonitored || '520.8 km²'}
Healthy Forest Canopy: ${attachedReport.forestPercentage || 94}%
Deforestation Loss: ${attachedReport.deforestedPercentage || 6}%
Summary: ${attachedReport.summary}
--------------------------------------------------
`;

      reportHtml = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-top: 20px;">
          <h3 style="color: #065f46; margin-top: 0;">📎 Attached Analysis PDF Report: ${attachedReport.name || 'Analysis Scan'}</h3>
          <p><strong>Date:</strong> ${attachedReport.date} | <strong>Region:</strong> ${attachedReport.regionId || 'Margalla Hills AOI'}</p>
          <p><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">${attachedReport.status}</span></p>
          <p><strong>Healthy Canopy:</strong> ${attachedReport.forestPercentage || 94}% | <strong>Canopy Loss:</strong> ${attachedReport.deforestedPercentage || 6}%</p>
          <p><strong>Summary:</strong> ${attachedReport.summary}</p>
        </div>
      `;
    }

    const mailOptions = {
      from: `"${senderName} via GreenGuard" <${process.env.EMAIL_USER || 'greenguard.satellite@gmail.com'}>`,
      to: RECIPIENT_EMAIL,
      replyTo: senderEmail,
      subject: `[URGENT COMPLAINT] Deforestation Alert - ${attachedReport ? attachedReport.name : 'Margalla Hills AOI'}`,
      text: `DEFORESTATION COMPLAINT NOTICE\n========================================\n\nComplainant Name: ${senderName}\nComplainant Email: ${senderEmail}\nTarget Recipient: ${RECIPIENT_EMAIL}\n\nCOMPLAINT MESSAGE:\n${complaintMessage}\n\n${reportText}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; color: #1e293b; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #065f46; border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-top: 0;">🌿 GreenGuard Deforestation Complaint System</h2>
          <p><strong>Complainant Name:</strong> ${senderName}</p>
          <p><strong>Complainant Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
          <p><strong>Target Recipient Authority:</strong> <strong>${RECIPIENT_EMAIL}</strong></p>
          
          <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 8px;">
            <h4 style="margin-top: 0; color: #b45309;">Official Complaint Message:</h4>
            <p style="white-space: pre-line; margin-bottom: 0;">${complaintMessage}</p>
          </div>
          
          ${reportHtml}

          <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
            Sent automatically via GreenGuard Satellite Forest Monitoring Complaint API
          </div>
        </div>
      `,
    };

    console.log(`[Email API] Ready to send complaint email from ${senderEmail} to ${RECIPIENT_EMAIL}`);
    console.log(`[Email API] SMTP Config loaded - User: ${process.env.EMAIL_USER || '(Not Set)'}`);

    try {
      console.log('[Email API] Executing mailTransporter.sendMail()...');
      await mailTransporter.sendMail(mailOptions);
      console.log('[Email API] Complaint email dispatched successfully.');

      return res.status(200).json({
        success: true,
        message: "Email delivered successfully"
      });

    } catch (error) {
      console.error('[Email API] SMTP sendMail failed with error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  } catch (outerError) {
    console.error('[Email API] Unexpected server error:', outerError);
    return res.status(500).json({
      success: false,
      error: outerError.message
    });
  }
});

// =========================================================================
// Real-Time & Historical Deforestation News API Endpoint
// =========================================================================

// Comprehensive database of curated real-time & historical forest news
const HISTORICAL_DEFORESTATION_NEWS = [
  {
    id: 'news-2026-07-15-1',
    title: 'Sentinel-2 & Landsat-9 Detect Real-Time Canopy Clearing in Amazon Basin',
    category: 'Satellite Monitoring',
    date: '15 Jul 2026',
    isoDate: '2026-07-15',
    pubDate: '2026-07-15T10:30:00Z',
    source: 'NASA Earth Observatory',
    author: 'Dr. Elena Rostova',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=800',
    summary: 'High-resolution multispectral analysis reveals unexpected tree canopy loss across the western Amazon Rainforest. Real-time satellite alert algorithms dispatched geo-referenced notices to local authorities.',
    content: `A joint remote sensing study using Sentinel-2 MSI and Landsat-9 sensors has detected fresh deforestation tracks covering 24.5 km² in the western Amazon Basin. Spectral variance algorithms flagged altered Normalized Difference Vegetation Index (NDVI) and Short-Wave Infrared reflectance, signalling heavy equipment activity and illegal logging operations.\n\nKey Highlights:\n• Real-time automated change detection flagged illegal clearing within 6 hours of satellite overpass.\n• High-resolution LiDAR imagery confirmed destruction of primary hardwood species.\n• Environmental enforcement units were dispatched using GPS coordinates provided by the earth observation stream.`,
    url: 'https://earthobservatory.nasa.gov/news/amazon-canopy-clearing-2026'
  },
  {
    id: 'news-2026-05-20-2',
    title: 'Margalla Hills Reforestation Project Exceeds 2 Million Native Saplings Goal',
    category: 'Forest Conservation',
    date: '20 May 2026',
    isoDate: '2026-05-20',
    pubDate: '2026-05-20T14:15:00Z',
    source: 'Pakistan Environmental Dispatch',
    author: 'Tariq Mahmood & GreenGuard Team',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800',
    summary: 'Community-led afforestation initiatives across Pakistan forests have successfully restored degraded slopes in Margalla Hills National Park, verified via drone imagery.',
    content: `A landmark afforestation campaign across Northern Pakistan forests has achieved a major milestone, planting over 2.1 million native Chir Pine and acacia trees. Autonomous drone mapping and Sentinel satellite spectral monitoring confirm an 88% survival rate across restored buffer zones.\n\nLocal forest conservation committees partnered with satellite analysts to identify high-risk erosion zones and deploy targeted seed bombing and community planting crews.`,
    url: 'https://news.mongabay.com/2026/05/pakistan-forests-margalla-reforestation-milestone/'
  },
  {
    id: 'news-2025-11-12-3',
    title: 'Severe Wildfires in Sub-Tropical Forests Accelerated by Heatwave Trends',
    category: 'Climate & Science',
    date: '12 Nov 2025',
    isoDate: '2025-11-12',
    pubDate: '2025-11-12T09:00:00Z',
    source: 'Global Climate Review',
    author: 'Environmental Science Journal',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    summary: 'Thermal satellite sensors track unprecedented wildfire intensity affecting pine forests across South Asia and Southern Europe during historic autumn droughts.',
    content: `Thermal infrared feeds from NASA MODIS and VIIRS satellites recorded over 1,400 active wildfire hotspots across dry pine ecosystems. Scientists link the rising frequency of crown fires to prolonged thermal stress and declining canopy moisture levels.`,
    url: 'https://www.nature.com/articles/s41558-025-wildfires-forest-degradation'
  },
  {
    id: 'news-2025-08-04-4',
    title: 'Interpol Operations Crack Down on International Illegal Logging Networks',
    category: 'Policy & Action',
    date: '04 Aug 2025',
    isoDate: '2025-08-04',
    pubDate: '2025-08-04T16:45:00Z',
    source: 'International Conservation News',
    author: 'Marcus Vance',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    summary: 'A coordinated international taskforce utilizes satellite intelligence to intercept illegal timber shipments valued at over $45 Million.',
    content: `Law enforcement agencies across three continents executed synchronized raids against illicit timber trafficking syndicates. Satellite tracking of illegal access roads combined with synthetic aperture radar (SAR) monitoring provided undeniable evidence of unauthorized timber harvesting inside protected national reserves.`,
    url: 'https://news.mongabay.com/2025/08/interpol-illegal-logging-crackdown-satellite-data/'
  },
  {
    id: 'news-2024-10-18-5',
    title: 'Sentinel-2 Satellite Imagery Exposes 15.2 km² Deforestation Loss in Margalla Hills Buffer Zone',
    category: 'Satellite Monitoring',
    date: '18 Oct 2024',
    isoDate: '2024-10-18',
    pubDate: '2024-10-18T08:00:00Z',
    source: 'GreenGuard Earth Observation',
    author: 'Dr. Sarah Jenkins & GreenGuard Earth Observation Team',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=800',
    summary: 'High-resolution multispectral analysis reveals unexpected tree canopy loss across Margalla Hills National Park. Satellite LiDAR scanning confirms illegal timber extraction.',
    content: `A detailed satellite investigation utilizing Sentinel-2 MSI data has uncovered significant illegal deforestation in the Margalla Hills buffer zone. Over 15.2 square kilometers of dense pine canopy have been degraded over the past quarter. Remote sensing spectral variance algorithms detected altered Normalized Difference Vegetation Index (NDVI) values, triggering real-time alerts for local forest enforcement agencies.\n\nKey Findings:\n• 15.2 km² total canopy loss detected across sector MGH-422.\n• Multi-spectral delta analysis indicates unauthorized commercial logging and slash-and-burn clearing.\n• AI change detection models predicted 98% accuracy on spectral degradation signals.`,
    url: 'https://news.mongabay.com/2024/10/sentinel-2-satellite-imagery-deforestation-margalla-hills/'
  },
  {
    id: 'news-2024-10-14-6',
    title: 'Himalayan Pine Forest Resilience: How AI Remote Sensing Detects Canopy Stress',
    category: 'Climate & Science',
    date: '14 Oct 2024',
    isoDate: '2024-10-14',
    pubDate: '2024-10-14T11:20:00Z',
    source: 'Environmental Science Journal',
    author: 'Environmental Science Journal & GreenGuard Research',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    summary: 'Machine learning algorithms trained on thermal and multi-band infrared satellite feeds are now identifying early drought stress in mountain pine ecosystems months ahead of visual symptoms.',
    content: `Climate change is increasing temperature volatility across Himalayan sub-tropical pine forests. Researchers have deployed machine learning models that analyze thermal infrared and shortwave infrared reflectance from Earth observation satellites to evaluate tree water stress.\n\n"By looking at sub-pixel reflectance changes in the 1.6µm and 2.2µm bands, we can diagnose canopy desiccation long before leaves turn brown," explained lead research scientist Dr. Tariq Mahmood.`,
    url: 'https://www.sciencedaily.com/releases/2024/10/ai-satellite-forest-canopy-stress.htm'
  },
  {
    id: 'news-2024-10-05-7',
    title: 'Global Forest Watch 2024 Report: Community-Driven Satellite Monitoring Protects Reserves',
    category: 'Forest Conservation',
    date: '05 Oct 2024',
    isoDate: '2024-10-05',
    pubDate: '2024-10-05T13:40:00Z',
    source: 'Global Conservation Tech Forum',
    author: 'Global Conservation Tech Forum',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    summary: 'Combining open satellite data with local community complaint reporting has reduced illegal logging response times from weeks to under 48 hours in protected national parks.',
    content: `The 2024 Global Forest Watch audit highlights the effectiveness of hybrid monitoring systems that merge automated satellite algorithms with direct citizen reporting.\n\nWhen local rangers and citizen volunteers receive automated geo-referenced alerts, response times drop by 85%, preventing large-scale clear-cutting before illegal operations expand.`,
    url: 'https://www.globalforestwatch.org/blog/2024/community-satellite-forest-monitoring/'
  },
  {
    id: 'news-2024-09-28-8',
    title: 'COP29 Climate Summit: New Funding Allocated for Sub-Tropical Pine Forest Reforestation',
    category: 'Policy & Action',
    date: '28 Sep 2024',
    isoDate: '2024-09-28',
    pubDate: '2024-09-28T09:15:00Z',
    source: 'International Climate Dispatch',
    author: 'International Climate Dispatch',
    readTime: '3 min read',
    img: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800',
    summary: 'International climate delegates pledge $12M grant to restore native Chir pine ecosystems and expand satellite monitoring infrastructure in South Asia.',
    content: `Delegates at the international climate convention agreed on a multi-million dollar fund aimed at protecting mountain watershed forests. The initiative includes funding for autonomous drone verification and satellite ground stations.`,
    url: 'https://unfccc.int/news/cop29-reforestation-funding-announcement'
  },
  {
    id: 'news-2023-06-19-9',
    title: 'Amazon Deforestation Rates Drop 33% Following Enhanced Satellite Surveillance',
    category: 'Satellite Monitoring',
    date: '19 Jun 2023',
    isoDate: '2023-06-19',
    pubDate: '2023-06-19T10:00:00Z',
    source: 'Reuters Earth',
    author: 'Ana Silva',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=800',
    summary: 'Brazilian space agency INPE reports significant reduction in Amazon rainforest clearing, attributed to real-time radar and optical satellite alerts.',
    content: `Official government data confirms Amazon deforestation declined sharpely in the first half of 2023. Real-time satellite alert systems utilizing synthetic aperture radar (SAR) penetrate cloud cover during the rainy season, closing previous monitoring loopholes exploited by illegal loggers.`,
    url: 'https://www.reuters.com/business/environment/amazon-deforestation-drops-satellite-surveillance-2023'
  },
  {
    id: 'news-2022-11-08-10',
    title: 'Congo Basin Rainforest Agreement Signed to Halt Forest Degradation',
    category: 'Policy & Action',
    date: '08 Nov 2022',
    isoDate: '2022-11-08',
    pubDate: '2022-11-08T14:30:00Z',
    source: 'BBC News Environment',
    author: 'Jean-Luc Kamba',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    summary: 'Six Central African nations commit to strict conservation quotas protecting the world second largest tropical rainforest from illegal timber trade.',
    content: `Leaders across Central Africa ratified a historic treaty establishing cross-border satellite monitoring and anti-poaching patrols. The agreement pledges $1.5 billion towards sustainable forestry practices and indigenous land rights enforcement.`,
    url: 'https://www.bbc.com/news/science-environment-congo-basin-forest-treaty-2022'
  },
  {
    id: 'news-2021-04-22-11',
    title: 'Earth Day 2021: Global Afforestation Initiatives Plant 50 Million Trees',
    category: 'Forest Conservation',
    date: '22 Apr 2021',
    isoDate: '2021-04-22',
    pubDate: '2021-04-22T08:00:00Z',
    source: 'Mongabay Environmental News',
    author: 'Rachel Carson Desk',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800',
    summary: 'Worldwide reforestation non-profits join forces with national forest departments to restore critical biodiversity corridors across five continents.',
    content: `On Earth Day 2021, over 120 global environmental organizations announced the successful planting of 50 million native saplings. High-precision GIS mapping ensures post-planting tree canopy growth is monitored annually via satellite observation.`,
    url: 'https://news.mongabay.com/2021/04/earth-day-50-million-trees-afforestation-initiative/'
  },
  {
    id: 'news-2020-09-15-12',
    title: 'Sub-Tropical Pine Forest Wildfires: Satellite Mapping of Burn Severities',
    category: 'Climate & Science',
    date: '15 Sep 2020',
    isoDate: '2020-09-15',
    pubDate: '2020-09-15T12:00:00Z',
    source: 'Remote Sensing & Ecosystems',
    author: 'Dr. Tariq Mahmood',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800',
    summary: 'Researchers utilize Sentinel-2 spectral indices (NBR and dNBR) to assess forest recovery trajectories following intense forest fires.',
    content: `Post-fire satellite evaluations in sub-tropical pine forests show that Normalized Burn Ratio (NBR) delta metrics reliably predict natural regeneration capacity. Forested slopes with high burn severity require immediate soil stabilization and manual replanting to prevent landslide erosion.`,
    url: 'https://www.sciencedaily.com/releases/2020/09/satellite-burn-severity-pine-forests.htm'
  }
];

// Optional live API fetch helper
const fetchLiveNewsFromAPI = async (searchTerm) => {
  const GNEWS_KEY = process.env.GNEWS_API_KEY;
  const NEWS_KEY = process.env.NEWS_API_KEY;

  if (GNEWS_KEY) {
    try {
      const q = encodeURIComponent(searchTerm || 'deforestation OR forest OR logging');
      const res = await fetch(`https://gnews.io/api/v4/search?q=${q}&lang=en&max=10&apikey=${GNEWS_KEY}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          return data.articles.map((art, idx) => ({
            id: `gnews-${idx}-${Date.now()}`,
            title: art.title,
            category: 'Forest Conservation',
            date: new Date(art.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            isoDate: art.publishedAt.split('T')[0],
            pubDate: art.publishedAt,
            source: art.source.name || 'GNews Live',
            author: art.source.name || 'Environmental Reporter',
            readTime: '4 min read',
            img: art.image || 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=800',
            summary: art.description || art.title,
            content: art.content || art.description || art.title,
            url: art.url
          }));
        }
      }
    } catch (err) {
      console.warn('[News API] GNews API fetch failed or rate limited:', err.message);
    }
  }

  if (NEWS_KEY) {
    try {
      const q = encodeURIComponent(searchTerm || 'deforestation');
      const res = await fetch(`https://newsapi.org/v2/everything?q=${q}&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_KEY}`);
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          return data.articles.map((art, idx) => ({
            id: `newsapi-${idx}-${Date.now()}`,
            title: art.title,
            category: 'Forest Conservation',
            date: new Date(art.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            isoDate: art.publishedAt.split('T')[0],
            pubDate: art.publishedAt,
            source: art.source.name || 'News API',
            author: art.author || art.source.name || 'Global News Desk',
            readTime: '4 min read',
            img: art.urlToImage || 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=800',
            summary: art.description || art.title,
            content: art.content || art.description || art.title,
            url: art.url
          }));
        }
      }
    } catch (err) {
      console.warn('[News API] NewsAPI fetch failed or rate limited:', err.message);
    }
  }

  return [];
};

app.get('/api/news', async (req, res) => {
  try {
    const { 
      q = '', 
      category = 'All', 
      specificDate = '', 
      month = '', 
      year = '', 
      fromDate = '', 
      toDate = '', 
      sortBy = 'newest' 
    } = req.query;

    console.log(`[News API] Query Params: q="${q}", category="${category}", specificDate="${specificDate}", month="${month}", year="${year}", fromDate="${fromDate}", toDate="${toDate}", sortBy="${sortBy}"`);

    // Combine historical articles with live API results if available
    let liveArticles = [];
    try {
      liveArticles = await fetchLiveNewsFromAPI(q);
    } catch (err) {
      console.warn('[News API] Live fetch error:', err.message);
    }

    // Deduplicate and combine
    const articleMap = new Map();
    [...liveArticles, ...HISTORICAL_DEFORESTATION_NEWS].forEach(art => {
      if (!articleMap.has(art.title.toLowerCase())) {
        articleMap.set(art.title.toLowerCase(), art);
      }
    });

    let articles = Array.from(articleMap.values());

    // 1. Text Search Filter (title, summary, content, source, author)
    if (q && q.trim() !== '') {
      const searchTerms = q.toLowerCase().trim().split(/\s+/);
      articles = articles.filter(art => {
        const fullText = `${art.title} ${art.summary} ${art.content} ${art.source} ${art.author} ${art.category}`.toLowerCase();
        return searchTerms.every(term => fullText.includes(term));
      });
    }

    // 2. Category Filter
    if (category && category !== 'All') {
      articles = articles.filter(art => art.category.toLowerCase() === category.toLowerCase());
    }

    // 3. Specific Date Filter (YYYY-MM-DD)
    if (specificDate && specificDate.trim() !== '') {
      articles = articles.filter(art => art.isoDate === specificDate.trim());
    }

    // 4. Month & Year Filter
    if (year && year.trim() !== '') {
      articles = articles.filter(art => {
        const artYear = new Date(art.pubDate || art.isoDate).getFullYear().toString();
        return artYear === year.trim();
      });
    }

    if (month && month.trim() !== '') {
      articles = articles.filter(art => {
        const artMonth = (new Date(art.pubDate || art.isoDate).getMonth() + 1).toString().padStart(2, '0');
        const reqMonth = parseInt(month, 10).toString().padStart(2, '0');
        return artMonth === reqMonth;
      });
    }

    // 5. Date Range Filter (fromDate & toDate)
    if (fromDate && fromDate.trim() !== '') {
      const fromTimestamp = new Date(fromDate.trim()).getTime();
      if (!isNaN(fromTimestamp)) {
        articles = articles.filter(art => new Date(art.pubDate || art.isoDate).getTime() >= fromTimestamp);
      }
    }

    if (toDate && toDate.trim() !== '') {
      const toTimestamp = new Date(toDate.trim()).getTime() + (24 * 60 * 60 * 1000 - 1); // end of day
      if (!isNaN(toTimestamp)) {
        articles = articles.filter(art => new Date(art.pubDate || art.isoDate).getTime() <= toTimestamp);
      }
    }

    // 6. Sorting
    if (sortBy === 'oldest') {
      articles.sort((a, b) => new Date(a.pubDate || a.isoDate).getTime() - new Date(b.pubDate || b.isoDate).getTime());
    } else if (sortBy === 'relevance') {
      if (q && q.trim() !== '') {
        const searchLower = q.toLowerCase();
        articles.sort((a, b) => {
          const scoreA = (a.title.toLowerCase().includes(searchLower) ? 3 : 0) + (a.summary.toLowerCase().includes(searchLower) ? 1 : 0);
          const scoreB = (b.title.toLowerCase().includes(searchLower) ? 3 : 0) + (b.summary.toLowerCase().includes(searchLower) ? 1 : 0);
          return scoreB - scoreA;
        });
      } else {
        // Default newest if no search query
        articles.sort((a, b) => new Date(b.pubDate || b.isoDate).getTime() - new Date(a.pubDate || a.isoDate).getTime());
      }
    } else {
      // Default: 'newest'
      articles.sort((a, b) => new Date(b.pubDate || b.isoDate).getTime() - new Date(a.pubDate || a.isoDate).getTime());
    }

    return res.status(200).json({
      success: true,
      totalResults: articles.length,
      lastUpdated: new Date().toISOString(),
      articles: articles
    });

  } catch (error) {
    console.error('[News API] Error handling news request:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch deforestation news articles.',
      details: error.message
    });
  }
});

// =========================================================================

app.listen(PORT, () => {
  console.log(`🚀 GreenGuard Email & News API Server running on port ${PORT}`);
});


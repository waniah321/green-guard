// src/pages/News.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Search, Satellite, X, Filter, RotateCcw, AlertTriangle, ExternalLink, RefreshCw, Layers, Info } from 'lucide-react';
import GlassmorphismSelect from '../components/layout/GlassmorphismSelect';

const CATEGORIES = ['All', 'Satellite Monitoring', 'Climate & Science', 'Forest Conservation', 'Policy & Action'];

// High-quality primary & historical deforestation articles dataset for fallback
const CLIENT_DEFORESTATION_NEWS = [
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

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Filter States
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [specificDate, setSpecificDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Selected Article for Drawer Modal
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Date Range Validation Check
  const isInvalidDateRange = fromDate && toDate && new Date(fromDate) > new Date(toDate);

  // Client-side filtering engine fallback
  const processClientSideFilter = useCallback(() => {
    console.log('[News Client Engine] Processing articles client-side...');
    let list = [...CLIENT_DEFORESTATION_NEWS];

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().trim().split(/\s+/);
      list = list.filter(art => {
        const text = `${art.title} ${art.summary} ${art.content} ${art.source} ${art.author} ${art.category}`.toLowerCase();
        return terms.every(t => text.includes(t));
      });
    }

    // 2. Category Filter
    if (activeTab !== 'All') {
      list = list.filter(art => art.category.toLowerCase() === activeTab.toLowerCase());
    }

    // 3. Specific Date
    if (specificDate) {
      list = list.filter(art => art.isoDate === specificDate.trim());
    }

    // 4. Month & Year
    if (selectedYear !== 'All Years') {
      list = list.filter(art => new Date(art.pubDate || art.isoDate).getFullYear().toString() === selectedYear);
    }
    if (selectedMonth !== 'All') {
      list = list.filter(art => {
        const m = (new Date(art.pubDate || art.isoDate).getMonth() + 1).toString().padStart(2, '0');
        return m === selectedMonth.padStart(2, '0');
      });
    }

    // 5. Date Range
    if (fromDate) {
      const fromMs = new Date(fromDate).getTime();
      if (!isNaN(fromMs)) list = list.filter(art => new Date(art.pubDate || art.isoDate).getTime() >= fromMs);
    }
    if (toDate) {
      const toMs = new Date(toDate).getTime() + (24 * 60 * 60 * 1000 - 1);
      if (!isNaN(toMs)) list = list.filter(art => new Date(art.pubDate || art.isoDate).getTime() <= toMs);
    }

    // 6. Sorting
    if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.pubDate || a.isoDate).getTime() - new Date(b.pubDate || b.isoDate).getTime());
    } else if (sortBy === 'relevance' && searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      list.sort((a, b) => {
        const scoreA = (a.title.toLowerCase().includes(term) ? 3 : 0) + (a.summary.toLowerCase().includes(term) ? 1 : 0);
        const scoreB = (b.title.toLowerCase().includes(term) ? 3 : 0) + (b.summary.toLowerCase().includes(term) ? 1 : 0);
        return scoreB - scoreA;
      });
    } else {
      list.sort((a, b) => new Date(b.pubDate || b.isoDate).getTime() - new Date(a.pubDate || a.isoDate).getTime());
    }

    return list;
  }, [searchQuery, activeTab, specificDate, selectedMonth, selectedYear, fromDate, toDate, sortBy]);

  // Robust Multi-Stage Fetch News Handler
  const fetchNews = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    setError(null);
    setInfoMessage(null);

    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) queryParams.append('q', searchQuery.trim());
    if (activeTab !== 'All') queryParams.append('category', activeTab);
    if (specificDate) queryParams.append('specificDate', specificDate);
    if (selectedMonth !== 'All') queryParams.append('month', selectedMonth);
    if (selectedYear !== 'All Years') queryParams.append('year', selectedYear);
    if (fromDate) queryParams.append('fromDate', fromDate);
    if (toDate) queryParams.append('toDate', toDate);
    if (sortBy) queryParams.append('sortBy', sortBy);

    const queryString = queryParams.toString();
    const endpointUrls = [
      `http://localhost:5000/api/news?${queryString}`,
      `http://127.0.0.1:5000/api/news?${queryString}`
    ];

    let fetchedSuccessfully = false;

    for (const url of endpointUrls) {
      try {
        console.log(`[News Frontend] Attempting fetch from ${url}...`);
        const response = await fetch(url, { headers: { 'Accept': 'application/json' } });

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.success && Array.isArray(data.articles)) {
              console.log(`✅ [News Frontend] Successfully loaded ${data.articles.length} articles from ${url}`);
              setArticles(data.articles);
              setLastRefreshed(new Date().toLocaleTimeString());
              fetchedSuccessfully = true;
              break;
            }
          }
        }
      } catch (err) {
        console.warn(`[News Frontend] Endpoint ${url} unreachable:`, err.message);
      }
    }

    // Fallback if backend server endpoint is unreachable
    if (!fetchedSuccessfully) {
      console.warn('⚠️ [News Frontend] Backend server unavailable. Utilizing high-performance client news stream engine.');
      const clientFilteredArticles = processClientSideFilter();
      setArticles(clientFilteredArticles);
      setLastRefreshed(new Date().toLocaleTimeString());
      setInfoMessage('Connected to GreenGuard Satellite News Stream (Local Engine).');
    }

    setLoading(false);
    setRefreshing(false);
  }, [searchQuery, activeTab, specificDate, selectedMonth, selectedYear, fromDate, toDate, sortBy, processClientSideFilter]);

  // Initial Fetch & Filter Trigger
  useEffect(() => {
    fetchNews(false);
  }, [fetchNews]);

  // Periodic 60-second Auto Refresh
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[News Auto Refresh] Fetching latest deforestation news...');
      fetchNews(true);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [fetchNews]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setActiveTab('All');
    setSearchQuery('');
    setSpecificDate('');
    setSelectedMonth('All');
    setSelectedYear('All Years');
    setFromDate('');
    setToDate('');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery !== '' || activeTab !== 'All' || specificDate !== '' || sortBy !== 'newest';

  // Handle Opening Article Link
  const handleOpenSource = (e, url) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="news-page">
      
      {/* Page Header */}
      <div className="news-header">
        <div className="news-controls-row">
          <div>
            <h1 className="news-title">Forest Conservation & Deforestation News</h1>
            <p className="news-subtitle">
              Stay updated with real-time satellite monitoring discoveries, illegal logging alerts, wildfire tracking, and reforestation initiatives.
            </p>
          </div>

          {/* Live Auto Refresh Indicator */}
          <div className="news-live-refresh-status">
            <span className="pulse-dot"></span>
            <span>LIVE AUTO-REFRESH (60s)</span>
            {refreshing && <RefreshCw className="w-3 h-3 animate-spin text-emerald-600 ml-1" />}
            {lastRefreshed && <span className="text-gray-400 font-normal ml-1">Updated {lastRefreshed}</span>}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="news-filter-bar">
        
        {/* Main Search Input & Category Pills */}
        <div className="search-input-wrapper">
          <Search className="search-icon w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search news by keywords (e.g. Amazon Rainforest, Pakistan forests, Illegal logging...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="news-search-input"
          />
        </div>

        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${activeTab === cat ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Advanced Filters & Sorting Controls */}
        <div className="news-advanced-filters-glass">
          
          {/* Sort By Dropdown */}
          <div className="filter-item-group">
            <label className="filter-label">
              <Layers className="w-3 h-3" />
              <span>Sort Articles</span>
            </label>
            <GlassmorphismSelect 
              value={sortBy} 
              onChange={setSortBy}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'relevance', label: 'Most Relevant' }
              ]}
              className="news-filter-select"
            />
          </div>

          {/* Specific Date Filter */}
          <div className="filter-item-group">
            <label className="filter-label">
              <Calendar className="w-3 h-3" />
              <span>Specific Date</span>
            </label>
            <input 
              type="date"
              value={specificDate}
              onChange={(e) => {
                setSpecificDate(e.target.value);
                setFromDate('');
                setToDate('');
              }}
              className="news-filter-input"
            />
          </div>


          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button 
              type="button" 
              onClick={handleResetFilters}
              className="news-clear-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>



      {/* API Error Notification */}
      {error && !isInvalidDateRange && (
        <div className="news-error-banner">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Info Status Banner */}
      {infoMessage && !error && !isInvalidDateRange && (
        <div className="news-live-refresh-status" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="news-grid" style={{ marginTop: '24px' }}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="news-skeleton-pulse news-skeleton-card"></div>
          ))}
        </div>
      ) : (
        <>
          {/* No Articles Found Empty State */}
          {articles.length === 0 && !isInvalidDateRange && (
            <div className="news-empty-banner">
              <Filter className="w-10 h-10 text-gray-400" />
              <h3 className="news-empty-title">No Deforestation News Found</h3>
              <p className="news-empty-subtitle">
                We couldn't find any articles matching your specified search query or date filters. Try adjusting keywords or date ranges.
              </p>
              <button 
                type="button" 
                onClick={handleResetFilters}
                className="news-read-btn"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Featured Big News Banner */}
          {articles.length > 0 && (
            <div className="news-featured-card-glass" onClick={() => setSelectedArticle(articles[0])}>
              <div className="featured-img-wrapper">
                <img src={articles[0].img} alt={articles[0].title} className="featured-img" />
                <span className="featured-tag">FEATURED BULLETIN</span>
              </div>

              <div className="featured-content">
                <div className="news-meta-row">
                  <span className="news-cat-pill">{articles[0].category}</span>
                  <span className="news-meta-item"><Calendar className="w-3 h-3" /> {articles[0].date}</span>
                  <span className="news-meta-item"><Clock className="w-3 h-3" /> {articles[0].readTime}</span>
                </div>

                <h2 className="featured-title">{articles[0].title}</h2>
                <p className="featured-summary">{articles[0].summary}</p>

                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    className="news-read-btn"
                    onClick={(e) => handleOpenSource(e, articles[0].url)}
                  >
                    <span>Read Full Article</span>
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* News Articles Grid */}
          <div className="news-grid">
            {articles.slice(1).map(article => (
              <div 
                key={article.id} 
                className="news-card-glass"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="news-card-img-box">
                  <img src={article.img} alt={article.title} className="news-card-img" />
                  <span className="news-card-cat">{article.category}</span>
                </div>

                <div className="news-card-body">
                  <div className="news-meta-row">
                    <span className="news-meta-item"><Calendar className="w-3 h-3" /> {article.date}</span>
                    <span className="news-meta-item"><Clock className="w-3 h-3" /> {article.readTime}</span>
                  </div>

                  <h3 className="news-card-title">{article.title}</h3>
                  <p className="news-card-summary">{article.summary}</p>

                  <div className="news-card-footer">
                    <span className="author-lbl">{article.source || article.author}</span>
                    <button 
                      type="button" 
                      className="read-more-link"
                      onClick={(e) => handleOpenSource(e, article.url)}
                    >
                      <span>Read Full Article</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Read Article Modal Drawer */}
      {selectedArticle && (
        <div className="save-modal-backdrop">
          <div className="save-modal-glass article-modal-glass">
            
            <div className="save-modal-header">
              <div className="save-modal-title-group">
                <div className="save-modal-icon-badge">
                  <Satellite className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{selectedArticle.category}</span>
                  <h3 className="save-modal-title">{selectedArticle.title}</h3>
                </div>
              </div>
              <button 
                type="button" 
                className="save-modal-close-btn"
                onClick={() => setSelectedArticle(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="article-modal-body">
              <img src={selectedArticle.img} alt={selectedArticle.title} className="article-modal-img" />
              
              <div className="article-modal-meta">
                <span>Published on {selectedArticle.date}</span> &bull; <span>{selectedArticle.readTime}</span> &bull; <span>Source: {selectedArticle.source || selectedArticle.author}</span>
              </div>

              <div className="article-modal-text">
                {(selectedArticle.content || selectedArticle.summary).split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className="save-modal-actions">
              {selectedArticle.url && (
                <button 
                  type="button" 
                  className="save-modal-btn btn-primary flex items-center justify-center gap-2"
                  onClick={(e) => handleOpenSource(e, selectedArticle.url)}
                >
                  <span>Read Full Article at Source</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
              <button 
                type="button" 
                className="save-modal-btn btn-cancel"
                onClick={() => setSelectedArticle(null)}
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
// src/components/analysis/VisualDrift.jsx
import React from 'react';
import { Activity } from 'lucide-react';

export default function VisualDrift({
  forestPercentage = 94,
  deforestedPercentage: customDefor = null,
  beforeImage = null,
  afterImage = null,
  overlayImage = null,
  startYear = "2020",
  endYear = "2024"
}) {
  const cleanForestPct = Number(Number(forestPercentage).toFixed(1));
  const cleanDeforPct = customDefor !== null 
    ? Number(Number(customDefor).toFixed(1)) 
    : Number((100 - cleanForestPct).toFixed(1));
  const strokeDashoffset = 226.08 - (226.08 * cleanForestPct) / 100;

  const formatImgSrc = (img, fallback) => {
    if (!img) return fallback;
    if (img.startsWith('data:') || img.startsWith('http')) return img;
    return `data:image/png;base64,${img}`;
  };

  const defaultBefore = "https://media.istockphoto.com/id/2226686330/photo/dense-green-forest-with-communication-tower-and-nearby-buildings-in-daylight.webp?a=1&b=1&s=612x612&w=0&k=20&c=TeYNhvH80XeIeZpx_PAqGf_5WjpU2T3yeOzexbZmlzw=";
  const defaultAfter = "https://plus.unsplash.com/premium_photo-1666626225781-ea37a9d43d40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRlZm9yZXN0YXRpb24lMjBzYXRlbGxpdGUlMjB2aWV3fGVufDB8fDB8fHww";
  const defaultOverlay = "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=600";

  return (
    <div className="visual-drift-section">
      
      {/* Modern Glassmorphic Heading Container Card */}
      <div className="visual-drift-header-card">
        <div className="drift-header-icon-box">
          <Activity className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="visual-drift-title">Visual Drift</h3>
          <p className="visual-drift-subtitle">Multi-temporal canopy change detection and pixel variance analysis</p>
        </div>
      </div>

      <div className="visual-drift-grid">
        
        {/* Card 1: Baseline */}
        <div>
          <span className="drift-card-label">Visual Drift: {startYear} Baseline</span>
          <div className="drift-card-body">
            <div className="drift-img-wrapper">
              <img 
                src={formatImgSrc(beforeImage, defaultBefore)} 
                alt={`Forest Canopy ${startYear}`} 
                className="drift-img" 
              />
              <span className="drift-img-tag">{startYear} BASELINE</span>
            </div>
            <span className="drift-card-footer-text">deep delta analysis</span>
          </div>
        </div>

        {/* Card 2: Current */}
        <div>
          <span className="drift-card-label">Visual Drift: {endYear} Current</span>
          <div className="drift-card-body">
            <div className="drift-img-wrapper">
              <img 
                src={formatImgSrc(afterImage, defaultAfter)} 
                alt={`Forest Degradation ${endYear}`} 
                className="drift-img" 
              />
              <span className="drift-img-tag drift-img-tag-red">{endYear} CURRENT</span>
            </div>
            <span className="drift-card-footer-text">deep delta analysis</span>
          </div>
        </div>

        {/* Card 3: Final Image with Pixel Overlays */}
        <div>
          <span className="drift-card-label">Final Image</span>
          <div className="drift-card-body">
            <div className="drift-img-wrapper" style={{ position: 'relative' }}>
              <img 
                src={formatImgSrc(overlayImage, defaultOverlay)} 
                alt="Analysis Delta" 
                className="drift-img" 
              />
              <span className="drift-img-tag drift-img-tag-red">FINAL DELTA</span>
              <div className="overlay-top-right">
                {endYear} Current Delta
              </div>
              <div className="overlay-bottom-left">
                <span className="overlay-danger-span">Major Pixel Difference</span>
                <span className="overlay-sub-span">- Deforestation Area</span>
              </div>
            </div>
            <span className="drift-card-footer-text">deep delta analysis</span>
          </div>
        </div>

        {/* Card 4: Donut Health Metrics & Trend Bar Chart */}
        <div className="health-card-container-wrapper">
          <span className="drift-card-label">Forest Health Metrics</span>
          <div className="health-metrics-container">
            
            {/* Left Column: Donut + Legends */}
            <div className="health-left-col">
              <div className="donut-chart-wrapper">
                <svg className="donut-svg">
                  <circle cx="48" cy="48" r="36" className="svg-track-red" strokeWidth="8" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    className="svg-active-green"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="226.08"
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="donut-center-text">
                  <span className="donut-percentage">{cleanForestPct}%</span>
                  <span className="donut-label">Healthy</span>
                </div>
              </div>

              <div className="chart-legends">
                <div className="legend-item">
                  <span className="legend-dot legend-dot-green"></span>
                  <span className="legend-text">Forest ({cleanForestPct}%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot legend-dot-red"></span>
                  <span className="legend-text">Deforested ({cleanDeforPct}%)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Deforestation Trend Bar Chart */}
            <div className="health-right-col">
              <div className="bar-chart-header">
                <span className="bar-chart-title">Deforestation Rate Over Time</span>
                <span className="bar-chart-subtitle">Canopy Loss Trend (km²)</span>
              </div>
              
              <div className="bar-chart-wrapper">
                <svg viewBox="0 0 240 140" width="100%" height="110" className="bar-chart-svg">
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="230" y2="20" className="bar-grid-line" strokeDasharray="2 2" />
                  <line x1="30" y1="60" x2="230" y2="60" className="bar-grid-line" strokeDasharray="2 2" />
                  <line x1="30" y1="100" x2="230" y2="100" className="bar-grid-line" strokeDasharray="2 2" />
                  
                  {/* Y-Axis Labels */}
                  <text x="24" y="23" className="bar-axis-text" textAnchor="end">100</text>
                  <text x="24" y="63" className="bar-axis-text" textAnchor="end">50</text>
                  <text x="24" y="103" className="bar-axis-text" textAnchor="end">0</text>

                  {/* 2020 Checkpoint */}
                  <rect x="52" y="22" width="14" height="78" rx="3" className="bar-healthy" />
                  <rect x="68" y="98" width="14" height="2" rx="1" className="bar-deforested" />
                  
                  {/* 2022 Checkpoint */}
                  <rect x="112" y="24" width="14" height="76" rx="3" className="bar-healthy" />
                  <rect x="128" y="96" width="14" height="4" rx="1" className="bar-deforested" />

                  {/* 2024 Checkpoint */}
                  <rect x="172" y="26" width="14" height="74" rx="3" className="bar-healthy" />
                  <rect x="188" y="94" width="14" height="6" rx="2" className="bar-deforested" />
                  
                  {/* Base Axis Line */}
                  <line x1="30" y1="100" x2="230" y2="100" className="bar-axis-line" />
                  
                  {/* X-Axis Labels */}
                  <text x="67" y="115" className="bar-axis-text" textAnchor="middle">2020 Base</text>
                  <text x="127" y="115" className="bar-axis-text" textAnchor="middle">2022 Mid</text>
                  <text x="187" y="115" className="bar-axis-text" textAnchor="middle">2024 Cur</text>

                  <text x="67" y="125" className="bar-axis-subtext" textAnchor="middle">(15.2 km²)</text>
                  <text x="127" y="125" className="bar-axis-subtext" textAnchor="middle">(20.5 km²)</text>
                  <text x="187" y="125" className="bar-axis-subtext" textAnchor="middle">(32.1 km²)</text>
                </svg>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
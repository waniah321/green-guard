// src/pages/Dashboard.jsx

import React, { useState, useRef } from 'react';
import { BookmarkPlus } from 'lucide-react';

import AnalysisMap from '../components/analysis/AnalysisMap';
import VisualDrift from '../components/analysis/VisualDrift';
import SaveReportModal from '../components/analysis/SaveReportModal';
import GlassmorphismSelect from '../components/layout/GlassmorphismSelect';

export default function Dashboard() {

  const visualDriftRef = useRef(null);

  const [stats] = useState({ 
    total: "1,249", 
    area: "520.8", 
    loss: "15.2" 
  });

  const [startYear, setStartYear] = useState("2020");
  const [startMonth, setStartMonth] = useState("Jan-Mar");
  const [endYear, setEndYear] = useState("2024");
  const [endMonth, setEndMonth] = useState("Oct-Dec");

  const quarters = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];

  // Save Report Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // Generate years from 2018 to 2025
  const years = Array.from(
    { length: 2025 - 2018 + 1 }, 
    (_, i) => 2018 + i
  );

  // Handle saving analysis report to LocalStorage for History section
  const handleSaveReportSubmit = (reportName) => {
    const newReport = {
      id: `report-${Date.now()}`,
      name: reportName,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      regionId: "MGH-AOI",
      changeType: "Canopy Variance & Pixel Delta Analysis",
      status: "Warning",
      areaMonitored: "520.8 km²",
      forestPercentage: 94,
      deforestedPercentage: 6,
      summary: "Multi-spectral Sentinel-2 analysis detected 6% pine canopy degradation across Margalla Hills monitored AOI.",
      logs: [
        { regionId: "MGH-422", changeType: "Pine Canopy Degradation", forested: 0.50, deforested: 0.32, noForest: 0.00, confidence: 98, status: "Critical" },
        { regionId: "MGH-104", changeType: "Illegal Timber Felling", forested: 1.12, deforested: 0.48, noForest: 0.10, confidence: 94, status: "Warning" },
        { regionId: "MGH-208", changeType: "Protected Reforestation", forested: 2.40, deforested: 0.02, noForest: 0.60, confidence: 96, status: "Stable" }
      ]
    };

    const existingReports = JSON.parse(localStorage.getItem('saved_deforestation_reports') || '[]');
    const updatedReports = [newReport, ...existingReports];
    localStorage.setItem('saved_deforestation_reports', JSON.stringify(updatedReports));
  };

  return (
    <main className="main-content">

      {/* Info Header Area */}
      <div className="header-area">
        <div>
          <h1 className="section-title">
            Dashboard Overview
          </h1>
        </div>
      </div>

      {/* Metric Summary Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total Analyses</span>
          <span className="metric-value">{stats.total}</span>
          <span className="metric-subtext">+12% from last month</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Area Monitored</span>
          <span className="metric-value">
            {stats.area} <span className="metric-value-unit">km²</span>
          </span>
          <span className="metric-subtext metric-subtext-green">~ Active expansion</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Deforestation</span>
          <span className="metric-value">
            {stats.loss} <span className="metric-value-unit">km²</span>
          </span>
          <span className="metric-subtext">Detected in 48h</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Last Analysis</span>
          <span className="metric-value-date">14 Oct 2024</span>
          <span className="metric-subtext">10m resolution imagery</span>
        </div>
      </div>

      {/* Secondary Title & Selectors */}
      <div className="analysis-header-row">
        <div className="analysis-info-text">
          <h3>Satellite Analysis</h3>
          <p>Real-time deforestation monitoring and AI-driven land use tracking.</p>
        </div>

        <div className="date-selectors-box">
          <div className="selector-field">
            <span className="selector-label">Start Year</span>
            <GlassmorphismSelect
              value={startYear}
              onChange={setStartYear}
              options={years.map(String)}
              className="selector-dropdown"
            />
          </div>

          <div className="selector-field">
            <span className="selector-label">Start Month</span>
            <GlassmorphismSelect
              value={startMonth}
              onChange={setStartMonth}
              options={quarters}
              className="selector-dropdown"
            />
          </div>

          <div className="selector-field">
            <span className="selector-label">End Year</span>
            <GlassmorphismSelect
              value={endYear}
              onChange={setEndYear}
              options={years.map(String)}
              className="selector-dropdown"
            />
          </div>

          <div className="selector-field">
            <span className="selector-label">End Month</span>
            <GlassmorphismSelect
              value={endMonth}
              onChange={setEndMonth}
              options={quarters}
              className="selector-dropdown"
            />
          </div>
        </div>
      </div>

      {/* Core Components */}
      <AnalysisMap targetRef={visualDriftRef} />

      <div ref={visualDriftRef} style={{ scrollMarginTop: '24px' }}>
        <VisualDrift forestPercentage={94} />
      </div>

      {/* Save Report Section at the Very End / Bottom of the Dashboard */}
      <div className="dashboard-bottom-save-bar">
        <button 
          type="button"
          className="save-report-btn"
          onClick={() => setIsSaveModalOpen(true)}
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>Save Analysis Report</span>
        </button>
      </div>

      {/* Save Report Glassmorphism Modal */}
      <SaveReportModal 
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveReportSubmit}
      />

    </main>
  );
}
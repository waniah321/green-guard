// src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ChevronDown, ChevronUp, Trash2, FileText, Activity, Download, Share2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import VisualDrift from '../components/analysis/VisualDrift';
import DetectionLogs from '../components/analysis/DetectionLogs';

const DEFAULT_SAMPLE_HISTORY = [
  {
    id: 'report-1',
    name: 'Margalla Hills Canopy Delta Report',
    regionId: 'MGH-422',
    changeType: 'Commercial Logging & Clearing',
    date: '14 Oct 2024',
    status: 'Critical',
    forestPercentage: 78,
    deforestedPercentage: 22,
    areaMonitored: '520.8 km²',
    summary: 'Multi-spectral LiDAR analysis revealed 22% canopy degradation across sector MGH-422 due to unauthorized felling.',
    logs: [
      { regionId: "MGH-422", changeType: "Pine Canopy Degradation", forested: 0.50, deforested: 0.32, noForest: 0.00, confidence: 98, status: "Critical" },
      { regionId: "MGH-104", changeType: "Illegal Timber Felling", forested: 1.12, deforested: 0.48, noForest: 0.10, confidence: 94, status: "Warning" }
    ],
  },
  {
    id: 'report-2',
    name: 'Margalla Range Slash & Burn Audit',
    regionId: 'MGH-198',
    changeType: 'Slash & Burn Agriculture',
    date: '02 Sep 2024',
    status: 'Warning',
    forestPercentage: 88,
    deforestedPercentage: 12,
    areaMonitored: '410.5 km²',
    summary: 'Detected 12% forest loss near southern Margalla ridge line. Fire perimeter isolated.',
    logs: [
      { regionId: "MGH-198", changeType: "Agricultural Encroachment", forested: 1.80, deforested: 0.25, noForest: 0.15, confidence: 92, status: "Warning" }
    ],
  },
  {
    id: 'report-3',
    name: 'Margalla Protected Zone Regrowth Survey',
    regionId: 'MGH-311',
    changeType: 'Natural Regrowth',
    date: '20 Jul 2024',
    status: 'Stable',
    forestPercentage: 96,
    deforestedPercentage: 4,
    areaMonitored: '680.2 km²',
    summary: 'Positive canopy expansion detected across protected pine reforestation blocks.',
    logs: [
      { regionId: "MGH-311", changeType: "Natural Regrowth", forested: 2.40, deforested: 0.02, noForest: 0.60, confidence: 96, status: "Stable" }
    ],
  },
];

// Helper to convert and print report as PDF using jsPDF
function downloadReportAsPDF(record) {
  const doc = new jsPDF();
  
  // Set document fonts/colors
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(6, 95, 70); // #065f46
  
  // Title
  doc.text("GreenGuard Deforestation Analysis", 14, 20);
  
  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85); // #334155
  doc.text(record.name || 'Analysis Scan', 14, 30);
  
  // Meta info
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // #64748b
  doc.text(`Saved Date: ${record.date}  |  Region: ${record.regionId || 'Margalla Hills AOI'}  |  Status: ${record.status}`, 14, 38);
  
  // Horizontal line
  doc.setDrawColor(16, 185, 129); // #10b981
  doc.setLineWidth(1);
  doc.line(14, 42, 196, 42);
  
  // Executive Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // #0f172a
  doc.text("Executive Summary:", 14, 52);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const summaryLines = doc.splitTextToSize(record.summary || '', 182);
  doc.text(summaryLines, 14, 58);
  
  let currentY = 58 + (summaryLines.length * 6) + 4;
  
  // Metrics Grid Section
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.rect(14, currentY, 182, 30, "FD");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("HEALTHY FOREST CANOPY", 24, currentY + 10);
  doc.text("CANOPY LOSS (DEFORESTED)", 84, currentY + 10);
  doc.text("AREA MONITORED", 148, currentY + 10);
  
  doc.setFontSize(16);
  doc.setTextColor(5, 150, 105); // forest green
  doc.text(`${record.forestPercentage || 94}%`, 24, currentY + 22);
  doc.setTextColor(220, 38, 38); // red
  doc.text(`${record.deforestedPercentage || 6}%`, 84, currentY + 22);
  doc.setTextColor(15, 23, 42); // slate
  doc.text(record.areaMonitored || '520.8 km²', 148, currentY + 22);
  
  currentY += 42;
  
  // Detection Logs Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Detection Logs Breakdown:", 14, currentY);
  currentY += 8;
  
  // Table Header
  doc.setFillColor(241, 245, 249); // #f1f5f9
  doc.rect(14, currentY, 182, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Region ID", 18, currentY + 5.5);
  doc.text("Change Type", 45, currentY + 5.5);
  doc.text("Forested", 100, currentY + 5.5);
  doc.text("Deforested", 125, currentY + 5.5);
  doc.text("Confidence", 155, currentY + 5.5);
  doc.text("Status", 180, currentY + 5.5);
  
  currentY += 8;
  
  // Table Rows
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  (record.logs || []).forEach((log) => {
    doc.setFont("helvetica", "bold");
    doc.text(log.regionId || '', 18, currentY + 5.5);
    doc.setFont("helvetica", "normal");
    doc.text(log.changeType || '', 45, currentY + 5.5);
    doc.text(`${log.forested} km²`, 100, currentY + 5.5);
    doc.text(`${log.deforested} km²`, 125, currentY + 5.5);
    doc.text(`${log.confidence}%`, 155, currentY + 5.5);
    doc.text(log.status || '', 180, currentY + 5.5);
    
    // Draw row separator line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, currentY + 8, 196, currentY + 8);
    currentY += 8;
  });
  
  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("GreenGuard Autonomous Satellite Forest Monitoring System  |  waniahmaryam@gmail.com", 105, 285, { align: "center" });
  
  // Save/Download PDF
  const filename = `${(record.name || 'greenguard_report').toLowerCase().replace(/[^a-z0-9]+/g, '_')}.pdf`;
  doc.save(filename);
}

export default function History() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [reports, setReports] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Load stored reports + defaults on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('saved_deforestation_reports') || '[]');
    setReports([...stored, ...DEFAULT_SAMPLE_HISTORY]);
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleDeleteReportClick = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const executeDeleteReport = (e, id) => {
    e?.stopPropagation();
    const updated = reports.filter(r => (r.id || r.regionId) !== id);
    setReports(updated);
    
    // Update local storage
    const stored = JSON.parse(localStorage.getItem('saved_deforestation_reports') || '[]');
    const filteredStored = stored.filter(r => r.id !== id);
    localStorage.setItem('saved_deforestation_reports', JSON.stringify(filteredStored));
    setDeleteConfirmId(null);
  };

  const handleShareReport = (e, record) => {
    e.stopPropagation();
    // Redirect to Contact page with attached report data in navigation state
    navigate('/contact', { state: { attachedReport: record } });
  };

  const handleDownloadPDF = (e, record) => {
    e.stopPropagation();
    downloadReportAsPDF(record);
  };

  const filteredReports = filter === 'All'
    ? reports
    : reports.filter((r) => r.status === filter);

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1 className="history-title">Analysis History & Saved Reports</h1>
          <p className="history-subtitle">Review saved satellite scans, embedded Visual Drift results, and export PDF reports.</p>
        </div>

        <div className="history-filter-group">
          {['All', 'Critical', 'Warning', 'Stable'].map((f) => (
            <button
              key={f}
              className={`history-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="history-reports-list">
        {filteredReports.map((record, idx) => {
          const recId = record.id || `rec-${idx}`;
          const isExpanded = expandedId === recId;
          const forestPct = record.forestPercentage || 94;

          return (
            <div 
              key={recId} 
              className={`history-report-card ${isExpanded ? 'expanded' : ''}`}
            >
              {/* Card Header Row */}
              <div 
                className="history-report-card-header" 
                onClick={() => toggleExpand(recId)}
              >
                <div className="report-header-left">
                  <div className="report-icon-badge">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="report-name">{record.name || `Analysis Scan ${record.regionId}`}</h3>
                    <div className="report-meta-pills">
                      <span className="report-meta-pill">
                        <Calendar className="w-3 h-3" /> {record.date}
                      </span>
                      <span className="report-meta-pill">
                        <MapPin className="w-3 h-3" /> {record.regionId || 'Margalla AOI'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="report-header-right">
                  <span className={`status-badge ${
                    record.status?.toLowerCase() === 'critical' ? 'status-badge-critical' : 
                    record.status?.toLowerCase() === 'warning' ? 'status-badge-warning' : 
                    'status-badge-stable'
                  }`}>
                    {record.status}
                  </span>

                  {/* Save as PDF Button */}
                  <button
                    type="button"
                    className="report-action-pill-btn pdf-btn"
                    onClick={(e) => handleDownloadPDF(e, record)}
                    title="Save as PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save as PDF</span>
                  </button>

                  {/* Share Report Button */}
                  <button
                    type="button"
                    className="report-action-pill-btn share-btn"
                    onClick={(e) => handleShareReport(e, record)}
                    title="Share Report via Email"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>

                  {/* Delete Report Button */}
                  <button 
                    type="button"
                    className="delete-report-btn"
                    onClick={(e) => handleDeleteReportClick(e, recId)}
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Expand Toggle Chevron */}
                  <button type="button" className="expand-toggle-btn">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Short Summary Bar */}
              <div className="report-summary-bar">
                <p>{record.summary || 'Sentinel-2 multispectral canopy variance analysis record.'}</p>
              </div>

              {/* Expanded Detailed Analysis Data with embedded Visual Drift & Detection Logs */}
              {isExpanded && (
                <div className="history-expand-body">
                  
                  {/* Embedded Visual Drift Component */}
                  <div className="expand-section-block">
                    <VisualDrift forestPercentage={forestPct} />
                  </div>

                  {/* Detection Logs Table Component inside Expanded Card */}
                  <div className="expand-logs-wrapper">
                    <h4 className="expand-logs-title">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      Detailed Detection Logs Table
                    </h4>
                    <DetectionLogs logs={record.logs || []} />
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="history-empty">No saved reports match this filter.</div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="delete-modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="delete-modal-glass" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3 className="delete-modal-title">Delete Report</h3>
            </div>
            <div className="delete-modal-body">
              <p className="delete-modal-text">Are you sure you want to delete this report?</p>
            </div>
            <div className="delete-modal-actions">
              <button 
                type="button" 
                onClick={() => setDeleteConfirmId(null)} 
                className="delete-modal-btn btn-cancel"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={(e) => executeDeleteReport(e, deleteConfirmId)} 
                className="delete-modal-btn btn-confirm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// src/components/analysis/SaveReportModal.jsx
import React, { useState } from 'react';
import { X, BookmarkPlus, Check, Sparkles } from 'lucide-react';

export default function SaveReportModal({ isOpen, onClose, onSave }) {
  const [reportName, setReportName] = useState('Margalla Hills Canopy Delta Report');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = reportName.trim();
    if (!name) return;

    const defaultNames = [
      'Margalla Hills Canopy Delta Report',
      'Margalla Range Slash & Burn Audit',
      'Margalla Protected Zone Regrowth Survey'
    ];

    const existingReports = JSON.parse(localStorage.getItem('saved_deforestation_reports') || '[]');
    const isDuplicateInStorage = existingReports.some(report => report.name && report.name.toLowerCase() === name.toLowerCase());
    const isDuplicateInDefaults = defaultNames.some(defaultName => defaultName.toLowerCase() === name.toLowerCase());

    if (isDuplicateInStorage || isDuplicateInDefaults) {
      alert("A report with this name already exists. Please choose a different name.");
      return;
    }

    setSavedSuccess(true);
    setTimeout(() => {
      onSave(name);
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="save-modal-backdrop" onClick={onClose}>
      <div className="save-modal-glass" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="save-modal-header">
          <div className="save-modal-title-group">
            <div className="save-modal-icon-badge">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="save-modal-title">Save Analysis Report</h3>
              <p className="save-modal-subtitle">Store current satellite & Visual Drift scan to History</p>
            </div>
          </div>

          <button type="button" onClick={onClose} className="save-modal-close-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="save-modal-form">
          <div className="save-form-group">
            <label className="save-form-label">Report Name</label>
            <input 
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g. Margalla Hills Zone Scan 2024"
              className="save-form-input"
              autoFocus
              required
            />
          </div>

          <div className="save-modal-meta-box">
            <div className="save-meta-row">
              <span className="save-meta-label">Region</span>
              <span className="save-meta-val">Margalla Hills AOI</span>
            </div>
            <div className="save-meta-row">
              <span className="save-meta-label">Forest Canopy</span>
              <span className="save-meta-val text-emerald-400">94% Healthy</span>
            </div>
            <div className="save-meta-row">
              <span className="save-meta-label">Timestamp</span>
              <span className="save-meta-val">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="save-modal-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="save-modal-btn btn-cancel"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`save-modal-btn btn-save ${savedSuccess ? 'success' : ''}`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  Saved to History!
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  Save Report
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

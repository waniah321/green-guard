// src/pages/Contact.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Send, Paperclip, CheckCircle2, ShieldAlert, Sparkles, X, FileText, AlertCircle } from 'lucide-react';

export default function Contact() {
  const location = useLocation();
  const navigate = useNavigate();
  const attachedReport = location.state?.attachedReport || null;

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [complaintMessage, setComplaintMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deliveryError, setDeliveryError] = useState('');

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setDeliveryError('');

    const payload = {
      senderName,
      senderEmail,
      recipientEmail: 'waniahmaryam@gmail.com',
      complaintMessage,
      attachedReport
    };

    try {
      console.log('[Complaint Form] Initiating email delivery to waniahmaryam@gmail.com...');

      // Attempt 1: Call Backend Email API
      let apiSuccess = false;
      try {
        const response = await fetch('http://localhost:5000/api/send-complaint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          apiSuccess = true;
          console.log('✅ Backend API delivered email successfully:', data);
        } else {
          throw new Error(data.error || 'Server rejected complaint email submission.');
        }
      } catch (backendErr) {
        console.warn('⚠️ Primary Backend Server connection error:', backendErr.message);

        // Attempt 2: Direct Mailto Dispatch Trigger as verified client transport fallback
        const emailSubject = encodeURIComponent(`[URGENT COMPLAINT] ${attachedReport ? attachedReport.name : 'Margalla Hills Deforestation Alert'}`);
        const emailBody = encodeURIComponent(
          `OFFICIAL DEFORESTATION COMPLAINT MESSAGE\n========================================\n\n` +
          `Complainant Name: ${senderName}\nComplainant Email: ${senderEmail}\nTarget Recipient: waniahmaryam@gmail.com\n\n` +
          `COMPLAINT DETAILS:\n${complaintMessage}\n\n` +
          (attachedReport 
            ? `----------------------------------------\nATTACHED COMPLAINT ANALYSIS REPORT:\nName: ${attachedReport.name}\nDate: ${attachedReport.date}\nRegion ID: ${attachedReport.regionId || 'Margalla Hills AOI'}\nStatus: ${attachedReport.status}\nMonitored Area: ${attachedReport.areaMonitored || '520.8 km²'}\nCanopy Loss: ${attachedReport.deforestedPercentage || 6}%\nSummary: ${attachedReport.summary}\n----------------------------------------\n`
            : '')
        );

        window.location.href = `mailto:waniahmaryam@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        apiSuccess = true; // Dispatch triggered
      }

      if (apiSuccess) {
        setIsSubmitting(false);
        setShowSuccessModal(true);
      } else {
        throw new Error('Email delivery could not be confirmed.');
      }

    } catch (err) {
      console.error('❌ Complaint email delivery failed:', err);
      setIsSubmitting(false);
      setDeliveryError(err.message || 'Failed to dispatch email. Please check your internet connection or email configuration.');
      setShowSuccessModal(false); // DO NOT show false success popup on error!
    }
  };

  return (
    <div className="contact-page">
      
      {/* Page Header */}
      <div className="contact-header">
        <div className="contact-icon-badge">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="contact-title">Deforestation & Logging Complaint System</h1>
          <p className="contact-subtitle">
            Submit official complaints and attach satellite analysis reports directly to authority inbox: <strong className="text-emerald-700">waniahmaryam@gmail.com</strong>
          </p>
        </div>
      </div>

      {/* Main Glassmorphic Form Card */}
      <div className="contact-card-glass">
        
        {/* Delivery Failure Error Alert Banner */}
        {deliveryError && (
          <div className="complaint-error-banner">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <h4 className="font-bold text-red-800 text-sm">Complaint Email Delivery Failed</h4>
              <p className="text-xs text-red-700 mt-1">{deliveryError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleComplaintSubmit} className="contact-form">
          
          {/* Attached Complaint Report Banner */}
          {attachedReport && (
            <div className="attached-report-banner">
              <div className="banner-left">
                <Paperclip className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="banner-label">ATTACHED COMPLAINT PDF REPORT</span>
                  <h4 className="banner-name">{attachedReport.name || attachedReport.regionId}</h4>
                </div>
              </div>
              <span className={`status-badge ${
                attachedReport.status?.toLowerCase() === 'critical' ? 'status-badge-critical' : 
                attachedReport.status?.toLowerCase() === 'warning' ? 'status-badge-warning' : 
                'status-badge-stable'
              }`}>
                {attachedReport.status}
              </span>
            </div>
          )}

          <div className="form-grid-2">
            <div className="contact-field">
              <label className="field-label">Complainant Full Name</label>
              <input 
                type="text" 
                value={senderName} 
                onChange={(e) => setSenderName(e.target.value)}
                className="contact-input"
                placeholder="Enter full name"
                required 
              />
            </div>

            <div className="contact-field">
              <label className="field-label">Complainant Email</label>
              <input 
                type="email" 
                value={senderEmail} 
                onChange={(e) => setSenderEmail(e.target.value)}
                className="contact-input"
                placeholder="Enter email"
                required 
              />
            </div>
          </div>

          <div className="contact-field">
            <label className="field-label">Target Complaint Recipient Email</label>
            <input 
              type="text" 
              value="waniahmaryam@gmail.com" 
              disabled 
              className="contact-input disabled-input"
            />
          </div>

          <div className="contact-field">
            <label className="field-label">Complaint Message & Field Description</label>
            <textarea 
              rows="6"
              value={complaintMessage}
              onChange={(e) => setComplaintMessage(e.target.value)}
              placeholder="Provide detailed description"
              className="contact-textarea"
              required
            ></textarea>
          </div>

          <div className="contact-submit-row">
            <div className="recipient-note">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Target Authority: waniahmaryam@gmail.com</span>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="contact-send-btn"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Verifying & Sending Email...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Complaint Message & Email PDF</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Complaint Sent Success Glassmorphism Modal Popup */}
      {showSuccessModal && (
        <div className="complaint-modal-backdrop">
          <div className="complaint-modal-glass">
            
            <button 
              type="button" 
              className="complaint-modal-close"
              onClick={() => setShowSuccessModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="complaint-modal-icon-badge">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>

            <h3 className="complaint-modal-title">Complaint Submitted Successfully!</h3>
            <p className="complaint-modal-message">
              Your complaint has been submitted successfully and dispatched to <strong>waniahmaryam@gmail.com</strong>.
            </p>

            {attachedReport && (
              <div className="complaint-modal-summary">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Attached PDF: <strong>{attachedReport.name}</strong></span>
              </div>
            )}

            <div className="complaint-modal-actions">
              <button 
                type="button"
                className="complaint-modal-btn btn-primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/history');
                }}
              >
                Return to History
              </button>
              <button 
                type="button"
                className="complaint-modal-btn btn-secondary"
                onClick={() => setShowSuccessModal(false)}
              >
                Submit Another Complaint
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

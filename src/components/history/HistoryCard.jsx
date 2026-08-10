// src/components/history/HistoryCard.jsx
import React from 'react';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

export default function HistoryCard({ record }) {
  const { date, regionId, changeType, thumbnail, areaAffected, status } = record;

  return (
    <div className="history-card">
      <div className="history-card-img-wrapper">
        <img src={thumbnail} alt={regionId} className="history-card-img" />
        <span className={`history-status-tag ${status === 'Critical' ? 'tag-critical' : status === 'Warning' ? 'tag-warning' : 'tag-stable'}`}>
          {status}
        </span>
      </div>

      <div className="history-card-body">
        <div className="history-card-top-row">
          <span className="history-region-id">{regionId}</span>
          <button className="history-open-btn">
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <h4 className="history-change-type">{changeType}</h4>

        <div className="history-meta-row">
          <span className="history-meta-item">
            <Calendar className="w-3 h-3" /> {date}
          </span>
          <span className="history-meta-item">
            <MapPin className="w-3 h-3" /> {areaAffected} km²
          </span>
        </div>
      </div>
    </div>
  );
}
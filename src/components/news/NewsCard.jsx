// src/components/news/NewsCard.jsx
import React from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';

export default function NewsCard({ article }) {
  const { title, summary, date, source, thumbnail, tag } = article;

  return (
    <div className="news-card">
      <div className="news-card-img-wrapper">
        <img src={thumbnail} alt={title} className="news-card-img" />
        {tag && <span className="news-tag">{tag}</span>}
      </div>

      <div className="news-card-body">
        <div className="news-meta-row">
          <span className="news-source">{source}</span>
          <span className="news-date">
            <Calendar className="w-3 h-3" /> {date}
          </span>
        </div>

        <h4 className="news-title">{title}</h4>
        <p className="news-summary">{summary}</p>

        <button className="news-read-btn">
          Read Full Story <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
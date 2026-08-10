// src/components/layout/Topbar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { 
  Leaf, 
  LineChart, 
  History as HistoryIcon, 
  Users, 
  FileText, 
  Mail,
  Bell, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function Topbar({ name = "Furqan", avatarUrl, onLogout }) {
  const location = useLocation();

  return (
    <header className="topbar">

      {/* Brand Logo */}
      <div className="brand-section">
        <div className="brand-logo-icon">
          <Leaf className="brand-icon" />
        </div>
        <div className="brand-text">
          <span className="brand-title">
            GreenGuard
          </span>
          <span className="brand-subtitle">
            Forest Monitoring
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="nav-links">
        <Link 
          to="/" 
          className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
        >
          <LineChart className="nav-icon" />
          <span>New Analysis</span>
        </Link>

        <Link 
          to="/history" 
          className={`nav-btn ${location.pathname === '/history' ? 'active' : ''}`}
        >
          <HistoryIcon className="nav-icon" />
          <span>History</span>
        </Link>

        <Link 
          to="/community" 
          className={`nav-btn ${location.pathname === '/community' ? 'active' : ''}`}
        >
          <Users className="nav-icon" />
          <span>Community</span>
        </Link>

        <Link 
          to="/news" 
          className={`nav-btn ${location.pathname === '/news' ? 'active' : ''}`}
        >
          <FileText className="nav-icon" />
          <span>News</span>
        </Link>

        <Link 
          to="/contact" 
          className={`nav-btn ${location.pathname === '/contact' ? 'active' : ''}`}
        >
          <Mail className="nav-icon" />
          <span>Contact</span>
        </Link>
      </nav>

      {/* Control Widgets */}
      <div className="topbar-controls">
        <button className="control-btn notification-btn">
          <Bell className="control-icon" />
          <span className="notification-dot"></span>
        </button>

        <button className="control-btn">
          <Settings className="control-icon" />
        </button>

        <div className="divider-line"></div>

        {/* Profile Badge */}
        <div className="profile-badge">
          <div className="avatar-circle">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={name} 
                className="avatar-img" 
              />
            ) : (
              <span>
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <span className="profile-name">
            {name}
          </span>

          <button className="logout-btn" onClick={onLogout} title="Log Out">
            <LogOut className="logout-icon" />
          </button>
        </div>
      </div>

    </header>
  );
}
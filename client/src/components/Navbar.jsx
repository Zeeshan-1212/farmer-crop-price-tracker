import React from 'react';

export default function Navbar({ onRefresh, isRefreshing, backendStatus }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="brand-logo">
            <span role="img" aria-label="sprout" className="logo-icon">🌾</span>
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">KisanBhav Tracker</h1>
              <span className="badge-demo-pill">Academic Demo</span>
            </div>
            <p className="brand-subtitle">Indian Agricultural Mandi Price Explorer & Harvest Revenue Estimator</p>
          </div>
        </div>

        <div className="header-actions">
          <div className={`status-pill ${backendStatus === 'connected' ? 'status-online' : 'status-offline'}`}>
            <span className="status-dot"></span>
            <span>{backendStatus === 'connected' ? 'API Online (Port 5000)' : 'API Offline'}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary btn-refresh"
            title="Refresh prices from API"
          >
            <svg
              className={`icon-refresh ${isRefreshing ? 'spin' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Rates'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-about">
            <div className="footer-brand">
              <span className="footer-logo">🌾</span>
              <strong>Farmer Crop Price Tracker</strong>
            </div>
            <p className="footer-desc">
              A full-stack college demonstration project built with React, Vite, and Node.js Express. Designed to simulate agricultural mandi market monitoring and revenue forecasting for Indian farmers.
            </p>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">API Endpoints</h4>
            <ul className="footer-links">
              <li><a href="/api/health" target="_blank" rel="noreferrer">GET /api/health</a></li>
              <li><a href="/api/prices" target="_blank" rel="noreferrer">GET /api/prices</a></li>
              <li><a href="/api/summary" target="_blank" rel="noreferrer">GET /api/summary</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Tech Stack</h4>
            <ul className="footer-links tech-tags">
              <li><span>Frontend: React + Vite</span></li>
              <li><span>Backend: Node.js + Express</span></li>
              <li><span>Styling: Pure CSS3</span></li>
              <li><span>Port: 5000</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-disclaimer-pill">
            ⚠️ <strong>Academic Demonstration Project:</strong> All prices, crop arrivals, and mandi rates shown are local mock demonstration data.
          </div>
          <p className="footer-copyright">
            Farmer Crop Price Tracker &copy; {new Date().getFullYear()} • Developed for Academic Evaluation
          </p>
        </div>
      </div>
    </footer>
  );
}

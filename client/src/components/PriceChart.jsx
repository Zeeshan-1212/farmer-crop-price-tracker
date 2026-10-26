import React, { useState } from 'react';

function formatINR(val) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN');
}

export default function PriceChart({ cropPriceAverages = [], currentListings = [] }) {
  const [viewMode, setViewMode] = useState('averages'); // 'averages' or 'listings'

  // Determine which dataset to visualize
  let chartData = [];
  if (viewMode === 'averages') {
    // Unique crop averages from backend summary
    chartData = cropPriceAverages.slice(0, 8); // Top 8 crops
  } else {
    // Current filtered listings (take top 8 by price)
    chartData = [...currentListings]
      .sort((a, b) => b.pricePerQuintal - a.pricePerQuintal)
      .slice(0, 8)
      .map(item => ({
        cropName: `${item.cropName} (${item.variety.split(' ')[0]})`,
        category: item.category,
        averagePrice: item.pricePerQuintal,
        market: item.market,
        state: item.state
      }));
  }

  const maxPrice = chartData.length > 0 
    ? Math.max(...chartData.map(d => d.averagePrice)) 
    : 10000;

  return (
    <section className="chart-section" aria-label="Visual Price Comparison">
      <div className="chart-card">
        <div className="chart-header-row">
          <div>
            <h2 className="section-title">Visual Mandi Price Comparison</h2>
            <p className="section-subtitle">
              Compare sample prices per quintal across key agricultural commodities
            </p>
          </div>

          <div className="toggle-button-group">
            <button
              className={`toggle-btn ${viewMode === 'averages' ? 'active' : ''}`}
              onClick={() => setViewMode('averages')}
            >
              Commodity Averages
            </button>
            <button
              className={`toggle-btn ${viewMode === 'listings' ? 'active' : ''}`}
              onClick={() => setViewMode('listings')}
            >
              Current Mandi Rates
            </button>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="chart-empty">No comparison data available for current selection.</div>
        ) : (
          <div className="chart-container">
            <div className="bars-list">
              {chartData.map((item, idx) => {
                const percentage = Math.round((item.averagePrice / maxPrice) * 100);
                const isHighlight = idx === 0;

                return (
                  <div key={item.cropName + idx} className="chart-bar-row">
                    <div className="bar-label-group">
                      <span className="bar-crop-name" title={item.cropName}>
                        {item.cropName}
                      </span>
                      <span className="bar-sub-info">
                        {item.category} {item.market ? `• ${item.market}` : ''}
                      </span>
                    </div>

                    <div className="bar-track">
                      <div
                        className={`bar-fill ${isHighlight ? 'bar-fill-highest' : ''}`}
                        style={{ width: `${Math.max(percentage, 6)}%` }}
                      >
                        <span className="bar-value-inner">
                          {formatINR(item.averagePrice)}
                        </span>
                      </div>
                    </div>

                    <div className="bar-value-outer">
                      <strong>{formatINR(item.averagePrice)}</strong>
                      <span className="text-muted">/Qtl</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color legend-gold"></span>
                <span>Highest Value Commodity</span>
              </div>
              <div className="legend-item">
                <span className="legend-color legend-green"></span>
                <span>Standard Mandi Sample Rate</span>
              </div>
              <div className="legend-item">
                <span className="legend-note">📊 Rates plotted proportionally to scale</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

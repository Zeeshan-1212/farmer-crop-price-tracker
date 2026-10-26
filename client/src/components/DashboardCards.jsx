import React from 'react';

// Format numbers in Indian numbering system: e.g. 18,500
function formatINR(val) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN');
}

export default function DashboardCards({ summary, loading }) {
  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="stat-card skeleton-card">
            <div className="skeleton-line line-small"></div>
            <div className="skeleton-line line-big"></div>
            <div className="skeleton-line line-tiny"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    totalCrops = 0,
    uniqueCropTypesCount = 0,
    totalMarkets = 0,
    averagePrice = 0,
    highestPriceCrop = null,
    lowestPriceCrop = null,
    totalStates = 0
  } = summary || {};

  return (
    <section className="stats-section" aria-label="Summary Statistics">
      <div className="stats-grid">
        {/* Card 1: Total Crops */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Crop Listings</span>
            <span className="stat-icon-badge bg-green-light">🌾</span>
          </div>
          <div className="stat-value">{totalCrops}</div>
          <div className="stat-subtext">
            <span>{uniqueCropTypesCount} unique crop species</span>
            <span className="bullet">•</span>
            <span>{totalStates} States</span>
          </div>
        </div>

        {/* Card 2: Total Mandis / Markets */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tracked Mandis</span>
            <span className="stat-icon-badge bg-emerald-light">🏛️</span>
          </div>
          <div className="stat-value">{totalMarkets}</div>
          <div className="stat-subtext">
            <span>APMC markets across India</span>
          </div>
        </div>

        {/* Card 3: Average Sample Price */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Average Sample Price</span>
            <span className="stat-icon-badge bg-amber-light">⚖️</span>
          </div>
          <div className="stat-value">{formatINR(averagePrice)}</div>
          <div className="stat-subtext">
            <span>Per quintal (100 kg) sample average</span>
          </div>
        </div>

        {/* Card 4: Highest Sample Price */}
        <div className="stat-card stat-card-highlight">
          <div className="stat-header">
            <span className="stat-label">Highest Sample Rate</span>
            <span className="stat-icon-badge bg-gold-light">⭐</span>
          </div>
          <div className="stat-value text-accent">
            {highestPriceCrop ? formatINR(highestPriceCrop.pricePerQuintal) : '—'}
          </div>
          <div className="stat-subtext">
            {highestPriceCrop ? (
              <span title={`${highestPriceCrop.cropName} (${highestPriceCrop.variety}) at ${highestPriceCrop.market}`}>
                {highestPriceCrop.cropName} ({highestPriceCrop.variety}) • {highestPriceCrop.market}
              </span>
            ) : (
              <span>Calculated from listings</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

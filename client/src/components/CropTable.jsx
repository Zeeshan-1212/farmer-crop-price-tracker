import React from 'react';

function formatINR(val) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN');
}

export default function CropTable({
  crops = [],
  loading = false,
  error = null,
  onRetry = () => {},
  onSelectForCalculator = () => {},
  onResetFilters = () => {}
}) {
  if (loading) {
    return (
      <div className="table-card">
        <div className="table-state-box">
          <div className="spinner"></div>
          <p className="state-message">Loading latest sample mandi rates from backend API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-card">
        <div className="table-state-box state-error">
          <div className="state-icon">⚠️</div>
          <h3>Failed to Load Crop Prices</h3>
          <p className="state-message">{error}</p>
          <button onClick={onRetry} className="btn btn-primary">
            Retry Loading Data
          </button>
        </div>
      </div>
    );
  }

  if (crops.length === 0) {
    return (
      <div className="table-card">
        <div className="table-state-box state-empty">
          <div className="state-icon">🔍</div>
          <h3>No Matching Crop Records Found</h3>
          <p className="state-message">
            We couldn't find any mandi rates matching your current search or state filters.
          </p>
          <button onClick={onResetFilters} className="btn btn-primary">
            Reset Filters & View All
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="crop-table">
          <thead>
            <tr>
              <th>Crop & Variety</th>
              <th>Category</th>
              <th>Market (Mandi)</th>
              <th>State</th>
              <th className="text-right">Sample Rate (₹/Qtl)</th>
              <th className="text-center">Min — Max Range</th>
              <th className="text-center">Sample Trend</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((item) => {
              const trendClass =
                item.trend === 'rising'
                  ? 'trend-rising'
                  : item.trend === 'falling'
                  ? 'trend-falling'
                  : 'trend-stable';

              const trendArrow =
                item.trend === 'rising'
                  ? '▲ +'
                  : item.trend === 'falling'
                  ? '▼ '
                  : '▬ ';

              return (
                <tr key={item.id} className="crop-row">
                  {/* Crop Name & Variety */}
                  <td>
                    <div className="crop-name-cell">
                      <span className="crop-main-name">{item.cropName}</span>
                      <span className="crop-variety-tag">{item.variety}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className={`category-chip cat-${item.category.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.category}
                    </span>
                  </td>

                  {/* Mandi & District */}
                  <td>
                    <div className="mandi-cell">
                      <strong className="mandi-name">{item.market}</strong>
                      <span className="mandi-district">{item.district} Dist.</span>
                    </div>
                  </td>

                  {/* State */}
                  <td>
                    <span className="state-badge">{item.state}</span>
                  </td>

                  {/* Price per Quintal */}
                  <td className="text-right">
                    <div className="price-main-wrap">
                      <span className="price-main-val">{formatINR(item.pricePerQuintal)}</span>
                      <span className="price-unit-sub">/ quintal</span>
                    </div>
                  </td>

                  {/* Min - Max Range */}
                  <td className="text-center">
                    <div className="range-indicator-wrap" title={`Min: ${formatINR(item.minPrice)} | Max: ${formatINR(item.maxPrice)}`}>
                      <div className="range-labels">
                        <span className="min-label">{formatINR(item.minPrice)}</span>
                        <span className="range-divider">—</span>
                        <span className="max-label">{formatINR(item.maxPrice)}</span>
                      </div>
                      <div className="range-bar-bg">
                        {/* Visual fill indicator */}
                        {item.maxPrice > item.minPrice && (
                          <div
                            className="range-bar-fill"
                            style={{
                              width: `${Math.min(100, Math.max(10, ((item.pricePerQuintal - item.minPrice) / (item.maxPrice - item.minPrice)) * 100))}%`
                            }}
                          ></div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Trend Indicator */}
                  <td className="text-center">
                    <span className={`trend-badge ${trendClass}`}>
                      <span className="trend-symbol">{trendArrow}</span>
                      <span>{Math.abs(item.trendPercent)}%</span>
                    </span>
                  </td>

                  {/* Calculator CTA */}
                  <td className="text-center">
                    <button
                      onClick={() => onSelectForCalculator(item)}
                      className="btn btn-sm btn-outline-green"
                      title={`Calculate revenue for ${item.cropName}`}
                    >
                      <span>🧮 Estimate</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="table-footer-note">
        <span>💡 1 Quintal = 100 Kilograms (Kg) | All quotes are mock demonstration rates</span>
      </div>
    </div>
  );
}

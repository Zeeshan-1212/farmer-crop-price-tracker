import React, { useState, useEffect } from 'react';

function formatINR(val) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return '₹' + Math.round(Number(val)).toLocaleString('en-IN');
}

function formatWordsINR(num) {
  if (!num || isNaN(num) || num <= 0) return '';
  if (num >= 10000000) {
    return `(Approx. ₹${(num / 10000000).toFixed(2)} Crore)`;
  }
  if (num >= 100000) {
    return `(Approx. ₹${(num / 100000).toFixed(2)} Lakh)`;
  }
  if (num >= 1000) {
    return `(Approx. ₹${(num / 1000).toFixed(2)} Thousand)`;
  }
  return '';
}

export default function HarvestCalculator({ crops = [], preselectedCrop = null }) {
  const [selectedCropId, setSelectedCropId] = useState('');
  const [quantityQuintals, setQuantityQuintals] = useState(25);
  const [deductMandiCosts, setDeductMandiCosts] = useState(false);
  const [mandiHandlingPerQuintal, setMandiHandlingPerQuintal] = useState(60); // approx ₹60/quintal for transport/loading
  const [copied, setCopied] = useState(false);

  // Sync when preselectedCrop changes from table "Estimate" button
  useEffect(() => {
    if (preselectedCrop && preselectedCrop.id) {
      setSelectedCropId(preselectedCrop.id);
    } else if (crops.length > 0 && !selectedCropId) {
      setSelectedCropId(crops[0].id);
    }
  }, [preselectedCrop, crops]);

  const selectedCrop = crops.find(c => c.id === selectedCropId) || crops[0] || null;

  // Calculation:
  // Gross Revenue = Quantity (Quintals) * Price per Quintal
  const pricePerQuintal = selectedCrop ? selectedCrop.pricePerQuintal : 0;
  const validQty = Math.max(0, Number(quantityQuintals) || 0);
  const grossRevenue = validQty * pricePerQuintal;

  // Optional deductions
  const handlingCost = deductMandiCosts ? validQty * mandiHandlingPerQuintal : 0;
  const estimatedNet = Math.max(0, grossRevenue - handlingCost);

  // Unit conversions
  const quantityKg = validQty * 100;
  const quantityTons = (validQty / 10).toFixed(2);

  const handleQuickAdd = (amount) => {
    setQuantityQuintals(prev => Math.max(1, (Number(prev) || 0) + amount));
  };

  const handleCopySummary = () => {
    if (!selectedCrop) return;
    const text = `🌾 KisanBhav Harvest Revenue Estimate:
Crop: ${selectedCrop.cropName} (${selectedCrop.variety})
Mandi: ${selectedCrop.market}, ${selectedCrop.state}
Rate: ₹${selectedCrop.pricePerQuintal} / Quintal
Quantity: ${validQty} Quintals (${quantityKg.toLocaleString('en-IN')} kg / ${quantityTons} MT)
Estimated Gross Revenue: ₹${grossRevenue.toLocaleString('en-IN')}
*Demonstration calculation based on sample data*`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  return (
    <section className="calculator-section" id="harvest-calculator" aria-label="Harvest Revenue Calculator">
      <div className="calculator-card">
        <div className="calc-header-badge">
          <span className="calc-badge-icon">🧮</span>
          <span>REVENUE ESTIMATION TOOL</span>
        </div>

        <h2 className="calc-title">Harvest Revenue Calculator</h2>
        <p className="calc-subtitle">
          Select a mandi crop quote and enter your harvest quantity to project gross farm revenue.
        </p>

        <div className="calc-layout-grid">
          {/* Left Column: Form Inputs */}
          <div className="calc-inputs-column">
            {/* 1. Crop Dropdown */}
            <div className="calc-field-group">
              <label htmlFor="calc-crop-select" className="calc-label">
                1. Select Crop & Mandi Quote
              </label>
              <div className="select-wrap">
                <select
                  id="calc-crop-select"
                  className="calc-select"
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                >
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.cropName} ({c.variety}) — {c.market}, {c.state} [₹{c.pricePerQuintal}/Qtl]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Crop Meta Badge */}
            {selectedCrop && (
              <div className="calc-crop-summary-pill">
                <div className="pill-item">
                  <span className="pill-key">Category:</span>
                  <span className="pill-val">{selectedCrop.category}</span>
                </div>
                <div className="pill-item">
                  <span className="pill-key">Sample Rate:</span>
                  <span className="pill-val text-green-bold">{formatINR(selectedCrop.pricePerQuintal)} / Quintal</span>
                </div>
                <div className="pill-item">
                  <span className="pill-key">Equivalent:</span>
                  <span className="pill-val">₹{(selectedCrop.pricePerQuintal / 100).toFixed(2)} / kg</span>
                </div>
              </div>
            )}

            {/* 2. Quantity Input */}
            <div className="calc-field-group">
              <div className="qty-label-row">
                <label htmlFor="calc-qty-input" className="calc-label">
                  2. Harvest Quantity (in Quintals)
                </label>
                <span className="qty-helper">1 Quintal = 100 Kg</span>
              </div>

              <div className="qty-input-wrap">
                <input
                  id="calc-qty-input"
                  type="number"
                  min="0"
                  step="1"
                  className="calc-qty-input"
                  value={quantityQuintals}
                  onChange={(e) => setQuantityQuintals(e.target.value)}
                />
                <span className="qty-input-unit">Quintals</span>
              </div>

              {/* Quick Adder Buttons */}
              <div className="quick-qty-buttons">
                <button type="button" onClick={() => handleQuickAdd(10)} className="btn-chip">+10 Qtl</button>
                <button type="button" onClick={() => handleQuickAdd(50)} className="btn-chip">+50 Qtl</button>
                <button type="button" onClick={() => handleQuickAdd(100)} className="btn-chip">+100 Qtl</button>
                <button type="button" onClick={() => setQuantityQuintals(10)} className="btn-chip btn-chip-alt">Reset (10)</button>
              </div>

              {/* Unit Conversion Footnote */}
              <div className="conversion-banner">
                <span>🔄 <strong>{validQty} Quintals</strong> is equal to <strong>{quantityKg.toLocaleString('en-IN')} Kilograms</strong> ({quantityTons} Metric Tons)</span>
              </div>
            </div>

            {/* Optional transport & mandi handling toggle */}
            <div className="calc-deduction-toggle">
              <label className="toggle-checkbox-label">
                <input
                  type="checkbox"
                  checked={deductMandiCosts}
                  onChange={(e) => setDeductMandiCosts(e.target.checked)}
                />
                <span>Include estimated transport / mandi handling cost deduction (~₹60/Qtl)</span>
              </label>
            </div>
          </div>

          {/* Right Column: Instant Revenue Breakdown */}
          <div className="calc-results-column">
            <div className="results-card">
              <div className="results-header">
                <span className="results-label">ESTIMATED GROSS REVENUE</span>
                <span className="results-formula-tag">Qty × Rate</span>
              </div>

              <div className="results-main-value">
                {formatINR(grossRevenue)}
              </div>
              <div className="results-words">
                {formatWordsINR(grossRevenue)}
              </div>

              <div className="results-divider"></div>

              {/* Step-by-Step Breakdown */}
              <div className="breakdown-list">
                <div className="breakdown-row">
                  <span className="b-label">Selected Crop:</span>
                  <span className="b-val">{selectedCrop ? `${selectedCrop.cropName} (${selectedCrop.variety})` : '—'}</span>
                </div>
                <div className="breakdown-row">
                  <span className="b-label">Mandi Market:</span>
                  <span className="b-val">{selectedCrop ? `${selectedCrop.market}, ${selectedCrop.state}` : '—'}</span>
                </div>
                <div className="breakdown-row">
                  <span className="b-label">Sample Price / Qtl:</span>
                  <span className="b-val">{formatINR(pricePerQuintal)}</span>
                </div>
                <div className="breakdown-row">
                  <span className="b-label">Total Quantity:</span>
                  <span className="b-val">{validQty} Quintals</span>
                </div>

                {deductMandiCosts && (
                  <>
                    <div className="breakdown-row text-red">
                      <span className="b-label">Est. Handling & Transport (₹60/Qtl):</span>
                      <span className="b-val">- {formatINR(handlingCost)}</span>
                    </div>
                    <div className="breakdown-row net-row">
                      <span className="b-label font-bold">Estimated Net Mandi Realization:</span>
                      <span className="b-val font-bold text-accent">{formatINR(estimatedNet)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="results-actions">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="btn btn-primary btn-copy"
                >
                  {copied ? '✓ Copied Estimate!' : '📋 Copy Revenue Summary'}
                </button>
              </div>

              <div className="disclaimer-mini">
                * Note: Gross revenue is based on the selected crop's sample mandi price per quintal. Demonstration purposes only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

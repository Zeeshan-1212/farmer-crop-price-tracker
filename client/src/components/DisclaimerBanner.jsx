import React, { useState } from 'react';

export default function DisclaimerBanner() {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className={`disclaimer-banner ${minimized ? 'minimized' : ''}`}>
      <div className="disclaimer-content">
        <div className="disclaimer-icon">⚠️</div>
        <div className="disclaimer-text">
          <strong>Academic Demonstration Project Notice:</strong> All mandi prices, crop varieties, and market trends presented in this application are mock sample data intended strictly for college project evaluation and software testing. They do <em>not</em> represent real-time, live, or officially certified APMC government rates.
        </div>
      </div>
      <button
        className="disclaimer-toggle"
        onClick={() => setMinimized(!minimized)}
        title={minimized ? "Expand notice" : "Minimize notice"}
      >
        {minimized ? "Show Notice" : "Got It"}
      </button>
    </div>
  );
}

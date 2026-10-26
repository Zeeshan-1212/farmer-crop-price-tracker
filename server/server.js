/**
 * Farmer Crop Price Tracker - Backend Express Server
 * 
 * Provides REST API endpoints for crop prices, summary statistics, and health check.
 * In production mode, it also serves the built Vite/React frontend on port 5000.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { sampleCrops } = require('./data');

const app = express();
const PORT = process.env.PORT || 5000;
const START_TIME = Date.now();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for academic demonstration and debugging
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: false });
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// API ROUTES
// ==========================================

/**
 * 1. Health Check Endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - START_TIME) / 1000);
  res.json({
    status: 'healthy',
    service: 'Farmer Crop Price Tracker API',
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    port: PORT,
    environment: process.env.NODE_ENV || 'production',
    disclaimer: 'Academic Demonstration Project - Sample Mandi Data Only'
  });
});

/**
 * 2. Summary Statistics Endpoint
 * GET /api/summary
 * Calculates aggregate figures for dashboard cards & overview charts.
 */
app.get('/api/summary', (req, res) => {
  const totalCrops = sampleCrops.length;
  const uniqueCropNames = [...new Set(sampleCrops.map(item => item.cropName))];
  const uniqueMarkets = [...new Set(sampleCrops.map(item => item.market))];
  const uniqueStates = [...new Set(sampleCrops.map(item => item.state))].sort();
  const uniqueCategories = [...new Set(sampleCrops.map(item => item.category))].sort();

  const totalPrice = sampleCrops.reduce((sum, item) => sum + item.pricePerQuintal, 0);
  const averagePrice = totalCrops > 0 ? Math.round(totalPrice / totalCrops) : 0;

  // Find highest and lowest price crops
  let highestPriceCrop = sampleCrops[0];
  let lowestPriceCrop = sampleCrops[0];

  sampleCrops.forEach(item => {
    if (item.pricePerQuintal > highestPriceCrop.pricePerQuintal) {
      highestPriceCrop = item;
    }
    if (item.pricePerQuintal < lowestPriceCrop.pricePerQuintal) {
      lowestPriceCrop = item;
    }
  });

  // Calculate average price per unique crop for visual comparison chart
  const cropPriceAverages = uniqueCropNames.map(name => {
    const matching = sampleCrops.filter(c => c.cropName === name);
    const avg = Math.round(matching.reduce((acc, curr) => acc + curr.pricePerQuintal, 0) / matching.length);
    const min = Math.min(...matching.map(c => c.minPrice));
    const max = Math.max(...matching.map(c => c.maxPrice));
    return {
      cropName: name,
      category: matching[0].category,
      averagePrice: avg,
      minPrice: min,
      maxPrice: max,
      marketCount: matching.length
    };
  }).sort((a, b) => b.averagePrice - a.averagePrice);

  res.json({
    success: true,
    totalCrops,
    uniqueCropTypesCount: uniqueCropNames.length,
    totalMarkets: uniqueMarkets.length,
    totalStates: uniqueStates.length,
    averagePrice,
    highestPriceCrop,
    lowestPriceCrop,
    statesList: uniqueStates,
    categoriesList: uniqueCategories,
    cropPriceAverages,
    disclaimer: 'Notice: Demonstration data only. Not verified or live APMC rates.'
  });
});

/**
 * 3. Crop Listings with Search, State Filter, and Sorting
 * GET /api/prices
 * Query Params:
 *  - search: string (matches cropName, variety, market, district, state)
 *  - state: string (filter by state name or "All")
 *  - sort: "price-asc" | "price-desc" | "name-asc" | "name-desc"
 */
app.get('/api/prices', (req, res) => {
  const { search = '', state = '', sort = 'price-desc' } = req.query;

  let filtered = [...sampleCrops];

  // 1. Search Query Filter
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(item =>
      item.cropName.toLowerCase().includes(q) ||
      item.variety.toLowerCase().includes(q) ||
      item.market.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }

  // 2. State Filter
  if (state.trim() && state.toLowerCase() !== 'all') {
    filtered = filtered.filter(item =>
      item.state.toLowerCase() === state.trim().toLowerCase()
    );
  }

  // 3. Sorting
  switch (sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.pricePerQuintal - b.pricePerQuintal);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.cropName.localeCompare(b.cropName));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.cropName.localeCompare(a.cropName));
      break;
    default:
      filtered.sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
  }

  res.json({
    success: true,
    count: filtered.length,
    totalAvailable: sampleCrops.length,
    filtersApplied: {
      search: search.trim(),
      state: state.trim() || 'All',
      sort
    },
    data: filtered,
    disclaimer: 'Notice: Demonstration data only. Not verified or live APMC rates.'
  });
});

// ==========================================
// FRONTEND STATIC FILE SERVING
// ==========================================
const clientDistPath = path.join(__dirname, '../client/dist');

// Serve static assets if the Vite production build exists
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Client-side routing fallback
  app.get('*', (req, res) => {
    // Avoid intercepting API routes that might have failed
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Helpful development placeholder before "npm run build" is run
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Farmer Crop Price Tracker - Backend Ready</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f0fdf4; color: #14532d; padding: 40px; text-align: center; }
          .card { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #bbf7d0; }
          h1 { color: #166534; margin-top: 0; }
          code { background: #dcfce7; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
          .btn { display: inline-block; margin-top: 15px; padding: 10px 18px; background: #15803d; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🌾 Farmer Crop Price Tracker API</h1>
          <p>The Express backend is running on <strong>Port ${PORT}</strong>.</p>
          <p>To serve the full React frontend through this server, run:</p>
          <p><code>npm run build</code> or <code>npm start</code></p>
          <hr style="border: none; border-top: 1px solid #dcfce7; margin: 20px 0;">
          <p>Available API routes:</p>
          <p><a class="btn" href="/api/health">Check /api/health</a> <a class="btn" href="/api/prices">View /api/prices</a> <a class="btn" href="/api/summary">View /api/summary</a></p>
        </div>
      </body>
      </html>
    `);
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌾 Farmer Crop Price Tracker Server`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📊 Health check:      http://localhost:${PORT}/api/health`);
  console.log(`💰 Crop prices:       http://localhost:${PORT}/api/prices`);
  console.log(`📈 Summary stats:     http://localhost:${PORT}/api/summary`);
  console.log(`=======================================================`);
});

# 🌾 Farmer Crop Price Tracker (KisanBhav)

A responsive, beginner-friendly, full-stack college demonstration project built with **React (Vite)** and **Node.js (Express)**. The application allows Indian farmers to browse simulated crop prices across agricultural markets (mandis), compare sample rates, filter by state, and calculate estimated harvest revenue.

---

> **⚠️ Academic Demonstration Notice:**  
> All crop prices, variety names, and mandi rates included in this project are sample mock demonstration data intended for college project evaluation and testing. They do **not** represent live, officially verified, or real-time APMC government rates.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Architecture and Data Flow](#-architecture-and-data-flow)
5. [Harvest Revenue Calculation Explained](#-harvest-revenue-calculation-explained)
6. [Project Structure](#-project-structure)
7. [API Route Documentation](#-api-route-documentation)
8. [Windows PowerShell Setup & Execution Guide](#-windows-powershell-setup--execution-guide)
9. [Development Mode](#-development-mode)
10. [Stopping the Server](#-stopping-the-server)

---

## 🎯 Project Overview

In agricultural economics, timely price discovery and harvest revenue projections are critical for farming families. The **Farmer Crop Price Tracker** serves as a prototype web dashboard simulating:
- Key metrics across commodities (total listings, mandis, average rate, maximum rate).
- Mandi price browsing with multi-attribute search and state/category filtering.
- Visual price comparison bar charts without heavy external graphing dependencies.
- A dedicated **Harvest Revenue Calculator** projecting gross earnings and estimated net returns.

---

## ✨ Key Features

1. **Dashboard Summary Cards:**
   - **Total Crop Listings** (24 sample records across 6 categories: Cereals, Pulses, Oilseeds, Cash Crops, Vegetables, Spices).
   - **Tracked Mandis** (23 APMC markets across 10 Indian states).
   - **Average Sample Price** (calculated dynamically across all active listings in ₹/quintal).
   - **Highest Sample Price** (highlights top-value commodity: *Red Chilli at Guntur Yard*).

2. **Crop Listings Table:**
   - Shows: Crop Name, Variety, Category, Mandi & District, State, Sample Price per Quintal, Min–Max range bar, and Market Trend (`▲ Rising`, `▼ Falling`, `▬ Stable`).
   - One-click **"🧮 Estimate"** button on any row automatically transfers that crop's price and details into the Harvest Calculator.

3. **Search & Filter Controls:**
   - Real-time search across crop name, variety, market name, district, or state.
   - Filter dropdowns by **State** (Punjab, Haryana, Madhya Pradesh, Gujarat, Maharashtra, Rajasthan, Karnataka, Andhra Pradesh, Uttar Pradesh, Telangana).
   - Filter by **Category** (Cereals, Pulses, Oilseeds, Vegetables, Cash Crops, Spices).
   - Sorting options: Price (High to Low / Low to High), Crop Name (A to Z / Z to A).
   - Clear Filters button and active result counter.

4. **Visual Price Comparison Chart:**
   - Pure CSS/SVG responsive horizontal bar chart comparing sample prices per quintal.
   - Toggle between **"Commodity Averages"** (averaging prices across all mandis) and **"Current Mandi Rates"** (sorted by current filtered view).
   - Gold highlight for the highest-value commodity.

5. **Harvest Revenue Calculator:**
   - Dropdown to select any mandi quote.
   - Harvest quantity input in **Quintals** (1 Quintal = 100 kg).
   - Quick increment buttons (`+10`, `+50`, `+100` Qtl).
   - Metric conversion display: shows equivalent in Kilograms and Metric Tons.
   - **Gross Revenue Projection** formatted in Indian numbering (`₹1,42,500`) and Indian word denomination (`1.42 Lakh`).
   - Optional toggle for estimated handling & transport deductions (~₹60/Qtl) to estimate net realization.
   - One-click button to copy formatted summary to clipboard.

6. **Full State Handling:**
   - Loading skeletons and spinners.
   - Friendly empty-result state when searches yield no matches.
   - Error banners with retry actions.
   - Real-time backend connectivity badge (`API Online` on port 5000).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast single-page application (SPA) with reactive component state |
| **Backend** | Node.js + Express.js | REST API server and static file provider on port 5000 |
| **Styling** | Pure CSS3 (Custom Variables) | Responsive agricultural green theme, no heavy CSS frameworks |
| **Data Storage** | Local JavaScript Module | `server/data.js` containing structured sample mandi quotes |
| **Package Manager** | npm | Standard dependency management |

---

## 🔄 Architecture and Data Flow

```
+-------------------------------------------------------------+
|                 React Client (Browser)                      |
|                                                             |
|  - DashboardCards       - CropTable                         |
|  - SearchFilters        - PriceChart                        |
|  - HarvestCalculator    - DisclaimerBanner                  |
+------------------------------+------------------------------+
                               |
                      HTTP / Fetch Requests
                               |
                               v
+-------------------------------------------------------------+
|                 Express Server (Port 5000)                  |
|                                                             |
|  GET /api/health   -> Health status & server uptime         |
|  GET /api/prices   -> Filtered & sorted mandi prices        |
|  GET /api/summary  -> Aggregate counts, averages, extremes  |
|  GET /*            -> Serves built React app from dist/     |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                 Sample Mandi Dataset                        |
|                (server/data.js - 24 crops)                  |
+-------------------------------------------------------------+
```

1. **Initial Load:** The React app mounts and issues parallel `fetch()` calls to `/api/summary` and `/api/prices`.
2. **Dashboard Rendering:** Summary data populates the top metric cards and visual bar chart.
3. **Filtering & Sorting:** As the user types in the search bar or selects a state, React immediately filters and re-sorts the in-memory array for instantaneous response without UI lag.
4. **Production Delivery:** Express serves both the REST API and the compiled React production assets from `client/dist`.

---

## 🧮 Harvest Revenue Calculation Explained

In Indian agricultural mandis (APMCs), transactions are traditionally quoted **per quintal** (100 kilograms).

The gross revenue formula is:
$$\text{Gross Revenue (₹)} = \text{Harvest Quantity (Quintals)} \times \text{Sample Mandi Rate (₹ / Quintal)}$$

### Example Calculation:
- **Crop:** Basmati Rice (Pusa 1121) at Karnal Mandi, Haryana
- **Sample Rate:** ₹4,350 per quintal (₹43.50 per kg)
- **Harvest Quantity:** 50 quintals (5,000 kg / 5.0 Metric Tons)
- **Calculation:**
  $$50 \times 4{,}350 = ₹2{,}17{,}500\text{ (Approx. ₹2.18 Lakh)}$$

If the optional mandi handling and local transport deduction (~₹60/Qtl) is enabled:
- **Deduction:** $50 \times 60 = ₹3{,}000$
- **Estimated Net:** $₹2{,}17{,}500 - ₹3{,}000 = ₹2{,}14{,}500$

---

## 📂 Project Structure

```
farmer-crop-price-tracker/
├── package.json              # Root npm config with build & start scripts
├── README.md                 # Project documentation and instructions
├── server/
│   ├── server.js             # Express API server & static file host (Port 5000)
│   └── data.js               # Sample Indian mandi dataset (24 items)
└── client/
    ├── package.json          # React & Vite client dependencies
    ├── vite.config.js        # Vite build & dev proxy configuration
    ├── index.html            # Main HTML entry point
    └── src/
        ├── main.jsx          # React DOM root mounting
        ├── App.jsx           # Main application state & orchestration
        ├── styles.css        # Agricultural green theme & responsive layout
        └── components/
            ├── Navbar.jsx            # Header, live status pill & refresh action
            ├── DisclaimerBanner.jsx  # Academic demonstration notice banner
            ├── DashboardCards.jsx    # Metric overview cards
            ├── SearchFilters.jsx     # Search bar, state filter & sorter
            ├── CropTable.jsx         # Mandi rates data table with trends
            ├── PriceChart.jsx        # Visual SVG/CSS bar comparison chart
            ├── HarvestCalculator.jsx # Revenue estimator with unit converter
            └── Footer.jsx            # Footer with endpoint links & metadata
```

---

## 🔌 API Route Documentation

All API routes run on `http://localhost:5000`.

### 1. `GET /api/health`
Returns system health, uptime, and demonstration environment information.
```json
{
  "status": "healthy",
  "service": "Farmer Crop Price Tracker API",
  "uptimeSeconds": 45,
  "timestamp": "2026-10-26T08:00:35.955Z",
  "nodeVersion": "v24.20.0",
  "port": 5000,
  "environment": "production",
  "disclaimer": "Academic Demonstration Project - Sample Mandi Data Only"
}
```

### 2. `GET /api/summary`
Calculates aggregated figures across all mandi records for dashboard cards.
- **Fields returned:**
  - `totalCrops`: Total number of records (24)
  - `uniqueCropTypesCount`: Number of unique species (14)
  - `totalMarkets`: Number of distinct APMC mandis (23)
  - `totalStates`: Number of states covered (10)
  - `averagePrice`: Average price per quintal (₹4,792)
  - `highestPriceCrop`: Red Chilli (₹18,500/Qtl)
  - `lowestPriceCrop`: Sugarcane (₹380/Qtl)
  - `statesList`: Sorted array of state names
  - `cropPriceAverages`: Ranked array for price comparison charts

### 3. `GET /api/prices`
Returns the crop listings. Supports optional query parameters:
- `search`: Case-insensitive text search (e.g. `?search=wheat` or `?search=punjab`).
- `state`: Filter by state name (e.g. `?state=Punjab`).
- `sort`: Ordering option (`price-desc`, `price-asc`, `name-asc`, `name-desc`).

Example:
```
GET /api/prices?search=cotton&sort=price-desc
```

---

## 💻 Windows PowerShell Setup & Execution Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended, tested on Node v24.20.0)
- **npm** (tested on npm 11.19.0)

> **💡 Windows PowerShell Tip:**  
> On Windows PowerShell, if you ever see `npm.ps1 cannot be loaded because running scripts is disabled`, either:
> 1. Use `npm.cmd` instead of `npm`, OR
> 2. Run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in your PowerShell window.

---

### Step 1: Open PowerShell and Navigate to the Project Folder
```powershell
cd C:\Users\Admin\Zeeshan\FSD\Project\scratch\farmer-crop-price-tracker
```

---

### Step 2: Install Dependencies
Run the installation commands for both the root (Express backend) and the client (React frontend):

```powershell
# 1. Install root dependencies (Express, CORS)
npm.cmd install

# 2. Install client dependencies (React, Vite)
npm.cmd --prefix client install
```

---

### Step 3: Build the React Frontend
Compile the React application into optimized static production files:

```powershell
npm.cmd run build
```
*This command runs Vite build and saves production assets in `client/dist`.*

---

### Step 4: Run the Production Application
Start the unified Express server serving both the backend API and frontend:

```powershell
npm.cmd start
```
*(Note: `npm.cmd start` automatically executes `npm run build && node server/server.js`.)*

You will see:
```text
=======================================================
🌾 Farmer Crop Price Tracker Server
🌐 Server running at: http://localhost:5000
📊 Health check:      http://localhost:5000/api/health
💰 Crop prices:       http://localhost:5000/api/prices
📈 Summary stats:     http://localhost:5000/api/summary
=======================================================
```

---

### Step 5: Open in Your Web Browser
Open your browser and navigate to:
```
http://localhost:5000
```
The entire application (dashboard cards, mandi listings table, comparison chart, and harvest calculator) will load directly from the local Express server.

---

## 🧑‍💻 Development Mode (Optional)

If you wish to make live changes to the React code with Vite's instant Hot Module Replacement (HMR):

1. **Start the Express backend** in one PowerShell tab:
   ```powershell
   cd "C:\Users\Admin\Zeeshan\FSD\Project\scratch\farmer-crop-price-tracker\server\server.js"
   ```

2. **Start the Vite dev server** in a second PowerShell tab:
   ```powershell
   cd C:\Users\Admin\Zeeshan\FSD\Project\scratch\farmer-crop-price-tracker
   npm.cmd --prefix client run dev
   ```
   Open `http://localhost:5173`. Vite will proxy API requests automatically to `http://localhost:5000`.

---

## ⏹️ Stopping the Server

To stop the running application:
1. Press `Ctrl + C` in the PowerShell terminal window where the server is running.
2. If prompted `Terminate batch job (Y/N)?`, type `Y` and press `Enter`.

Alternatively, to force close any process listening on port 5000 from PowerShell:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## 🧪 Testing Checklist Completed

The following tests were executed and verified during build:
- [x] Node.js and npm versions checked (`Node v24.20.0`, `npm 11.19.0`).
- [x] Root dependencies installed cleanly (`express`, `cors`).
- [x] Client dependencies installed cleanly (`react`, `react-dom`, `vite`, `@vitejs/plugin-react`).
- [x] Vite production build tested (`npm run build` generated `client/dist` in 499ms).
- [x] `npm start` tested (`vite build` + `node server/server.js` startup on port 5000).
- [x] `GET http://localhost:5000/api/health` verified with HTTP 200 JSON response.
- [x] `GET http://localhost:5000/api/summary` verified returning statistics across 24 crops.
- [x] `GET http://localhost:5000/api/prices?search=cotton` verified with filtered search results.
- [x] `GET http://localhost:5000/` verified serving production React `index.html`.
- [x] Responsive layout styling verified across desktop and mobile screen widths.
- [x] Clean termination and port freeing verified.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import DisclaimerBanner from './components/DisclaimerBanner.jsx';
import DashboardCards from './components/DashboardCards.jsx';
import SearchFilters from './components/SearchFilters.jsx';
import CropTable from './components/CropTable.jsx';
import PriceChart from './components/PriceChart.jsx';
import HarvestCalculator from './components/HarvestCalculator.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [crops, setCrops] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('connecting');
  const [preselectedCrop, setPreselectedCrop] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('price-desc');

  // Helper to show transient toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch summary and initial crop prices from Express backend
  const fetchAllData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // 1. Fetch Health / Check backend status
      try {
        const healthRes = await fetch('/api/health');
        if (healthRes.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (e) {
        setBackendStatus('error');
      }

      // 2. Fetch Summary Statistics
      const summaryRes = await fetch('/api/summary');
      if (!summaryRes.ok) {
        throw new Error(`Summary API error: HTTP ${summaryRes.status}`);
      }
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      // 3. Fetch Prices
      const pricesRes = await fetch('/api/prices');
      if (!pricesRes.ok) {
        throw new Error(`Prices API error: HTTP ${pricesRes.status}`);
      }
      const pricesData = await pricesRes.json();
      setCrops(pricesData.data || []);

      if (isManualRefresh) {
        showToast('✓ Mandi crop rates refreshed successfully');
      }
    } catch (err) {
      console.error('Error fetching data from server:', err);
      setError(err.message || 'Unable to connect to the backend server. Please verify the server is running on port 5000.');
      setBackendStatus('error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Client-side filtering & sorting for instantaneous response
  const filteredCrops = useMemo(() => {
    let result = [...crops];

    // Filter by search query (cropName, variety, market, state, district, category)
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(item =>
        item.cropName.toLowerCase().includes(q) ||
        item.variety.toLowerCase().includes(q) ||
        item.market.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    // Filter by State
    if (selectedState !== 'All') {
      result = result.filter(item => item.state.toLowerCase() === selectedState.toLowerCase());
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.pricePerQuintal - b.pricePerQuintal);
        break;
      case 'price-desc':
        result.sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
        break;
      case 'name-asc':
        result.sort((a, b) => a.cropName.localeCompare(b.cropName));
        break;
      case 'name-desc':
        result.sort((a, b) => b.cropName.localeCompare(a.cropName));
        break;
      default:
        result.sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
    }

    return result;
  }, [crops, searchTerm, selectedState, selectedCategory, sortBy]);

  // Handle row "Estimate" click: select crop and scroll to calculator
  const handleSelectForCalculator = (crop) => {
    setPreselectedCrop(crop);
    const element = document.getElementById('harvest-calculator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Selected "${crop.cropName} (${crop.variety})" in Harvest Calculator`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedState('All');
    setSelectedCategory('All');
    setSortBy('price-desc');
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification" role="alert">
          {toastMessage}
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onRefresh={() => fetchAllData(true)}
        isRefreshing={isRefreshing}
        backendStatus={backendStatus}
      />

      <main className="main-content">
        <div className="content-container">
          {/* Demonstration Notice */}
          <DisclaimerBanner />

          {/* 1. Dashboard Summary Cards */}
          <DashboardCards summary={summary} loading={loading} />

          {/* 2. Visual Price Comparison Chart */}
          <PriceChart
            cropPriceAverages={summary?.cropPriceAverages || []}
            currentListings={filteredCrops}
          />

          {/* 3. Search & Filter Controls */}
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            statesList={summary?.statesList || []}
            categoriesList={summary?.categoriesList || []}
            totalResults={filteredCrops.length}
            totalAvailable={crops.length}
            onReset={handleResetFilters}
          />

          {/* 4. Crop Listings Table */}
          <CropTable
            crops={filteredCrops}
            loading={loading}
            error={error}
            onRetry={() => fetchAllData()}
            onSelectForCalculator={handleSelectForCalculator}
            onResetFilters={handleResetFilters}
          />

          {/* 5. Harvest Revenue Calculator */}
          <HarvestCalculator
            crops={crops}
            preselectedCrop={preselectedCrop}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import React from 'react';

export default function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedState,
  setSelectedState,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  statesList = [],
  categoriesList = [],
  totalResults = 0,
  totalAvailable = 0,
  onReset
}) {
  const isFiltered = searchTerm !== '' || selectedState !== 'All' || selectedCategory !== 'All' || sortBy !== 'price-desc';

  return (
    <div className="filter-panel">
      <div className="filter-header-row">
        <div className="filter-title-group">
          <h2 className="section-title">Mandi Market Prices</h2>
          <span className="results-count-badge">
            Showing {totalResults} of {totalAvailable} records
          </span>
        </div>

        {isFiltered && (
          <button onClick={onReset} className="btn btn-text btn-reset" title="Reset all search filters">
            ✕ Clear Filters
          </button>
        )}
      </div>

      <div className="filter-grid">
        {/* 1. Search Box */}
        <div className="filter-control-wrap search-wrap">
          <label htmlFor="search-input" className="control-label">Search Mandi or Crop</label>
          <div className="input-with-icon">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              id="search-input"
              type="text"
              className="text-input"
              placeholder="Search crop, variety, mandi, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 2. State Filter */}
        <div className="filter-control-wrap">
          <label htmlFor="state-filter" className="control-label">Filter by State</label>
          <div className="select-wrap">
            <select
              id="state-filter"
              className="select-input"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="All">All States (India)</option>
              {statesList.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Category Filter */}
        <div className="filter-control-wrap">
          <label htmlFor="category-filter" className="control-label">Crop Category</label>
          <div className="select-wrap">
            <select
              id="category-filter"
              className="select-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Sort By */}
        <div className="filter-control-wrap">
          <label htmlFor="sort-filter" className="control-label">Sort Listings</label>
          <div className="select-wrap">
            <select
              id="sort-filter"
              className="select-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price-desc">Price: Highest to Lowest</option>
              <option value="price-asc">Price: Lowest to Highest</option>
              <option value="name-asc">Crop Name (A to Z)</option>
              <option value="name-desc">Crop Name (Z to A)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

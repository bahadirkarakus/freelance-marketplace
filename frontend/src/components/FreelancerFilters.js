import React from 'react';

const FreelancerFilters = ({ filters, onFilterChange, onClear }) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleClear = () => {
    onClear();
  };

  return (
    <div 
      className="p-6 rounded-2xl shadow-xl mb-8"
      style={{ background: 'rgba(255, 255, 255, 0.95)' }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold" style={{ color: '#667eea' }}>
          🔍 Search & Filter Freelancers
        </h3>
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Clear Filters
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔎 Search
          </label>
          <input
            type="text"
            placeholder="Search by name or skills..."
            value={filters.q || ''}
            onChange={(e) => handleChange('q', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Min Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💵 Min Hourly Rate
          </label>
          <input
            type="number"
            placeholder="Min rate"
            value={filters.min_rate || ''}
            onChange={(e) => handleChange('min_rate', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            min="0"
          />
        </div>

        {/* Max Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💰 Max Hourly Rate
          </label>
          <input
            type="number"
            placeholder="Max rate"
            value={filters.max_rate || ''}
            onChange={(e) => handleChange('max_rate', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            min="0"
          />
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ⭐ Min Rating
          </label>
          <select
            value={filters.min_rating || ''}
            onChange={(e) => handleChange('min_rating', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="1">1+ Stars</option>
          </select>
        </div>

        {/* Sort */}
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔄 Sort By
          </label>
          <select
            value={filters.sort || 'date'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          >
            <option value="date">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="rate_asc">Rate: Low to High</option>
            <option value="rate_desc">Rate: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {Object.keys(filters).some(key => filters[key] && key !== 'sort') && (
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.q && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: '#667eea' }}>
                Search: "{filters.q}"
              </span>
            )}
            {filters.min_rate && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: '#11998e' }}>
                Min Rate: ${filters.min_rate}/hr
              </span>
            )}
            {filters.max_rate && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: '#11998e' }}>
                Max Rate: ${filters.max_rate}/hr
              </span>
            )}
            {filters.min_rating && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: '#fa709a' }}>
                Min Rating: {filters.min_rating}⭐
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerFilters;

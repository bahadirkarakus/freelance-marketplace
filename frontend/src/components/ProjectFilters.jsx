import React from 'react';

const ProjectFilters = ({ filters, onFilterChange, onClear }) => {
  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Data Science',
    'Digital Marketing',
    'Content Writing',
    'Video Editing',
    'Other'
  ];

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
          🔍 Search & Filter
        </h3>
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
        >
          Clear Filters
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔎 Search Projects
          </label>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={filters.q || ''}
            onChange={(e) => handleChange('q', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📁 Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📊 Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Min Budget */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💵 Min Budget
          </label>
          <input
            type="number"
            placeholder="Min price"
            value={filters.min_budget || ''}
            onChange={(e) => handleChange('min_budget', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            min="0"
          />
        </div>

        {/* Max Budget */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💰 Max Budget
          </label>
          <input
            type="number"
            placeholder="Max price"
            value={filters.max_budget || ''}
            onChange={(e) => handleChange('max_budget', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            min="0"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔄 Sort By
          </label>
          <select
            value={filters.sort || 'date'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          >
            <option value="date">Newest First</option>
            <option value="budget_asc">Budget: Low to High</option>
            <option value="budget_desc">Budget: High to Low</option>
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
            {filters.category && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: '#11998e' }}>
                {filters.category}
              </span>
            )}
            {filters.status && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: '#fa709a' }}>
                {filters.status}
              </span>
            )}
            {filters.min_budget && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: '#f5576c' }}>
                Min: ${filters.min_budget}
              </span>
            )}
            {filters.max_budget && (
              <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: '#f5576c' }}>
                Max: ${filters.max_budget}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;

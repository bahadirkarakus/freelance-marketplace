import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FreelancerFilters = ({ filters, onFilterChange, onClear }) => {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleClear = () => {
    onClear();
  };

  const hasActiveFilters = Object.keys(filters).some(key => filters[key] && key !== 'sort');

  return (
    <div className="mb-8">
      {/* Main Search Bar - Modern & Minimal */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          {/* Search Icon */}
          <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {/* Search Input */}
          <input
            type="text"
            placeholder={t('freelancers.searchPlaceholder', 'İsim veya yeteneklere göre ara...')}
            value={filters.q || ''}
            onChange={(e) => handleChange('q', e.target.value)}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-base"
          />

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t('common.clear', 'Temizle')}
            </button>
          )}

          {/* Toggle Advanced Filters */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-sm font-medium"
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {showAdvanced ? t('common.hide', 'Gizle') : t('common.filter', 'Filtreler')}
          </button>
        </div>

        {/* Advanced Filters - Collapsible */}
        {showAdvanced && (
          <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 px-5 py-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Min Rate */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  {t('freelancers.minRate', 'Min Saatlik Ücret')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.min_rate || ''}
                    onChange={(e) => handleChange('min_rate', e.target.value)}
                    className="w-full pl-7 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              {/* Max Rate */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  {t('freelancers.maxRate', 'Max Saatlik Ücret')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.max_rate || ''}
                    onChange={(e) => handleChange('max_rate', e.target.value)}
                    className="w-full pl-7 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  {t('freelancers.minRating', 'Min Puan')}
                </label>
                <select
                  value={filters.min_rating || ''}
                  onChange={(e) => handleChange('min_rating', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">{t('freelancers.allRatings', 'Tüm Puanlar')}</option>
                  <option value="4">⭐⭐⭐⭐ (4+)</option>
                  <option value="3">⭐⭐⭐ (3+)</option>
                  <option value="2">⭐⭐ (2+)</option>
                  <option value="1">⭐ (1+)</option>
                </select>
              </div>
            </div>

            {/* Sort Option - Secondary Row */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="max-w-xs">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  {t('projects.sortBy', 'Sırala')}
                </label>
                <select
                  value={filters.sort || 'date'}
                  onChange={(e) => handleChange('sort', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="date">📅 {t('projects.newest', 'En Yeni')}</option>
                  <option value="rating">⭐ {t('freelancers.ratingDesc', 'En Yüksek Puan')}</option>
                  <option value="rate_asc">💰 {t('freelancers.rateAsc', 'En Düşük Ücret')}</option>
                  <option value="rate_desc">💎 {t('freelancers.rateDesc', 'En Yüksek Ücret')}</option>
                  <option value="reviews">📝 {t('freelancers.mostReviewed', 'En Çok Değerlendirilen')}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Chips - Modern Style */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.q && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
              <span>{t('common.search', 'Arama')}: "{filters.q}"</span>
            </div>
          )}
          {filters.min_rate && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              <span>Min: ${filters.min_rate}/{t('common.hour', 'saat')}</span>
            </div>
          )}
          {filters.max_rate && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              <span>Max: ${filters.max_rate}/{t('common.hour', 'saat')}</span>
            </div>
          )}
          {filters.min_rating && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium">
              <span>⭐ {filters.min_rating}+ {t('freelancers.stars', 'yıldız')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FreelancerFilters;

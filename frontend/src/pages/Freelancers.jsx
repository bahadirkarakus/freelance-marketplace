import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { getProfilePictureUrl } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import FreelancerFilters from '../components/FreelancerFilters';
import { useTranslation } from 'react-i18next';

const Freelancers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: searchParams.get('service') || searchParams.get('search') || '',
    min_rate: '',
    max_rate: '',
    min_rating: '',
    sort: 'date'
  });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const serviceQuery = searchParams.get('service');

  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      params.append('page', pagination.page);
      params.append('limit', '12');

      const response = await api.get(`/freelancers/search?${params}`);
      setFreelancers(response.data.freelancers);
      setPagination({
        page: response.data.pagination.page,
        totalPages: response.data.pagination.totalPages,
        total: response.data.pagination.total || response.data.freelancers.length
      });
    } catch (error) {
      console.error('Error fetching freelancers:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      q: '',
      min_rate: '',
      max_rate: '',
      min_rating: '',
      sort: 'date'
    });
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Clean Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {serviceQuery ? `${serviceQuery} ${t('freelancers.experts', 'Uzmanları')}` : t('freelancers.browseFreelancers', 'Freelancerlara Göz At')}
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                {pagination.total} {t('freelancers.freelancersFound', 'freelancer bulundu')}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-base text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('freelancers.verifiedProfiles', 'Doğrulanmış Profiller')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <FreelancerFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : freelancers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{t('freelancers.noFreelancersFound', 'No freelancers found')}</h3>
            <p className="text-lg text-gray-500 dark:text-gray-400">{t('freelancers.tryChangingFilters', 'Filtreleri değiştirmeyi deneyin')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {freelancers.map((freelancer) => (
              <div 
                key={freelancer.id} 
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {freelancer.profile_picture ? (
                        <img
                          src={getProfilePictureUrl(freelancer.profile_picture)}
                          alt={freelancer.name}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold ring-2 ring-gray-100 dark:ring-gray-700">
                          {freelancer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {freelancer.name}
                        </h3>
                        {freelancer.rating >= 4.5 && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded">
                            TOP
                          </span>
                        )}
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          {freelancer.rating?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-base text-gray-400">•</span>
                        <span className="text-base text-gray-500 dark:text-gray-400">
                          {freelancer.hourly_rate ? `$${freelancer.hourly_rate}/${t('common.hour', 'saat')}` : t('freelancers.priceNotSpecified', 'Fiyat belirtilmedi')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {freelancer.bio && (
                    <p className="mt-3 text-base text-gray-600 dark:text-gray-300 line-clamp-2">
                      {freelancer.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {freelancer.skills && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {freelancer.skills.split(',').slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                      {freelancer.skills.split(',').length > 3 && (
                        <span className="px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-500">
                          +{freelancer.skills.split(',').length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2">
                    <Link
                      to={`/freelancers/${freelancer.id}`}
                      className="flex-1 text-center py-3 px-4 text-base font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    >
                      {t('freelancers.viewProfile', 'Profili Gör')}
                    </Link>
                    
                    {user && user.id !== freelancer.id && (
                      <button
                        onClick={() => navigate(`/chat/${freelancer.id}`)}
                        className="py-3 px-4 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => {
                setPagination({ ...pagination, page: pagination.page - 1 });
                fetchFreelancers();
              }}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPagination({ ...pagination, page: i + 1 });
                  fetchFreelancers();
                }}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  pagination.page === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => {
                setPagination({ ...pagination, page: pagination.page + 1 });
                fetchFreelancers();
              }}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Freelancers;

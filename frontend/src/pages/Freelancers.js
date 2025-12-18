import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
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
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const serviceQuery = searchParams.get('service');

  useEffect(() => {
    fetchFreelancers();
  }, [filters, pagination.page]);

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add all filter parameters
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
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      console.error('Error fetching freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to page 1 when filters change
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
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">
            {serviceQuery ? serviceQuery : t('freelancers.browseFreelancers')}
          </h1>
          <p className="text-white text-lg" style={{ opacity: 0.9 }}>
            {serviceQuery 
              ? `${t('freelancers.specializing')} ${serviceQuery}` 
              : t('freelancers.title')
            }
          </p>
        </div>

        {/* Filters */}
        <FreelancerFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : freelancers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-2xl text-white font-semibold">No freelancers found</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freelancers.map((freelancer) => (
              <div 
                key={freelancer.id} 
                className="rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:-translate-y-2"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Profile Header with Gradient */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  padding: '2rem 1.5rem'
                }}>
                  <div className="flex flex-col items-center">
                    {freelancer.profile_picture ? (
                      <img
                        src={freelancer.profile_picture}
                        alt={freelancer.name}
                        className="mb-4 shadow-lg object-cover"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          border: '4px solid white'
                        }}
                      />
                    ) : (
                      <div 
                        className="mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: '4px solid white'
                        }}
                      >
                        {freelancer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {freelancer.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-5 h-5"
                          fill={star <= Math.round(freelancer.rating || 0) ? '#ffc107' : '#e0e0e0'}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-white font-semibold ml-2">
                        {freelancer.rating?.toFixed(1) || 'New'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {freelancer.bio && (
                    <p className="text-gray-700 mb-4 text-center leading-relaxed" style={{ minHeight: '60px' }}>
                      {freelancer.bio.length > 100 ? freelancer.bio.substring(0, 100) + '...' : freelancer.bio}
                    </p>
                  )}

                  {freelancer.skills && (
                    <div className="mb-5">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {freelancer.skills.split(',').slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {freelancer.hourly_rate && (
                    <div className="text-center mb-5 py-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                      <div className="text-3xl font-bold" style={{ color: '#667eea' }}>
                        ${freelancer.hourly_rate}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">per hour</div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Link
                      to={`/freelancers/${freelancer.id}`}
                      className="flex-1 text-center py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      View Profile
                    </Link>
                    
                    {user && user.id !== freelancer.id && (
                      <button
                        onClick={() => navigate(`/chat/${freelancer.id}`)}
                        className="flex-1 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                        style={{
                          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                        }}
                      >
                        Message
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
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={() => {
                setPagination({ ...pagination, page: pagination.page - 1 });
                fetchFreelancers();
              }}
              disabled={pagination.page === 1}
              className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: pagination.page === 1 ? 'rgba(255, 255, 255, 0.3)' : 'white',
                color: pagination.page === 1 ? 'white' : '#667eea'
              }}
            >
              ← Previous
            </button>
            
            <span className="px-6 py-3 rounded-lg font-bold text-white" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
              {pagination.page} / {pagination.totalPages}
            </span>
            
            <button
              onClick={() => {
                setPagination({ ...pagination, page: pagination.page + 1 });
                fetchFreelancers();
              }}
              disabled={pagination.page === pagination.totalPages}
              className="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: pagination.page === pagination.totalPages ? 'rgba(255, 255, 255, 0.3)' : 'white',
                color: pagination.page === pagination.totalPages ? 'white' : '#667eea'
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Freelancers;

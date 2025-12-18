import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ReviewsList = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/${userId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/reviews/${userId}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="text-xl"
            style={{ color: star <= rating ? '#ffc107' : '#e0e0e0' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      {stats && stats.total_reviews > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-3xl font-bold" style={{ color: '#f5576c' }}>
                {stats.avg_rating ? stats.avg_rating.toFixed(1) : '0.0'}
              </h3>
              <div className="flex items-center mt-1">
                {renderStars(Math.round(stats.avg_rating || 0))}
                <span className="ml-2 text-gray-600">
                  ({stats.total_reviews} {stats.total_reviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="space-y-1 text-sm">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats[`${['one', 'two', 'three', 'four', 'five'][star - 1]}_star`] || 0;
                const percentage = stats.total_reviews > 0 
                  ? Math.round((count / stats.total_reviews) * 100) 
                  : 0;
                return (
                  <div key={star} className="flex items-center space-x-2">
                    <span className="text-gray-600 w-8">{star}★</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                        }}
                      />
                    </div>
                    <span className="text-gray-500 text-xs w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-md text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-lg">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {review.reviewer_picture ? (
                    <img
                      src={`http://localhost:4000${review.reviewer_picture}`}
                      alt={review.reviewer_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                         style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                      {review.reviewer_name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.reviewer_name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              
              {review.project_title && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Project:</span> {review.project_title}
                </p>
              )}
              
              {review.comment && (
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;

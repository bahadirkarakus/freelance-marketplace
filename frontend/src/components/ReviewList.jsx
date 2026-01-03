import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';
import api from '../utils/api';

/**
 * ReviewList Component
 * Kullanıcı değerlendirmelerini listeler
 */
const ReviewList = ({ userId, refreshTrigger }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [userId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/${userId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/reviews/${userId}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border border-blue-100 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('reviews.overallRating')}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                </span>
                <div>
                  <StarRating value={stats.averageRating || 0} readOnly size={20} />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {stats.totalReviews} {t('reviews.reviews')}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.ratingDistribution?.[star] || 0;
                const percentage = stats.totalReviews > 0 
                  ? (count / stats.totalReviews) * 100 
                  : 0;
                
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                      {star}⭐
                    </span>
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 dark:bg-yellow-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {t('reviews.allReviews')}
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <p className="text-gray-600 dark:text-gray-400">{t('reviews.noReviews')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div 
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {review.reviewer_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {review.reviewer_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StarRating value={review.rating} readOnly size={18} />
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.comment}
                </p>

                {/* Project Info (if available) */}
                {review.project_title && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('reviews.project')}: 
                      <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">
                        {review.project_title}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import StarRating from './StarRating';

const ReviewForm = ({ projectId, revieweeId, onSuccess, isFreelancerProfile = false }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!revieweeId) {
      toast.error('Reviewee ID is missing. Please refresh the page and try again.');
      return;
    }
    
    if (rating === 0) {
      toast.error(t('reviews.selectRating'));
      return;
    }

    if (!comment.trim()) {
      toast.error(t('reviews.writeComment'));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      const reviewData = {
        project_id: projectId || null,
        reviewee_id: revieweeId,
        rating,
        comment
      };
      console.log('Submitting review:', reviewData);
      console.log('revieweeId prop value:', revieweeId, typeof revieweeId);
      const response = await api.post('/reviews', reviewData);
      console.log('Review response:', response);
      toast.success(t('reviews.reviewAdded'));
      setRating(0);
      setComment('');
      setIsExpanded(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Review submission error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isFreelancerProfile ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {t('reviews.writeReview')}
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('reviews.writeReview')}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  {t('reviews.yourRating')}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="group relative"
                    >
                      <span
                        className="text-4xl transition-all duration-200 cursor-pointer hover:scale-110"
                        style={{
                          color: star <= rating ? '#ffc107' : '#e0e0e0'
                        }}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('reviews.yourComment')}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('reviews.commentPlaceholder')}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows="4"
                />
                <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {comment.length}/500 {t('reviews.characters')}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || rating === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('common.submitting', 'Submitting...')}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                      </svg>
                      {t('reviews.submitReview')}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-semibold rounded-lg border border-gray-200 dark:border-gray-600 transition-all"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-400">
            {t('reviews.writeReview')}
          </h3>
          
          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              {t('reviews.yourRating')}
            </label>
            <StarRating value={rating} onChange={setRating} size={40} />
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              {t('reviews.yourComment')}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:border-pink-500 dark:focus:border-pink-400 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 transition-all outline-none"
              placeholder={t('reviews.commentPlaceholder')}
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {comment.length}/500 {t('reviews.characters')}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pink-500 to-yellow-400"
          >
            {loading ? '...' : t('reviews.submitReview')}
          </button>
        </form>
      )}
    </>
  );
};

export default ReviewForm;

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import StarRating from './StarRating';

const ReviewForm = ({ projectId, revieweeId, onSuccess }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      await api.post('/reviews', {
        project_id: projectId,
        reviewee_id: revieweeId,
        rating,
        comment
      });
      toast.success(t('reviews.reviewAdded'));
      setRating(0);
      setComment('');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

export default ReviewForm;

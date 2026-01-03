import React, { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BidForm = ({ projectId, onBidSubmitted }) => {
  const [formData, setFormData] = useState({
    amount: '',
    delivery_time: '',
    proposal: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.proposal) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.post('/bids', {
        project_id: projectId,
        freelancer_id: user.id,
        amount: parseFloat(formData.amount),
        delivery_time: formData.delivery_time,
        proposal: formData.proposal
      });
      
      toast.success('Bid submitted successfully!');
      setFormData({ amount: '', delivery_time: '', proposal: '' });
      if (onBidSubmitted) onBidSubmitted();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit bid');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="rounded-2xl p-8 shadow-lg"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <h3 className="text-2xl font-bold text-white mb-6">
        💼 Submit Your Proposal
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Your Bid Amount ($) *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="1"
            step="0.01"
            required
            className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your bid amount"
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Delivery Time */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Delivery Time
          </label>
          <input
            type="text"
            name="delivery_time"
            value={formData.delivery_time}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-yellow-400"
            placeholder="e.g., 2 weeks, 5 days"
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Proposal */}
        <div>
          <label className="block text-white font-semibold mb-2">
            Cover Letter / Proposal *
          </label>
          <textarea
            name="proposal"
            value={formData.proposal}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-yellow-400 resize-none"
            placeholder="Explain why you're the best fit for this project..."
            style={{ fontSize: '16px' }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: '#333'
          }}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </span>
          ) : (
            '🚀 Submit Bid'
          )}
        </button>
      </form>
    </div>
  );
};

export default BidForm;

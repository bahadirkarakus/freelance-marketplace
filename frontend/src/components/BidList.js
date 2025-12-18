import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const BidList = ({ projectId, isOwner, onBidStatusChange }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, [projectId]);

  const fetchBids = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/bids`);
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bidId, status) => {
    try {
      await api.put(`/bids/${bidId}`, { status });
      toast.success(`Bid ${status}!`);
      fetchBids();
      if (onBidStatusChange) onBidStatusChange();
    } catch (error) {
      toast.error('Failed to update bid status');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'rgba(255, 193, 7, 0.2)', color: '#ff9800', text: '⏳ Pending' },
      accepted: { bg: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', text: '✅ Accepted' },
      rejected: { bg: 'rgba(244, 67, 54, 0.2)', color: '#f44336', text: '❌ Rejected' }
    };
    const style = styles[status] || styles.pending;
    
    return (
      <span 
        className="px-4 py-2 rounded-full font-semibold text-sm"
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        {style.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div 
        className="text-center py-16 rounded-2xl"
        style={{ background: 'rgba(255, 255, 255, 0.05)' }}
      >
        <div className="text-6xl mb-4">📭</div>
        <p className="text-xl text-gray-400 font-semibold">No bids yet</p>
        <p className="text-gray-500 mt-2">Be the first to submit a proposal!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold mb-6" style={{ color: '#667eea' }}>
        📊 Proposals ({bids.length})
      </h3>

      {bids.map((bid) => (
        <div 
          key={bid.id}
          className="rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
            border: bid.status === 'accepted' ? '3px solid #4caf50' : 'none'
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                {bid.freelancer_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{bid.freelancer_name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4"
                        fill={star <= Math.round(bid.freelancer_rating || 0) ? '#ffc107' : '#e0e0e0'}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {bid.freelancer_rating?.toFixed(1) || 'New'}
                  </span>
                </div>
              </div>
            </div>
            {getStatusBadge(bid.status)}
          </div>

          {/* Skills */}
          {bid.skills && (
            <div className="flex flex-wrap gap-2 mb-4">
              {bid.skills.split(',').slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Bid Details */}
          <div 
            className="grid md:grid-cols-2 gap-4 p-4 rounded-lg mb-4"
            style={{ backgroundColor: '#f8f9fa' }}
          >
            <div>
              <p className="text-sm text-gray-600 mb-1">Bid Amount</p>
              <p className="text-2xl font-bold" style={{ color: '#667eea' }}>
                ${bid.amount.toLocaleString()}
              </p>
            </div>
            {bid.delivery_time && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Delivery Time</p>
                <p className="text-lg font-semibold text-gray-800">
                  ⏱️ {bid.delivery_time}
                </p>
              </div>
            )}
          </div>

          {/* Proposal */}
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">Cover Letter:</p>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {bid.proposal}
            </p>
          </div>

          {/* Action Buttons (only for project owner) */}
          {isOwner && bid.status === 'pending' && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleStatusUpdate(bid.id, 'accepted')}
                className="flex-1 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
              >
                ✅ Accept Bid
              </button>
              <button
                onClick={() => handleStatusUpdate(bid.id, 'rejected')}
                className="flex-1 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' }}
              >
                ❌ Reject
              </button>
            </div>
          )}

          {/* Submitted Date */}
          <p className="text-xs text-gray-500 mt-4">
            📅 Submitted: {new Date(bid.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BidList;

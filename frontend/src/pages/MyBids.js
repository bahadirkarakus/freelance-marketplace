import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const MyBids = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected

  useEffect(() => {
    if (user) {
      fetchMyBids();
    }
  }, [user]);

  const fetchMyBids = async () => {
    try {
      const response = await api.get(`/users/${user.id}/bids`);
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: { bg: 'rgba(255, 193, 7, 0.2)', color: '#ff9800', text: '⏳ Pending' },
      accepted: { bg: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', text: '✅ Accepted' },
      rejected: { bg: 'rgba(244, 67, 54, 0.2)', color: '#f44336', text: '❌ Rejected' }
    };
    return styles[status] || styles.pending;
  };

  const filteredBids = filter === 'all' 
    ? bids 
    : bids.filter(bid => bid.status === filter);

  const stats = {
    total: bids.length,
    pending: bids.filter(b => b.status === 'pending').length,
    accepted: bids.filter(b => b.status === 'accepted').length,
    rejected: bids.filter(b => b.status === 'rejected').length,
    totalValue: bids.reduce((sum, bid) => sum + parseFloat(bid.amount), 0)
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">
            📊 My Bids Dashboard
          </h1>
          <p className="text-white text-lg" style={{ opacity: 0.9 }}>
            Track all your proposals and their status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div 
            className="p-6 rounded-xl text-center shadow-lg"
            style={{ background: 'rgba(255, 255, 255, 0.95)' }}
          >
            <div className="text-4xl mb-2">📝</div>
            <div className="text-3xl font-bold" style={{ color: '#667eea' }}>{stats.total}</div>
            <div className="text-gray-600 font-semibold">Total Bids</div>
          </div>
          
          <div 
            className="p-6 rounded-xl text-center shadow-lg"
            style={{ background: 'rgba(255, 255, 255, 0.95)' }}
          >
            <div className="text-4xl mb-2">⏳</div>
            <div className="text-3xl font-bold" style={{ color: '#ff9800' }}>{stats.pending}</div>
            <div className="text-gray-600 font-semibold">Pending</div>
          </div>
          
          <div 
            className="p-6 rounded-xl text-center shadow-lg"
            style={{ background: 'rgba(255, 255, 255, 0.95)' }}
          >
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold" style={{ color: '#4caf50' }}>{stats.accepted}</div>
            <div className="text-gray-600 font-semibold">Accepted</div>
          </div>
          
          <div 
            className="p-6 rounded-xl text-center shadow-lg"
            style={{ background: 'rgba(255, 255, 255, 0.95)' }}
          >
            <div className="text-4xl mb-2">❌</div>
            <div className="text-3xl font-bold" style={{ color: '#f44336' }}>{stats.rejected}</div>
            <div className="text-gray-600 font-semibold">Rejected</div>
          </div>
          
          <div 
            className="p-6 rounded-xl text-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
          >
            <div className="text-4xl mb-2 text-white">💰</div>
            <div className="text-3xl font-bold text-white">${stats.totalValue.toLocaleString()}</div>
            <div className="text-white font-semibold">Total Value</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8 flex-wrap justify-center">
          {[
            { value: 'all', label: '📋 All', color: '#667eea' },
            { value: 'pending', label: '⏳ Pending', color: '#ff9800' },
            { value: 'accepted', label: '✅ Accepted', color: '#4caf50' },
            { value: 'rejected', label: '❌ Rejected', color: '#f44336' }
          ].map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="px-6 py-3 rounded-lg font-bold transition-all"
              style={{
                background: filter === value ? color : 'rgba(255, 255, 255, 0.2)',
                color: filter === value ? 'white' : 'white',
                border: filter === value ? 'none' : '2px solid white'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Bids List */}
        {filteredBids.length === 0 ? (
          <div 
            className="text-center py-20 rounded-2xl"
            style={{ background: 'rgba(255, 255, 255, 0.95)' }}
          >
            <div className="text-6xl mb-4">📭</div>
            <p className="text-2xl font-bold text-gray-700 mb-2">No bids found</p>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Start bidding on projects to see them here!' 
                : `No ${filter} bids at the moment`}
            </p>
            <Link
              to="/projects"
              className="inline-block mt-6 px-8 py-4 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              🔍 Browse Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBids.map((bid) => {
              const statusStyle = getStatusStyle(bid.status);
              return (
                <div 
                  key={bid.id}
                  className="rounded-2xl p-6 shadow-lg transition-all hover:shadow-xl"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <Link 
                        to={`/projects/${bid.project_id}`}
                        className="text-2xl font-bold hover:underline"
                        style={{ color: '#667eea' }}
                      >
                        {bid.project_title}
                      </Link>
                      <p className="text-gray-600 mt-1">
                        Project Budget: <span className="font-bold" style={{ color: '#fa709a' }}>
                          ${bid.project_budget?.toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <div 
                      className="px-5 py-2 rounded-full font-semibold"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                    >
                      {statusStyle.text}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div 
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#f8f9fa' }}
                    >
                      <p className="text-sm text-gray-600 mb-1">Your Bid</p>
                      <p className="text-2xl font-bold" style={{ color: '#667eea' }}>
                        ${bid.amount.toLocaleString()}
                      </p>
                    </div>
                    
                    {bid.delivery_time && (
                      <div 
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: '#f8f9fa' }}
                      >
                        <p className="text-sm text-gray-600 mb-1">Delivery Time</p>
                        <p className="text-lg font-semibold text-gray-800">
                          ⏱️ {bid.delivery_time}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Your Proposal:</p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {bid.proposal.length > 200 
                        ? bid.proposal.substring(0, 200) + '...' 
                        : bid.proposal}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      📅 Submitted: {new Date(bid.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    
                    <Link
                      to={`/projects/${bid.project_id}`}
                      className="px-6 py-2 rounded-lg font-bold text-white transition-all hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                      View Project →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBids;

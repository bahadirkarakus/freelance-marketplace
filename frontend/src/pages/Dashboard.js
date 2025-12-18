import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const endpoint = user.user_type === 'client' 
        ? `/analytics/client/${user.id}`
        : `/analytics/freelancer/${user.id}`;
      
      const response = await api.get(endpoint);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div 
          className="p-12 rounded-2xl text-center"
          style={{ background: 'rgba(255, 255, 255, 0.95)' }}
        >
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-2xl font-bold text-gray-800 mb-4">Please Login</p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 rounded-lg font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

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

  // Client Dashboard
  if (user.user_type === 'client') {
    const { projects, bids, monthly } = analytics;

    // Project Status Doughnut Chart
    const projectStatusData = {
      labels: ['Open', 'In Progress', 'Completed', 'Cancelled'],
      datasets: [{
        data: [
          projects.open_projects || 0,
          projects.in_progress_projects || 0,
          projects.completed_projects || 0,
          projects.cancelled_projects || 0
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#f44336'],
        borderWidth: 0
      }]
    };

    // Monthly Projects Line Chart
    const monthlyLabels = monthly.map(m => {
      const date = new Date(m.month + '-01');
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    const monthlyProjectData = {
      labels: monthlyLabels,
      datasets: [{
        label: 'Projects Created',
        data: monthly.map(m => m.count),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    };

    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                📊 Client Dashboard
              </h1>
              <p className="text-white text-lg" style={{ opacity: 0.9 }}>
                Welcome back, {user.name}!
              </p>
            </div>
            <Link
              to="/profile"
              className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'rgba(255, 255, 255, 0.2)', border: '2px solid white' }}
            >
              ⚙️ Edit Profile
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div 
              className="p-6 rounded-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
            >
              <div className="text-white text-sm font-semibold mb-2">Total Projects</div>
              <div className="text-white text-4xl font-bold">{projects.total_projects || 0}</div>
              <div className="text-white text-xs mt-2" style={{ opacity: 0.8 }}>All time</div>
            </div>

            <div 
              className="p-6 rounded-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
            >
              <div className="text-white text-sm font-semibold mb-2">Active Projects</div>
              <div className="text-white text-4xl font-bold">{projects.in_progress_projects || 0}</div>
              <div className="text-white text-xs mt-2" style={{ opacity: 0.8 }}>In progress</div>
            </div>

            <div 
              className="p-6 rounded-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <div className="text-white text-sm font-semibold mb-2">Pending Bids</div>
              <div className="text-white text-4xl font-bold">{bids.pending_bids || 0}</div>
              <div className="text-white text-xs mt-2" style={{ opacity: 0.8 }}>Awaiting review</div>
            </div>

            <div 
              className="p-6 rounded-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
            >
              <div className="text-white text-sm font-semibold mb-2">Total Budget</div>
              <div className="text-white text-4xl font-bold">${(projects.total_budget || 0).toLocaleString()}</div>
              <div className="text-white text-xs mt-2" style={{ opacity: 0.8 }}>All projects</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Project Status Chart */}
            <div 
              className="p-8 rounded-2xl shadow-2xl"
              style={{ background: 'rgba(255, 255, 255, 0.95)' }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#667eea' }}>
                📈 Project Status Distribution
              </h3>
              <div style={{ height: '300px' }}>
                <Doughnut data={projectStatusData} options={chartOptions} />
              </div>
            </div>

            {/* Monthly Projects Chart */}
            <div 
              className="p-8 rounded-2xl shadow-2xl"
              style={{ background: 'rgba(255, 255, 255, 0.95)' }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#667eea' }}>
                📅 Projects Over Time
              </h3>
              <div style={{ height: '300px' }}>
                {monthly.length > 0 ? (
                  <Line data={monthlyProjectData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bid Statistics */}
          <div 
            className="p-8 rounded-2xl shadow-2xl mb-8"
            style={{ background: 'rgba(255, 255, 255, 0.95)' }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#667eea' }}>
              💼 Bid Statistics
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="text-4xl mb-2">📨</div>
                <div className="text-3xl font-bold text-gray-800">{bids.total_bids_received || 0}</div>
                <div className="text-sm text-gray-600">Total Bids</div>
              </div>
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#fff3cd' }}>
                <div className="text-4xl mb-2">⏳</div>
                <div className="text-3xl font-bold" style={{ color: '#ff9800' }}>{bids.pending_bids || 0}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#d1ecf1' }}>
                <div className="text-4xl mb-2">✅</div>
                <div className="text-3xl font-bold" style={{ color: '#4caf50' }}>{bids.accepted_bids || 0}</div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
              <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#f8d7da' }}>
                <div className="text-4xl mb-2">❌</div>
                <div className="text-3xl font-bold" style={{ color: '#f44336' }}>{bids.rejected_bids || 0}</div>
                <div className="text-sm text-gray-600">Rejected</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div 
            className="p-8 rounded-2xl shadow-2xl"
            style={{ background: 'rgba(255, 255, 255, 0.95)' }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#667eea' }}>
              ⚡ Quick Actions
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/projects/create"
                className="p-6 rounded-lg text-center font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                ➕ Post New Project
              </Link>
              <Link
                to="/projects"
                className="p-6 rounded-lg text-center font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
              >
                📋 View All Projects
              </Link>
              <Link
                to="/freelancers"
                className="p-6 rounded-lg text-center font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
              >
                🔍 Find Freelancers
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Freelancer Dashboard
  const { bids, projects, monthly } = analytics;

  // Bid Status Doughnut Chart
  const bidStatusData = {
    labels: ['Pending', 'Accepted', 'Rejected'],
    datasets: [{
      data: [
        bids.pending_bids || 0,
        bids.accepted_bids || 0,
        bids.rejected_bids || 0
      ],
      backgroundColor: ['#ff9800', '#4caf50', '#f44336'],
      borderWidth: 0
    }]
  };

  // Monthly Bids Bar Chart
  const monthlyLabels = monthly.map(m => {
    const date = new Date(m.month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short' });
  });
  
  const monthlyBidData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Total Bids',
        data: monthly.map(m => m.count),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
      },
      {
        label: 'Accepted',
        data: monthly.map(m => m.accepted_count),
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">
              📊 Freelancer Dashboard
            </h1>
            <p className="text-white text-lg" style={{ opacity: 0.9 }}>
              Welcome back, {user.name}!
            </p>
          </div>
          <Link
            to="/profile"
            className="px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
            style={{ background: 'rgba(255, 255, 255, 0.2)', border: '2px solid white' }}
          >
            ⚙️ Edit Profile
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="p-6 rounded-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
          >
            <div className="text-white text-sm font-semibold mb-2">💰 Total Earnings</div>
            <div className="text-white text-4xl font-bold">${(bids.total_earnings || 0).toLocaleString()}</div>
            <div className="text-white text-xs mt-2" style={{ opacity: 0.8 }}>From accepted bids</div>
          </div>

          <div 
            className="p-6 rounded-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
          >
            <div className="text-white text-sm font-semibold mb-2">🎯 Success Rate</div>
            <div className="text-white text-4xl font-bold">{bids.success_rate || 0}%</div>
            <div className="text-white text-xs mt-2" style={{ opacity: 0.8 }}>Bid acceptance</div>
          </div>

          <div 
            className="p-6 rounded-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <div className="text-white text-sm font-semibold mb-2">📝 Total Bids</div>
            <div className="text-white text-4xl font-bold">{bids.total_bids || 0}</div>
            <div className="text-white text-xs mt-2" style={{ opacity: 0.8 }}>All time</div>
          </div>

          <div 
            className="p-6 rounded-xl shadow-lg"
            style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
          >
            <div className="text-white text-sm font-semibold mb-2">🚀 Active Projects</div>
            <div className="text-white text-4xl font-bold">{projects.active_projects || 0}</div>
            <div className="text-white text-xs mt-2" style={{ opacity: 0.8 }}>In progress</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Bid Status Chart */}
          <div 
            className="p-8 rounded-2xl shadow-2xl"
            style={{ background: 'rgba(255, 255, 255, 0.95)' }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#667eea' }}>
              📊 Bid Status Overview
            </h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={bidStatusData} options={chartOptions} />
            </div>
          </div>

          {/* Monthly Bids Chart */}
          <div 
            className="p-8 rounded-2xl shadow-2xl"
            style={{ background: 'rgba(255, 255, 255, 0.95)' }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#667eea' }}>
              📅 Monthly Bid Activity
            </h3>
            <div style={{ height: '300px' }}>
              {monthly.length > 0 ? (
                <Bar data={monthlyBidData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div 
          className="p-8 rounded-2xl shadow-2xl mb-8"
          style={{ background: 'rgba(255, 255, 255, 0.95)' }}
        >
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#667eea' }}>
            📈 Performance Metrics
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="text-4xl mb-2">💵</div>
              <div className="text-2xl font-bold text-gray-800">${(bids.avg_bid_amount || 0).toFixed(2)}</div>
              <div className="text-sm text-gray-600">Average Bid Amount</div>
            </div>
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="text-4xl mb-2">✅</div>
              <div className="text-2xl font-bold" style={{ color: '#4caf50' }}>{projects.completed_projects || 0}</div>
              <div className="text-sm text-gray-600">Completed Projects</div>
            </div>
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
              <div className="text-4xl mb-2">⏳</div>
              <div className="text-2xl font-bold" style={{ color: '#ff9800' }}>{bids.pending_bids || 0}</div>
              <div className="text-sm text-gray-600">Pending Bids</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div 
          className="p-8 rounded-2xl shadow-2xl"
          style={{ background: 'rgba(255, 255, 255, 0.95)' }}
        >
          <h3 className="text-2xl font-bold mb-6" style={{ color: '#667eea' }}>
            ⚡ Quick Actions
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/projects"
              className="p-6 rounded-lg text-center font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              🔍 Browse Projects
            </Link>
            <Link
              to="/my-bids"
              className="p-6 rounded-lg text-center font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
            >
              📋 My Bids
            </Link>
            <Link
              to="/messages"
              className="p-6 rounded-lg text-center font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
            >
              💬 Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

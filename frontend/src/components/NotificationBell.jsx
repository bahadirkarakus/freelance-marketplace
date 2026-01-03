import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      const notifs = response.data || [];
      setNotifications(notifs.slice(0, 5)); // Show only latest 5
      setUnreadCount(notifs.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'bid': return '💼';
      case 'message': return '💬';
      case 'payment': return '💳';
      case 'review': return '⭐';
      case 'project': return '📁';
      case 'completion': return '✅';
      case 'dispute': return '⚠️';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'bid': return '#667eea';
      case 'message': return '#11998e';
      case 'payment': return '#f093fb';
      case 'review': return '#fa709a';
      case 'project': return '#fee140';
      case 'completion': return '#38ef7d';
      case 'dispute': return '#eb3349';
      default: return '#4a5568';
    }
  };

  const getNotificationLink = (notification) => {
    const { type, related_id } = notification;
    switch (type) {
      case 'bid':
        return related_id ? `/projects/${related_id}` : '/projects';
      case 'message':
        return related_id ? `/chat/${related_id}` : '/messages';
      case 'payment':
        return related_id ? `/projects/${related_id}` : '/dashboard';
      case 'review':
        return related_id ? `/freelancers/${related_id}` : '/profile';
      case 'project':
        return related_id ? `/projects/${related_id}` : '/projects';
      case 'completion':
        return related_id ? `/projects/${related_id}` : '/dashboard';
      case 'dispute':
        return related_id ? `/projects/${related_id}` : '/dashboard';
      default:
        return '/dashboard';
    }
  };

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id);
    setShowDropdown(false);
    const link = getNotificationLink(notification);
    navigate(link);
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg 
          className="w-6 h-6 text-gray-700 dark:text-gray-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        {unreadCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
            style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-20 border border-gray-200 dark:border-gray-700">
            <div 
              className="p-4 border-b border-gray-200 dark:border-gray-700 font-bold text-white rounded-t-xl"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              🔔 Notifications
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-blue-50 dark:bg-gray-750' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span 
                        className="text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full"
                        style={{ 
                          backgroundColor: `${getNotificationColor(notification.type)}20`,
                          color: getNotificationColor(notification.type)
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔕</div>
                  <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <Link
                to="/notifications"
                onClick={() => setShowDropdown(false)}
                className="block p-3 text-center text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-b-xl"
                style={{ color: '#667eea' }}
              >
                View All Notifications →
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;

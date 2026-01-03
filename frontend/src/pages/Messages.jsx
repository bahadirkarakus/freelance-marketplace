import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { getProfilePictureUrl } from '../utils/helpers';
import { AuthContext } from '../context/AuthContext';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      console.log('Fetching conversations...');
      const response = await api.get('/messages/conversations');
      console.log('Conversations response:', response.data);
      setConversations(response.data || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-5xl">🔒</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to access your messages</p>
          <Link to="/login" className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">💬</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Messages</h1>
              <p className="text-gray-600 dark:text-gray-400">Stay connected with your team</p>
            </div>
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center animate-fade-in border border-gray-200 dark:border-gray-700">
            <div className="w-32 h-32 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">📭</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No conversations yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start connecting with freelancers or clients by browsing available projects
            </p>
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              <span>🔍</span>
              Browse projects to get started
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv, index) => (
              <Link
                key={conv.user_id}
                to={`/chat/${conv.user_id}`}
                className="block bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Profile Picture with Online Status */}
                    <div className="relative flex-shrink-0">
                      {conv.profile_picture ? (
                        <img
                          src={getProfilePictureUrl(conv.profile_picture)}
                          alt={conv.user_name}
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-100 dark:ring-indigo-900/30 group-hover:ring-indigo-300 dark:group-hover:ring-indigo-700 transition-all"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-2xl font-bold ring-4 ring-indigo-100 dark:ring-indigo-900/30 group-hover:ring-indigo-300 dark:group-hover:ring-indigo-700 transition-all shadow-lg">
                          {conv.user_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {/* Online Indicator */}
                      <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {conv.user_name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {conv.unread_count > 0 && (
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                        {conv.last_message}
                      </p>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <span>🕒</span>
                          {new Date(conv.last_message_time).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          Open conversation →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Hover Gradient Border Effect */}
                <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

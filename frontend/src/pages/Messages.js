import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
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
      const response = await api.get('/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl">Please login to access messages</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600 mb-4">No conversations yet</p>
          <Link to="/projects" className="text-blue-600 hover:underline">
            Browse projects to get started
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {conversations.map((conv) => (
            <Link
              key={conv.user_id}
              to={`/chat/${conv.user_id}`}
              className="block p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center">
                {conv.profile_picture ? (
                  <img
                    src={`http://localhost:4000${conv.profile_picture}`}
                    alt={conv.user_name}
                    className="w-14 h-14 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mr-4">
                    {conv.user_name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{conv.user_name}</h3>
                    {conv.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-1">{conv.last_message}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(conv.last_message_time).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;

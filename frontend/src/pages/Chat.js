import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Connect to socket
    socketRef.current = io('http://localhost:4000');
    socketRef.current.emit('user_online', user.id);

    // Listen for new messages
    socketRef.current.on('receive_message', (message) => {
      if (message.sender_id === parseInt(userId)) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    fetchMessages();
    fetchOtherUser();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, user]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data);
      await api.put(`/messages/${userId}/read`);
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherUser = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setOtherUser(response.data);
    } catch (error) {
      console.error('Failed to load user');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post('/messages', {
        receiver_id: parseInt(userId),
        message: newMessage
      });

      const sentMessage = response.data.data;
      setMessages(prev => [...prev, sentMessage]);
      socketRef.current.emit('send_message', sentMessage);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to send message');
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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '80vh' }}>
        {/* Chat Header */}
        <div className="bg-blue-600 text-white p-4">
          <Link to="/messages" className="text-sm hover:underline mb-2 block">
            ← Back to Messages
          </Link>
          {otherUser && (
            <div className="flex items-center">
              {otherUser.profile_picture ? (
                <img
                  src={`http://localhost:4000${otherUser.profile_picture}`}
                  alt={otherUser.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold mr-3">
                  {otherUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold">{otherUser.name}</h2>
                <p className="text-sm text-blue-100">{otherUser.user_type}</p>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto" style={{ height: 'calc(80vh - 180px)' }}>
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => {
                const isOwnMessage = msg.sender_id === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="break-words">{msg.message}</p>
                      <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

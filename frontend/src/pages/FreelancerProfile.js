import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import ReviewList from '../components/ReviewList';

const FreelancerProfile = () => {
  const { id } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreelancer();
  }, [id]);

  const fetchFreelancer = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setFreelancer(response.data);
    } catch (error) {
      console.error('Error fetching freelancer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-pink-500"></div>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 text-gray-600">
          Freelancer not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div>
              {freelancer.profile_picture ? (
                <img
                  src={`http://localhost:4000${freelancer.profile_picture}`}
                  alt={freelancer.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
                >
                  {freelancer.name?.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 text-pink-600 dark:text-pink-400">
                {freelancer.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="text-2xl"
                      style={{ color: star <= Math.round(freelancer.rating || 0) ? '#ffc107' : '#e0e0e0' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  {freelancer.rating ? freelancer.rating.toFixed(1) : '0.0'}
                </span>
              </div>

              {/* Hourly Rate */}
              {freelancer.hourly_rate && (
                <div className="mb-4">
                  <span className="text-3xl font-bold text-pink-500 dark:text-pink-400">
                    ${freelancer.hourly_rate}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-xl">/hour</span>
                </div>
              )}

              {/* Bio */}
              {freelancer.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
                  {freelancer.bio}
                </p>
              )}

              {/* Skills */}
              {freelancer.skills && (
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="text-white px-4 py-2 rounded-lg font-medium shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <ReviewList userId={id} />
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;

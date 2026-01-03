import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getProfilePictureUrl } from '../utils/helpers';
import { AuthContext } from '../context/AuthContext';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';

const FreelancerProfile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsRefresh, setReviewsRefresh] = useState(0);

  useEffect(() => {
    fetchFreelancer();
    fetchPortfolio();
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

  const fetchPortfolio = async () => {
    try {
      const response = await api.get(`/portfolio/${id}`);
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
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
                  src={getProfilePictureUrl(freelancer.profile_picture)}
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

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {user && user.id !== parseInt(id) && (
                  <>
                    <button
                      onClick={() => navigate(`/chat/${id}`)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                    >
                      <span>💬</span> Send Message
                    </button>
                    <button
                      onClick={() => navigate('/projects')}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                    >
                      <span>💼</span> View Projects
                    </button>
                  </>
                )}
                {!user && (
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                  >
                    Login to Contact
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        {portfolio.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h2>
              <Link
                to={`/portfolio/${id}`}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {portfolio.slice(0, 3).map((item) => (
                <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-gray-700">
                  {item.image_url ? (
                    <img
                      src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:4000${item.image_url}`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-medium">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {user && user.id !== parseInt(id) && (
            <ReviewForm 
              revieweeId={parseInt(id)} 
              onSuccess={() => setReviewsRefresh(r => r + 1)}
              isFreelancerProfile={true}
            />
          )}
          <ReviewList userId={id} refreshTrigger={reviewsRefresh} />
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;

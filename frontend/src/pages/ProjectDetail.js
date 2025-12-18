import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import BidForm from '../components/BidForm';
import BidList from '../components/BidList';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [refreshBids, setRefreshBids] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewee, setReviewee] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      const projectData = response.data;
      setProject(projectData);
      
      // Determine who can be reviewed
      if (projectData.status === 'completed' && user) {
        if (user.id === projectData.client_id && projectData.freelancer_id) {
          // Client can review freelancer
          setReviewee({ id: projectData.freelancer_id, name: projectData.freelancer_name });
        } else if (user.id === projectData.freelancer_id) {
          // Freelancer can review client
          setReviewee({ id: projectData.client_id, name: projectData.client_name });
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmitted = () => {
    setShowBidForm(false);
    setRefreshBids(prev => prev + 1);
    fetchProjectDetails();
  };

  const handleBidStatusChange = () => {
    setRefreshBids(prev => prev + 1);
    fetchProjectDetails();
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    toast.success(t('reviews.reviewAdded'));
    fetchProjectDetails();
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!project) {
    return <div className="container mx-auto px-4 py-8 text-center">Project not found</div>;
  }

  const isOwner = user && user.id === project.client_id;
  const isFreelancer = user && user.user_type === 'freelancer';
  const canBid = isFreelancer && project.status === 'open' && !isOwner;

  const getStatusStyle = (status) => {
    const styles = {
      open: { bg: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', text: '🟢 Open', border: '2px solid #4caf50' },
      in_progress: { bg: 'rgba(255, 152, 0, 0.2)', color: '#ff9800', text: '⏳ In Progress', border: '2px solid #ff9800' },
      completed: { bg: 'rgba(33, 150, 243, 0.2)', color: '#2196f3', text: '✅ Completed', border: '2px solid #2196f3' },
      cancelled: { bg: 'rgba(244, 67, 54, 0.2)', color: '#f44336', text: '❌ Cancelled', border: '2px solid #f44336' }
    };
    return styles[status] || styles.open;
  };

  const statusStyle = getStatusStyle(project.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        {/* Project Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 text-indigo-600 dark:text-indigo-400">
                {project.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Posted by <span className="font-semibold text-gray-800 dark:text-gray-200">{project.client_name}</span>
              </p>
            </div>
            <div 
              className="px-6 py-3 rounded-full font-bold text-lg"
              style={{ 
                backgroundColor: statusStyle.bg, 
                color: statusStyle.color,
                border: statusStyle.border
              }}
            >
              {statusStyle.text}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              📝 Project Description
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div 
              className="p-6 rounded-xl text-center"
              style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
            >
              <div className="text-white text-sm font-semibold mb-2">💰 Budget</div>
              <div className="text-white text-3xl font-bold">${project.budget?.toLocaleString()}</div>
            </div>
            
            {project.duration && (
              <div 
                className="p-6 rounded-xl text-center"
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
              >
                <div className="text-white text-sm font-semibold mb-2">⏱️ Duration</div>
                <div className="text-white text-2xl font-bold">{project.duration}</div>
              </div>
            )}
            
            {project.category && (
              <div 
                className="p-6 rounded-xl text-center"
                style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
              >
                <div className="text-white text-sm font-semibold mb-2">📁 Category</div>
                <div className="text-white text-2xl font-bold">{project.category}</div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap">
            {canBid && (
              <button
                onClick={() => setShowBidForm(!showBidForm)}
                className="px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90"
                style={{ 
                  background: showBidForm 
                    ? 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {showBidForm ? '❌ Cancel' : '💼 Submit Proposal'}
              </button>
            )}
            
            {user && !isOwner && (
              <button
                onClick={() => navigate(`/chat/${project.client_id}`)}
                className="px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
              >
                💬 Send Message
              </button>
            )}
          </div>
        </div>

        {/* Bid Form */}
        {showBidForm && canBid && (
          <div className="mb-8">
            <BidForm 
              projectId={id} 
              onBidSubmitted={handleBidSubmitted}
            />
          </div>
        )}

        {/* Bids List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
          <BidList 
            projectId={id} 
            isOwner={isOwner}
            onBidStatusChange={handleBidStatusChange}
            key={refreshBids}
          />
        </div>

        {/* Review Section - Only for completed projects */}
        {project.status === 'completed' && reviewee && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
              {t('reviews.title')}
            </h2>
            
            {!showReviewForm ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
              >
                ⭐ {t('reviews.writeReview')} {reviewee.name}
              </button>
            ) : (
              <div>
                <ReviewForm
                  projectId={id}
                  revieweeId={reviewee.id}
                  onSuccess={handleReviewSubmitted}
                />
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="mt-4 px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold"
                >
                  {t('common.cancel')}
                </button>
              </div>
            )}

            {/* Show reviews for the project participants */}
            {reviewee && (
              <div className="mt-8">
                <ReviewList userId={reviewee.id} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;

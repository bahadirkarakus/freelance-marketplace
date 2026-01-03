import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import BidForm from '../components/BidForm';
import BidList from '../components/BidList';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import PaymentModal from '../components/PaymentModal';

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [acceptedBid, setAcceptedBid] = useState(null);
  const [payments, setPayments] = useState([]);
  const [submittingCompletion, setSubmittingCompletion] = useState(false);
  const [approvingCompletion, setApprovingCompletion] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchProjectDetails = useCallback(async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      const projectData = response.data;
      setProject(projectData);
      
      // Determine who can be reviewed
      // Backend returns freelancer_id from LEFT JOIN on assigned_freelancer_id
      const freelancerId = projectData.freelancer_id || projectData.assigned_freelancer_id;
      
      if (projectData.status === 'completed' && user) {
        if (user.id === projectData.client_id && freelancerId) {
          // Client can review freelancer
          setReviewee({ id: freelancerId, name: projectData.freelancer_name });
        } else if (user.id === freelancerId) {
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
  }, [id, user]);

  const fetchPayments = useCallback(async () => {
    try {
      const response = await api.get(`/projects/${id}/payments`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  }, [id]);

  const fetchAcceptedBid = useCallback(async () => {
    try {
      const response = await api.get(`/projects/${id}/bids`);
      const accepted = response.data.find(bid => bid.status === 'accepted');
      setAcceptedBid(accepted);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
    fetchAcceptedBid();
    if (user && user.user_type === 'client') {
      fetchPayments();
    }
  }, [id, user, fetchProjectDetails, fetchPayments, fetchAcceptedBid]);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    fetchPayments();
    fetchProjectDetails();
    toast.success('Payment completed successfully!');
  };

  const hasSuccessfulPayment = payments.some(p => p.status === 'SUCCESS');

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

  // ========== ESCROW SYSTEM HANDLERS ==========
  const handleSubmitCompletion = async () => {
    setSubmittingCompletion(true);
    try {
      await api.post(`/projects/${id}/submit-completion`);
      toast.success('✅ Work submitted for client approval!');
      fetchProjectDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit work');
    } finally {
      setSubmittingCompletion(false);
    }
  };

  const handleApproveCompletion = async () => {
    setApprovingCompletion(true);
    try {
      await api.post(`/projects/${id}/approve-completion`);
      toast.success('✅ Work approved! Payment released to freelancer.');
      fetchProjectDetails();
      fetchPayments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve work');
    } finally {
      setApprovingCompletion(false);
    }
  };

  const handleRejectCompletion = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      await api.post(`/projects/${id}/reject-completion`, { reason: rejectReason });
      toast.success('⚠️ Dispute created. Admins will review.');
      setShowRejectForm(false);
      setRejectReason('');
      fetchProjectDetails();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject work');
    }
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
            
            {/* ESCROW: Freelancer Submit Completion */}
            {!isOwner && user && user.id === project.assigned_freelancer_id && 
             project.status === 'in_progress' && !project.freelancer_approved && (
              <button
                onClick={handleSubmitCompletion}
                disabled={submittingCompletion}
                className="px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
              >
                {submittingCompletion ? '⏳ Submitting...' : '✅ Mark Work Complete'}
              </button>
            )}

            {/* ESCROW: Client Approve/Reject Work */}
            {isOwner && project.freelancer_approved && !project.client_approved && (
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={approvingCompletion}
                  className="px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #11db8d 0%, #23b967 100%)' }}
                >
                  {approvingCompletion ? '⏳ Processing...' : '✅ Approve & Pay'}
                </button>
                <button
                  onClick={() => setShowRejectForm(!showRejectForm)}
                  className="px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #f76707 0%, #ffa500 100%)' }}
                >
                  {showRejectForm ? '❌ Cancel' : '⚠️ Reject Work'}
                </button>
              </div>
            )}

            {/* ESCROW: Dispute Status */}
            {project.status === 'in_dispute' && (
              <div className="px-8 py-4 rounded-lg font-bold text-white text-lg bg-red-500 dark:bg-red-600 flex items-center gap-2">
                ⚠️ In Dispute - Admin Review
              </div>
            )}

            {/* Payment Button - Only for project owner with accepted bid (OLD SYSTEM) */}
            {isOwner && acceptedBid && !project.freelancer_approved && !hasSuccessfulPayment && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
              >
                💳 Pay Freelancer ${acceptedBid.amount}
              </button>
            )}

            {/* Payment Status Badge */}
            {isOwner && project.client_approved && (
              <div className="px-8 py-4 rounded-lg font-bold text-white text-lg bg-green-500 dark:bg-green-600 flex items-center gap-2">
                ✅ Payment Completed
              </div>
            )}
            
            {user && !isOwner && project.assigned_freelancer_id && user.id !== project.assigned_freelancer_id && (
              <button
                onClick={() => navigate(`/chat/${project.client_id}`)}
                className="px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}
              >
                💬 Send Message
              </button>
            )}
          </div>

          {/* ESCROW: Reject Work Form */}
          {showRejectForm && (
            <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800">
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">⚠️ Reject Work - Why is the work unsatisfactory?</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why the work doesn't meet your requirements (this will be reviewed by admins)..."
                className="w-full p-4 border-2 border-red-300 rounded-lg mb-4 dark:bg-gray-700 dark:border-red-600 dark:text-white"
                rows="4"
              />
              <button
                onClick={handleRejectCompletion}
                disabled={!rejectReason.trim()}
                className="px-6 py-3 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-all"
              >
                Submit Dispute
              </button>
            </div>
          )}
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

        {/* Bids List - ONLY for logged-in users */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
            <BidList 
              projectId={id} 
              isOwner={isOwner}
              onBidStatusChange={handleBidStatusChange}
              key={refreshBids}
            />
          </div>
        )}

        {/* Not logged in message */}
        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 mb-8 text-center">
            <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-300 mb-3">
              🔐 Login Required
            </h3>
            <p className="text-yellow-700 dark:text-yellow-200 mb-4">
              Please log in to see proposals and submit your own bid for this project.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              🔑 Login Now
            </button>
          </div>
        )}

        {/* Review Section - Only for completed projects and ONLY for the client */}
        {project.status === 'completed' && reviewee && isOwner && (
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

            {/* Show reviews - Only for the freelancer being reviewed or the client who posted them */}
            {reviewee && (
              <div className="mt-8">
                <ReviewList userId={reviewee.id} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && acceptedBid && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          project={project}
          bid={acceptedBid}
          onPaymentSuccess={handlePaymentSuccess}
          isEscrowRelease={project.freelancer_approved && !project.client_approved}
        />
      )}
    </div>
  );
};

export default ProjectDetail;

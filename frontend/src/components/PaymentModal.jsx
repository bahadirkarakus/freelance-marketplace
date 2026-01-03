import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

/**
 * 🎯 PROFESSIONAL PAYMENT MODAL
 * Simulated payment with real backend flow
 * - PENDING → Processing → SUCCESS/FAILED
 * - Security checks on backend
 * - Real-time status updates
 * - Supports both direct payment and escrow release
 */
const PaymentModal = ({ isOpen, onClose, project, bid, onPaymentSuccess, isEscrowRelease = false }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [balance, setBalance] = useState(0);
  const [paymentResult, setPaymentResult] = useState(null);
  const [processingStage, setProcessingStage] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchBalance();
    }
  }, [isOpen]);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/wallet/balance');
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (balance < bid.amount) {
      toast.error('Insufficient balance!');
      return;
    }

    setLoading(true);
    setPaymentStatus('PROCESSING');

    try {
      // Stage 1: Validation
      setProcessingStage('Verifying payment details...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Stage 2: Processing
      setProcessingStage('Processing payment...');
      
      let response;
      if (isEscrowRelease) {
        // Escrow release - approve completion and release funds
        response = await api.post(`/projects/${project.id}/approve-completion`);
      } else {
        // Direct payment
        response = await api.post('/payments/pay', {
          project_id: project.id,
          bid_id: bid.id,
          amount: bid.amount
        });
      }

      // Stage 3: Finalizing
      setProcessingStage('Finalizing transaction...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Success
      setPaymentStatus('SUCCESS');
      setPaymentResult(response.data.payment || { transaction_id: 'ESCROW_RELEASE_' + Date.now() });
      setBalance(prev => prev - bid.amount);
      toast.success(isEscrowRelease ? 'Work approved! Payment released! 🎉' : 'Payment completed successfully! 🎉');
      
      if (onPaymentSuccess) onPaymentSuccess();
    } catch (error) {
      setPaymentStatus('FAILED');
      const errorMsg = error.response?.data?.error || 'Payment processing failed';
      toast.error(errorMsg);
      console.error('Payment error:', error.response?.data);
    } finally {
      setLoading(false);
      setProcessingStage('');
    }
  };

  const handleClose = () => {
    onClose();
    setPaymentStatus(null);
    setPaymentResult(null);
  };

  const insufficientFunds = balance < bid.amount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            💳 {isEscrowRelease ? 'Release Payment' : 'Secure Payment'}
          </h2>
          <p className="text-white/90 mt-1 text-sm">
            {isEscrowRelease ? 'Approve work and release funds to freelancer' : 'Pay from your wallet balance'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* IDLE STATE - Before Payment */}
          {!paymentStatus && (
            <>
              {/* Balance Display */}
              <div className={`p-4 rounded-xl mb-4 border-2 ${
                insufficientFunds 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-400' 
                  : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 font-medium">Your Balance:</span>
                  <span className={`text-2xl font-bold ${
                    insufficientFunds ? 'text-red-600' : 'text-indigo-600'
                  }`}>
                    ${balance.toLocaleString()}
                  </span>
                </div>
                {insufficientFunds && (
                  <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                      ⚠️ Insufficient balance! Need ${(bid.amount - balance).toLocaleString()} more
                    </p>
                    <button className="mt-2 text-red-600 underline text-sm font-semibold">
                      Add funds to wallet
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-300">Project:</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-right max-w-52 truncate">
                    {project.title}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <span className="text-gray-600 dark:text-gray-300">Freelancer:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {bid.freelancer_name}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-400">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Amount to Pay:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${bid.amount?.toLocaleString()}
                  </span>
                </div>

                {/* Remaining Balance Preview */}
                {!insufficientFunds && (
                  <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">After payment:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      ${(balance - bid.amount).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔒</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Secure Payment:</strong> Your payment is protected. The freelancer will receive funds instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading || insufficientFunds}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay $${bid.amount?.toLocaleString()}`
                  )}
                </button>
              </div>
            </>
          )}

          {/* PROCESSING STATE */}
          {paymentStatus === 'PROCESSING' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg className="animate-spin h-12 w-12 text-indigo-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Processing Payment...
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {processingStage}
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full animate-progress"></div>
              </div>
            </div>
          )}

          {/* SUCCESS STATE */}
          {paymentStatus === 'SUCCESS' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Successful! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Funds transferred to freelancer
              </p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-xl mb-6 text-left border-2 border-green-300">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600 dark:text-gray-300">Amount Paid:</span>
                  <span className="font-bold text-green-600 text-lg">${bid.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600 dark:text-gray-300">Remaining Balance:</span>
                  <span className="font-bold text-indigo-600 text-lg">${balance.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-3 border-gray-300 dark:border-gray-600">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Transaction ID:</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {paymentResult?.transaction_id?.slice(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-semibold text-green-600">✓ Completed</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                Done
              </button>
            </div>
          )}

          {/* FAILED STATE */}
          {paymentStatus === 'FAILED' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">❌</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Something went wrong. Please try again.
              </p>
              <button
                onClick={() => {
                  setPaymentStatus(null);
                  setPaymentResult(null);
                }}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

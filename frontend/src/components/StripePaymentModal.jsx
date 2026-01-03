/**
 * 🏦 STRIPE PAYMENT COMPONENT
 * 
 * Gerçek kart bilgisi girişi için Stripe Elements kullanır.
 * 
 * KURULUM:
 * npm install @stripe/react-stripe-js @stripe/stripe-js
 */

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../utils/api';
import toast from 'react-hot-toast';

// Stripe'ı başlat (publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Kart stili
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

// Ana Ödeme Formu
const CheckoutForm = ({ project, bid, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  // Component mount olduğunda Payment Intent oluştur
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await api.post('/payments/create-intent', {
          project_id: project.id,
          bid_id: bid.id,
          amount: bid.amount,
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError(err.response?.data?.error || 'Ödeme başlatılamadı');
      }
    };

    createPaymentIntent();
  }, [project.id, bid.id, bid.amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: project.client_name,
          },
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      toast.success('Ödeme başarılı! 🎉');
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Proje Bilgileri */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Proje:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{project.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-300">Freelancer:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{bid.freelancer_name}</span>
        </div>
        <div className="flex justify-between border-t pt-3 mt-3">
          <span className="text-gray-600 dark:text-gray-300">Toplam:</span>
          <span className="text-2xl font-bold text-green-600">${bid.amount}</span>
        </div>
      </div>

      {/* Kart Girişi */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          💳 Kart Bilgileri
        </label>
        <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus-within:border-blue-500 transition-colors">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-xs text-gray-500">
          🔒 Kart bilgileriniz Stripe tarafından güvenli şekilde işlenir
        </p>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Butonlar */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          disabled={loading}
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              İşleniyor...
            </>
          ) : (
            <>
              <span>🔒</span>
              ${bid.amount} Öde
            </>
          )}
        </button>
      </div>

      {/* Test Kartları */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          🧪 Test Kartları (Stripe Test Mode):
        </p>
        <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1 font-mono">
          <p>✅ Başarılı: 4242 4242 4242 4242</p>
          <p>❌ Reddedilir: 4000 0000 0000 0002</p>
          <p>⏳ 3D Secure: 4000 0000 0000 3220</p>
          <p className="text-yellow-600 dark:text-yellow-400 mt-2">
            Son kullanma: Gelecek herhangi bir tarih | CVC: Herhangi 3 rakam
          </p>
        </div>
      </div>
    </form>
  );
};

// Stripe Elements Provider ile sarılmış ana component
const StripePaymentModal = ({ isOpen, onClose, project, bid, onPaymentSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Güvenli Ödeme</h2>
              <p className="text-blue-100">Stripe ile güvende</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Elements stripe={stripePromise}>
            <CheckoutForm
              project={project}
              bid={bid}
              onSuccess={onPaymentSuccess}
              onClose={onClose}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;

import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

/**
 * 💳 Wallet Component
 * Gösterir: Bakiye, Para yükleme, İşlem geçmişi
 */
const WalletCard = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingBalance, setFetchingBalance] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setFetchingBalance(true);
      const response = await api.get('/wallet/balance');
      setBalance(response.data.balance || 0);
      // Update user context
      if (user) {
        updateUser({ ...user, balance: response.data.balance });
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error('Failed to load wallet balance');
    } finally {
      setFetchingBalance(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > 10000) {
      toast.error('Maximum deposit is $10,000');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/wallet/deposit', { amount });
      setBalance(response.data.new_balance);
      setDepositAmount('');
      toast.success(`✅ $${amount} successfully added to wallet!`);
      
      // Update user context
      if (user) {
        updateUser({ ...user, balance: response.data.new_balance });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to deposit funds';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 rounded-2xl p-8 text-white mb-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            💳 Wallet Balance
          </h2>
          <p className="text-indigo-100 mt-1">Your account funds</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-indigo-100">Available Balance</p>
          <p className="text-4xl font-bold">
            ${fetchingBalance ? '...' : balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/20 mb-6"></div>

      {/* Deposit Form */}
      <form onSubmit={handleDeposit} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-indigo-100 mb-2">
              Deposit Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lg">$</span>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount (max $10,000)"
                min="1"
                max="10000"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 rounded-lg text-gray-800 dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <p className="text-xs text-indigo-100 mt-1">Min: $1 • Max: $10,000</p>
          </div>
          
          <div className="flex flex-col justify-end">
            <button
              type="submit"
              disabled={loading || !depositAmount}
              className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
            >
              {loading ? '⏳ Adding...' : '➕ Add Funds'}
            </button>
          </div>
        </div>
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
        <p className="text-sm text-indigo-100">
          💡 <strong>Tip:</strong> Add funds to your wallet to pay freelancers. Funds are held securely until both parties confirm project completion.
        </p>
      </div>

      {/* Payment Status */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-white/10 rounded-lg">
          <p className="text-xs text-indigo-100">Status</p>
          <p className="font-bold">✅ Active</p>
        </div>
        <div className="text-center p-3 bg-white/10 rounded-lg">
          <p className="text-xs text-indigo-100">Type</p>
          <p className="font-bold">🔒 Secured</p>
        </div>
        <div className="text-center p-3 bg-white/10 rounded-lg">
          <p className="text-xs text-indigo-100">Escrow</p>
          <p className="font-bold">✅ Enabled</p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;

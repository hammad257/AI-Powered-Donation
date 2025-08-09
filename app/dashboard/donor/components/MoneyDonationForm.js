import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '@/app/services/api';

export default function MoneyDonationForm() {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const { token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !purpose) {
      return toast.error('Amount and purpose are required');
    }

    try {
      await apiRequest(
        '/money/donate',
        'POST',
        { amount, purpose },
        token
      );
      toast.success('Donation submitted successfully');
      setAmount('');
      setPurpose('');
    } catch (err) {
      toast.error(err.message || 'Failed to donate');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-8 rounded-2xl shadow-xl border bg-white w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v8m0-8a4 4 0 110 8 4 4 0 010-8z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800">
          Make a Money Donation
        </h2>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="border border-gray-300 px-4 py-3 rounded-lg w-full text-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Purpose Select */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">
          Purpose
        </label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="border border-gray-300 px-4 py-3 rounded-lg w-full text-lg focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="">Select Purpose</option>
          <option value="Zakat">Zakat</option>
          <option value="Charity">Charity</option>
          <option value="Sadqa">Sadqa</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 px-4 rounded-lg transition duration-200"
      >
        Donate Now
      </button>
    </form>
  );
}

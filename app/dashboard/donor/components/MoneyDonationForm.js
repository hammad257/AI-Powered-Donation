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
      const res = await apiRequest(
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
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow">
      <h2 className="text-lg font-semibold">Make a Donation</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="border px-3 py-2 rounded w-full"
      />

<select
  value={purpose}
  onChange={(e) => setPurpose(e.target.value)}
  className="border px-3 py-2 rounded w-full"
>
  <option value="">Select Purpose</option>
  <option value="Zakat">Zakat</option>
  <option value="Charity">Charity</option>
  <option value="Sadqa">Sadqa</option>
</select>


      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Donate
      </button>
    </form>
  );
}

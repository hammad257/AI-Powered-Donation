// File: app/dashboard/admin/money-donations/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '../../../services/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function ManageAdminMoneyDonations() {
  const { token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchDonations = async () => {
    try {
      const query = new URLSearchParams();
      if (statusFilter) query.append('status', statusFilter);
      if (startDate) query.append('startDate', startDate);
      if (endDate) query.append('endDate', endDate);

      const data = await apiRequest(`/money/all?${query.toString()}`, 'GET', null, token);
      setDonations(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load donations');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/money/status/${id}`, 'PUT', { status }, token);
      toast.success(`Donation ${status}`);
      fetchDonations();
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };


  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">💰 Manage Money Donations</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          {/* <option value="">All Statuses</option> */}
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={fetchDonations}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>

      </div>

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Donor</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Purpose</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation._id} className="text-center">
              <td className="border p-2">{donation.donorName || '—'}</td>
              <td className="border p-2">Rs. {donation.amount}</td>
              <td className="border p-2">{donation.purpose}</td>
              <td
                className={`border p-2 capitalize font-semibold ${
                  donation.status === 'approved'
                    ? 'text-green-600'
                    : donation.status === 'rejected'
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`}
              >
                {donation.status}
              </td>
              <td className="border p-2 text-sm">
                {new Date(donation.createdAt).toLocaleDateString()}
              </td>
              <td className="border p-2 space-x-2">
                {donation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(donation._id, 'approved')}
                      className="text-green-600 underline"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => updateStatus(donation._id, 'rejected')}
                      className="text-red-600 underline"
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

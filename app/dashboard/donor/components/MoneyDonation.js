'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../services/api';

export default function MyMoneyDonations() {
  const { token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const itemsPerPage = 6;

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

  useEffect(() => {
    fetchDonations();
  }, []);

  // Search filter
  const filteredDonations = donations.filter(
    (donation) =>
      donation.amount?.toString().includes(search) ||
      donation.purpose?.toLowerCase().includes(search.toLowerCase()) ||
      donation.status?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  return (
    <div className="p-4">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">💰 My Money Donations</h1>

        <input
          type="text"
          placeholder="Search by amount, purpose, or status..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
        />
      </div>

      {/* Donations List */}
      {currentItems.length === 0 ? (
        <p className="text-gray-600">No donations found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((donation) => (
            <div
              key={donation._id}
              className="border border-gray-200 rounded-lg shadow-md bg-white p-4 transition hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                Amount: {donation.amount}
              </h2>
              <p className="text-sm text-gray-600 mb-2 truncate">
                Purpose: {donation.purpose}
              </p>

              <p className="flex items-center gap-2 mb-1">
                <strong>Status:</strong>
                <span
                  className={`capitalize ${
                    donation.status === 'approved'
                      ? 'text-green-600 font-semibold'
                      : donation.status === 'rejected'
                      ? 'text-red-600 font-semibold'
                      : 'text-gray-800'
                  }`}
                >
                  {donation.status}
                  {donation.status === 'approved' && (
                    <span className="ml-1 text-green-600">✔</span>
                  )}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

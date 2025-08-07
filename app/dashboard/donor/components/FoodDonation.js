'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../services/api';
import ChatBox from '../../shared/ChatBox';

export default function MyFoodDonations() {
  const { token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchDonations = async () => {
    try {
      const data = await apiRequest('food/donor/my-donations', 'GET', null, token);
      setDonations(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load donations');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Filter by search text
  let filteredDonations = donations.filter(
    (donation) =>
      donation.foodType.toLowerCase().includes(search.toLowerCase()) ||
      donation.description?.toLowerCase().includes(search.toLowerCase()) ||
      donation.location?.toLowerCase().includes(search.toLowerCase()) ||
      donation.status?.toLowerCase().includes(search.toLowerCase())
  );

  // Apply status filter
  if (statusFilter !== 'All') {
    filteredDonations = filteredDonations.filter(
      (donation) => donation.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  return (
    <div className="p-4">
      {/* Header with Search + Status Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">🍱 My Food Donations</h1>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by food type, status, or location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page on search
            }}
            className="border px-3 py-2 rounded w-full md:w-72 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // reset page on filter change
            }}
            className="border px-3 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="picked">Picked</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
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
              <h2 className="text-lg font-semibold text-gray-800 truncate max-w-[200px]" title={donation.foodType}>
  {donation.foodType}
</h2>

              <p className="text-sm text-gray-600 mb-2">{donation.description}</p>

              <p className="flex items-center gap-2 mb-1">
                <strong>Status:</strong>
                <span
                  className={`capitalize ${
                    donation.status === 'picked'
                      ? 'text-green-600 font-semibold'
                      : donation.status === 'delivered'
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-800'
                  }`}
                >
                  {donation.status}
                  {donation.status === 'picked' && (
                    <span className="ml-1 text-green-600">✔</span>
                  )}
                </span>
              </p>

              <p className="mb-3">
                <strong>Location:</strong> {donation.location}
              </p>

              {/* Chat Box for picked donations */}
              {donation.status === 'picked' && (
                <ChatBox receiverId={donation.pickedBy} donationId={donation._id} />
              )}
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

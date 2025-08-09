'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../services/api';
import ChatBox from '../../shared/ChatBox';

export default function MyFoodDonations({ onEdit }) {
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

  const deleteDonation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    try {
      await apiRequest(`food/${id}`, 'DELETE', null, token);
      toast.success('Donation deleted successfully');
      setDonations((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete donation');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Filter by search text
  let filteredDonations = donations.filter(
    (donation) =>
      donation.foodType.toLowerCase().includes(search.toLowerCase()) ||
      donation.foodDescription?.toLowerCase().includes(search.toLowerCase()) ||
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

  const StatusMessageCard = ({ type, donation }) => {
    if (type === "delivered") {
      return (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center text-center shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-blue-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-blue-700 font-medium">
            This donation has been delivered. Thank you for your generosity! 💙
          </p>
        </div>
      );
    }

    if (type === "pending") {
      return (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col items-center text-center shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-yellow-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-yellow-700 font-medium">
            Your donation is pending — waiting for a volunteer to accept it. 🕒
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(donation)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => deleteDonation(donation._id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      );
    }

    if (type === "picked") {
      return (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex flex-col items-center text-center shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A2 2 0 0122 9.618v4.764a2 2 0 01-2.447 1.894L15 14" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h8m0 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0v2a2 2 0 002 2h4a2 2 0 002-2V6" />
          </svg>
          <p className="text-green-700 font-medium mb-4">
            Your request has been accepted by a volunteer! You can now chat with them below.
          </p>
          <div className="w-full">
            <ChatBox receiverId={donation.pickedBy} donationId={donation._id} />
          </div>
         
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">🍱 My Food Donations</h1>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by food type, status, or location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded w-full md:w-72 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
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
              className="border border-gray-200 rounded-lg shadow-md bg-white p-4 transition hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <h2
                  className="text-lg font-semibold text-gray-800 truncate max-w-[200px]"
                  title={donation.foodType}
                >
                  {donation.foodType}
                </h2>

                <p className="text-sm text-gray-600 mb-2">{donation.foodDescription || 'N/A'}</p>
                <p className="flex items-center gap-2 mb-1">
                  <strong>Status:</strong>
                  <span
                    className={`capitalize font-semibold ${
                      donation.status === 'picked'
                        ? 'text-green-600'
                        : donation.status === 'delivered'
                        ? 'text-blue-600'
                        : donation.status === 'pending'
                        ? 'text-yellow-600'
                        : 'text-gray-800'
                    }`}
                  >
                    {donation.status}
                  </span>
                </p>
                <p className="mb-3 truncate max-w-[200px]">
                  <strong>Location:</strong> {donation.location}
                </p>

                {/* Status Message Card */}
                <StatusMessageCard type={donation.status} donation={donation} />
              </div>
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

'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../services/api';
import ChatBox from '../../shared/ChatBox';
import DonationMiniMap from './DonationMiniMap';

export default function MyPickups() {
  const { token } = useSelector((state) => state.auth);
  const [pickups, setPickups] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchMyPickups = async () => {
    try {
      const data = await apiRequest('/volunteer/food/my-pickups', 'GET', null, token);
      setPickups(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load your pickups');
    }
  };

  const markAsDelivered = async (donationId) => {
    try {
      await apiRequest(`/volunteer/food/delivered/${donationId}`, 'POST', {}, token);
      toast.success('Marked as delivered');
      fetchMyPickups();
    } catch (err) {
      toast.error(err.message || 'Failed to mark as delivered');
    }
  };

  useEffect(() => {
    fetchMyPickups();
  }, []);

  // Filter pickups by search and status
  const filteredPickups = pickups.filter((pickup) => {
    const matchesSearch =
      pickup.foodType?.toLowerCase().includes(search.toLowerCase()) ||
      pickup.description?.toLowerCase().includes(search.toLowerCase()) ||
      pickup.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pickup.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPickups.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPickups.length / itemsPerPage);

  return (
    <div className="p-4">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">📋 My Accepted Pickups</h1>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by food, location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="picked">Picked</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Pickups List */}
      {currentItems.length === 0 ? (
        <p className="text-gray-600">No accepted pickups found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((pickup) => (
            <div
              key={pickup._id}
              className="border border-gray-200 rounded-lg shadow-md bg-white p-4 transition hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {pickup.foodType}
              </h2>
              <p className="text-sm text-gray-600 mb-2 truncate">{pickup.description}</p>
              <p className="text-sm"><strong>Location:</strong> {pickup.location}</p>
              <p className="text-sm">
                <strong>Status:</strong>{' '}
                <span
                  className={`font-semibold ${
                    pickup.status === 'delivered'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {pickup.status}
                </span>
              </p>
              <p className="text-sm">
                <strong>Accepted At:</strong>{' '}
                {new Date(pickup.acceptedAt || pickup.updatedAt).toLocaleString()}
              </p>

              <DonationMiniMap donation={pickup} />

              {pickup.status !== 'delivered' && (
                <button
                  onClick={() => markAsDelivered(pickup._id)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Mark as Delivered
                </button>
              )}

              {pickup.status === 'picked' && (
                <div className="mt-4">
                  <ChatBox receiverId={pickup.pickedBy} donationId={pickup._id} />
                </div>
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

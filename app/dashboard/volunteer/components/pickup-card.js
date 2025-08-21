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
  const [dropoffCenter, setDropoffCenter] = useState(null)
  const itemsPerPage = 6;

  // Store which pickups have map toggled open (by _id)
  const [mapToggle, setMapToggle] = useState({});

  const fetchMyPickups = async () => {
    try {
      const data = await apiRequest('/volunteer/food/my-pickups', 'GET', null, token);
      setPickups(data); // keep all pickups including delivered
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
    const savedDropoff = localStorage.getItem("selectedDropoff");
    if (savedDropoff) {
      setDropoffCenter(JSON.parse(savedDropoff));
    }
    fetchMyPickups();
  }, []);

  const filteredPickups = pickups.filter((pickup) => {
    const matchesSearch =
      pickup.foodType?.toLowerCase().includes(search.toLowerCase()) ||
      pickup.description?.toLowerCase().includes(search.toLowerCase()) ||
      pickup.location?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || pickup.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPickups.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPickups.length / itemsPerPage);

  // Toggle map visibility for a pickup
  const toggleMap = (id) => {
    setMapToggle((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="p-4">

{dropoffCenter && (
  <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl mb-6 shadow-md">
    <h2 className="text-lg font-bold">🏢 Selected Dropoff Center</h2>
    <p className="mt-2"><strong>{dropoffCenter.ngoName}</strong></p>

    <div className="flex items-center gap-2 mt-1">
      <span className="font-medium text-gray-700">📍 {dropoffCenter.locationName}</span>
      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
        ⚠️ Use this location for dropping the food
      </span>
    </div>

    <p className="text-sm text-gray-600 mt-2">
      Added: {new Date(dropoffCenter.createdAt).toLocaleDateString()}
    </p>

    {/* Buttons */}
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => setMapToggle((prev) => ({ ...prev, dropoff: true }))}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Use Map
      </button>
      <button
        onClick={() => setMapToggle((prev) => ({ ...prev, dropoff: false }))}
        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
      >
        Back
      </button>
    </div>

    {/* Conditionally render map to Dropoff */}
    {mapToggle.dropoff && (
      <div className="h-64 mt-3">
        <DonationMiniMap
          donation={{
            lat: dropoffCenter.coordinates.lat,
            lng: dropoffCenter.coordinates.lng,
            foodType: dropoffCenter.ngoName,
            location: dropoffCenter.locationName,
            quantity: "Dropoff Center"
          }}
        />
      </div>
    )}
  </div>
)}




      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">🚚 My Accepted Pickups</h1>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by food, location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="picked">Picked</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Pickups List */}
      {currentItems.length === 0 ? (
        <p className="text-gray-500 italic">No available pickups found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((pickup) => (
            <div
              key={pickup._id}
              className="border border-gray-200 rounded-lg shadow-md bg-white p-4 transition hover:shadow-lg flex flex-col justify-between"
              style={{ minHeight: '350px' }}
            >
              {pickup.status?.toLowerCase().trim() === 'delivered' ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center p-6 bg-green-50 border border-green-200 rounded-lg shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-green-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-lg font-semibold text-green-700">
                    This pickup has been delivered
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {pickup.foodType}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2 truncate">
                      {pickup.description}
                    </p>
                    <p className="text-sm">
                      <strong>Location:</strong> {pickup.location}
                    </p>
                    <p className="text-sm">
                      <strong>Status:</strong>{' '}
                      <span
                        className={`font-semibold ${pickup.status === 'delivered'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                          }`}
                      >
                        {pickup.status}
                      </span>
                    </p>
                    <p className="text-sm">
                      <strong>Accepted At:</strong>{' '}
                      {new Date(
                        pickup.acceptedAt || pickup.updatedAt
                      ).toLocaleString()}
                    </p>

                    {/* Toggle Map Button */}
                    <button
                      type="button"
                      onClick={() => toggleMap(pickup._id)}
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors my-4
    ${mapToggle[pickup._id]
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }
  `}
                    >
                      {mapToggle[pickup._id] ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Hide Map
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          Show Map
                        </>
                      )}
                    </button>


                    {/* Conditionally render map */}
                    {mapToggle[pickup._id] && (
                      <div className="h-48 w-full mb-3">
                        <DonationMiniMap donation={pickup} />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => markAsDelivered(pickup._id)}
                    className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Mark as Delivered
                  </button>

                  {pickup.status === 'picked' && (
                    <div className="mt-11 p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-md border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.83L3 20l1.27-3.81A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <h2 className="text-lg font-semibold text-green-800">
                          Chat with Food Donor
                        </h2>
                      </div>
                      <p className="text-sm text-green-700 mb-4">
                        Coordinate with the donor to arrange pickup for the food items.
                      </p>
                      <ChatBox receiverId={pickup.pickedBy} donationId={pickup._id} />
                    </div>
                  )}
                </>
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
              className={`px-3 py-1 rounded border ${currentPage === i + 1
                  ? 'bg-green-500 text-white'
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

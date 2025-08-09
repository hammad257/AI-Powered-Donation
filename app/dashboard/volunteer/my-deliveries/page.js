'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../../services/api';
import { toast } from 'react-toastify';

export default function MyDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await apiRequest(
          '/volunteer/volunteer/my-deliveries',
          'GET',
          null,
          token
        );
        setDeliveries(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load deliveries');
      }
    };
    fetchDeliveries();
  }, [token]);

  const filteredDeliveries = deliveries.filter((d) =>
    `${d.foodType} ${d.donor?.name} ${d.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);

  return (
    <div className="p-4 bg-white">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-extrabold text-green-700">🚚 My Delivered Pickups</h1>

        <input
          type="text"
          placeholder="Search by food, donor, location..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-green-300 px-3 py-2 rounded shadow-sm focus:ring-2 focus:ring-green-500 outline-none max-w-xs"
        />
      </div>

      {/* Deliveries List */}
      {currentItems.length === 0 ? (
        <p className="text-gray-600 italic">No deliveries yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((d) => (
            <div
              key={d._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-green-200 flex flex-col min-h-[240px]"
            >
              <h2 className="text-xl font-semibold text-green-900 truncate mb-2">
                {d.foodType}
              </h2>
              <p className="text-sm mb-1">
                <strong className="text-green-600">Donor:</strong> {d.donor?.name || 'N/A'}
              </p>
              <p className="text-sm mb-1">
                <strong className="text-green-600">Location:</strong> {d.location}
              </p>
              <p className="text-sm mb-1">
                <strong className="text-green-600">Delivered At:</strong>{' '}
                {new Date(d.deliveryTime).toLocaleString()}
              </p>
              {d.deliveryDuration && (
                <p className="text-sm mt-auto">
                  <strong className="text-green-500">Delivery Duration:</strong> {d.deliveryDuration} minutes
                </p>
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
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-green-700 hover:bg-green-100'
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

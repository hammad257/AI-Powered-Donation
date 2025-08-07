'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '@/app/services/api';

const ITEMS_PER_PAGE = 10;

export default function AdminDeliveredPickups() {
  const { token } = useSelector((state) => state.auth);
  const [deliveries, setDeliveries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('/admin/food/delivered', 'GET', null, token);
        // Sort latest first
        const sorted = [...data].sort((a, b) => new Date(b.deliveryTime) - new Date(a.deliveryTime));
        setDeliveries(sorted);
      } catch (err) {
        toast.error(err.message || 'Failed to load delivered pickups');
      }
    };

    fetchData();
  }, [token]);

  const totalPages = Math.ceil(deliveries.length / ITEMS_PER_PAGE);
  const paginatedDeliveries = deliveries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Delivered Food Pickups</h1>

      {deliveries.length === 0 ? (
        <p className="text-gray-500">No delivered food donations yet.</p>
      ) : (
        <>
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Food Type</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Donor</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Volunteer</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left px-4 py-2 text-sm font-medium text-gray-600">Delivered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedDeliveries.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{item.foodType}</td>
                  <td className="px-4 py-2">
                    {item.donor?.name || '-'}
                    <div className="text-xs text-gray-500">{item.donor?.email || '-'}</div>
                  </td>
                  <td className="px-4 py-2">
                    {item.pickedBy?.name}
                    <div className="text-xs text-gray-500">{item.pickedBy?.email || '-'}</div>
                  </td>
                  <td className="px-4 py-2">{item.location || '-'}</td>
                  <td className="px-4 py-2">{new Date(item.deliveryTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

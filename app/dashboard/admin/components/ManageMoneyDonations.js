'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '../../../services/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ITEMS_PER_PAGE = 10;

export default function ManageAdminMoneyDonations() {
  const { token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
   const { t } = useTranslation();

  const fetchDonations = async () => {
    try {
      const query = new URLSearchParams();
      if (statusFilter) query.append('status', statusFilter);

      const data = await apiRequest(`/money/all?${query.toString()}`, 'GET', null, token);
      setDonations(data);
      setCurrentPage(1);
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
  }, [statusFilter]);

  useEffect(() => {
    const filtered = donations.filter((donation) => {
      const term = searchTerm.toLowerCase();
      return (
        donation?.donorName?.toLowerCase().includes(term) ||
        donation?.purpose?.toLowerCase().includes(term)
      );
    });
    setFilteredDonations(filtered);
  }, [donations, searchTerm]);

  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4">

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          type="text"
          placeholder="Search by donor or purpose"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded shadow-sm w-64 focus:outline-none focus:ring focus:border-blue-300"
        />

        {/* <button
          onClick={fetchDonations}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Refresh
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full table-auto bg-white">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
 <th className="text-left p-3">{t("donations.table.donor")}</th>
              <th className="text-left p-3">{t("donations.table.amount")}</th>
              <th className="text-left p-3">{t("donations.table.purpose")}</th>
              <th className="text-left p-3">{t("donations.table.status")}</th>
              <th className="text-left p-3">{t("donations.table.date")}</th>
              <th className="text-left p-3">{t("donations.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDonations.map((donation) => (
              <tr
                key={donation._id}
                className="border-t hover:bg-gray-50 transition text-sm"
              >
                <td className="p-3">{donation?.donatedBy?.name || '—'}</td>
                <td className="p-3">Rs. {donation.amount}</td>
                <td className="p-3">{donation.purpose}</td>
                <td
                  className={`p-3 capitalize font-semibold ${
                    donation.status === 'approved'
                      ? 'text-green-600'
                      : donation.status === 'rejected'
                      ? 'text-red-500'
                      : 'text-yellow-500'
                  }`}
                >
                  {donation.status}
                </td>
                <td className="p-3 text-sm">
                  {new Date(donation.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 space-x-2">
                  {donation.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(donation._id, 'approved')}
                        className="text-green-600 hover:underline"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(donation._id, 'rejected')}
                        className="text-red-600 hover:underline"
                      >
                         Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {paginatedDonations.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

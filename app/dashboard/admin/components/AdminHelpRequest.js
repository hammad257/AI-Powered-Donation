'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../../services/api';
import { toast } from 'react-toastify';
import StatusModal from '../../../components/StatusModal';
import * as XLSX from 'xlsx';

const statuses = ['all', 'pending', 'under_review', 'approved', 'rejected'];

export default function AdminHelpRequests() {
  const { token } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [nextStatus, setNextStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('/admin/needy', 'GET', null, token);
        setRequests(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load requests');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = [...requests];

    if (selectedStatus !== 'all') {
      filteredData = filteredData.filter((r) => r.status === selectedStatus);
    }

    if (searchName.trim() !== '') {
      filteredData = filteredData.filter((r) =>
        r.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchDate) {
      filteredData = filteredData.filter((r) =>
        new Date(r.createdAt).toISOString().startsWith(searchDate)
      );
    }

    setFiltered(filteredData);
    setCurrentPage(1);
  }, [selectedStatus, searchName, searchDate, requests]);

  const handleAction = (req, status) => {
    setSelectedRequest(req);
    setNextStatus(status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (notes) => {
    try {
      await apiRequest(
        `/admin/needy/status/${selectedRequest._id}`,
        'PUT',
        { status: nextStatus, adminNotes: notes },
        token
      );
      toast.success(`Request ${nextStatus}`);
      setSelectedRequest(null);
      setIsModalOpen(false);
      const data = await apiRequest('/admin/needy', 'GET', null, token);
      setRequests(data);
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  const exportToExcel = () => {
    const rows = filtered.map((req) => ({
      Name: req.name,
      Reason: req.reason,
      Status: req.status,
      'Admin Notes': req.adminNotes || '',
      'Submitted At': new Date(req.createdAt).toLocaleString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Requests');
    XLSX.writeFile(workbook, 'needy_requests.xlsx');
  };

  const renderActions = (req) => {
    const actions = [];

    if (req.status !== 'under_review') {
      actions.push(
        <button
          key="review"
          onClick={() => handleAction(req, 'under_review')}
          className="text-yellow-600 hover:underline"
        >
          🔎 Under Review
        </button>
      );
    }

    if (req.status !== 'approved') {
      actions.push(
        <button
          key="approve"
          onClick={() => handleAction(req, 'approved')}
          className="text-green-600 hover:underline"
        >
          ✅ Approve
        </button>
      );
    }

    if (req.status !== 'rejected') {
      actions.push(
        <button
          key="reject"
          onClick={() => handleAction(req, 'rejected')}
          className="text-red-600 hover:underline"
        >
          ❌ Reject
        </button>
      );
    }

    return <div className="space-y-1">{actions}</div>;
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-4">
      <StatusModal
        isOpen={isModalOpen}
        status={nextStatus}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <div className="mb-4 flex flex-col md:flex-row justify-between gap-2">
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border px-3 py-1 rounded w-48"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ⬇️ Export to Excel
        </button>
      </div>

      <div className="bg-white border shadow rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Reason</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Admin Notes</th>
              <th className="p-3 border">Docs</th>
              <th className="p-3 border">Submitted</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((req) => (
              <tr key={req._id} className="text-center">
                <td className="p-2 border">{req.name}</td>
                <td className="p-2 border">{req.reason}</td>
                <td
                  className={`p-2 border capitalize font-semibold ${
                    req.status === 'pending'
                      ? 'text-yellow-500'
                      : req.status === 'under_review'
                      ? 'text-blue-500'
                      : req.status === 'approved'
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  {req.status}
                </td>
                <td className="p-2 border">{req.adminNotes || '—'}</td>
                <td className="p-2 border">
                  <div className="flex gap-2 flex-wrap justify-center">
                    {req.documents?.map((doc, i) => (
                      <a key={i} href={doc} target="_blank" rel="noopener noreferrer">
                        <img
                          src={doc}
                          alt={`doc-${i}`}
                          className="w-12 h-12 object-cover border rounded"
                        />
                      </a>
                    ))}
                  </div>
                </td>
                <td className="p-2 border text-xs">
                  {new Date(req.createdAt).toLocaleString()}
                </td>
                <td className="p-2 border">{renderActions(req)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 border rounded ${
                num === currentPage ? 'bg-gray-200 font-bold' : ''
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

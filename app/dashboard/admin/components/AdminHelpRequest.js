'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../../services/api';
import { toast } from 'react-toastify';
import StatusModal from '../../../components/StatusModal';

export default function AdminHelpRequests() {
  const { token } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [nextStatus, setNextStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const data = await apiRequest('/admin/needy', 'GET', null, token);
      setRequests(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load requests');
    }
  };

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
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderActions = (req) => {
    const status = req.status;

    const buttons = [];

    if (status !== 'under_review') {
      buttons.push(
        <button
          key="under_review"
          onClick={() => handleAction(req, 'under_review')}
          className="text-yellow-600 hover:underline block"
        >
          🔎 Under Review
        </button>
      );
    }

    if (status !== 'approved') {
      buttons.push(
        <button
          key="approved"
          onClick={() => handleAction(req, 'approved')}
          className="text-green-600 hover:underline block"
        >
          ✅ Approve
        </button>
      );
    }

    if (status !== 'rejected') {
      buttons.push(
        <button
          key="rejected"
          onClick={() => handleAction(req, 'rejected')}
          className="text-red-600 hover:underline block"
        >
          ❌ Reject
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="overflow-x-auto">
      <StatusModal
        isOpen={isModalOpen}
        status={nextStatus}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Admin Notes</th>
            <th className="p-2 border">Docs</th>
            <th className="p-2 border">Submitted</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id} className="text-center">
              <td className="p-2 border">{req.name}</td>
              <td className="p-2 border">{req.reason}</td>
              <td
                className={`p-2 border capitalize ${
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
              <td className="p-2 border text-sm">{req.adminNotes || '—'}</td>
              <td className="p-2 border">
  <div className="flex gap-2 flex-wrap justify-center">
    {req.documents?.map((doc, i) => (
      <a key={i} href={doc} target="_blank" rel="noopener noreferrer">
        <img
          src={doc}
          alt={`doc-${i}`}
          className="w-16 h-16 object-cover border rounded shadow"
        />
      </a>
    ))}
  </div>
</td>

              <td className="p-2 border text-sm">
                {new Date(req.createdAt).toLocaleString()}
              </td>
              <td className="p-2 border space-y-1">{renderActions(req)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

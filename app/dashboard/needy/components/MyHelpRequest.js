'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../../services/api';
import { toast } from 'react-toastify';

export default function MyHelpRequests() {
  const [request, setRequest] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const data = await apiRequest('/needy/my-request', 'GET', null, token, false);
        setRequest(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load request');
      }
    };

    if (token) fetchRequest();
  }, [token]);

  if (!request) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">My Help Requests</h2>
        <p>Loading or no request submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Help Request</h2>

      {/* Responsive scroll container */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Admin Notes</th>
              <th className="p-3">Documents</th>
              <th className="p-3">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t text-sm text-gray-700">
              <td className="p-3">{request.reason}</td>
              <td className="p-3 capitalize font-medium">{request.status}</td>
              <td className="p-3 text-gray-600">{request.adminNotes || '—'}</td>
              <td className="p-3">
                {request.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline truncate max-w-[150px]"
                  >
                    {doc.split('/').pop()}
                  </a>
                ))}
              </td>
              <td className="p-3 whitespace-nowrap">
                {new Date(request.submittedAt || request.createdAt).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

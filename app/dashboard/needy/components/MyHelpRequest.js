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

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Admin Notes</th>
            <th className="p-2 border">Documents</th>
            <th className="p-2 border">Submitted At</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="p-2 border">{request.reason}</td>
            <td className="p-2 border capitalize">
              {request.status}
              </td>
            <td className="p-2 border text-sm text-gray-600">{request.adminNotes || '—'}</td>
            <td className="p-2 border">
              {request.documents.map((doc, i) => (
                <a
                  key={i}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 underline text-sm"
                >
                  {doc.split('/').pop()}
                </a>
              ))}
            </td>
            <td className="p-2 border text-sm">
              {new Date(request.submittedAt || request.createdAt).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

'use client';

import ProtectedRoute from '../../../components/ProtectedRoute';
import AdminHelpRequests from '../components/AdminHelpRequest';

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Needy Request</h1>
        <AdminHelpRequests />
      </div>
    </ProtectedRoute>
  );
}

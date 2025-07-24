'use client';
import LogoutButton from '../../components/LogoutButton';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DonorDashboard() {
  return (
    <ProtectedRoute allowedRoles={['donor']}>
      <div className="p-4">
        <h1 className="text-xl font-bold">🎁 Donor Dashboard</h1>
      </div>
    </ProtectedRoute>
  );
}

'use client';
import LogoutButton from '../../components/LogoutButton';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function VolunteerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['volunteer']}>
      <div className="p-4">
        <h1 className="text-xl font-bold">🎁 Voluntter Dashboard</h1>
      </div>
    </ProtectedRoute>
  );
}

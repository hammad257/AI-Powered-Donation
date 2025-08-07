'use client';
import LogoutButton from '../../components/LogoutButton';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function VolunteerDashboard() {
  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="text-xl font-bold">Needy Dashboard</h1>
      </div>
    </ProtectedRoute>
  );
}

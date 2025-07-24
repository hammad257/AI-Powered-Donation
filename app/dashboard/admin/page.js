'use client';

import ProtectedRoute from "../../components/ProtectedRoute";

export default function AdminDashboardPage() {
  return (
     <ProtectedRoute allowedRoles={['admin']}>
    <div>
      <h1 className="text-2xl font-bold mb-4">📊 Admin Dashboard</h1>
      <p>Here you can view stats about users, requests, and more.</p>
      {/* Later: Add charts and stat boxes */}
    </div>
    </ProtectedRoute>
  );
}

'use client';

import ProtectedRoute from "../../../components/ProtectedRoute";


export default function ManageUsersPage() {
  return (
     <ProtectedRoute allowedRoles={['admin']}>
    <div>
      <h1 className="text-2xl font-bold mb-4">👥 Manage Users</h1>
      <p>This is where you’ll list all users and allow actions like delete or update.</p>
    </div>
    </ProtectedRoute >
  );
}

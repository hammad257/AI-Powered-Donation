'use client';

import ProtectedRoute from '../../../components/ProtectedRoute';
import MyPickups from '../components/pickup-card';


export default function MyPickupPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="p-4">
        <h1 className="text-xl font-bold">🎁 My Pickups</h1>
        <MyPickups />
      </div>
    </ProtectedRoute>
  );
}

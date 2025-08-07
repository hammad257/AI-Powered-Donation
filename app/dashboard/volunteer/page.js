'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LogoutButton from '../../components/LogoutButton';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiRequest } from '../../services/api';
import { toast } from 'react-toastify';

export default function VolunteerDashboard() {
  const { token } = useSelector((state) => state.auth);
  const [availablePickups, setAvailablePickups] = useState(0);
  const [myPickups, setMyPickups] = useState(0);
  const [myDeliveries, setMyDeliveries] = useState(0);

  // Fetch All Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const available = await apiRequest('/volunteer/food/available', 'GET', null, token);
        const pickups = await apiRequest('/volunteer/food/my-pickups', 'GET', null, token);
        const deliveries = await apiRequest('/volunteer/volunteer/my-deliveries', 'GET', null, token);

        setAvailablePickups(available.length || 0);
        setMyPickups(pickups.length || 0);
        setMyDeliveries(deliveries.length || 0);
      } catch (err) {
        toast.error(err.message || 'Failed to load dashboard stats');
      }
    };

    fetchStats();
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={['volunteer']}>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Available Pickups" value={availablePickups} color="bg-green-500" icon="📦" />
          <StatCard label="My Pickups" value={myPickups} color="bg-blue-500" icon="🛻" />
          <StatCard label="My Deliveries" value={myDeliveries} color="bg-purple-500" icon="🚚" />
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Reusable Stat Card Component
function StatCard({ label, value, color, icon }) {
  return (
    <div className={`p-5 rounded-xl shadow-md text-white ${color} flex flex-col items-center justify-center`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-lg font-semibold">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

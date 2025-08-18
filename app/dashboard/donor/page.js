'use client';
import { useSelector } from 'react-redux';
import LogoutButton from '../../components/LogoutButton';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiRequest } from '@/app/services/api';

export default function DonorDashboard() {

  const { token } = useSelector((state) => state.auth);
  const [availablePickups, setAvailablePickups] = useState(0);
  const [money, setMoney] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');

  // Fetch All Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const query = new URLSearchParams();
        if (statusFilter) query.append('status', statusFilter);

        const donationData = await apiRequest('food/donor/my-donations', 'GET', null, token);
        const moneyData = await apiRequest(`/money/all?${query.toString()}`, 'GET', null, token);
        setAvailablePickups(donationData.length || 0);
        setMoney(moneyData.length || 0);
      } catch (err) {
        toast.error(err.message || 'Failed to load dashboard stats');
      }
    };

    fetchStats();
  }, [token]);


  return (
    <ProtectedRoute allowedRoles={['donor']}>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Donor Dashboard</h1>
          {/* <LogoutButton /> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Food Donation" value={availablePickups} color="bg-green-500" icon="📦" />
          <StatCard label="Money Donation" value={money} color="bg-blue-500" icon="🛻" />
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

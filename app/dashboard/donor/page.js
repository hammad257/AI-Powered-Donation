'use client';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiRequest } from '@/app/services/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function DonorDashboard() {
  const { token } = useSelector((state) => state.auth);
  const [availablePickups, setAvailablePickups] = useState(0);
  const [money, setMoney] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');
  const router = useRouter();

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
      <div className="p-6 space-y-12">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Overview</h1>
        </div>

          {/* Section 4: Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatCard label="Food Donations" value={availablePickups} color="bg-green-500" icon="🍱" />
          <StatCard label="Money Donations" value={money} color="bg-blue-500" icon="💰" />
        </div>

        {/* Section 1: Food Donor & Money Donor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border rounded-2xl shadow-md flex flex-col items-center text-center">
            <Image src="/food-donate.jpg" alt="Food Donor" width={200} height={150} />
            <h2 className="mt-4 text-xl font-semibold">Food Donor</h2>
            <p className="mt-2 text-gray-600">
              Donate leftover or extra food to help those in need. Volunteers will pick it up and deliver it safely.
            </p>
          </div>

          <div className="p-6 border rounded-2xl shadow-md flex flex-col items-center text-center">
            <Image src="/money donate.jpg" alt="Money Donor" width={200} height={150} />
            <h2 className="mt-4 text-xl font-semibold">Money Donor</h2>
            <p className="mt-2 text-gray-600">
              Support needy individuals by donating money. Admins will review and distribute funds fairly.
            </p>
          </div>
        </div>

        {/* Section 2: How It Works */}
        <div className="p-6 bg-gray-50 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <StepCard step="1" text="Choose whether to donate food or money" />
            <StepCard step="2" text="Fill out the donation form" />
            <StepCard step="3" text="Our team verifies and distributes your donation" />
          </div>
        </div>

        {/* Section 3: Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={() => router.push('/dashboard/donor/food-donation')}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow hover:bg-green-600"
          >
            Donate Food
          </button>
          <button
            onClick={() => router.push('/dashboard/donor/money-donation')}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow hover:bg-blue-600"
          >
            Donate Money
          </button>
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

// Step Card Component
function StepCard({ step, text }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-bold">
        {step}
      </div>
      <p className="mt-3 text-gray-700">{text}</p>
    </div>
  );
}

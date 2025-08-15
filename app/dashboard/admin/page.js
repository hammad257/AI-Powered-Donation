'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { apiRequest } from '@/app/services/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function AdminDashboardPage() {
  const { token } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({});
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, graph] = await Promise.all([
          apiRequest('/admin/dashboard/stats', 'GET', null, token),
          apiRequest('/admin/dashboard/graph', 'GET', null, token),
        ]);

        setStats(statsRes);

        // ---- Transform API -> chart array ----
        const toMap = (arr = []) => {
          const m = new Map();
          arr.forEach((it) => {
            const day = it?._id?.day || it?.day || it?._id?.date || it?.date;
            if (day) m.set(day, (m.get(day) || 0) + (it.total || 0));
          });
          return m;
        };

        const donationsMap = toMap(graph?.dailyDonations);
        const deliveriesMap = toMap(graph?.dailyDeliveries);

        const days = Array.from(new Set([...donationsMap.keys(), ...deliveriesMap.keys()])).sort();

        const merged = days.map((day) => ({
          name: day,
          donations: donationsMap.get(day) || 0,
          deliveries: deliveriesMap.get(day) || 0,
        }));

        setGraphData(merged);
      } catch (err) {
        toast.error(err.message || 'Failed to load dashboard data');
      }
    };

    fetchData();
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value={stats?.users?.total || 'Loading...'} />
          <StatCard title="Total Donations" value={stats?.users?.donors || 'Loading...'} />
          <StatCard title="Volunteers" value={stats?.users?.volunteers || 'Loading...'} />
          
          {/* Delivered Orders with total */}
          <StatCard 
            title="Delivered Orders" 
            value={stats?.donations?.delivered || 'Loading...'} 
            subtitle={`Total: ${stats?.donations?.total || 0}`} 
          />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Daily Activity</h2>
          <div className="h-80">
            {graphData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                No activity yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="donations" fill="#10b981" name="Donations" />
                  <Bar dataKey="deliveries" fill="#3b82f6" name="Deliveries" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all duration-200">
      <h3 className="text-md font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-green-600">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// 📊 Mock data for chart
const chartData = [
  { name: 'Jan', donations: 30, deliveries: 20 },
  { name: 'Feb', donations: 50, deliveries: 35 },
  { name: 'Mar', donations: 45, deliveries: 40 },
  { name: 'Apr', donations: 60, deliveries: 50 },
  { name: 'May', donations: 80, deliveries: 70 },
  { name: 'Jun', donations: 75, deliveries: 65 },
];

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value="128" />
          <StatCard title="Total Donations" value="320" />
          <StatCard title="Volunteers" value="45" />
          <StatCard title="Delivered Orders" value="280" />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 Monthly Activity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="donations" fill="#10b981" name="Donations" />
                <Bar dataKey="deliveries" fill="#3b82f6" name="Deliveries" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all duration-200">
      <h3 className="text-md font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold text-green-600">{value}</p>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../../components/ProtectedRoute';
import { apiRequest } from '../../services/api';
import { toast } from 'react-toastify';
import Link from 'next/link';

// Recharts imports
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function VolunteerDashboard() {
  const { token } = useSelector((state) => state.auth);

  const [availablePickups, setAvailablePickups] = useState(0);
  const [myPickups, setMyPickups] = useState(0);
  const [myDeliveries, setMyDeliveries] = useState(0);

  const [dropoffss, setDropoffs] = useState([]);
  const [selectedDropoff, setSelectedDropoff] = useState(null);

  // ✅ Only ONE useEffect
  useEffect(() => {
    // 1. Load from localStorage
    const saved = localStorage.getItem("selectedDropoff");
    if (saved) {
      try {
        setSelectedDropoff(JSON.parse(saved));
      } catch {
        console.error("Invalid JSON in localStorage");
      }
    }

    // 2. Fetch stats
    const fetchStats = async () => {
      try {
        const available = await apiRequest('/volunteer/food/available', 'GET', null, token);
        const pickups = await apiRequest('/volunteer/food/my-pickups', 'GET', null, token);
        const deliveries = await apiRequest('/volunteer/volunteer/my-deliveries', 'GET', null, token);
        const res = await apiRequest('/dropoff/all', 'GET', null, token);

        setDropoffs(res || []);
        setAvailablePickups(available.length || 0);
        setMyPickups(pickups.length || 0);
        setMyDeliveries(deliveries.length || 0);
      } catch (err) {
        toast.error(err.message || 'Failed to load dashboard stats');
      }
    };

    fetchStats();
  }, [token]);

  // Chart data
  const chartData = [
    { name: 'Available', value: availablePickups },
    { name: 'My Pickups', value: myPickups },
    { name: 'My Deliveries', value: myDeliveries },
  ];

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6'];

  // ✅ Handle selecting dropoff + saving to localStorage
  const handleSelectDropoff = (id) => {
    const selected = dropoffss?.dropoffs?.find((d) => d._id === id);
    if (selected) {
      setSelectedDropoff(selected);
      localStorage.setItem("selectedDropoff", JSON.stringify(selected));
    }
  };

  return (
    <ProtectedRoute allowedRoles={['volunteer']}>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
        </div>

        {/* Selected Dropoff Center */}
        {selectedDropoff && (
          <div className="mb-6 p-4 rounded-lg shadow bg-green-100 border border-green-400">
            <h2 className="text-lg font-bold text-green-700">✅ Selected Dropoff Center</h2>
            <p className="mt-2 text-green-800">
              <strong>{selectedDropoff.ngoName}</strong> <br />
              Location: {selectedDropoff.locationName} <br />
              Added on: {new Date(selectedDropoff.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/volunteer/available-pickups" className="block">
            <StatCard label="Available Pickups" value={availablePickups} color="bg-green-500" icon="📦" />
          </Link>
          <Link href="/dashboard/volunteer/my-pickups" className="block">
            <StatCard label="My Pickups" value={myPickups} color="bg-blue-500" icon="🛻" />
          </Link>
          <Link href="/dashboard/volunteer/my-deliveries" className="block">
            <StatCard label="My Deliveries" value={myDeliveries} color="bg-purple-500" icon="🚚" />
          </Link>
        </div>

        {/* Dropoff Center Picker */}
        <div className="bg-white p-6 rounded-lg shadow mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">🏢 Choose Dropoff Center</h2>
          {dropoffss?.dropoffs?.length === 0 ? (
            <p className="text-gray-500">No dropoff centers available.</p>
          ) : (
            <select
              className="w-full border rounded-lg p-2"
              value={selectedDropoff?._id || ""}
              onChange={(e) => handleSelectDropoff(e.target.value)}
            >
              <option value="" disabled>
                -- Select a Dropoff Center --
              </option>
              {dropoffss?.dropoffs?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.ngoName} — {c.locationName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Pickup & Delivery Stats</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Proportion of Tasks</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div
      className={`p-5 rounded-xl shadow-md text-white ${color} flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-lg font-semibold">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

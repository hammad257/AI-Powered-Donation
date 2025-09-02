'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { apiRequest } from '@/app/services/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [dropoff, setDropoffs] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, graph, dropoffRes] = await Promise.all([
          apiRequest('/admin/dashboard/stats', 'GET', null, token),
          apiRequest('/admin/dashboard/graph', 'GET', null, token),
          apiRequest('/dropoff/all', 'GET', null, token),
        ]);

        setStats(statsRes);
        setDropoffs(dropoffRes);

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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 {t("admin.dashboard")}</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title={t("admin.totalUsers")} value={stats?.users?.total || 'Loading...'} />
          <StatCard title={t("admin.totalDonations")} value={stats?.users?.donors || 'Loading...'} />
          <StatCard title={t("admin.volunteers")} value={stats?.users?.volunteers || 'Loading...'} />
          <StatCard
            title={t("admin.deliveredOrders")}
            value={stats?.donations?.delivered || 'Loading...'}
            subtitle={`${t("admin.total")}: ${stats?.donations?.total || 0}`}
          />
        </div>

        {/* Dropoff Center Card */}
        <div className="bg-white p-6 rounded-lg shadow mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">🏢 {t("admin.dropoffCenters")}</h2>
          <p className="text-2xl font-bold text-green-600 mb-3">{dropoff.total}</p>

          {/* Recently Added */}
          <h3 className="text-md font-medium text-gray-600 mb-2">{t("admin.recentlyAdded")}</h3>
          {dropoff?.dropoffs?.length > 0 && (
            <div key={dropoff.dropoffs[0]._id} className="mb-4">
              <p>
                <span className="font-semibold">{t("admin.name")}:</span> {dropoff.dropoffs[0].ngoName} —{" "}
                <span className="text-gray-500 text-sm">
                  {new Date(dropoff.dropoffs[0].createdAt).toLocaleDateString()}
                </span>
              </p>
              <p>
                <span className="font-semibold">{t("admin.location")}:</span> {dropoff?.dropoffs[0]?.locationName}
              </p>
            </div>
          )}

          {/* Dropdown with all centers */}
          <h3 className="text-md font-medium text-gray-600 mb-2">{t("admin.allDropoffCenters")}</h3>
          <select className="w-full border rounded-lg p-2">
            {dropoff?.dropoffs?.map((center) => (
              <option key={center._id} value={center._id} >
                {center.ngoName} — {center.locationName}
              </option>
            ))}
          </select>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📈 {t("admin.dailyActivity")}</h2>
          <div className="h-80">
            {graphData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                {t("admin.noActivity")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="donations" fill="#10b981" name={t("admin.donations")} />
                  <Bar dataKey="deliveries" fill="#3b82f6" name={t("admin.deliveries")} />
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

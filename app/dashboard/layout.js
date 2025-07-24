'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import LogoutButton from '../components/LogoutButton';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../services/api';
import { setCredentials, setProfilePicture } from '../redux/features/authSlice';

export default function DashboardLayout({ children }) {
  const { token } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest('/profile/me', 'GET', null, token);
        setProfile(data);
        dispatch(setProfilePicture(data));
      } catch (err) {
        console.error('Failed to load profilee:', err.message);
      }
    };

    fetchProfile();
  }, [token]);

  const renderLinks = () => {
    switch (profile?.role) {
      case 'admin':
        return (
          <>
            <Link href="/dashboard/admin" className="block hover:bg-gray-700 px-2 py-1 rounded">Admin Dashboard</Link>
            <Link href="/dashboard/admin/users" className="block hover:bg-gray-700 px-2 py-1 rounded">Manage Users</Link>
            <Link href="/dashboard/admin/requests" className="block hover:bg-gray-700 px-2 py-1 rounded">Needy Requests</Link>
            <Link href="/dashboard/admin/money-donations" className="block hover:bg-gray-700 px-2 py-1 rounded">Manage Money Donation</Link>
            <Link href="/dashboard/admin/food-delivered" className="block hover:bg-gray-700 px-2 py-1 rounded">Delivered Pickups</Link>
          </>
        );
      case 'donor':
        return (
          <>
            <Link href="/dashboard/donor" className="block hover:bg-gray-700 px-2 py-1 rounded">Donor Dashboard</Link>
            <Link href="/dashboard/donor/food-donation" className="block hover:bg-gray-700 px-2 py-1 rounded">Food Donations</Link>
            <Link href="/dashboard/donor/money-donation" className="block hover:bg-gray-700 px-2 py-1 rounded">Money Donations</Link>
          </>
        );
      case 'volunteer':
        return (
          <>
            <Link href="/dashboard/volunteer" className="block hover:bg-gray-700 px-2 py-1 rounded">Volunteer Dashboard</Link>
            <Link href="/dashboard/volunteer/available-pickups" className="block hover:bg-gray-700 px-2 py-1 rounded">Available Pickup</Link>
            <Link href="/dashboard/volunteer/my-pickups" className="block hover:bg-gray-700 px-2 py-1 rounded">My Pickups</Link>
            <Link href="/dashboard/volunteer/my-deliveries" className="block hover:bg-gray-700 px-2 py-1 rounded">My Deliveries</Link>
          </>
        );
      case 'needy':
        return (
          <>
            <Link href="/dashboard/needy" className="block hover:bg-gray-700 px-2 py-1 rounded">Needy Dashboard</Link>
            <Link href="/dashboard/needy/myRequest" className="block hover:bg-gray-700 px-2 py-1 rounded">My Request</Link>
            <Link href="/dashboard/needy/submitRequest" className="block hover:bg-gray-700 px-2 py-1 rounded">Submit Request</Link>
          </>
        );
      default:
        return <p>No links available</p>;
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
          {/* Top Section */}
          <div>
            {/* App Title */}
            <h2 className="text-xl font-bold mb-4">AI Powered Donation</h2>

            {/* ✅ User Info just below title */}
            {profile && (
              <div className="mb-6 flex items-center gap-3">
                <img
                  src={profile.profilePic || '/default-user.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div className="overflow-hidden">
                  <p className="font-semibold break-words max-w-[10rem] leading-snug">
                    {profile.name}
                  </p>
                  <p className="text-sm text-gray-300">{profile.role}</p>
                  {profile.phone && (
                    <p className="text-xs text-gray-400 break-words">
                       {profile.phone}
                    </p>
                  )}
                  {profile.address && (
                    <p className="text-xs text-gray-400 break-words">
                      {profile.address}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="space-y-2">{renderLinks()}</nav>
          </div>

          {/* ✅ Bottom: Profile + Logout */}
          <div className="space-y-2 border-t border-gray-600 pt-4">
            <Link href="/dashboard/profile" className="block hover:bg-gray-700 px-2 py-1 rounded">
              Profile
            </Link>
            <LogoutButton />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </ProtectedRoute>
  );
}

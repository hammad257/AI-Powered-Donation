'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { FaSearch, FaEye, FaTrash, FaLock, FaUnlock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '@/app/services/api';
import Link from 'next/link';
import { useTranslation } from "react-i18next";


export default function ManageUsersPage() {
  const { token } = useSelector((state) => state.auth);
    const { t } = useTranslation();

  // state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null); // id for currently-loading action
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // modal for viewing profile
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  // fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/admin', 'GET', null, token);
      // assume backend returns array of users
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch users', err);
      toast.error(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // filtered + pagination
  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name?.toLowerCase().includes(search.toLowerCase());
    const roleMatch = !roleFilter || user.role === roleFilter;
    const statusMatch = !statusFilter || (user.status || 'active') === statusFilter;
    return nameMatch && roleMatch && statusMatch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));

  // view profile
  const handleViewProfile = async (id) => {
    try {
      setActionLoadingId(id);
      const data = await apiRequest(`/admin/${id}`, 'GET', null, token);
      setProfileUser(data);
      setProfileOpen(true);
    } catch (err) {
      console.error('View profile error', err);
      toast.error(err?.message || 'Failed to load profile');
    } finally {
      setActionLoadingId(null);
    }
  };

  // delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      setActionLoadingId(id);
      await apiRequest(`/admin/${id}`, 'DELETE', null, token);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
      toast.success('User deleted');
    } catch (err) {
      console.error('Delete user error', err);
      toast.error(err?.message || 'Failed to delete user');
    } finally {
      setActionLoadingId(null);
    }
  };

  // block / unblock
  const handleBlockUnblock = async (id, currentStatus) => {
    const wantBlock = currentStatus !== 'blocked';
    const confirmMsg = wantBlock ? 'Block this user?' : 'Unblock this user?';
    if (!window.confirm(confirmMsg)) return;
    try {
      setActionLoadingId(id);
      const action = wantBlock ? 'block' : 'unblock';
      const res = await apiRequest(`/admin/${id}/${action}`, 'PATCH', null, token);
      // update in UI
      setUsers((prev) =>
        prev.map((u) => {
          const uid = u._id || u.id;
          if (uid !== id) return u;
          return { ...u, status: wantBlock ? 'blocked' : 'active', ...res.user };
        })
      );
      toast.success(wantBlock ? 'User blocked' : 'User unblocked');
    } catch (err) {
      console.error('Block/Unblock error', err);
      toast.error(err?.message || 'Action failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">{t("manageUsers.heading")}</h1>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center border px-2 py-1 rounded-md bg-white w-full md:w-1/3">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="outline-none w-full"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-md border bg-white"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="volunteer">Volunteer</option>
            <option value="needy">Needy</option>
            <option value="donor">Donor</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-md border bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          <button
            onClick={fetchUsers}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">{t("manageUsers.name")}</th>
                <th className="px-6 py-3">{t("manageUsers.email")}</th>
                <th className="px-6 py-3">{t("manageUsers.role")}</th>
                <th className="px-6 py-3">{t("manageUsers.status")}</th>
                <th className="px-6 py-3">{t("manageUsers.actions")}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-6">
                    Loading users...
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => {
                  const id = user._id || user.id;
                  const status = user.status || 'active';
                  const isActionLoading = actionLoadingId === id;
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4 capitalize">{user.role}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-3 items-center">
                        <button
                          onClick={() => handleViewProfile(id)}
                          title="View Profile"
                          disabled={isActionLoading}
                        >
                          <FaEye className="text-blue-500 hover:text-blue-700" />
                        </button>

                        <button
                          onClick={() => handleDelete(id)}
                          title="Delete"
                          disabled={isActionLoading}
                        >
                          <FaTrash className="text-red-500 hover:text-red-700" />
                        </button>

                        <button
                          onClick={() => handleBlockUnblock(id, status)}
                          title={status === 'active' ? 'Block' : 'Unblock'}
                          disabled={isActionLoading}
                        >
                          {status === 'active' ? (
                            <FaLock className="text-yellow-500 hover:text-yellow-700" />
                          ) : (
                            <FaUnlock className="text-green-500 hover:text-green-700" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-blue-50'
                }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Profile Modal */}
        {profileOpen && profileUser && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setProfileOpen(false)} />
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md z-50 p-6">
              <h3 className="text-xl font-semibold mb-2">{profileUser.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{profileUser.email}</p>
              <p className="text-sm mb-1"><strong>Role:</strong> {profileUser.role}</p>
              <p className="text-sm mb-1"><strong>Phone:</strong> {profileUser.phone || '—'}</p>
              <p className="text-sm mb-4"><strong>Address:</strong> {profileUser.address || '—'}</p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  Close
                </button>
                <button>
                  <Link href={`/dashboard/admin/userProfile/${profileUser._id}`} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                    View Profile
                  </Link>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

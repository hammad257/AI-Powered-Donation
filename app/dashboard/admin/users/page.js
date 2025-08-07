'use client';

import { useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { FaSearch, FaEye, FaTrash, FaLock, FaUnlock } from 'react-icons/fa';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'volunteer', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'needy', status: 'blocked' },
  { id: 3, name: 'Ali Khan', email: 'ali@example.com', role: 'donor', status: 'active' },
  { id: 4, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
  { id: 5, name: 'Sara Malik', email: 'sara@example.com', role: 'volunteer', status: 'active' },
  { id: 6, name: 'Usman Raza', email: 'usman@example.com', role: 'donor', status: 'blocked' },
  { id: 7, name: 'Hina Iqbal', email: 'hina@example.com', role: 'needy', status: 'active' },
  { id: 8, name: 'Tariq Ahmed', email: 'tariq@example.com', role: 'admin', status: 'active' },
  { id: 9, name: 'Zainab Shah', email: 'zainab@example.com', role: 'volunteer', status: 'blocked' },
  { id: 10, name: 'Bilal Nawaz', email: 'bilal@example.com', role: 'donor', status: 'active' },
  { id: 11, name: 'Ayesha Khan', email: 'ayesha@example.com', role: 'needy', status: 'active' },
  { id: 12, name: 'Mohsin Ali', email: 'mohsin@example.com', role: 'volunteer', status: 'active' },
  { id: 13, name: 'Rabia Sheikh', email: 'rabia@example.com', role: 'admin', status: 'blocked' },
  { id: 14, name: 'Hamza Mirza', email: 'hamza@example.com', role: 'donor', status: 'active' },
  { id: 15, name: 'Kiran Rauf', email: 'kiran@example.com', role: 'needy', status: 'blocked' },
  { id: 16, name: 'Fahad Yousaf', email: 'fahad@example.com', role: 'volunteer', status: 'active' },
  { id: 17, name: 'Mehwish Tariq', email: 'mehwish@example.com', role: 'donor', status: 'active' },
  { id: 18, name: 'Shahid Afridi', email: 'shahid@example.com', role: 'admin', status: 'active' },
  { id: 19, name: 'Mariam Javed', email: 'mariam@example.com', role: 'needy', status: 'active' },
  { id: 20, name: 'Saad Chaudhry', email: 'saad@example.com', role: 'volunteer', status: 'blocked' },
  { id: 21, name: 'Anam Ashraf', email: 'anam@example.com', role: 'donor', status: 'active' },
  { id: 22, name: 'Omar Siddiqi', email: 'omar@example.com', role: 'admin', status: 'active' },
  { id: 23, name: 'Laiba Imran', email: 'laiba@example.com', role: 'needy', status: 'active' },
  { id: 24, name: 'Arsalan Bhatti', email: 'arsalan@example.com', role: 'volunteer', status: 'blocked' },
  { id: 25, name: 'Nimra Waheed', email: 'nimra@example.com', role: 'donor', status: 'active' },
  { id: 26, name: 'Junaid Zafar', email: 'junaid@example.com', role: 'admin', status: 'active' },
  { id: 27, name: 'Farah Jabeen', email: 'farah@example.com', role: 'needy', status: 'blocked' },
  { id: 28, name: 'Asad Mehmood', email: 'asad@example.com', role: 'volunteer', status: 'active' },
  { id: 29, name: 'Zoya Shabbir', email: 'zoya@example.com', role: 'donor', status: 'blocked' },
  { id: 30, name: 'Rizwan Tariq', email: 'rizwan@example.com', role: 'admin', status: 'active' },
  { id: 31, name: 'Hassan Qureshi', email: 'hassan@example.com', role: 'volunteer', status: 'active' },
  { id: 32, name: 'Saba Khalid', email: 'saba@example.com', role: 'needy', status: 'active' },
  { id: 33, name: 'Yasir Nadeem', email: 'yasir@example.com', role: 'donor', status: 'blocked' },
  { id: 34, name: 'Lubna Jamil', email: 'lubna@example.com', role: 'admin', status: 'active' },
  { id: 35, name: 'Waqas Riaz', email: 'waqas@example.com', role: 'volunteer', status: 'active' },
  { id: 36, name: 'Nida Hanif', email: 'nida@example.com', role: 'needy', status: 'blocked' },
  { id: 37, name: 'Zubair Rehman', email: 'zubair@example.com', role: 'donor', status: 'active' },
  { id: 38, name: 'Shazia Noor', email: 'shazia@example.com', role: 'admin', status: 'blocked' },
  { id: 39, name: 'Imran Arif', email: 'imran@example.com', role: 'volunteer', status: 'active' },
  { id: 40, name: 'Sidra Aftab', email: 'sidra@example.com', role: 'needy', status: 'active' },
  { id: 41, name: 'Abdul Hameed', email: 'abdul@example.com', role: 'donor', status: 'blocked' },
  { id: 42, name: 'Muneeba Sadiq', email: 'muneeba@example.com', role: 'admin', status: 'active' },
  { id: 43, name: 'Noman Latif', email: 'noman@example.com', role: 'volunteer', status: 'active' },
  { id: 44, name: 'Fariha Sami', email: 'fariha@example.com', role: 'needy', status: 'blocked' },
  { id: 45, name: 'Haris Bashir', email: 'haris@example.com', role: 'donor', status: 'active' },
  { id: 46, name: 'Iqra Maqsood', email: 'iqra@example.com', role: 'admin', status: 'active' },
  { id: 47, name: 'Talha Akhtar', email: 'talha@example.com', role: 'volunteer', status: 'blocked' },
  { id: 48, name: 'Rameen Zia', email: 'rameen@example.com', role: 'needy', status: 'active' },
  { id: 49, name: 'Shan Baig', email: 'shan@example.com', role: 'donor', status: 'blocked' },
  { id: 50, name: 'Tooba Rafique', email: 'tooba@example.com', role: 'admin', status: 'active' },
  { id: 51, name: 'Faizan Shahid', email: 'faizan@example.com', role: 'volunteer', status: 'active' },
  { id: 52, name: 'Maheen Yousaf', email: 'maheen@example.com', role: 'needy', status: 'blocked' },
  { id: 53, name: 'Umer Dar', email: 'umer@example.com', role: 'donor', status: 'active' },
  { id: 54, name: 'Ansa Tariq', email: 'ansa@example.com', role: 'admin', status: 'active' },
  { id: 55, name: 'Danish Raza', email: 'danish@example.com', role: 'volunteer', status: 'active' },
  { id: 56, name: 'Sana Shoukat', email: 'sana@example.com', role: 'needy', status: 'active' },
  { id: 57, name: 'Kamran Yaseen', email: 'kamran@example.com', role: 'donor', status: 'blocked' },
  { id: 58, name: 'Farzana Jaleel', email: 'farzana@example.com', role: 'admin', status: 'active' },
  { id: 59, name: 'Rehan Gill', email: 'rehan@example.com', role: 'volunteer', status: 'active' },
  { id: 60, name: 'Bushra Tariq', email: 'bushra@example.com', role: 'needy', status: 'blocked' },
  { id: 61, name: 'Naveed Arshad', email: 'naveed@example.com', role: 'donor', status: 'active' },
  { id: 62, name: 'Areeba Nisar', email: 'areeba@example.com', role: 'admin', status: 'active' },
  { id: 63, name: 'Yousuf Danish', email: 'yousuf@example.com', role: 'volunteer', status: 'blocked' },
  { id: 64, name: 'Sehar Ayaz', email: 'sehar@example.com', role: 'needy', status: 'active' },
  { id: 65, name: 'Jawad Aslam', email: 'jawad@example.com', role: 'donor', status: 'active' },
  { id: 66, name: 'Fizza Irfan', email: 'fizza@example.com', role: 'admin', status: 'active' },
  { id: 67, name: 'Salman Tariq', email: 'salman@example.com', role: 'volunteer', status: 'active' },
  { id: 68, name: 'Hafsa Basharat', email: 'hafsa@example.com', role: 'needy', status: 'blocked' },
  { id: 69, name: 'Raza Butt', email: 'raza@example.com', role: 'donor', status: 'blocked' },
  { id: 70, name: 'Nashit Alam', email: 'nashit@example.com', role: 'admin', status: 'active' },
];


export default function ManageUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) &&
    (!roleFilter || user.role === roleFilter) &&
    (!statusFilter || user.status === statusFilter)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleBlockUnblock = (id) => {
    alert(`Toggle block/unblock for user ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete user ${id}`);
  };

  const handleViewProfile = (id) => {
    alert(`View profile of user ${id}`);
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center border px-2 py-1 rounded-md bg-white">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none w-full"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
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
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-md border bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 capitalize">{user.role}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3 items-center">
                    <button onClick={() => handleViewProfile(user.id)} title="View Profile">
                      <FaEye className="text-blue-500 hover:text-blue-700" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} title="Delete">
                      <FaTrash className="text-red-500 hover:text-red-700" />
                    </button>
                    <button onClick={() => handleBlockUnblock(user.id)} title={user.status === 'active' ? "Block" : "Unblock"}>
                      {user.status === 'active' ? (
                        <FaLock className="text-yellow-500 hover:text-yellow-700" />
                      ) : (
                        <FaUnlock className="text-green-500 hover:text-green-700" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
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
              className={`px-3 py-1 rounded ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border text-gray-600 hover:bg-blue-50'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}

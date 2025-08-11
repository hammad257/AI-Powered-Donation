'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../services/api';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { user, token, profilePicture } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: profilePicture?.name || '',
        email: user.email || '',
        phone: profilePicture?.phone || '',
        address: profilePicture?.address || '',
      });
      setPreview(profilePicture?.profilePic || '');
    }
  }, [user, profilePicture]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiRequest('/profile/me', 'PUT', formData, token);
      toast.success('Profile updated');

      if (file) {
        const photoForm = new FormData();
        photoForm.append('photo', file);
        await apiRequest('/profile/upload-photo', 'POST', photoForm, token, true);
        toast.success('Profile picture uploaded');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-10 text-center text-gray-800">My Profile</h1>

      {/* Profile Picture */}
<div className="flex flex-col items-center mb-8">
  <label htmlFor="profilePicInput" className="cursor-pointer">
    <img
      src={preview || '/default-user.png'}
      alt="Profile"
      className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow-md hover:opacity-80 transition"
    />
  </label>
  <input
    id="profilePicInput"
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />
  <p className="text-sm text-gray-500 mt-2">Click image to upload a new one</p>

  {/* Remove Picture Button */}
  {preview && (
    <button
      type="button"
      onClick={async () => {
        try {
          await apiRequest('/profile/remove-photo', 'DELETE', null, token);
          setPreview('');
          toast.success('Profile picture removed');
        } catch (err) {
          toast.error(err.message || 'Failed to remove profile picture');
        }
      }}
      className="mt-3 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-full shadow-sm transition duration-200"
    >
      Remove Picture
    </button>
  )}
</div>


      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input
            name="email"
            value={formData.email}
            disabled
            className="w-full bg-gray-100 text-gray-500 border px-4 py-2 rounded-md cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

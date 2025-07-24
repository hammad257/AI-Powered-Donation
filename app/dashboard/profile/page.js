'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../services/api';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { user, token, profilePicture } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: '', email: '', phone:'', address:'' });
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: profilePicture.name || '',
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
      setPreview(URL.createObjectURL(selected)); // live preview
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
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded space-y-6">
      <h1 className="text-xl font-bold">👤 My Profile</h1>

      {/* Profile Picture Upload */}
      <div className="text-center">
        <label htmlFor="profilePicInput" className="cursor-pointer inline-block">
          <img
            src={preview || '/default-user.png'}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full border mx-auto hover:opacity-80"
          />
        </label>
        <input
          id="profilePicInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-1">Click image to upload new</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            name="email"
            value={formData.email}
            disabled
            className="w-full bg-gray-100 border px-3 py-2 rounded cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

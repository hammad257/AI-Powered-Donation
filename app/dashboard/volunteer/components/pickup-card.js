'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../services/api';
import ChatBox from '../../shared/ChatBox';

export default function MyPickups() {
  const { token } = useSelector((state) => state.auth);
  const [pickups, setPickups] = useState([]);

  const fetchMyPickups = async () => {
    try {
      const data = await apiRequest('/volunteer/food/my-pickups', 'GET', null, token);
      setPickups(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load your pickups');
    }
  };

  const markAsDelivered = async (donationId) => {
    try {
      await apiRequest(`/volunteer/food/delivered/${donationId}`, 'POST', {}, token);
      toast.success('Marked as delivered');
      fetchMyPickups(); // refresh list
    } catch (err) {
      toast.error(err.message || 'Failed to mark as delivered');
    }
  };

  useEffect(() => {
    fetchMyPickups();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📋 My Accepted Pickups</h1>

      {pickups.length === 0 ? (
        <p>No accepted pickups found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {pickups.map((pickup) => (
            <div key={pickup._id} className="border p-4 rounded shadow bg-white">
              <h2 className="text-lg font-semibold">{pickup.foodType}</h2>
              <p className="text-sm text-gray-600 mb-2">{pickup.description}</p>
              <p><strong>Location:</strong> {pickup.location}</p>
              <p><strong>Status:</strong> <span className={`font-semibold ${pickup.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{pickup.status}</span></p>
              <p><strong>Accepted At:</strong> {new Date(pickup.acceptedAt || pickup.updatedAt).toLocaleString()}</p>

              {pickup.status !== 'delivered' && (
                <button
                  onClick={() => markAsDelivered(pickup._id)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Mark as Delivered
                </button>
              )}
          
          {pickup.status === 'picked' && (
  <div className="mt-4">
    <ChatBox
       receiverId={pickup.pickedBy}
       donationId={pickup._id}
    />
  </div>
)}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

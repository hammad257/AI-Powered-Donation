'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../services/api';
import ChatBox from '../../shared/ChatBox'; // adjust the path

export default function MyFoodDonations() {
  const { token } = useSelector((state) => state.auth);
  const [donations, setDonations] = useState([]);

  const fetchDonations = async () => {
    try {
      const data = await apiRequest('food/donor/my-donations', 'GET', null, token);
      setDonations(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load donations');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🍱 My Food Donations</h1>

      {donations.length === 0 ? (
        <p>No donations yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {donations.map((donation) => (
            <div key={donation._id} className="border p-4 rounded shadow bg-white">
              <h2 className="text-lg font-semibold">{donation.foodType}</h2>
              <p className="text-sm text-gray-600 mb-2">{donation.description}</p>

              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <span
                  className={`capitalize ${
                    donation.status === 'picked'
                      ? 'text-green-600 font-semibold'
                      : donation.status === 'delivered'
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-800'
                  }`}
                >
                  {donation.status}
                  {donation.status === 'picked' && (
                    <span className="ml-2 text-green-600">✔</span> // green tick
                  )}
                </span>
              </p>

              <p><strong>Location:</strong> {donation.location}</p>

              {donation.status === 'picked' && (
                <ChatBox
                  receiverId={donation.pickedBy}
                  donationId={donation._id}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

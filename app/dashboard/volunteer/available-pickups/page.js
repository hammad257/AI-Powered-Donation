'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../services/api';
import dynamic from 'next/dynamic';

const VolunteerDonationsMap = dynamic(
  () => import('../components/VolunteerDonationsMap'),
  { ssr: false }
);

const DonationMiniMap = dynamic(
  () => import('../components/DonationMiniMap'),
  { ssr: false }
);

export default function AvailablePickups() {
  const [donations, setDonations] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const fetchDonations = async () => {
    try {
      const data = await apiRequest('/volunteer/food/available', 'GET', null, token);
      setDonations(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load donations');
    }
  };

  const acceptPickup = async (donationId) => {
    try {
      await apiRequest(`/volunteer/food/accept/${donationId}`, 'POST', {}, token);
      toast.success('Pickup accepted!');
      fetchDonations(); // refresh list
    } catch (err) {
      toast.error(err.message || 'Failed to accept pickup');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📦 Available Food Pickups</h1>

      {/* Big map with all donations (optional) */}
      {/* {donations.length > 0 && (
        <VolunteerDonationsMap donations={donations} />
      )} */}

      {donations.length === 0 ? (
        <p>No pickups available right now.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {donations.map((donation) => (
            <div key={donation._id} className="border p-4 rounded shadow bg-white">
              <h2 className="text-lg font-semibold">{donation.foodType}</h2>
              <p className="text-sm text-gray-600 mb-2">{donation.description}</p>
              <p><strong>Donor:</strong> {donation.donor?.name || 'N/A'}</p>
              <p><strong>Location:</strong> {donation.location}</p>
              <p><strong>Created:</strong> {new Date(donation.createdAt).toLocaleString()}</p>

              {/* Mini map per donation (optional) */}
              <DonationMiniMap donation={donation} />

              <button
                onClick={() => acceptPickup(donation._id)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Accept Pickup
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

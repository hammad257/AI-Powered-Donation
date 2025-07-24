'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '@/app/services/api';

export default function AdminDeliveredPickups() {
  const { token } = useSelector((state) => state.auth);
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest('/admin/food/delivered', 'GET', null, token);
        setDeliveries(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load delivered pickups');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">✅ Delivered Food Pickups</h1>

      {deliveries.length === 0 ? (
        <p>No delivered food donations yet.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Food Type</th>
              <th className="p-2 border">Donor</th>
              <th className="p-2 border">Volunteer</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Delivered At</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((item) => (
              <tr key={item._id} className="text-center">
                <td className="p-2 border">{item.foodType}</td>
                <td className="p-2 border">
                  {item.donor?.name} <br />
                  <span className="text-sm text-gray-600">{item.donor?.email}</span>
                </td>
                <td className="p-2 border">
                  {item.pickedBy?.name} <br />
                  <span className="text-sm text-gray-600">{item.pickedBy?.email}</span>
                </td>
                <td className="p-2 border">{item.location}</td>
                <td className="p-2 border">{new Date(item.deliveryTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

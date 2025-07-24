'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../../services/api';
import { toast } from 'react-toastify';

export default function MyDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await apiRequest('/volunteer/volunteer/my-deliveries', 'GET', null, token);
        setDeliveries(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load deliveries');
      }
    };
    fetchDeliveries();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🚚 My Delivered Pickups</h1>

      {deliveries.length === 0 ? (
        <p>No deliveries yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {deliveries.map((d) => (
            <div key={d._id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-lg font-semibold">{d.foodType}</h2>
            <p><strong>Donor:</strong> {d.donor?.name}</p>
            <p><strong>Location:</strong> {d.location}</p>
            <p><strong>Delivered At:</strong> {new Date(d.deliveryTime).toLocaleString()}</p>
          
            {d.deliveryDuration && (
              <p className="text-sm text-gray-700">
                <strong>Delivery Duration:</strong> {d.deliveryDuration} minutes
              </p>
            )}
          </div>
          ))}
        </div>
      )}
    </div>
  );
}

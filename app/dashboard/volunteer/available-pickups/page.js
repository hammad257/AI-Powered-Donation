'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiRequest } from '../../../services/api';
import dynamic from 'next/dynamic';

const DonationMiniMap = dynamic(() => import('../components/DonationMiniMap'), { ssr: false });

export default function AvailablePickups() {
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [mapToggle, setMapToggle] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [viewNearestOnly, setViewNearestOnly] = useState(false);
  const [dropoffCenter, setDropoffCenter] = useState(null)

  
  const itemsPerPage = 6;

  const { token, user } = useSelector((state) => state.auth); // Assuming user info present in auth state

  const fetchDonations = async () => {
    try {
      const data = await apiRequest('/volunteer/food/available', 'GET', null, token);

      // Optionally mark each donation if accepted by current user, assuming backend returns pickedBy id
      const enrichedData = data.map(donation => ({
        ...donation,
        isAccepted: donation.pickedBy === user._id,
      }));

      setDonations(enrichedData);
    } catch (err) {
      toast.error(err.message || 'Failed to load donations');
    }
  };

  const acceptPickup = async (donationId) => {
    try {
      await apiRequest(`/volunteer/food/accept/${donationId}`, 'POST', {}, token);
      toast.success('Pickup accepted!');
      fetchDonations();
    } catch (err) {
      toast.error(err.message || 'Failed to accept pickup');
    }
  };

  const cancelPickup = async (donationId) => {
    try {
      await apiRequest(`/volunteer/food/cancel-accept/${donationId}`, 'POST', {}, token);
      toast.success('Pickup acceptance cancelled.');
      fetchDonations();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel pickup');
    }
  };

  useEffect(() => {
    const savedDropoff = localStorage.getItem("selectedDropoff");
    if (savedDropoff) {
      setDropoffCenter(JSON.parse(savedDropoff));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
    fetchDonations();
  }, []);

  function getDistanceFromLatLng(lat1, lng1, lat2, lng2) {
    if (
      typeof lat1 !== "number" ||
      typeof lng1 !== "number" ||
      typeof lat2 !== "number" ||
      typeof lng2 !== "number"
    ) {
      return Infinity; // if coords missing, skip this donation
    }
  
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
  }
  

  function estimateTravelTime(distance, mode = "driving") {
    if (!distance || distance === Infinity) return Infinity;
  
    // avg speed assumption
    const speed = mode === "walking" ? 5 : 40; // km/h
    const time = (distance / speed) * 60; // in minutes
    return Math.round(time);
  }
  

  const filteredDonations = donations.filter((donation) =>
    donation.foodType?.toLowerCase().includes(search.toLowerCase()) ||
    donation.description?.toLowerCase().includes(search.toLowerCase()) ||
    donation.donor?.name?.toLowerCase().includes(search.toLowerCase()) ||
    donation.location?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDonations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

  const toggleMap = (id) => {
    setMapToggle((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  let nearestDonation = null;

  if (userLocation && donations.length > 0) {
    const withTimes = donations.map(donation => {
      const distance = getDistanceFromLatLng(
        userLocation.lat,
        userLocation.lng,
        donation.lat,
        donation.lng
      );
  
      const travelTime = estimateTravelTime(distance, "driving");
  
      return { ...donation, distance, travelTime };
    });
  
    // filter out invalid ones
    const valid = withTimes.filter(d => d.travelTime !== Infinity);
  
    if (valid.length > 0) {
      nearestDonation = valid.reduce((min, d) =>
        d.travelTime < min.travelTime ? d : min
      );
    }
  }
  
  const displayedDonations = viewNearestOnly && nearestDonation
  ? [nearestDonation]
  : currentItems;

  

  return (
    <div className="p-4">

{dropoffCenter && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl mb-6 shadow-md">
          <h2 className="text-lg font-bold">🏢 Selected Dropoff Center</h2>
          <p className="mt-2">
            <strong>{dropoffCenter.ngoName}</strong><br />
            📍 {dropoffCenter.locationName}
          </p>
          <p className="text-sm text-gray-600">
            Added: {new Date(dropoffCenter.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}

<div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl mb-6 shadow-md">
  <h2 className="text-lg font-bold">📍 Nearest Pickup</h2>
  {nearestDonation ? (
    <div>
      <p className="mb-3">
        <strong>{nearestDonation.foodType}</strong> at{" "}
        {nearestDonation.location} <br />
        ⏱ {nearestDonation.travelTime} mins ({nearestDonation.distance.toFixed(1)} km)
      </p>

      <div className="flex gap-2">
  {!viewNearestOnly ? (
    <button
      onClick={() => setViewNearestOnly(true)}
      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
    >
      View
    </button>
  ) : (
    <button
      onClick={() => setViewNearestOnly(false)}
      className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
    >
      Back
    </button>
  )}
</div>

    </div>
  ) : (
    <p>Finding nearest pickup...</p>
  )}
</div>



      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">📦 Available Food Pickups</h1>
        <input
          type="text"
          placeholder="Search by food type, donor, or location..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Donations List */}
      {displayedDonations.length === 0 ? (
        <p className="text-gray-600">No pickups available right now.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDonations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 ">
                <h2 className="text-xl font-bold text-gray-800 truncate max-w-[200px]">{donation.foodType}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(donation.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {donation.description}
              </p>

              {/* Donor info */}
              <div className="space-y-1 text-sm text-gray-700 mb-4 truncate max-w-[200px]">
                <p><strong>Donor:</strong> {donation.donor?.name || 'N/A'}</p>
                <p><strong>Location:</strong> {donation.location}</p>
              </div>

              {/* Toggle Map Button */}
              <button
                type="button"
                onClick={() => toggleMap(donation._id)}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors mb-4
                  ${mapToggle[donation._id]
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
              >
                {mapToggle[donation._id] ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hide Map
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    Show Map
                  </>
                )}
              </button>

              {/* Map (conditionally rendered) */}
              {mapToggle[donation._id] && (
                <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
                  <DonationMiniMap donation={donation} />
                </div>
              )}

              {/* Accept / Cancel buttons */}
              <div className="mt-auto flex gap-3">
                {!donation.isAcceptedByCurrentUser ? (
                  <button
                    onClick={() => acceptPickup(donation._id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Accept Pickup
                  </button>
                ) : (
                  <button
                    onClick={() => cancelPickup(donation._id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Pickup
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

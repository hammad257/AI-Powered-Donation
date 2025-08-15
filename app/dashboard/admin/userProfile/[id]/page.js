"use client";

import { apiRequest } from "@/app/services/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const data = await apiRequest(`/admin/${id}`, "GET", null, token);
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id, token]);

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      {/* Profile Picture */}
      <img
        src={user.profilePicture || "https://via.placeholder.com/150"}
        alt="Profile"
        className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-md object-cover"
      />

      {/* Name & Role */}
      <h1 className="mt-4 text-3xl font-bold text-gray-800">{user.name}</h1>
      <p className="text-indigo-600 font-medium">{user.role}</p>

      {/* Details */}
      <div className="mt-6 space-y-3 w-full max-w-md">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Email</span>
          <span className="text-gray-800">{user.email}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Phone</span>
          <span className="text-gray-800">{user.phone || "N/A"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Address</span>
          <span className="text-gray-800">{user.address || "Not provided"}</span>
        </div>
      </div>
    </div>
  );
}

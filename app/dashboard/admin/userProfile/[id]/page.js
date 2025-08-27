"use client";

import { apiRequest } from "@/app/services/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";

export default function UserProfile() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();

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

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-500">Loading...</p>
    );

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-gray-100 text-gray-800 relative">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard/admin/users")} // 👈 Change "/admin" to your users list route
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={22} />
        <span className="font-medium">Back</span>
      </button>

      {/* Profile Picture with Glow */}
      <div className="relative mt-16">
        <img
          src={user.profilePic || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-36 h-36 rounded-full border-4 border-white shadow-xl object-cover"
        />
        <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
      </div>

      {/* Name & Role */}
      <h1 className="mt-6 text-4xl font-bold">{user.name}</h1>
      <p className="text-lg font-semibold capitalize tracking-wide text-gray-600">
        {user.role}
      </p>

      {/* Details Section */}
      <div className="mt-12 w-full max-w-3xl bg-white rounded-2xl shadow-lg p-10">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
          {[
            { label: "Email", value: user.email },
            { label: "Phone", value: user.phone || "N/A" },
            { label: "Address", value: user.address || "N/A" },
            { label: "Status", value: user.status },
            { label: "Created At", value: new Date(user.createdAt).toLocaleString() },
          ].map((field, idx) => (
            <div key={idx} className="flex flex-col">
              <dt className="text-sm font-medium text-gray-500">
                {field.label}
              </dt>
              <dd className="text-lg font-semibold text-gray-900">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

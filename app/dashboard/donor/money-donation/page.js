
'use client';

import { useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import MyMoneyDonations from "../components/MoneyDonation";
import MoneyDonationForm from "../components/MoneyDonationForm";

export default function MoneyDonationPage() {
  const [activeTab, setActiveTab] = useState("form"); // default tab: "form"

  return (
    <ProtectedRoute allowedRoles={['donor']}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Money Donations</h1>

        {/* Tabs */}
        <div className="flex mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "form"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("form")}
          >
            ➕ Add Donation
          </button>

          <button
            className={`px-4 py-2 rounded ${
              activeTab === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("list")}
          >
            📋 My Donations
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "form" && <MoneyDonationForm />}
        {activeTab === "list" &&   <MyMoneyDonations />}
      </div>
    </ProtectedRoute>
  );
}

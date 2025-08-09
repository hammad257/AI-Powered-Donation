'use client';

import { useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import MyFoodDonations from "../components/FoodDonation";
import FoodDonationForm from "../components/FoodDonationForm";

export default function FoodDonationPage() {
  const [activeTab, setActiveTab] = useState("form");
  const [editingDonation, setEditingDonation] = useState(null);

  const handleCancelEdit = () => {
    setEditingDonation(null); // hide form
  };

  return (
    <ProtectedRoute allowedRoles={['donor']}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">👥 Manage Food Donations</h1>

        {/* Tabs */}
        <div className="flex mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "form"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => {
              setActiveTab("form");
              setEditingDonation(null); // reset when adding new
            }}
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
        {activeTab === "form" && (
          <FoodDonationForm
            editingDonation={editingDonation}
            onCancelEdit={handleCancelEdit}
            onFormSuccess={() => {
              setActiveTab("list");
              setEditingDonation(null);
            }}
          />
        )}
        {activeTab === "list" && (
          <MyFoodDonations
            onEdit={(donation) => {
              setEditingDonation(donation);
              setActiveTab("form");
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

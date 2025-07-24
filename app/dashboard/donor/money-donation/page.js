'use client';

import ProtectedRoute from "../../../components/ProtectedRoute";
import MoneyDonationForm from "../components/MoneyDonationForm";


export default function MoneyDonationPage() {
  return (
    <ProtectedRoute allowedRoles={['donor']}>
      <div className="p-4 space-y-8">
        <h1 className="text-2xl font-bold">💰 Money Donor Dashboard</h1>
        <MoneyDonationForm />
      </div>
    </ProtectedRoute>
  );
}

'use client';

import ProtectedRoute from "../../../components/ProtectedRoute";
import MyFoodDonations from "../components/FoodDonation";
import FoodDonationForm from "../components/FoodDonationForm";


export default function FoodDonationPage() {
  return (
     <ProtectedRoute allowedRoles={['donor']}>
    <div>
      <h1 className="text-2xl font-bold mb-4">👥 Manage FoodDonationPage</h1>
      <FoodDonationForm />
      <MyFoodDonations />
    </div>
    </ProtectedRoute >
  );
}

'use client';

import ProtectedRoute from "../../../components/ProtectedRoute";
import HelpRequestForm from "../components/HelpRequestForm";


export default function SubmitRequestPage() {
  return (
     <ProtectedRoute allowedRoles={['needy']}>
    <div>
      <h1 className="text-2xl font-bold mb-4">Submit Request Form</h1>
      <HelpRequestForm />
    </div>
    </ProtectedRoute >
  );
}

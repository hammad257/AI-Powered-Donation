'use client';

import Link from "next/link";
import ProtectedRoute from "../../../components/ProtectedRoute";
import MyHelpRequests from "../components/MyHelpRequest";


export default function MyRequestPage() {
  return (
     <ProtectedRoute allowedRoles={['needy']}>
    <div>
      <MyHelpRequests />
            <Link href="/dashboard/needy/submitRequest" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Re-Submit Request
            </Link>
    </div>
    </ProtectedRoute >
  );
}

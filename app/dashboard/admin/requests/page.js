'use client';

import { useTranslation } from 'react-i18next';
import ProtectedRoute from '../../../components/ProtectedRoute';
import AdminHelpRequests from '../components/AdminHelpRequest';

export default function AdminDashboard() {
  const { t } = useTranslation();
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{t("helpRequests.table.ManageNeedyRequest")}</h1>
        <AdminHelpRequests />
      </div>
    </ProtectedRoute>
  );
}

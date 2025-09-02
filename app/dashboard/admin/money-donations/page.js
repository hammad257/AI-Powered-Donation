// File: app/dashboard/admin/money-donations/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/app/services/api';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import ManageAdminMoneyDonations from '../components/ManageMoneyDonations';
import { useTranslation } from 'react-i18next';

export default function AdminMoneyDonationsPage() {
 const { t } = useTranslation();
  return (
    <ProtectedRoute allowedRoles={['admin']}>
       <div>
         <h1 className="text-2xl font-bold mb-4">{t("donations.table.ManageMoneyDonation")}</h1>
         <ManageAdminMoneyDonations />
       </div>
       </ProtectedRoute >
  );
}

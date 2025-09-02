'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '../redux/features/authSlice';
import { useTranslation } from 'react-i18next';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();
     const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  return (
    <button onClick={handleLogout} className="text-red-600 hover:underline">
      {t("sidebar.logoutGoogle")}
    </button>
  );
};

export default LogoutButton;

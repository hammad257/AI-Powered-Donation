'use client';

import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '../redux/features/authSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  return (
    <button onClick={handleLogout} className="text-red-600 hover:underline">
      Logout
    </button>
  );
};

export default LogoutButton;

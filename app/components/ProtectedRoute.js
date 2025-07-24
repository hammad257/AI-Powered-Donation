'use client';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
   

  useEffect(() => {
    if (!user || !token) {
      router.push('/auth/login');
    }
  }, [user, token, router]);

  // Show nothing if not logged in yet
  if (!user || !token) return <p className="text-center mt-10">Please login first</p>;

  return children;
}

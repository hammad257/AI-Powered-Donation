'use client';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!user || !token)) {
      router.push('/auth/login');
    }
  }, [mounted, user, token, router]);

  if (!mounted) {
    // Avoid rendering mismatched SSR markup
    return null;
  }

  // If user is not logged in, we don't render anything here (router will redirect)
  if (!user || !token) return null;

  return children;
}

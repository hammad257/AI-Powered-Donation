'use client';

import { Suspense } from 'react';
import RegisterForm from './component/registerPage';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

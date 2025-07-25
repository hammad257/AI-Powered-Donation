'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setCredentials } from '../../redux/features/authSlice';
import { apiRequest } from '@/app/services/api';
import Link from 'next/link';
import { signIn, useSession } from "next-auth/react";
import { useEffect } from 'react';

export default function LoginPage() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const initialValues = { email: '', password: '' };

    // Watch for Google login success
    useEffect(() => {
      if (session?.user) {
        handleGoogleLogin(session.user);
      }
    }, [session]);

    const handleGoogleLogin = async (googleUser) => {
      try {
        const payload = {
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.image,
        };
  
        const data = await apiRequest('/auth/social-login', 'POST', JSON.stringify(payload));
  
        if (data?.token) {
          dispatch(setCredentials({ user: data.user, token: data.token }));
          localStorage.setItem('userInfo', JSON.stringify({ user: data.user, token: data.token }));
          toast.success('Google login successful!');
          router.push(`/dashboard/${data.user.role}`);
        } else {
          toast.error('Social login failed');
        }
      } catch (error) {
        console.error('Google Login Error:', error);
        toast.error('Google login failed!');
      }
    };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = await apiRequest('/auth/login', 'POST', JSON.stringify(values));
      if (data?.token) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        localStorage.setItem('userInfo', JSON.stringify({ user: data.user, token: data.token }));
        toast.success('Login successful!');
        router.push(`/dashboard/${data?.user?.role}`);
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Server error');
      console.error('❌ Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1">Email</label>
              <Field type="email" name="email" className="w-full border px-4 py-2 rounded" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <Field type="password" name="password" className="w-full border px-4 py-2 rounded" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => signIn('google')}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Login with Google
            </button>

            {/* Normal Login */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            <Link
              href="/auth/register"
              className="block text-center w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
            >
              New Account
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
}

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
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // using lucide icons

export default function LoginPage() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(prev => !prev);

  const initialValues = { email: '', password: '' };

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back 👋</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="you@example.com"
                />
                <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              {/* Password with Toggle */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-800"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={() => signIn('google')}
                className="w-full flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <hr className="flex-grow border-gray-300" />
                OR
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>

              {/* Register */}
              <div className="text-center text-sm mt-4">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-orange-600 hover:underline font-medium">
                  Create one
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

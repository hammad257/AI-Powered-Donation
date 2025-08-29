'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCredentials } from '../../redux/features/authSlice';
import { toast } from 'react-toastify';
import { apiRequest } from '@/app/services/api';
import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // using lucide icons

export default function RegisterPage() {
  const initialValues = {
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    address: '',
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(prev => !prev);

  const dispatch = useDispatch();
  const router = useRouter();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
    role: Yup.string().oneOf(['admin', 'donor', 'needy', 'volunteer'], 'Invalid role').required('Role is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const data = await apiRequest('auth/signup', 'POST', JSON.stringify(values));
      if (data) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        toast.success('Registered successfully!');
        router.push('/auth/login');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('Something went wrong!');
      console.error('❌ Error:', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 px-4">
         <Link href="/" className="text-4xl font-extrabold text-blue-700 mb-6 hover:underline">
      Empower Communities
through Food & Charity
    </Link>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h1>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Field
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
              </div>


              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Field
                  type="text"
                  name="phone"
                  placeholder="+92 3XX XXXXXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <ErrorMessage name="phone" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Field
                  as="textarea"
                  name="address"
                  rows={2}
                  placeholder="Street, City, Zip"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <ErrorMessage name="address" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Field
                  as="select"
                  name="role"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="donor">Donor</option>
                  {/* <option value="needy">Needy</option> */}
                  <option value="volunteer">Volunteer</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>

              {/* Already account */}
              <div className="text-center text-sm mt-4">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-orange-600 hover:underline font-medium">
                  Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

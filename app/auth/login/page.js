'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setCredentials } from '../../redux/features/authSlice';
import { apiRequest } from '@/app/services/api';
import Link from 'next/link';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const initialValues = {
    email: '',
    password: '',
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
        router.push(`/dashboard/${data?.user?.role}`); // 🔁 or route based on user.role
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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
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

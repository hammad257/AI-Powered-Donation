'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCredentials } from '../../redux/features/authSlice';
import { toast } from 'react-toastify';
import { apiRequest } from '@/app/services/api';
import Link from 'next/link';

export default function RegisterPage() {
  const initialValues = {
    name: '',
    email: '',
    password: '',
    role: '', // donor, needy, volunteer
    phone: '',      // ✅ new
    address: '',    // 
  };

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
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <Field
                type="text"
                name="name"
                className="w-full border px-4 py-2 rounded"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <Field
                type="email"
                name="email"
                className="w-full border px-4 py-2 rounded"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <Field
                type="password"
                name="password"
                className="w-full border px-4 py-2 rounded"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className="block mb-1">Phone</label>
              <Field
                type="text"
                name="phone"
                className="w-full border px-4 py-2 rounded"
              />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1">Address</label>
              <Field
                as="textarea"
                name="address"
                className="w-full border px-4 py-2 rounded"
                rows={2}
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
            </div>


            <div>
              <label className="block mb-1">Role</label>
              <Field as="select" name="role" className="w-full border px-4 py-2 rounded">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="donor">Donor</option>
                <option value="needy">Needy</option>
                <option value="volunteer">Volunteer</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
            <Link
              href="/auth/login"
              className="block text-center w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
            >
              Already have an account
            </Link>

            {/* <Link href="/auth/login"  className="w-full bg-orange-600 text-white py-2 rounded hover:bg-blue-700">
             Already have an account
            </Link> */}
          </Form>
        )}
      </Formik>
    </div>
  );
}

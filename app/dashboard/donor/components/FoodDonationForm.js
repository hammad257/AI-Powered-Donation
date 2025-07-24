'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../../services/api';

const FoodDonationForm = () => {
  const { token } = useSelector((state) => state.auth);

  const initialValues = {
    foodType: '',
    quantity: '',
    location: '',

  };

  const validationSchema = Yup.object({
    foodType: Yup.string().required('Food type is required'),
    quantity: Yup.string().required('Quantity is required'),
    location: Yup.string().required('Pickup location is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await apiRequest('/food/donate', 'POST', values, token, false);

      if (res) {
        toast.success('Food donation submitted successfully');
        resetForm();
      } else {
        toast.error('Failed to submit');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 border p-4 rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">🍱 Submit Food Donation</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block mb-1">Food Type</label>
              <Field name="foodType" className="w-full border p-2 rounded" />
              <ErrorMessage name="foodType" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1">Quantity</label>
              <Field name="quantity" className="w-full border p-2 rounded" />
              <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block mb-1">Pickup Location</label>
              <Field name="location" className="w-full border p-2 rounded" />
              <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Donation'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FoodDonationForm;

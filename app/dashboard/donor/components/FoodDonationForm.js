'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../../services/api';
import LocationPicker from './FoodLocationPicker';

const FoodDonationForm = ({ editingDonation, onFormSuccess, onCancelEdit }) => {
  const { token } = useSelector((state) => state.auth);

  const initialValues = editingDonation || {
    foodType: '',
    foodDescription: '',
    quantity: '',
    location: '',
    lat: '',
    lng: '',
  };

  const validationSchema = Yup.object({
    foodType: Yup.string().required('Food type is required'),
    foodDescription: Yup.string().required('Food description is required'),
    quantity: Yup.string().required('Quantity is required'),
    location: Yup.string().required('Pickup location is required'),
    lat: Yup.number().required('Location latitude is required'),
    lng: Yup.number().required('Location longitude is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      if (editingDonation) {
        await apiRequest(`/food/${editingDonation._id}`, 'PUT', values, token,formData);
        toast.success('Food donation updated successfully');
      } else {
        await apiRequest('/food/donate', 'POST', values, token,formData);
        toast.success('Food donation submitted successfully');
      }
      resetForm();
      onFormSuccess();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-2xl shadow-xl border bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800">
          {editingDonation ? 'Edit Food Donation' : 'Submit Food Donation'}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, resetForm }) => (
          <Form className="space-y-5">
            {/* Food Type */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Food Type
              </label>
              <Field
                name="foodType"
                className="border border-gray-300 px-4 py-3 rounded-lg w-full text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="E.g., Rice, Bread, Fruits"
              />
              <ErrorMessage
                name="foodType"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Food Description */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Food Description
              </label>
              <Field
                name="foodDescription"
                className="border border-gray-300 px-4 py-3 rounded-lg w-full text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Brief description of the food"
              />
              <ErrorMessage
                name="foodDescription"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <Field
                name="quantity"
                className="border border-gray-300 px-4 py-3 rounded-lg w-full text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="E.g., 5 kg, 10 packs"
              />
              <ErrorMessage
                name="quantity"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Pickup Location
              </label>
              <Field
                name="location"
                className="border border-gray-300 px-4 py-3 rounded-lg w-full text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter address or area"
              />
              <ErrorMessage
                name="location"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Food Image */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Food Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setFieldValue('image', e.target.files[0])}
                className="border border-gray-300 px-4 py-3 rounded-lg w-full text-lg"
              />
            </div>


            {/* Location Picker */}
            <div>
              <LocationPicker
                onLocationSelect={(pos) => {
                  setFieldValue('lat', pos.lat);
                  setFieldValue('lng', pos.lng);
                }}
              />
              <ErrorMessage
                name="lat"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
              <ErrorMessage
                name="lng"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                {isSubmitting
                  ? 'Saving...'
                  : editingDonation
                    ? 'Update Donation'
                    : 'Submit Donation'}
              </button>

              {editingDonation && (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onCancelEdit?.();
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white text-lg font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FoodDonationForm;

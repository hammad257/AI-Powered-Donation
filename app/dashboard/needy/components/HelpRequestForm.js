'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { apiRequest } from '@/app/services/api';

const HelpRequestForm = () => {
  const [files, setFiles] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    reason: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().required('Required'),
    reason: Yup.string().required('Reason is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    files.forEach((file) => {
      formData.append('documents', file);
    });

    try {

      const data = await apiRequest('/needy/request', 'POST', formData, token, true);

      if (data) {
        toast.success('Help request submitted');
        resetForm();
        setFiles([]);
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
      console.error('❌ Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Submit Help Request</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label className="block">Name</label>
              <Field name="name" className="border w-full p-2 rounded" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block">Email</label>
              <Field type="email" name="email" className="border w-full p-2 rounded" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block">Phone</label>
              <Field name="phone" className="border w-full p-2 rounded" />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block">Reason</label>
              <Field as="textarea" name="reason" rows="3" className="border w-full p-2 rounded" />
              <ErrorMessage name="reason" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label className="block">Upload Documents</label>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setFiles((prevFiles) => [...prevFiles, ...newFiles]);
                }}
                className="block mt-2"
              />
              {files.length > 0 && (
                <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                  {files.map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              )}


            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default HelpRequestForm;

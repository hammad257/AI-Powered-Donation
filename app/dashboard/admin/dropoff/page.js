"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AdminDropoffMap from "../components/AdminDropoffMap";
import { apiRequest } from '@/app/services/api';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function DropoffPage() {
  const [coords, setCoords] = useState(null);
  const [saving, setSaving] = useState(false);
  const { token } = useSelector((state) => state.auth);
   const { t } = useTranslation();

  const initialValues = {
    ngoName: "",
    locationName: "",
  };

  const validationSchema = Yup.object({
    ngoName: Yup.string().required("NGO Name is required"),
    locationName: Yup.string().required("Location is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (!coords) {
      alert("Please select a location on the map");
      return;
    }

    try {
      setSaving(true);
      await apiRequest(
        "/dropoff/create",
        "POST",
        { ngoName: values.ngoName,
         locationName: values.locationName,
         coordinates: { lat: coords[0], lng: coords[1] },
          },
        token
      );
      resetForm();
      setCoords(null);
     toast.success('DropOff center add successfully');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to create drop-off");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t('deliveredPickups.CreateDropoffCenter')}</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-4 bg-white p-4 rounded-xl shadow">
            {/* NGO Name */}
            <div>
              <Field
                name="ngoName"
                type="text"
                placeholder="NGO Name"
                className="w-full border rounded-lg p-2"
              />
              <ErrorMessage
                name="ngoName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Location Name */}
            <div>
              <Field
                name="locationName"
                type="text"
                placeholder="Location Name (auto-filled from map)"
                className="w-full border rounded-lg p-2"
              />
              <ErrorMessage
                name="locationName"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Map */}
            <AdminDropoffMap
              selected={coords}
              onSelectLocation={(latlng) => setCoords(latlng)}
              onAddressChange={(address) =>
                setFieldValue("locationName", address)
              }
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create Dropoff"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

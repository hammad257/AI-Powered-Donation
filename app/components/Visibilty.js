"use client";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { apiRequest } from "../services/api";

export default function ManageVisibility() {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <Formik
      initialValues={{
        emailVisible: user?.emailVisible || false,
        phoneVisible: user?.phoneVisible || false,
      }}
      enableReinitialize={true} // ✅ ensures values reset when user changes
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await apiRequest("/auth/visibility", "PUT", values, token);
          toast.success("Visibility updated successfully");
        } catch (err) {
          toast.error("Failed to update visibility");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting, resetForm }) => (
        <Form className="space-y-4 p-4">
          <label className="flex items-center space-x-2">
            <Field type="checkbox" name="emailVisible" />
            <span>
              Email Visibility ({values.emailVisible ? "Public" : "Private"})
            </span>
          </label>

          <label className="flex items-center space-x-2">
            <Field type="checkbox" name="phoneVisible" />
            <span>
              Phone Visibility ({values.phoneVisible ? "Public" : "Private"})
            </span>
          </label>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => resetForm()} // ✅ resets to initial values
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

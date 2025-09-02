"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { apiRequest } from "../services/api";
import { useSelector } from "react-redux";



export default function ChangePassword() {
  const {t } = useTranslation();
  const [success, setSuccess] = useState("");
   const { token } = useSelector((state) => state.auth);

  // Validation schema
const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const body = {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      await apiRequest(`/auth/change-password`, "POST", body, token);

      toast.success("Password updated successfully!");
      resetForm();
    } catch (err) {
      toast.error("Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Change Password
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Update your account password
      </p>

        <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={ChangePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            {/* Current Password */}
            <div>
              <Field
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
              />
              <ErrorMessage
                name="currentPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* New Password */}
            <div>
              <Field
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              {isSubmitting ? "Changing..." : "Change Password"}
            </button>

            {/* Success Message */}
            {success && (
              <div className="text-green-600 text-sm mt-2">{success}</div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

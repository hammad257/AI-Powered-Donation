"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { apiRequest } from "./services/api";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";

export default function Home() {
  const helpSectionRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [error, setError] = useState("");
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

      const data = await apiRequest('/needy/request', 'POST', formData, null, true);

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

  const scrollToHelp = () => {
    helpSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 overflow-hidden">
      {/* Decorative SVG background */}
      <header className="w-full bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo / Title */}
          <h1 className="text-xl font-bold text-indigo-600">
            MealBridge
          </h1>

          {/* Nav Buttons */}
          {/* Nav Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/auth/register?role=volunteer"
              className="w-full sm:w-auto text-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-transform hover:scale-105 shadow-md"
            >
              Become a Volunteer
            </Link>
            <Link
              href="/auth/register?role=donor"
              className="w-full sm:w-auto text-center px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition-transform hover:scale-105 shadow-md"
            >
              Donate
            </Link>
            <button
              onClick={scrollToHelp}
              className="w-full sm:w-auto text-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-transform hover:scale-105 shadow-md"
            >
              Need Help
            </button>
          </div>

        </div>
      </header>


      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 800 800"
        >
          <circle cx="400" cy="400" r="400" fill="url(#grad1)" />
          <defs>
            <radialGradient id="grad1">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-20 gap-12">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl text-center lg:text-left"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Empower <span className="text-indigo-600">Communities</span>
            <br />with <span className="text-indigo-600">AI</span> through Food & Charity
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Our platform connects restaurants, volunteers, and donors to fight
            hunger and deliver food & donations to those who need it most.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/auth/login"
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-lg flex items-center gap-2 text-white shadow-lg transition-transform transform hover:scale-105"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Right Side Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full max-w-lg"
        >
          <Image
            src="/child-donate.jpg"
            alt="Food Donation"
            width={600}
            height={500}
            className="rounded-2xl shadow-2xl"
          />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-10 -left-10 bg-white shadow-lg rounded-xl px-4 py-2 text-sm font-semibold text-indigo-600"
          >
            🍲 1,200+ Meals Delivered
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="absolute -bottom-10 -right-10 bg-white shadow-lg rounded-xl px-4 py-2 text-sm font-semibold text-pink-500"
          >
            ❤️ 500+ Donors Joined
          </motion.div>
        </motion.div>
      </section>

     


      {/* Features Section */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-gray-600">
            A simple process to deliver food & donations with impact.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Food Donation",
              desc: "Restaurants & homes donate extra food securely.",
              icon: "🍛",
            },
            {
              title: "Volunteers",
              desc: "Volunteers pick & deliver food to those in need.",
              icon: "🚴",
            },
            {
              title: "Money Donations",
              desc: "Donate money safely, verified distribution.",
              icon: "💳",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-indigo-50 rounded-2xl shadow-md p-8 text-center"
            >
              <div className="text-4xl">{item.icon}</div>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Admin Verification Section */}
      <section className="py-20 px-6 lg:px-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-600">How Admins Verify Requests</h2>
          <p className="mt-4 text-gray-600">
            To ensure fairness and transparency, our admin team carefully reviews every application:
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Check Documents", desc: "Admins review uploaded receipts, bills, and certificates." },
              { step: "2", title: "Validate Identity", desc: "Cross-check applicant’s contact details and history." },
              { step: "3", title: "Approve or Reject", desc: "Requests are approved if genuine, rejected otherwise." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition">
                <div className="text-indigo-600 font-bold text-xl">{item.step}</div>
                <h3 className="mt-2 font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

       {/* 🌟 I Need Help Form Section */}
      <section
        ref={helpSectionRef}
        className="py-20 px-6 lg:px-20 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-indigo-100">
          <h2 className="text-3xl font-bold text-center text-indigo-600">
            I Need Help
          </h2>
          <p className="mt-2 text-gray-600 text-center">
            Fill this form if you need food, money, or assistance. Our team will
            reach out to you.
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6 mt-8">
                {/* Name */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Name</label>
                  <Field
                    name="name"
                    className="border border-gray-300 w-full p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="border border-gray-300 w-full p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Phone</label>
                  <Field
                    name="phone"
                    maxLength="11"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, ""); // only numbers
                    }}
                    className="border border-gray-300 w-full p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Reason */}
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Reason</label>
                  <Field
                    as="textarea"
                    name="reason"
                    rows="3"
                    className="border border-gray-300 w-full p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Upload Documents
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="w-full py-3 rounded-xl text-indigo-600 border-2 border-dashed border-gray-300 hover:border-indigo-500 transition"
                  >
                    📎 Click to Upload Documents
                  </button>

                  {files.length > 0 && (
                    <ul className="mt-3 text-sm text-gray-700 space-y-2">
                      {files.map((file, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2"
                        >
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                            className="ml-3 px-2 py-1 text-xs bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>


                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 shadow-lg hover:opacity-90 transition-transform transform hover:scale-105"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>


      {/* Impact Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-center">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { number: "12K+", label: "Meals Donated" },
            { number: "5K+", label: "Active Volunteers" },
            { number: "1.2K+", label: "Families Helped" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <h3 className="text-5xl font-bold">{stat.number}</h3>
              <p className="mt-2 text-lg opacity-90">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-20 px-6 lg:px-20 bg-gray-50 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
          Ready to Make an Impact?
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Join us today and be part of a movement that brings food, hope, and
          smiles to communities worldwide.
        </p>
        <div className="mt-8">
          <Link href='/auth/register' className="bg-pink-600 hover:bg-pink-700 px-8 py-4 rounded-full text-lg font-semibold text-white shadow-lg transition-transform transform hover:scale-110">
            Join the Cause 💖
          </Link>
        </div>
      </section>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-indigo-600 mb-4">Upload Documents</h3>
            <p className="text-gray-600 text-sm mb-4">You can upload max <b>5 files</b>.
              Please select the type of document.</p>

            {/* Document Type */}
            <div className="space-y-2 mb-4">
              {["Medical Receipt", "Billing", "School Fees", "Other"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="documentType"
                    value={type}
                    checked={documentType === type}
                    onChange={(e) => setDocumentType(e.target.value)}
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* File Input */}
            <input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg"
              onChange={(e) => {
                if (!documentType) {
                  setError("Please select a document type before uploading.");
                  e.target.value = "";
                  return;
                }
                const newFiles = Array.from(e.target.files);

                if (files.length + newFiles.length > 5) {
                  setError("You can only upload a maximum of 5 files.");
                  return;
                }

                setFiles((prev) => [...prev, ...newFiles]);
                setShowUploadModal(false);
                setError("");
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
            />

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      )}

    </div>
  );
}

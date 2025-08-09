import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL
});

export const apiRequest = async (
  endpoint,
  method = 'GET',
  data = null,
  token = null,
  isFormData = false
) => {
  try {
    const headers = {};

    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (isFormData) {
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      url: endpoint,
      method,
      headers
    };

    // ✅ Only attach data if it's not null or undefined
    if (data !== null && data !== undefined) {
      config.data = data;
    }

    const res = await axiosInstance(config);
    return res.data;

  } catch (error) {
    console.error('❌ Axios Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};

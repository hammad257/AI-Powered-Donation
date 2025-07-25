import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL:BASE_URL
});

export const apiRequest = async (endpoint, method = 'GET', data = null, token = null, isFormData = false) => {
   try {
      
     const headers = {};
      
     if(token) headers['Authorization'] = `Bearer ${token}`;
     if(isFormData){
        headers['Content-Type'] = 'multipart/form-data';
     }else{
        headers['Content-Type'] = 'application/json';
     }

     const res = await axiosInstance({
        url: endpoint,
        method,
        data,
        headers
     })

     return res.data;

   } catch (error) {
    console.error('❌ Axios Error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Something went wrong');
   }
}
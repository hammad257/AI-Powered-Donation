'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "react-redux";
import store from "./redux/store";
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
        </Provider>
      </body>
    </html>
  );
}

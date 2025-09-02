'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "react-redux";
import store from "./redux/store";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import "./i18n"; // 👈 import i18n setup

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Provider store={store}>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}

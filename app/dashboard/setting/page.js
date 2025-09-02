"use client";

import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import ThemeToggle from "../../components/ThemeToggle";
import { useTranslation } from "react-i18next";
import ChangePassword from "@/app/components/changePassword";
import { useState } from "react";
import ManageVisibility from "@/app/components/Visibilty";

export default function SettingsPage() {
  const { t } = useTranslation();
   const [showChangePassword, setShowChangePassword] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Section */}         
          <ChangePassword />


        <ThemeToggle />

        <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Visibilty
          </h2>
           <p className="text-sm text-gray-500 dark:text-gray-400">
            Hide your Visibilty
          </p>
            <ManageVisibility />
        </div>

        {/* Language Section */}
        <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Language Preferences
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose your Language
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

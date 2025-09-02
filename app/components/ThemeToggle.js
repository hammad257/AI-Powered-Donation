"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fix hydration issue
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl shadow">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Theme & Appearance
      </h2>

      <div className="flex gap-3">
        <button
          onClick={() => setTheme("light")}
          className={`px-4 py-2 rounded-xl border ${
            theme === "light"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          Light
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`px-4 py-2 rounded-xl border ${
            theme === "dark"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          Dark
        </button>

        <button
          onClick={() => setTheme("system")}
          className={`px-4 py-2 rounded-xl border ${
            theme === "system"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
        >
          System
        </button>
      </div>
    </div>
  );
}

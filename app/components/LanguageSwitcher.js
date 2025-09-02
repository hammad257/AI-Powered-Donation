"use client";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

 const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem("appLanguage", lng); // persist
};


  return (
    <div className="flex gap-3">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-4 py-2 rounded-xl border hover:shadow transition ${
          i18n.language === "en"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        }`}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("ur")}
        className={`px-4 py-2 rounded-xl border hover:shadow transition ${
          i18n.language === "ur"
            ? "bg-blue-500 text-white"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        }`}
      >
        اردو
      </button>
    </div>
  );
}

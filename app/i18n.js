"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import ur from "./locales/ur/translation.json";

const savedLang = typeof window !== "undefined" ? localStorage.getItem("appLanguage") : "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur },
    },
    lng: savedLang || "en", // 👈 use saved language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

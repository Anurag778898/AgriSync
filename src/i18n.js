import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import hindi from "./locales/hi.json";
import marathi from "./locales/mr.json";

const savedLanguage = window.localStorage.getItem("agrisync-language");
const initialLanguage = ["en", "hi", "mr"].includes(savedLanguage) ? savedLanguage : "en";

i18n.use(initReactI18next).init({
  resources: {
    hi: { translation: hindi },
    mr: { translation: marathi },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  supportedLngs: ["en", "hi", "mr"],
  keySeparator: false,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;

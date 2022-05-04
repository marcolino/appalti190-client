import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import config from "./config";

/**
 * All supported languages resources are listed here.
 * When adding a new language, add it here.
 */
import { en, fr, it } from "./locales/index";

const resources = {
  en: { translation: en },
  it: { translation: it },
  fr: { translation: fr },
};

i18n
  .use(LanguageDetector) // detect language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: [ config.languages.fallback ],
    keySeparator: false, // we do not use keys in form messages.welcome
    nsSeparator: false, // do not use namespaces
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    detection: {
      //order: [ "navigator" ], // only detect from browser
      //checkWhitelist: true, // only detect languages that are in the whitelist
    },
  })
;

const i18nLogout = () => {
  localStorage.removeItem("i18nextLng");
}

export { i18n, resources, i18nLogout };
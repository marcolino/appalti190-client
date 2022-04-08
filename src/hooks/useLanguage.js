import i18n from "i18next";
import { getCurrentLanguage } from "../libs/I18n";
import config from "../config";

export default function useLanguageIcon() {
  const language = getCurrentLanguage();
  //const language = i18n.language;
  return config.languages.supported[language].icon;
};

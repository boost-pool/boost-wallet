
let en = require("./translations/en/en.json");
let es = require("./translations/es/es.json");

export const SUPPORTED_LANGUAGES = {
  English: "en",
  Spanish: "es"
}
export const SUPPORTED_LANGUAGES_KEYS = {
  en: "English",
  es: "Spanish"
}

const i18n = {
  translations: {
    en,
    es,
  },
  defaultLang: SUPPORTED_LANGUAGES.English,
  //useBrowserDefault: true,
};

module.exports = i18n;

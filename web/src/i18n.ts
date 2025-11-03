import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS: 'landing',
    ns: ['landing'],
    fallbackLng: 'en',
    supportedLngs: ['en', 'de'],
    debug: false, // Disabled for production performance

    // Performance optimizations
    load: 'currentOnly', // Only load current language, not all variants
    preload: [], // Don't preload any languages upfront

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Enable browser caching for translation files
      requestOptions: {
        cache: 'default',
      },
    },

    // React-specific optimizations
    react: {
      useSuspense: false, // Don't block render waiting for translations
    },
  });

// Don't wait for initialization to complete
// Translations will load asynchronously

declare global {
  interface Window {
    i18n: typeof i18n;
  }
}

window.i18n = i18n;

export default i18n;

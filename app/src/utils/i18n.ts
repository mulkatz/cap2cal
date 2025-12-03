import { initReactI18next } from 'react-i18next';
import de_DE from '../assets/translations/de_DE.json';
import en_GB from '../assets/translations/en_GB.json';
// import da_DK from '../assets/translations/da_DK.json';
// import fi_FI from '../assets/translations/fi_FI.json';
// import sv_SE from '../assets/translations/sv_SE.json';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export function initI18n() {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      detection: {
        order: ['localStorage', 'querystring', 'navigator'],
      },
      debug: false,
      fallbackLng: 'en-GB',
      interpolation: { escapeValue: false },
      resources: {
        'de-DE': de_DE,
        'en-GB': en_GB,
        // 'da-DK': da_DK,
        // 'fi-FI': fi_FI,
        // 'sv-SE': sv_SE,
      },
      ns: ['translations'],
      defaultNS: 'translations',
    })
    .then(() => {
      console.info('i18n initialized');

      // Normalize language to either 'en-GB' or 'de-DE'
      const currentLang = i18next.language;
      let normalizedLang: string;

      if (currentLang.startsWith('de')) {
        normalizedLang = 'de-DE';
      } else {
        // Default to English for all other languages
        normalizedLang = 'en-GB';
      }

      // Only change language if it needs normalization
      if (currentLang !== normalizedLang) {
        i18next.changeLanguage(normalizedLang);
        localStorage.setItem('i18nextLng', normalizedLang);
        console.info(`Normalized language from '${currentLang}' to '${normalizedLang}'`);
      }
    });
}

// Export the i18next instance so it can be used with I18nextProvider
export { i18next };

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
        order: ['querystring', 'navigator'],
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
      // i18next.changeLanguage('en-EN');
      // i18next.changeLanguage('da-DK');
    });
}

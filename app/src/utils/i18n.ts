import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// Supported languages in order for cycling
export const SUPPORTED_LANGUAGES = ['en-GB', 'de-DE', 'es-ES', 'fr-FR', 'pt-BR'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Language display names (in their native language)
export const LANGUAGE_DISPLAY_NAMES: Record<SupportedLanguage, string> = {
  'en-GB': 'English',
  'de-DE': 'Deutsch',
  'es-ES': 'Español',
  'fr-FR': 'Français',
  'pt-BR': 'Português',
};

// Translation key for language display
export const LANGUAGE_TRANSLATION_KEYS: Record<SupportedLanguage, string> = {
  'en-GB': 'dialogs.settings.languageEnglish',
  'de-DE': 'dialogs.settings.languageGerman',
  'es-ES': 'dialogs.settings.languageSpanish',
  'fr-FR': 'dialogs.settings.languageFrench',
  'pt-BR': 'dialogs.settings.languagePortuguese',
};

/**
 * Normalize detected language to one of our supported languages.
 * Handles various formats: 'en', 'en-US', 'en_US', 'en-GB', etc.
 */
function normalizeLanguage(detectedLang: string): SupportedLanguage {
  const lang = detectedLang.toLowerCase().replace('_', '-');

  // Check exact match first
  if (SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    return lang as SupportedLanguage;
  }

  // Check language prefix
  const prefix = lang.split('-')[0];

  switch (prefix) {
    case 'de':
      return 'de-DE';
    case 'es':
      return 'es-ES';
    case 'fr':
      return 'fr-FR';
    case 'pt':
      return 'pt-BR';
    default:
      // Default to English for all other languages
      return 'en-GB';
  }
}

/**
 * Get the next language in the cycle
 */
export function getNextLanguage(currentLang: string): SupportedLanguage {
  const normalizedCurrent = normalizeLanguage(currentLang);
  const currentIndex = SUPPORTED_LANGUAGES.indexOf(normalizedCurrent);
  const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
  return SUPPORTED_LANGUAGES[nextIndex];
}

export function initI18n() {
  i18next
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      detection: {
        order: ['localStorage', 'querystring', 'navigator'],
      },
      debug: false,
      fallbackLng: 'en-GB',
      supportedLngs: [...SUPPORTED_LANGUAGES],

      // Performance optimizations - only load current language
      load: 'currentOnly',
      preload: [], // Don't preload any languages upfront

      interpolation: { escapeValue: false },

      // HTTP backend configuration for lazy loading
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
        // Enable browser caching for translation files
        requestOptions: {
          cache: 'default',
        },
      },

      ns: ['translations'],
      defaultNS: 'translations',

      // React-specific optimizations
      react: {
        useSuspense: false, // Don't block render waiting for translations
      },
    })
    .then(() => {
      console.info('i18n initialized');

      // Normalize language to one of our supported languages
      const currentLang = i18next.language;
      const normalizedLang = normalizeLanguage(currentLang);

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

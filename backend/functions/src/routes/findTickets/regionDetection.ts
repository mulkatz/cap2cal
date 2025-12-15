/**
 * Region Detection from Language/Locale
 *
 * Maps user's language preference to geographic region for
 * ticket provider prioritization.
 */

import { Region } from './providers';

/**
 * Maps language/locale codes to regions
 *
 * Note: Language doesn't always equal region perfectly (e.g., English is spoken
 * in many regions), but combined with regional variants (en-US vs en-GB) we can
 * make reasonable assumptions about where the user is located.
 */
const LANGUAGE_TO_REGION: Record<string, Region> = {
  // English variants - location specific
  'en-US': 'NA',
  'en-CA': 'NA',
  'en-GB': 'EU',
  'en-AU': 'OCEANIA',
  'en-NZ': 'OCEANIA',
  'en-IE': 'EU',
  'en-IN': 'APAC_SOUTH',
  'en-SG': 'APAC_SOUTH',
  'en-ZA': 'MEA',
  'en-AE': 'MEA',

  // German variants
  'de': 'EU',
  'de-DE': 'EU',
  'de-AT': 'EU',
  'de-CH': 'EU',

  // Spanish variants
  'es': 'EU', // Default to Spain
  'es-ES': 'EU',
  'es-MX': 'LATAM',
  'es-AR': 'LATAM',
  'es-CL': 'LATAM',
  'es-CO': 'LATAM',
  'es-PE': 'LATAM',
  'es-VE': 'LATAM',
  'es-419': 'LATAM', // Latin America generic

  // Portuguese variants
  'pt': 'EU', // Default to Portugal
  'pt-PT': 'EU',
  'pt-BR': 'LATAM',

  // French variants
  'fr': 'EU',
  'fr-FR': 'EU',
  'fr-CA': 'NA',
  'fr-BE': 'EU',
  'fr-CH': 'EU',

  // Italian
  'it': 'EU',
  'it-IT': 'EU',
  'it-CH': 'EU',

  // Dutch
  'nl': 'EU',
  'nl-NL': 'EU',
  'nl-BE': 'EU',

  // Polish
  'pl': 'EU',
  'pl-PL': 'EU',

  // Scandinavian
  'sv': 'EU', // Swedish
  'sv-SE': 'EU',
  'no': 'EU', // Norwegian
  'nb': 'EU', // Norwegian Bokmål
  'nb-NO': 'EU',
  'da': 'EU', // Danish
  'da-DK': 'EU',
  'fi': 'EU', // Finnish
  'fi-FI': 'EU',

  // Asian languages
  'ja': 'APAC_EAST',
  'ja-JP': 'APAC_EAST',
  'ko': 'APAC_EAST',
  'ko-KR': 'APAC_EAST',
  'zh': 'APAC_EAST',
  'zh-CN': 'APAC_EAST',
  'zh-TW': 'APAC_EAST',
  'zh-HK': 'APAC_EAST',

  // South Asian
  'hi': 'APAC_SOUTH', // Hindi
  'hi-IN': 'APAC_SOUTH',
  'bn': 'APAC_SOUTH', // Bengali
  'ta': 'APAC_SOUTH', // Tamil
  'te': 'APAC_SOUTH', // Telugu
  'th': 'APAC_SOUTH', // Thai
  'th-TH': 'APAC_SOUTH',
  'vi': 'APAC_SOUTH', // Vietnamese
  'vi-VN': 'APAC_SOUTH',
  'id': 'APAC_SOUTH', // Indonesian
  'id-ID': 'APAC_SOUTH',
  'ms': 'APAC_SOUTH', // Malay
  'ms-MY': 'APAC_SOUTH',

  // Middle East
  'ar': 'MEA', // Arabic
  'ar-AE': 'MEA',
  'ar-SA': 'MEA',
  'ar-EG': 'MEA',
  'he': 'MEA', // Hebrew
  'he-IL': 'MEA',
  'tr': 'MEA', // Turkish
  'tr-TR': 'MEA',

  // Other European
  'cs': 'EU', // Czech
  'cs-CZ': 'EU',
  'hu': 'EU', // Hungarian
  'hu-HU': 'EU',
  'el': 'EU', // Greek
  'el-GR': 'EU',
  'ro': 'EU', // Romanian
  'ro-RO': 'EU',
  'uk': 'EU', // Ukrainian
  'uk-UA': 'EU',
  'ru': 'EU', // Russian (European side)
  'ru-RU': 'EU',
};

/**
 * Valid region codes for validation
 */
const VALID_REGIONS: Region[] = ['EU', 'NA', 'LATAM', 'APAC_EAST', 'APAC_SOUTH', 'OCEANIA', 'MEA', 'GLOBAL'];

/**
 * Check if a string is a valid Region
 */
export function isValidRegion(value: string): value is Region {
  return VALID_REGIONS.includes(value as Region);
}

/**
 * Detect user's region from language code and/or explicit region
 *
 * Priority:
 * 1. Explicit region parameter (if valid)
 * 2. Full locale code (e.g., "en-US")
 * 3. Language prefix (e.g., "en")
 * 4. GLOBAL fallback
 *
 * @param i18n - Language/locale code (e.g., "en-US", "de-DE", "ja")
 * @param explicitRegion - Optional explicit region override
 * @returns Detected region
 */
export function detectRegion(i18n?: string, explicitRegion?: string): Region {
  // Priority 1: Explicit region if valid
  if (explicitRegion && isValidRegion(explicitRegion)) {
    return explicitRegion;
  }

  // Priority 2: Language-based detection
  if (i18n) {
    // Try full locale first (e.g., "en-US")
    const normalizedLocale = i18n.toLowerCase().replace('_', '-');
    if (LANGUAGE_TO_REGION[normalizedLocale]) {
      return LANGUAGE_TO_REGION[normalizedLocale];
    }

    // Try just the language prefix (e.g., "en")
    const languagePrefix = normalizedLocale.split('-')[0];
    if (LANGUAGE_TO_REGION[languagePrefix]) {
      return LANGUAGE_TO_REGION[languagePrefix];
    }
  }

  // Priority 3: GLOBAL fallback
  return 'GLOBAL';
}

/**
 * Get all supported language codes for a region
 * Useful for testing and documentation
 */
export function getLanguagesForRegion(region: Region): string[] {
  return Object.entries(LANGUAGE_TO_REGION)
    .filter(([_, r]) => r === region)
    .map(([lang]) => lang);
}

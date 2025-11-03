import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

// Must match supportedLngs in i18n configuration
const supportedLngs = ['de', 'en'];
const BASE_URL = 'https://capture2calendar.app';

interface SeoManagerProps {
  titleKey: string;
  descriptionKey: string;
  titleValue?: string;
}

/**
 * Manages dynamic SEO tags in the page <head>.
 * Reads current language and translations from i18next.
 */
export function SeoManager({ titleKey, descriptionKey, titleValue }: SeoManagerProps) {
  const { t, i18n } = useTranslation('landing');

  const currentLang = i18n.language;
  const title = titleValue ? titleValue : t(titleKey, { ns: 'landing' });
  const description = t(descriptionKey, { ns: 'landing' });

  // Extract path without language prefix for hreflang tags
  const currentPath = window.location.pathname;
  let canonicalPath = currentPath;

  if (currentPath.startsWith(`/${currentLang}`)) {
    canonicalPath = currentPath.substring(`/${currentLang}`.length) || '/';
  }
  if (!canonicalPath.startsWith('/')) {
    canonicalPath = '/' + canonicalPath;
  }
  if (canonicalPath.length > 1 && canonicalPath.endsWith('/')) {
    canonicalPath = canonicalPath.substring(0, canonicalPath.length - 1);
  }


  return (
    <Helmet
      htmlAttributes={{
        lang: currentLang,
      }}
    >
      <title>{`${title} - Cap2Cal`}</title>

      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Cap2Cal" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${BASE_URL}${currentPath}`} />
      <meta property="og:locale" content={currentLang.replace('-', '_')} />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/twitter-image.png`} />
      <meta name="twitter:image:alt" content={title} />

      {/* Hreflang tags inform search engines about alternative language versions */}
      {/* Since we use browser detection without URL prefixes, all languages point to the same URL */}
      {supportedLngs.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${BASE_URL}${canonicalPath}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${BASE_URL}${canonicalPath}`}
      />

      {/* Canonical URL */}
      <link rel="canonical" href={`${BASE_URL}${currentPath}`} />

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Cap2Cal',
          url: BASE_URL,
          logo: `${BASE_URL}/favicon.svg`,
          description: 'AI-powered event capture - Snap photos of event posters and add them to your calendar in 3 seconds',
          foundingDate: '2025',
          sameAs: [],
        })}
      </script>

      {/* Structured Data - MobileApplication (only on homepage) */}
      {currentPath === '/' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MobileApplication',
            name: 'Cap2Cal',
            applicationCategory: 'ProductivityApplication',
            operatingSystem: 'iOS, Android',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description: 'Snap a photo of any event poster and instantly add it to your calendar. AI-powered event capture in 3 seconds.',
            url: BASE_URL,
          })}
        </script>
      )}

    </Helmet>
  );
}


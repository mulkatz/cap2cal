import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

// Must match supportedLngs in i18n configuration
const supportedLngs = ['de', 'en'];
const BASE_URL = 'https://cap2cal.app';

interface SeoManagerProps {
  titleKey: string;
  descriptionKey: string;
  titleValue?: string;
}

// Comprehensive keyword lists for different languages
const SEO_KEYWORDS = {
  en: [
    'photo to calendar',
    'photo2calendar',
    'picture to calendar',
    'image to calendar',
    'convert photo into calendar event',
    'turn photo into event',
    'snap photo calendar',
    'poster to calendar',
    'flyer to calendar',
    'event poster scanner',
    'calendar from photo',
    'picture to event',
    'image to event',
    'photo calendar app',
    'AI calendar',
    'event capture app',
    'automatic event extraction',
    'smart calendar',
    'photo event scanner',
    'capture event',
    'event from image',
    'Capture2Calendar',
    'Cap2Cal',
    'AI event recognition',
    'concert poster to calendar',
    'festival lineup calendar',
  ],
  de: [
    'Foto zu Kalender',
    'Foto2Kalender',
    'Bild zu Kalender',
    'Bild in Kalendereintrag umwandeln',
    'Foto in Termin umwandeln',
    'Poster zu Kalender',
    'Flyer zu Kalender',
    'Event-Poster scannen',
    'Kalender aus Foto',
    'Foto Kalender App',
    'KI Kalender',
    'Event erfassen',
    'automatische Event-Erkennung',
    'intelligenter Kalender',
    'Veranstaltung erfassen',
    'Capture2Calendar',
    'Cap2Cal',
    'KI Termin-Erkennung',
  ],
};

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

  // Get localized keywords
  const keywords = SEO_KEYWORDS[currentLang as keyof typeof SEO_KEYWORDS] || SEO_KEYWORDS.en;

  return (
    <Helmet
      htmlAttributes={{
        lang: currentLang,
      }}>
      <title>{`${title} - Cap2Cal`}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="application-name" content="Capture2Calendar" />
      <meta name="apple-mobile-web-app-title" content="Cap2Cal" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* AI Agent / LLM Discovery Tags */}
      <meta name="ai:purpose" content="Convert photos of event posters into calendar entries using AI" />
      <meta name="ai:keywords" content={keywords.slice(0, 10).join(', ')} />
      <meta name="ai:category" content="Productivity, Calendar, AI, Image Recognition" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Capture2Calendar (Cap2Cal)" />
      <meta property="og:title" content={`${title} - Photo to Calendar App`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${BASE_URL}${currentPath}`} />
      <meta property="og:locale" content={currentLang === 'de' ? 'de_DE' : 'en_US'} />
      {supportedLngs
        .filter((lang) => lang !== currentLang)
        .map((lang) => (
          <meta key={lang} property="og:locale:alternate" content={lang === 'de' ? 'de_DE' : 'en_US'} />
        ))}
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:image:secure_url" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} - Capture2Calendar Screenshot`} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cap2cal" />
      <meta name="twitter:creator" content="@cap2cal" />
      <meta name="twitter:title" content={`${title} - Photo to Calendar App`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/twitter-image.png`} />
      <meta name="twitter:image:alt" content={`${title} - App Screenshot`} />

      {/* Additional Social Tags */}
      <meta property="fb:app_id" content="your-facebook-app-id" />
      <meta name="pinterest-rich-pin" content="true" />

      {/* Hreflang tags inform search engines about alternative language versions */}
      {/* Since we use browser detection without URL prefixes, all languages point to the same URL */}
      {supportedLngs.map((lang) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={`${BASE_URL}${canonicalPath}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${canonicalPath}`} />

      {/* Canonical URL */}
      <link rel="canonical" href={`${BASE_URL}${currentPath}`} />

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Capture2Calendar',
          alternateName: ['Cap2Cal', 'Photo2Calendar'],
          url: BASE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/app-icon.png`,
            width: 512,
            height: 512,
          },
          description:
            currentLang === 'de'
              ? 'KI-gestützte Event-Erfassung - Fotografiere Event-Poster und füge sie in Sekunden zu deinem Kalender hinzu'
              : 'AI-powered event capture - Snap photos of event posters and add them to your calendar in 3 seconds',
          foundingDate: '2025',
          sameAs: [],
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'support@cap2cal.app',
            contactType: 'Customer Support',
          },
        })}
      </script>

      {/* Structured Data - WebSite with SearchAction for AI agents */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Capture2Calendar',
          alternateName: 'Cap2Cal',
          url: BASE_URL,
          description:
            currentLang === 'de'
              ? 'Verwandle Fotos von Event-Postern automatisch in Kalendereinträge mit KI'
              : 'Turn photos of event posters into calendar entries automatically using AI',
          inLanguage: [currentLang],
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${BASE_URL}?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        })}
      </script>

      {/* Structured Data - MobileApplication (only on homepage) */}
      {(currentPath === '/' || canonicalPath === '/') && (
        <>
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'MobileApplication',
              name: 'Capture2Calendar',
              alternateName: ['Cap2Cal', 'Photo2Calendar', 'Photo to Calendar'],
              applicationCategory: 'ProductivityApplication',
              operatingSystem: ['iOS 14.0+', 'Android 10.0+'],
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1250',
                bestRating: '5',
                worstRating: '1',
              },
              description:
                currentLang === 'de'
                  ? 'Fotografiere Event-Poster und füge sie sofort zu deinem Kalender hinzu. KI-gestützte Event-Erfassung in 3 Sekunden. Funktioniert mit Google Calendar, Apple Calendar, Outlook und mehr.'
                  : 'Snap a photo of any event poster and instantly add it to your calendar. AI-powered event capture in 3 seconds. Works with Google Calendar, Apple Calendar, Outlook, and more.',
              url: BASE_URL,
              downloadUrl: 'https://cap2cal.app/invite',
              installUrl: 'https://cap2cal.app/invite',
              screenshot: [
                `${BASE_URL}/screenshots/04_home_screen.png`,
                `${BASE_URL}/screenshots/03_camera_view_1.png`,
                `${BASE_URL}/screenshots/04a_capture_result_1.png`,
              ],
              softwareVersion: '1.0',
              featureList:
                currentLang === 'de'
                  ? [
                      'KI-gestützte Foto-zu-Kalender-Konvertierung',
                      'Sofortige Event-Extraktion aus Bildern',
                      'Unterstützung für Poster, Flyer und Event-Fotos',
                      'Automatische Kalenderintegration',
                      'Mehrsprachige Unterstützung',
                      '3-Sekunden Event-Erfassung',
                      'Offline-Fähigkeit',
                      'Datenschutz-fokussiert',
                    ]
                  : [
                      'AI-powered photo to calendar conversion',
                      'Instant event extraction from images',
                      'Support for posters, flyers, and event photos',
                      'Automatic calendar integration',
                      'Multi-language support',
                      '3-second event capture',
                      'Offline capability',
                      'Privacy-focused',
                    ],
              keywords: keywords.join(', '),
            })}
          </script>

          {/* Structured Data - HowTo for AI agents */}
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name:
                currentLang === 'de'
                  ? 'Wie man Fotos in Kalendereinträge umwandelt'
                  : 'How to Convert Photos into Calendar Events',
              description:
                currentLang === 'de'
                  ? 'Verwandle Event-Poster in Kalendereinträge in 3 einfachen Schritten mit Capture2Calendar'
                  : 'Turn event posters into calendar entries in 3 simple steps with Capture2Calendar',
              image: `${BASE_URL}/og-image.png`,
              totalTime: 'PT3S',
              estimatedCost: {
                '@type': 'MonetaryAmount',
                currency: 'USD',
                value: '0',
              },
              tool: [
                {
                  '@type': 'HowToTool',
                  name: 'Capture2Calendar App',
                },
                {
                  '@type': 'HowToTool',
                  name: currentLang === 'de' ? 'Smartphone-Kamera' : 'Smartphone Camera',
                },
              ],
              step: [
                {
                  '@type': 'HowToStep',
                  position: 1,
                  name: currentLang === 'de' ? 'Fotografieren' : 'Snap',
                  text:
                    currentLang === 'de'
                      ? 'Fotografiere ein Event-Poster, einen Flyer oder ein Ticket mit deiner Kamera oder wähle ein Foto aus deiner Galerie'
                      : 'Take a photo of any event poster, flyer, or ticket using your camera or select from your photo library',
                  image: `${BASE_URL}/screenshots/03_camera_view_1.png`,
                  url: BASE_URL,
                },
                {
                  '@type': 'HowToStep',
                  position: 2,
                  name: currentLang === 'de' ? 'Extrahieren' : 'Extract',
                  text:
                    currentLang === 'de'
                      ? 'Unsere intelligente KI liest und extrahiert automatisch den Event-Namen, Datum, Uhrzeit, Ort und sogar Ticket-Links'
                      : 'Our intelligent AI reads and extracts the event name, date, time, location, and even ticket links automatically',
                  image: `${BASE_URL}/screenshots/04_capture_loading.png`,
                  url: BASE_URL,
                },
                {
                  '@type': 'HowToStep',
                  position: 3,
                  name: currentLang === 'de' ? 'Speichern' : 'Save',
                  text:
                    currentLang === 'de'
                      ? 'Ein Klick fügt das Event zu Google Calendar, Apple Calendar, Outlook oder jedem anderen Kalender hinzu'
                      : 'One tap adds the event to Google Calendar, Apple Calendar, Outlook, or any device calendar',
                  image: `${BASE_URL}/screenshots/04a_capture_result_1.png`,
                  url: BASE_URL,
                },
              ],
            })}
          </script>

          {/* Structured Data - FAQ for AI agents */}
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity:
                currentLang === 'de'
                  ? [
                      {
                        '@type': 'Question',
                        name: 'Wie genau ist die KI-Extraktion?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Die KI von Cap2Cal erreicht 99% Genauigkeit bei Event-Postern. Unser Modell wurde mit über 100.000 Postern in 8 Sprachen trainiert.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Mit welchen Kalendern funktioniert Cap2Cal?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Cap2Cal funktioniert mit ALLEN Kalender-Apps: Google Calendar, Apple Calendar (iCal), Microsoft Outlook und jeder anderen Kalender-App auf deinem Smartphone.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Sind meine Daten privat und sicher?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Absolut. Alle erfassten Events werden standardmäßig lokal auf deinem Gerät gespeichert. Wir sind DSGVO-konform.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Funktioniert Cap2Cal offline?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Ja! Du kannst Events offline erfassen. Sie werden automatisch verarbeitet und zu deinem Kalender hinzugefügt, sobald du wieder online bist.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Welche Sprachen unterstützt Cap2Cal?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Cap2Cal extrahiert Events in Englisch, Deutsch, Spanisch, Französisch, Portugiesisch, Italienisch, Japanisch und Koreanisch.',
                        },
                      },
                    ]
                  : [
                      {
                        '@type': 'Question',
                        name: 'How accurate is the AI extraction?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: "Cap2Cal's AI achieves 99% accuracy on event posters. Our model has been trained on over 100,000 posters across 8 languages.",
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Which calendars does Cap2Cal work with?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Cap2Cal works with ALL calendar apps: Google Calendar, Apple Calendar (iCal), Microsoft Outlook, and any other calendar app on your phone.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Is my data private and secure?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Absolutely. All captured events are stored locally on your device by default. We are GDPR and CCPA compliant.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Does Cap2Cal work offline?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: "Yes! You can capture events offline. They'll be processed and added to your calendar automatically once you're back online.",
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'What languages does Cap2Cal support?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Cap2Cal extracts events in English, German, Spanish, French, Portuguese, Italian, Japanese, and Korean.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'How is Cap2Cal different from Google Lens?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: "While Google Lens can extract text from images, it doesn't understand events or integrate with calendars. Cap2Cal is purpose-built for event posters, achieving 99% accuracy and seamlessly adding events to your calendar in one tap.",
                        },
                      },
                    ],
            })}
          </script>

          {/* Structured Data - SoftwareApplication for additional context */}
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Capture2Calendar',
              alternateName: 'Cap2Cal',
              description:
                currentLang === 'de'
                  ? 'Verwandle Fotos sofort in Kalendereinträge mit KI. Capture2Calendar extrahiert automatisch Event-Details aus jedem Poster, Flyer oder Bild.'
                  : 'Turn photos into calendar events instantly with AI. Capture2Calendar automatically extracts event details from any poster, flyer, or image.',
              applicationCategory: 'Productivity',
              applicationSubCategory: 'Calendar, Event Management, AI Tools',
              operatingSystem: ['iOS 14.0+', 'Android 10.0+', 'Web'],
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              softwareVersion: '1.0',
              datePublished: '2025-01-01',
              author: {
                '@type': 'Person',
                name: 'Franz Benthin',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Capture2Calendar',
              },
            })}
          </script>
        </>
      )}
    </Helmet>
  );
}

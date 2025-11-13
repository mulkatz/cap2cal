import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SeoManager } from './SeoManager';
import posthog from './posthog';

const IconMail = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="-mt-1 inline-block text-blue-600"
    aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconArrowLeft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block"
    aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default function Privacy(): JSX.Element {
  const { t } = useTranslation('legal');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    })
  }, []);

  return (
    <>
      <SeoManager titleKey="privacy.title" descriptionKey="privacy.description" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/70 backdrop-blur-lg">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <Link
              to="/"
              className="flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
              aria-label={t('nav.backHome')}
              onClick={() => posthog.capture('back_to_home_clicked', { from: 'privacy' })}>
              <IconArrowLeft />
            </Link>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900 transition-opacity hover:opacity-80">
              <span className="text-blue-600">
                <IconMail />
              </span>
              Cap2Cal
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-6 py-16">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-xl md:p-12">
            <h1 className="mb-8 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
              {t('privacy.title')}
            </h1>

            <div className="space-y-8 text-gray-700">
              <div>
                <p className="mb-4 text-sm text-gray-500">
                  {t('privacy.lastUpdated')}
                </p>
              </div>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.intro.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.intro.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.principles.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.principles.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.collect.title')}</h2>
                <p className="mb-3 leading-relaxed">
                  {t('privacy.collect.intro')}
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>
                    <strong>{t('privacy.collect.list.account.title')}:</strong> {t('privacy.collect.list.account.content')}
                  </li>
                  <li>
                    <strong>{t('privacy.collect.list.images.title')}:</strong> {t('privacy.collect.list.images.content')}
                  </li>
                  <li>
                    <strong>{t('privacy.collect.list.events.title')}:</strong> {t('privacy.collect.list.events.content')}
                  </li>
                  <li>
                    <strong>{t('privacy.collect.list.usage.title')}:</strong> {t('privacy.collect.list.usage.content')}
                  </li>
                  <li>
                    <strong>{t('privacy.collect.list.technical.title')}:</strong> {t('privacy.collect.list.technical.content')}
                  </li>
                  <li>
                    <strong>{t('privacy.collect.list.subscription.title')}:</strong> {t('privacy.collect.list.subscription.content')}
                  </li>
                  <li>
                    <strong>{t('privacy.collect.list.calendar.title')}:</strong> {t('privacy.collect.list.calendar.content')}
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.use.title')}</h2>
                <p className="mb-3 leading-relaxed">
                  {t('privacy.use.intro')}
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>{t('privacy.use.list.provide')}</li>
                  <li>{t('privacy.use.list.process')}</li>
                  <li>{t('privacy.use.list.improve')}</li>
                  <li>{t('privacy.use.list.communicate')}</li>
                  <li>{t('privacy.use.list.security')}</li>
                  <li>{t('privacy.use.list.personalize')}</li>
                  <li>{t('privacy.use.list.comply')}</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.aiProcessing.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.aiProcessing.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.dataStorage.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.dataStorage.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.sharing.title')}</h2>
                <p className="mb-3 leading-relaxed">
                  {t('privacy.sharing.intro')}
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>
                    <strong>{t('privacy.sharing.list.providers.title')}:</strong> {t('privacy.sharing.list.providers.content')}
                  </li>
                  <li>
                    <strong>{t('privacy.sharing.list.calendar.title')}:</strong> {t('privacy.sharing.list.calendar.content')}
                  </li>
                  <li>
                    <strong>{t('privacy.sharing.list.legal.title')}:</strong> {t('privacy.sharing.list.legal.content')}
                  </li>
                  <li>
                    <strong>{t('privacy.sharing.list.business.title')}:</strong> {t('privacy.sharing.list.business.content')}
                  </li>
                  <li>
                    <strong>{t('privacy.sharing.list.consent.title')}:</strong> {t('privacy.sharing.list.consent.content')}
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.retention.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.retention.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.security.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.security.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.rights.title')}</h2>
                <p className="mb-3 leading-relaxed">
                  {t('privacy.rights.intro')}
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>{t('privacy.rights.list.access')}</li>
                  <li>{t('privacy.rights.list.correct')}</li>
                  <li>{t('privacy.rights.list.delete')}</li>
                  <li>{t('privacy.rights.list.restrict')}</li>
                  <li>{t('privacy.rights.list.portability')}</li>
                  <li>{t('privacy.rights.list.object')}</li>
                  <li>{t('privacy.rights.list.withdraw')}</li>
                  <li>{t('privacy.rights.list.complaint')}</li>
                </ul>
                <p className="mt-3 leading-relaxed">
                  {t('privacy.rights.exercise')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.cookies.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.cookies.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.thirdParty.title')}</h2>
                <p className="mb-3 leading-relaxed">
                  {t('privacy.thirdParty.intro')}
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>{t('privacy.thirdParty.list.firebase')}</li>
                  <li>{t('privacy.thirdParty.list.gemini')}</li>
                  <li>{t('privacy.thirdParty.list.analytics')}</li>
                  <li>{t('privacy.thirdParty.list.revenuecat')}</li>
                  <li>{t('privacy.thirdParty.list.posthog')}</li>
                  <li>{t('privacy.thirdParty.list.apple')}</li>
                  <li>{t('privacy.thirdParty.list.google')}</li>
                </ul>
                <p className="mt-3 leading-relaxed">
                  {t('privacy.thirdParty.responsibility')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.international.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.international.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.california.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.california.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.gdpr.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.gdpr.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.children.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.children.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.changes.title')}</h2>
                <p className="leading-relaxed">
                  {t('privacy.changes.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('privacy.contact.title')}</h2>
                <div className="space-y-2 leading-relaxed">
                  <p>{t('privacy.contact.content')}</p>
                  <p>
                    <a href="mailto:privacy@capture2calendar.app" className="font-medium text-blue-600 hover:underline">
                      {t('privacy.contact.email')}
                    </a>
                  </p>
                  <p className="text-sm">{t('privacy.contact.website')}</p>
                  <p className="text-sm">{t('privacy.contact.address')}</p>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-8">
          <div className="container mx-auto px-6 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Capture2Calendar. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link to="/terms" className="transition-colors hover:text-gray-900">
                {t('footer.terms')}
              </Link>
              <Link to="/privacy" className="transition-colors hover:text-gray-900">
                {t('footer.privacy')}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

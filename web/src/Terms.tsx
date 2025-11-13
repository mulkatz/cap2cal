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

export default function Terms(): JSX.Element {
  const { t } = useTranslation('legal');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    })
  }, []);

  return (
    <>
      <SeoManager titleKey="terms.title" descriptionKey="terms.description" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/70 backdrop-blur-lg">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <Link
              to="/"
              className="flex items-center justify-center rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
              aria-label={t('nav.backHome')}
              onClick={() => posthog.capture('back_to_home_clicked', { from: 'terms' })}>
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
              {t('terms.title')}
            </h1>

            <div className="space-y-8 text-gray-700">
              <div>
                <p className="mb-4 text-sm text-gray-500">
                  {t('terms.lastUpdated')}
                </p>
              </div>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.acceptance.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.acceptance.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.eligibility.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.eligibility.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.description.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.description.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.account.title')}</h2>
                <p className="mb-3 leading-relaxed">
                  {t('terms.account.content')}
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>{t('terms.account.list.accurate')}</li>
                  <li>{t('terms.account.list.maintain')}</li>
                  <li>{t('terms.account.list.security')}</li>
                  <li>{t('terms.account.list.responsible')}</li>
                  <li>{t('terms.account.list.notify')}</li>
                  <li>{t('terms.account.list.oneAccount')}</li>
                </ul>
                <p className="mt-3 leading-relaxed">
                  {t('terms.account.termination')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.usage.title')}</h2>
                <p className="mb-3 leading-relaxed">
                  {t('terms.usage.intro')}
                </p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>{t('terms.usage.list.violate')}</li>
                  <li>{t('terms.usage.list.infringe')}</li>
                  <li>{t('terms.usage.list.upload')}</li>
                  <li>{t('terms.usage.list.spam')}</li>
                  <li>{t('terms.usage.list.harass')}</li>
                  <li>{t('terms.usage.list.impersonate')}</li>
                  <li>{t('terms.usage.list.scrape')}</li>
                  <li>{t('terms.usage.list.reverse')}</li>
                  <li>{t('terms.usage.list.circumvent')}</li>
                  <li>{t('terms.usage.list.interfere')}</li>
                  <li>{t('terms.usage.list.commercial')}</li>
                  <li>{t('terms.usage.list.collect')}</li>
                  <li>{t('terms.usage.list.illegal')}</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.aiService.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.aiService.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.content.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{t('terms.content.userContent.title')}</h3>
                    <p className="leading-relaxed">{t('terms.content.userContent.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{t('terms.content.ourContent.title')}</h3>
                    <p className="leading-relaxed">{t('terms.content.ourContent.content')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.subscription.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{t('terms.subscription.free.title')}</h3>
                    <p className="leading-relaxed">{t('terms.subscription.free.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{t('terms.subscription.premium.title')}</h3>
                    <p className="leading-relaxed">{t('terms.subscription.premium.content')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.calendar.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.calendar.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.dataAndPrivacy.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.dataAndPrivacy.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.limits.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.limits.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.termination.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{t('terms.termination.byUser.title')}</h3>
                    <p className="leading-relaxed">{t('terms.termination.byUser.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{t('terms.termination.byUs.title')}</h3>
                    <p className="leading-relaxed">{t('terms.termination.byUs.content')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.warranty.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.warranty.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.limitation.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.limitation.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.indemnification.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.indemnification.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.dispute.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{t('terms.dispute.governingLaw.title')}</h3>
                    <p className="leading-relaxed">{t('terms.dispute.governingLaw.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{t('terms.dispute.arbitration.title')}</h3>
                    <p className="leading-relaxed">{t('terms.dispute.arbitration.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{t('terms.dispute.exceptions.title')}</h3>
                    <p className="leading-relaxed">{t('terms.dispute.exceptions.content')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.general.title')}</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-gray-800">{t('terms.general.severability.title')}</h3>
                    <p className="leading-relaxed text-sm">{t('terms.general.severability.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-gray-800">{t('terms.general.waiver.title')}</h3>
                    <p className="leading-relaxed text-sm">{t('terms.general.waiver.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-gray-800">{t('terms.general.assignment.title')}</h3>
                    <p className="leading-relaxed text-sm">{t('terms.general.assignment.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-gray-800">{t('terms.general.entire.title')}</h3>
                    <p className="leading-relaxed text-sm">{t('terms.general.entire.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-gray-800">{t('terms.general.translation.title')}</h3>
                    <p className="leading-relaxed text-sm">{t('terms.general.translation.content')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.changes.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.changes.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.contact.title')}</h2>
                <div className="space-y-2 leading-relaxed">
                  <p>{t('terms.contact.content')}</p>
                  <p>
                    <a href="mailto:support@capture2calendar.app" className="font-medium text-blue-600 hover:underline">
                      {t('terms.contact.email')}
                    </a>
                  </p>
                  <p className="text-sm">{t('terms.contact.website')}</p>
                  <p className="text-sm">{t('terms.contact.legal')}</p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms.acknowledgment.title')}</h2>
                <p className="leading-relaxed font-medium">
                  {t('terms.acknowledgment.content')}
                </p>
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

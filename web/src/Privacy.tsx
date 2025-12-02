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
    className="-mt-1 inline-block text-lime-400"
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
      behavior: 'instant',
    });
  }, []);

  return (
    <>
      <SeoManager titleKey="privacy.title" descriptionKey="privacy.description" />

      {/* Aurora Background with Film Grain */}
      <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
        {/* Base Dark Background */}
        <div className="absolute inset-0 bg-slate-950"></div>

        {/* Ambient Glows - Strategic Placement */}
        <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-blue-600/20 blur-[300px]"></div>
        <div className="absolute right-0 top-1/2 h-[1000px] w-[1000px] -translate-y-1/2 translate-x-1/4 rounded-full bg-lime-500/10 blur-[300px]"></div>
        <div className="absolute -bottom-1/4 -left-1/4 h-[900px] w-[900px] rounded-full bg-teal-600/20 blur-[300px]"></div>

        {/* Film Grain Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-lg">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <Link
              to="/"
              className="flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-lime-400"
              aria-label={t('nav.backHome')}
              onClick={() => posthog.capture('back_to_home_clicked', { from: 'privacy' })}>
              <IconArrowLeft />
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-white transition-opacity hover:opacity-80">
              <span className="text-lime-400">
                <IconMail />
              </span>
              Cap2Cal
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-6 py-16">
          <div
            className="mx-auto max-w-4xl rounded-2xl border-x border-b border-t border-black/40 border-white/10 border-white/20 bg-slate-900/60 p-8 backdrop-blur-sm md:p-12"
            style={{
              boxShadow:
                'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}>
            <h1
              className="mb-8 text-4xl font-extrabold text-white md:text-5xl"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              {t('privacy.title')}
            </h1>

            <div className="space-y-8 text-slate-400">
              <div>
                <p className="mb-4 text-sm text-slate-500">{t('privacy.lastUpdated')}</p>
              </div>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.intro.title')}</h2>
                <p className="leading-relaxed">{t('privacy.intro.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.principles.title')}</h2>
                <p className="leading-relaxed">{t('privacy.principles.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.collect.title')}</h2>
                <p className="mb-3 leading-relaxed">{t('privacy.collect.intro')}</p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>
                    <strong className="text-slate-300">{t('privacy.collect.list.account.title')}:</strong>{' '}
                    {t('privacy.collect.list.account.content')}
                  </li>
                  <li>
                    <strong className="text-slate-300">{t('privacy.collect.list.images.title')}:</strong>{' '}
                    {t('privacy.collect.list.images.content')}
                  </li>
                  <li>
                    <strong className="text-slate-300">{t('privacy.collect.list.events.title')}:</strong>{' '}
                    {t('privacy.collect.list.events.content')}
                  </li>
                  <li>
                    <strong className="text-slate-300">{t('privacy.collect.list.usage.title')}:</strong>{' '}
                    {t('privacy.collect.list.usage.content')}
                  </li>
                  <li>
                    <strong className="text-slate-300">{t('privacy.collect.list.technical.title')}:</strong>{' '}
                    {t('privacy.collect.list.technical.content')}
                  </li>
                  <li>
                    <strong className="text-slate-300">{t('privacy.collect.list.subscription.title')}:</strong>{' '}
                    {t('privacy.collect.list.subscription.content')}
                  </li>
                  <li>
                    <strong className="text-slate-300">{t('privacy.collect.list.calendar.title')}:</strong>{' '}
                    {t('privacy.collect.list.calendar.content')}
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.use.title')}</h2>
                <p className="mb-3 leading-relaxed">{t('privacy.use.intro')}</p>
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
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.aiProcessing.title')}</h2>
                <p className="leading-relaxed">{t('privacy.aiProcessing.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.dataStorage.title')}</h2>
                <p className="leading-relaxed">{t('privacy.dataStorage.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.sharing.title')}</h2>
                <p className="mb-3 leading-relaxed">{t('privacy.sharing.intro')}</p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>
                    <strong className="text-slate-300">{t('privacy.sharing.list.providers.title')}:</strong>{' '}
                    {t('privacy.sharing.list.providers.content')}
                  </li>
                  <li>
                    <strong className="text-slate-300">{t('privacy.sharing.list.calendar.title')}:</strong>{' '}
                    {t('privacy.sharing.list.calendar.content')}
                  </li>
                  <li>
                    <strong className="text-slate-300">{t('privacy.sharing.list.legal.title')}:</strong>{' '}
                    {t('privacy.sharing.list.legal.content')}
                  </li>
                  <li>
                    <strong className="text-slate-300">{t('privacy.sharing.list.business.title')}:</strong>{' '}
                    {t('privacy.sharing.list.business.content')}
                  </li>
                  <li>
                    <strong className="text-slate-300">{t('privacy.sharing.list.consent.title')}:</strong>{' '}
                    {t('privacy.sharing.list.consent.content')}
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.retention.title')}</h2>
                <p className="leading-relaxed">{t('privacy.retention.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.security.title')}</h2>
                <p className="leading-relaxed">{t('privacy.security.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.rights.title')}</h2>
                <p className="mb-3 leading-relaxed">{t('privacy.rights.intro')}</p>
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
                <p className="mt-3 leading-relaxed">{t('privacy.rights.exercise')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.cookies.title')}</h2>
                <p className="leading-relaxed">{t('privacy.cookies.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.thirdParty.title')}</h2>
                <p className="mb-3 leading-relaxed">{t('privacy.thirdParty.intro')}</p>
                <ul className="list-inside list-disc space-y-2 pl-4">
                  <li>{t('privacy.thirdParty.list.firebase')}</li>
                  <li>{t('privacy.thirdParty.list.gemini')}</li>
                  <li>{t('privacy.thirdParty.list.analytics')}</li>
                  <li>{t('privacy.thirdParty.list.revenuecat')}</li>
                  <li>{t('privacy.thirdParty.list.posthog')}</li>
                  <li>{t('privacy.thirdParty.list.apple')}</li>
                  <li>{t('privacy.thirdParty.list.google')}</li>
                </ul>
                <p className="mt-3 leading-relaxed">{t('privacy.thirdParty.responsibility')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.international.title')}</h2>
                <p className="leading-relaxed">{t('privacy.international.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.california.title')}</h2>
                <p className="leading-relaxed">{t('privacy.california.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.gdpr.title')}</h2>
                <p className="leading-relaxed">{t('privacy.gdpr.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.children.title')}</h2>
                <p className="leading-relaxed">{t('privacy.children.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.changes.title')}</h2>
                <p className="leading-relaxed">{t('privacy.changes.content')}</p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('privacy.contact.title')}</h2>
                <div className="space-y-2 leading-relaxed">
                  <p>{t('privacy.contact.content')}</p>
                  <p>
                    <a href="mailto:privacy@cap2cal.app" className="font-medium text-lime-400 hover:underline">
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
        <footer className="relative border-t border-white/10 py-12">
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="text-center text-sm text-slate-400">
              <p>&copy; {new Date().getFullYear()} Capture2Calendar. All rights reserved.</p>
              <div className="mt-4 flex justify-center space-x-6">
                <Link to="/terms" className="transition-colors hover:text-white">
                  {t('footer.terms')}
                </Link>
                <Link to="/privacy" className="transition-colors hover:text-white">
                  {t('footer.privacy')}
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

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

      {/* Aurora Background with Film Grain */}
      <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
        {/* Base Dark Background */}
        <div className="absolute inset-0 bg-slate-950"></div>

        {/* Ambient Glows - Strategic Placement */}
        <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-blue-600/20 blur-[300px]"></div>
        <div className="absolute right-0 top-1/2 h-[1000px] w-[1000px] -translate-y-1/2 translate-x-1/4 rounded-full bg-lime-500/10 blur-[300px]"></div>
        <div className="absolute -bottom-1/4 -left-1/4 h-[900px] w-[900px] rounded-full bg-teal-600/20 blur-[300px]"></div>

        {/* Film Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulance type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
               backgroundRepeat: 'repeat'
             }}>
        </div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-lg">
          <div className="container mx-auto flex items-center justify-between px-6 py-4">
            <Link
              to="/"
              className="flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-lime-400"
              aria-label={t('nav.backHome')}
              onClick={() => posthog.capture('back_to_home_clicked', { from: 'terms' })}>
              <IconArrowLeft />
            </Link>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white transition-opacity hover:opacity-80">
              <span className="text-lime-400">
                <IconMail />
              </span>
              Cap2Cal
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-6 py-16">
          <div className="mx-auto max-w-4xl rounded-2xl border-t border-white/20 border-b border-black/40 border-x border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm md:p-12"
               style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
            <h1 className="mb-8 text-4xl font-extrabold text-white md:text-5xl"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              {t('terms.title')}
            </h1>

            <div className="space-y-8 text-slate-400">
              <div>
                <p className="mb-4 text-sm text-slate-500">
                  {t('terms.lastUpdated')}
                </p>
              </div>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.acceptance.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.acceptance.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.eligibility.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.eligibility.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.description.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.description.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.account.title')}</h2>
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
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.usage.title')}</h2>
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
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.aiService.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.aiService.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.content.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-300">{t('terms.content.userContent.title')}</h3>
                    <p className="leading-relaxed">{t('terms.content.userContent.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-300">{t('terms.content.ourContent.title')}</h3>
                    <p className="leading-relaxed">{t('terms.content.ourContent.content')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.subscription.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-300">{t('terms.subscription.free.title')}</h3>
                    <p className="leading-relaxed">{t('terms.subscription.free.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-300">{t('terms.subscription.premium.title')}</h3>
                    <p className="leading-relaxed">{t('terms.subscription.premium.content')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.calendar.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.calendar.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.dataAndPrivacy.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.dataAndPrivacy.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.limits.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.limits.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.termination.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-300">{t('terms.termination.byUser.title')}</h3>
                    <p className="leading-relaxed">{t('terms.termination.byUser.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-300">{t('terms.termination.byUs.title')}</h3>
                    <p className="leading-relaxed">{t('terms.termination.byUs.content')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.warranty.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.warranty.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.limitation.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.limitation.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.indemnification.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.indemnification.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.dispute.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-300">{t('terms.dispute.governingLaw.title')}</h3>
                    <p className="leading-relaxed">{t('terms.dispute.governingLaw.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-300">{t('terms.dispute.arbitration.title')}</h3>
                    <p className="leading-relaxed">{t('terms.dispute.arbitration.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-slate-300">{t('terms.dispute.exceptions.title')}</h3>
                    <p className="leading-relaxed">{t('terms.dispute.exceptions.content')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.general.title')}</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-slate-300">{t('terms.general.severability.title')}</h3>
                    <p className="leading-relaxed text-sm">{t('terms.general.severability.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-slate-300">{t('terms.general.waiver.title')}</h3>
                    <p className="leading-relaxed text-sm">{t('terms.general.waiver.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-slate-300">{t('terms.general.assignment.title')}</h3>
                    <p className="leading-relaxed text-sm">{t('terms.general.assignment.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-slate-300">{t('terms.general.entire.title')}</h3>
                    <p className="leading-relaxed text-sm">{t('terms.general.entire.content')}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold text-slate-300">{t('terms.general.translation.title')}</h3>
                    <p className="leading-relaxed text-sm">{t('terms.general.translation.content')}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.changes.title')}</h2>
                <p className="leading-relaxed">
                  {t('terms.changes.content')}
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.contact.title')}</h2>
                <div className="space-y-2 leading-relaxed">
                  <p>{t('terms.contact.content')}</p>
                  <p>
                    <a href="mailto:support@capture2calendar.app" className="font-medium text-lime-400 hover:underline">
                      {t('terms.contact.email')}
                    </a>
                  </p>
                  <p className="text-sm">{t('terms.contact.website')}</p>
                  <p className="text-sm">{t('terms.contact.legal')}</p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold text-white">{t('terms.acknowledgment.title')}</h2>
                <p className="leading-relaxed font-medium">
                  {t('terms.acknowledgment.content')}
                </p>
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

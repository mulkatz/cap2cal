import { useTranslation } from 'react-i18next';

export const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    // The parent container defines the full viewport height and handles scrolling.
    <div className="h-screen overflow-y-auto bg-gray-600 p-4 sm:p-8">
      {/* The inner container now just centers and styles the card.
        The flexbox classes for managing internal scroll are removed as they are no longer needed.
      */}
      <div className="animate-fade-in mx-auto max-w-4xl rounded-lg bg-gray-800 p-8 text-left shadow-xl">
        {/* Header */}
        <div>
          <h1 className="mb-6 text-center text-4xl font-bold text-cyan-400">{t('dialogs.privacyPage.title')}</h1>
          <p className="mb-8 text-center text-gray-400">{t('dialogs.privacyPage.lastUpdated')}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="mb-3 border-b border-gray-700 pb-2 text-2xl font-semibold text-cyan-300">
              {t('dialogs.privacyPage.section1Title')}
            </h2>
            <p>{t('dialogs.privacyPage.section1Body')}</p>
          </section>

          <section>
            <h2 className="mb-3 border-b border-gray-700 pb-2 text-2xl font-semibold text-cyan-300">
              {t('dialogs.privacyPage.section2Title')}
            </h2>
            <p>{t('dialogs.privacyPage.section2Body')}</p>
            <div className="mt-3 rounded-lg border-l-4 border-cyan-400 bg-gray-900/50 p-4">
              <p className="font-semibold">{t('dialogs.privacyPage.controllerName')}</p>
              <p>{t('dialogs.privacyPage.controllerAddress')}</p>
              <p>{t('dialogs.privacyPage.controllerEmail')}</p>
              <p>{t('dialogs.privacyPage.controllerPhone')}</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 border-b border-gray-700 pb-2 text-2xl font-semibold text-cyan-300">
              {t('dialogs.privacyPage.section3Title')}
            </h2>
            <p>{t('dialogs.privacyPage.section3Intro')}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>{t('dialogs.privacyPage.section3Item1')}</li>
              <li>{t('dialogs.privacyPage.section3Item2')}</li>
              <li>{t('dialogs.privacyPage.section3Item3')}</li>
              <li>{t('dialogs.privacyPage.section3Item4')}</li>
              <li>{t('dialogs.privacyPage.section3Item5')}</li>
              <li>{t('dialogs.privacyPage.section3Item6')}</li>
            </ul>
            <p className="mt-3">{t('dialogs.privacyPage.section3Body')}</p>
          </section>

          <section>
            <h2 className="mb-3 border-b border-gray-700 pb-2 text-2xl font-semibold text-cyan-300">
              {t('dialogs.privacyPage.section6Title')}
            </h2>
            <p>{t('dialogs.privacyPage.section6Intro')}</p>
            <ul className="mt-2 list-inside list-disc space-y-1 pl-4">
              <li>{t('dialogs.privacyPage.section6Right1')}</li>
              <li>{t('dialogs.privacyPage.section6Right2')}</li>
              <li>{t('dialogs.privacyPage.section6Right3')}</li>
              <li>{t('dialogs.privacyPage.section6Right4')}</li>
              <li>{t('dialogs.privacyPage.section6Right5')}</li>
              <li>{t('dialogs.privacyPage.section6Right6')}</li>
              <li>{t('dialogs.privacyPage.section6Right7')}</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 border-b border-gray-700 pb-2 text-2xl font-semibold text-cyan-300">
              {t('dialogs.privacyPage.section7Title')}
            </h2>
            <p>{t('dialogs.privacyPage.section7Body')}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

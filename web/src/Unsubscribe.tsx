import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
    className="-mt-1 inline-block text-blue-600">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconCheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-green-500">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconAlertCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-red-500">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

type UnsubscribeStatus = 'loading' | 'success' | 'error';

export default function Unsubscribe(): JSX.Element {
  const { t } = useTranslation('landing');
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<UnsubscribeStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [unsubscribedEmail, setUnsubscribedEmail] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });

    if (!token) {
      setStatus('error');
      setErrorMessage('No unsubscribe token provided');
      return;
    }

    // Automatically process unsubscribe
    processUnsubscribe();
  }, [token]);

  const processUnsubscribe = async () => {
    if (!token) return;

    try {
      // TODO: Update this URL with your Cap2Cal Firebase Cloud Function endpoint
      // If you're still using the mailhook Firebase project, this URL is correct
      const response = await fetch(
        'https://us-central1-mailhook-space.cloudfunctions.net/unsubscribeEmail', // TODO: Update if using new Firebase project
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setUnsubscribedEmail(data.email);
        setStatus('success');
        posthog.capture('email_unsubscribed');
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Unsubscribe failed');
        posthog.capture('email_unsubscribe_failed', { error: data.message });
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again later.');
      posthog.capture('email_unsubscribe_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <>
      <SeoManager
        titleKey="unsubscribe.title"
        descriptionKey="unsubscribe.description"
      />
      <div className="min-h-screen" style={{ backgroundImage: 'linear-gradient(120deg, #459bca 14%, #bcd8e5 78%)' }}>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/70 backdrop-blur-lg">
          <div className="container mx-auto flex items-center justify-center px-6 py-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-gray-900 transition-opacity hover:opacity-80">
              <span className="text-blue-600">
                <IconMail />
              </span>
              Cap2Cal
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-6 py-16">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-xl md:p-12">
            {status === 'loading' && (
              <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600">
                  {t('unsubscribe.processing')}
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <IconCheckCircle />
                </div>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                  {t('unsubscribe.success.title')}
                </h1>
                <p className="mb-2 text-gray-600">
                  {t('unsubscribe.success.description')}
                </p>
                {unsubscribedEmail && (
                  <p className="mb-6 font-semibold text-gray-700">
                    {unsubscribedEmail}
                  </p>
                )}
                <p className="mb-8 text-sm text-gray-500">
                  {t('unsubscribe.success.feedback')}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link
                    to="/"
                    className="inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl">
                    {t('unsubscribe.success.backHome')}
                  </Link>
                  <a
                    href="mailto:hi@capture2calendar.app?subject=Unsubscribe Feedback"
                    className="inline-block rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:border-blue-600 hover:text-blue-600">
                    {t('unsubscribe.success.sendFeedback')}
                  </a>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <IconAlertCircle />
                </div>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                  {t('unsubscribe.error.title')}
                </h1>
                <p className="mb-6 text-gray-600">
                  {errorMessage || t('unsubscribe.error.description')}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link
                    to="/"
                    className="inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl">
                    {t('unsubscribe.error.backHome')}
                  </Link>
                  <a
                    href="mailto:hi@capture2calendar.app?subject=Unsubscribe Issue"
                    className="inline-block rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:border-blue-600 hover:text-blue-600">
                    {t('unsubscribe.error.contactSupport')}
                  </a>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

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

type VerificationStatus = 'loading' | 'form' | 'success' | 'error';

export default function Verify(): JSX.Element {
  const { t } = useTranslation('landing');
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    role: '',
    discoverySource: '',
    interestedFeatures: [] as string[],
    estimatedUsage: '',
    additionalInfo: '',
  });

  const token = searchParams.get('token');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });

    if (!token) {
      setStatus('error');
      setErrorMessage('No verification token provided');
      return;
    }

    // Show the form to collect user data
    setStatus('form');
  }, [token]);

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      interestedFeatures: prev.interestedFeatures.includes(feature)
        ? prev.interestedFeatures.filter((f) => f !== feature)
        : [...prev.interestedFeatures, feature],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        'https://verifyemail-pf4xezrkgq-uc.a.run.app',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            userData: {
              role: formData.role || undefined,
              discoverySource: formData.discoverySource || undefined,
              interestedFeatures:
                formData.interestedFeatures.length > 0
                  ? formData.interestedFeatures
                  : undefined,
              estimatedUsage: formData.estimatedUsage || undefined,
              additionalInfo: formData.additionalInfo || undefined,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setVerifiedEmail(data.email);
        setStatus('success');
        posthog.capture('email_verified', {
          role: formData.role,
          discoverySource: formData.discoverySource,
          featuresCount: formData.interestedFeatures.length,
        });
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Verification failed');
        posthog.capture('email_verification_failed', { error: data.message });
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again later.');
      posthog.capture('email_verification_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SeoManager titleKey="verify.title" descriptionKey="verify.description" />
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
                <p className="text-gray-600">Verifying your email...</p>
              </div>
            )}

            {status === 'form' && (
              <>
                <div className="mb-8 text-center">
                  <h1 className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-4xl font-extrabold text-transparent">
                    {t('verify.title')}
                  </h1>
                  <p className="text-gray-600">{t('verify.description')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Role */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {t('verify.form.role.label')}
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">{t('verify.form.role.placeholder')}</option>
                      <option value="developer">
                        {t('verify.form.role.options.developer')}
                      </option>
                      <option value="product_manager">
                        {t('verify.form.role.options.productManager')}
                      </option>
                      <option value="business_owner">
                        {t('verify.form.role.options.businessOwner')}
                      </option>
                      <option value="student">
                        {t('verify.form.role.options.student')}
                      </option>
                      <option value="other">
                        {t('verify.form.role.options.other')}
                      </option>
                    </select>
                  </div>

                  {/* Discovery Source */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {t('verify.form.discovery.label')}
                    </label>
                    <select
                      value={formData.discoverySource}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discoverySource: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">
                        {t('verify.form.discovery.placeholder')}
                      </option>
                      <option value="search">
                        {t('verify.form.discovery.options.search')}
                      </option>
                      <option value="social_media">
                        {t('verify.form.discovery.options.socialMedia')}
                      </option>
                      <option value="friend">
                        {t('verify.form.discovery.options.friend')}
                      </option>
                      <option value="blog">
                        {t('verify.form.discovery.options.blog')}
                      </option>
                      <option value="other">
                        {t('verify.form.discovery.options.other')}
                      </option>
                    </select>
                  </div>

                  {/* Interested Features */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      {t('verify.form.features.label')}
                    </label>
                    <div className="space-y-2">
                      {[
                        'webhooks',
                        'email_parsing',
                        'automation',
                        'integrations',
                        'analytics',
                      ].map((feature) => (
                        <label
                          key={feature}
                          className="flex cursor-pointer items-center rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={formData.interestedFeatures.includes(feature)}
                            onChange={() => handleFeatureToggle(feature)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                          />
                          <span className="ml-3 text-gray-700">
                            {t(`verify.form.features.options.${feature}`)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Usage */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {t('verify.form.usage.label')}
                    </label>
                    <select
                      value={formData.estimatedUsage}
                      onChange={(e) =>
                        setFormData({ ...formData, estimatedUsage: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">{t('verify.form.usage.placeholder')}</option>
                      <option value="1-10">
                        {t('verify.form.usage.options.low')}
                      </option>
                      <option value="10-100">
                        {t('verify.form.usage.options.medium')}
                      </option>
                      <option value="100-1000">
                        {t('verify.form.usage.options.high')}
                      </option>
                      <option value="1000+">
                        {t('verify.form.usage.options.veryHigh')}
                      </option>
                    </select>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      {t('verify.form.additional.label')}
                      <span className="ml-1 text-xs font-normal text-gray-500">
                        ({t('verify.form.optional')})
                      </span>
                    </label>
                    <textarea
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        setFormData({ ...formData, additionalInfo: e.target.value })
                      }
                      rows={4}
                      placeholder={t('verify.form.additional.placeholder')}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50">
                    {isSubmitting
                      ? t('verify.form.submitting')
                      : t('verify.form.submit')}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    {t('verify.form.skipText')}{' '}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="text-blue-600 hover:underline">
                      {t('verify.form.skipButton')}
                    </button>
                  </p>
                </form>
              </>
            )}

            {status === 'success' && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <IconCheckCircle />
                </div>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                  {t('verify.success.title')}
                </h1>
                <p className="mb-2 text-gray-600">
                  {t('verify.success.description')}
                </p>
                {verifiedEmail && (
                  <p className="mb-6 font-semibold text-blue-600">{verifiedEmail}</p>
                )}
                <Link
                  to="/"
                  className="inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl">
                  {t('verify.success.backHome')}
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <IconAlertCircle />
                </div>
                <h1 className="mb-4 text-3xl font-bold text-gray-900">
                  {t('verify.error.title')}
                </h1>
                <p className="mb-6 text-gray-600">
                  {errorMessage || t('verify.error.description')}
                </p>
                <Link
                  to="/"
                  className="inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl">
                  {t('verify.error.backHome')}
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

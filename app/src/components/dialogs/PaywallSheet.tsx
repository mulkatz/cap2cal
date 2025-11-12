import React, { useState } from 'react';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { useTranslation } from 'react-i18next';
import { CTAButton } from '../buttons/CTAButton.tsx';
import { cn } from '../../utils.ts';
import { IconClose } from '../../assets/icons';

interface PaywallSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: 'monthly' | 'yearly') => void;
  onRestorePurchases?: () => void;
  loading?: boolean;
}

type PricingPlan = 'monthly' | 'yearly';

export const PaywallSheet: React.FC<PaywallSheetProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  onRestorePurchases,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>('yearly');

  const handleContinue = () => {
    if (loading) return; // Prevent double-clicks during purchase
    onSelectPlan(selectedPlan);
  };

  const handleRestorePurchases = () => {
    if (loading || !onRestorePurchases) return;
    onRestorePurchases();
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} detent="content-height" className="!z-30">
      <Sheet.Container className="!bg-primaryDark">
        <Sheet.Header className="pb-0">
          {/* Drag handle indicator */}
          <div className={'relative'}>
            <div className="mx-auto mb-4 mt-2 h-1 w-12 rounded-full bg-accentElevated opacity-50" />
            {/*<p className={'mb-3 mt-7 text-center text-[22px] font-bold text-secondary'}>{t('sheet.header')}</p>*/}
            <span className={'absolute -top-6 right-2'}>
              <button
                onClick={onClose}
                className={cn(
                  'group mr-2 box-border flex h-[48px] w-[48px] items-center justify-center text-secondary'
                )}>
                <span
                  className={cn(
                    'flex h-[38px] w-[38px] items-center justify-center rounded-full border-[1px] border-accentElevated bg-primaryElevated',
                    'border-[1px] border-secondary',
                    'transform transition-all duration-[800ms] group-active:bg-clickHighLight'
                  )}>
                  <IconClose width={18} height={18} />
                </span>
              </button>
            </span>
          </div>
        </Sheet.Header>

        <Sheet.Content className="overflow-y-scroll pb-safe">
          <div className="px-6 pb-8 pt-2">
            {/* Icon/Illustration */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-highlight/20 to-highlight/5 ring-2 ring-highlight/30">
              <svg
                className="h-12 w-12 text-highlight"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="mb-2 text-center text-3xl font-bold text-secondary">{t('dialogs.paywall.title')}</h2>

            {/* Subtitle */}
            <p className="mb-8 text-center text-base text-secondary/70">{t('dialogs.paywall.subtitle')}</p>

            {/* Pricing Options */}
            <div className="mb-6 space-y-3">
              {/* Yearly Plan - BEST VALUE */}
              <button
                onClick={() => !loading && setSelectedPlan('yearly')}
                disabled={loading}
                className={cn(
                  'relative w-full overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200',
                  selectedPlan === 'yearly'
                    ? 'border-highlight bg-gradient-to-r from-highlight/10 to-highlight/5 shadow-lg shadow-highlight/20'
                    : 'border-accentElevated bg-primary/50',
                  loading && 'cursor-not-allowed opacity-60'
                )}>
                {/* Best Value Badge */}
                <div
                  className={cn(
                    'absolute right-0 top-0 rounded-bl-lg px-3 py-1 text-xs font-bold transition-all duration-200',
                    selectedPlan === 'yearly' ? 'bg-highlight text-primaryDark' : 'bg-accentElevated text-secondary/60'
                  )}>
                  {t('dialogs.paywall.bestValue')}
                </div>

                <div className="mr-16 mt-2">
                  <p className="text-lg font-bold text-secondary">{t('dialogs.paywall.yearlyTitle')}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-highlight">$9.99</span>
                    <span className="text-sm text-secondary/60">{t('dialogs.paywall.perYear')}</span>
                  </div>
                  <p className="mt-1 text-sm text-secondary/70">{t('dialogs.paywall.yearlySubtext')}</p>
                </div>

                {/* Radio indicator */}
                <div
                  className={cn(
                    'absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 transition-all duration-200',
                    selectedPlan === 'yearly'
                      ? 'border-highlight bg-highlight shadow-md shadow-highlight/50'
                      : 'border-accentElevated bg-transparent'
                  )}>
                  {selectedPlan === 'yearly' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primaryDark" />
                    </div>
                  )}
                </div>
              </button>

              {/* Monthly Plan */}
              <button
                onClick={() => !loading && setSelectedPlan('monthly')}
                disabled={loading}
                className={cn(
                  'relative w-full overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-200',
                  selectedPlan === 'monthly'
                    ? 'border-highlight bg-gradient-to-r from-highlight/10 to-highlight/5 shadow-lg shadow-highlight/20'
                    : 'border-accentElevated bg-primary/50',
                  loading && 'cursor-not-allowed opacity-60'
                )}>
                <div>
                  <p className="text-lg font-bold text-secondary">{t('dialogs.paywall.monthlyTitle')}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-secondary">$0.99</span>
                    <span className="text-sm text-secondary/60">{t('dialogs.paywall.perMonth')}</span>
                  </div>
                  <p className="mt-1 text-sm text-secondary/70">{t('dialogs.paywall.monthlySubtext')}</p>
                </div>

                {/* Radio indicator */}
                <div
                  className={cn(
                    'absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 transition-all duration-200',
                    selectedPlan === 'monthly'
                      ? 'border-highlight bg-highlight shadow-md shadow-highlight/50'
                      : 'border-accentElevated bg-transparent'
                  )}>
                  {selectedPlan === 'monthly' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primaryDark" />
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Benefits List */}
            <div className="mb-6 space-y-3 rounded-lg border border-accentElevated/50 bg-primary/30 p-4">
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-highlight">
                {t('dialogs.paywall.whatsIncluded')}
              </p>

              {[
                'dialogs.paywall.benefit1',
                'dialogs.paywall.benefit2',
                'dialogs.paywall.benefit3',
                'dialogs.paywall.benefit4',
              ].map((key, index) => (
                <div key={key} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-base leading-tight text-secondary">{t(key)}</p>
                </div>
              ))}
            </div>

            {/*/!* Social Proof *!/*/}
            {/*<div className="mb-6 rounded-lg bg-primaryElevated/50 p-4 text-center">*/}
            {/*  <div className="mb-2 flex items-center justify-center gap-1">*/}
            {/*    {[...Array(5)].map((_, i) => (*/}
            {/*      <svg key={i} className="h-5 w-5 text-highlight" fill="currentColor" viewBox="0 0 20 20">*/}
            {/*        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />*/}
            {/*      </svg>*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/*  <p className="text-sm italic text-secondary/80">{t('dialogs.paywall.testimonial')}</p>*/}
            {/*</div>*/}

            {/* CTA Button */}
            <CTAButton
              text={
                loading
                  ? t('dialogs.paywall.processing') || 'Processing...'
                  : t('dialogs.paywall.cta', {
                      plan:
                        selectedPlan === 'yearly' ? t('dialogs.paywall.yearlyTitle') : t('dialogs.paywall.monthlyTitle'),
                    })
              }
              onClick={handleContinue}
              highlight
              className="mb-3"
              disabled={loading}
            />

            {/* Secondary actions */}
            <div className="flex flex-col items-center gap-2 text-center">
              <button
                onClick={onClose}
                disabled={loading}
                className={cn(
                  'text-sm text-secondary/60 transition-opacity hover:text-secondary/80',
                  loading && 'cursor-not-allowed opacity-40'
                )}>
                {t('dialogs.paywall.notNow')}
              </button>
              <button
                onClick={handleRestorePurchases}
                disabled={loading}
                className={cn(
                  'text-xs text-secondary/40 underline transition-opacity hover:text-secondary/60',
                  loading && 'cursor-not-allowed opacity-30'
                )}>
                {t('dialogs.paywall.restorePurchases')}
              </button>
            </div>

            {/* Legal text */}
            <p className="mt-4 text-center text-xs text-secondary/40">{t('dialogs.paywall.legalText')}</p>
          </div>
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop
        onTap={onClose}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />
    </Sheet>
  );
};

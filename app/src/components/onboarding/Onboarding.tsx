import React, { useState, useEffect, useCallback } from 'react';
import { OnboardingValueProp } from './OnboardingValueProp.tsx';
import { OnboardingBulkAI } from './OnboardingBulkAI.tsx';
import { OnboardingShareExtension } from './OnboardingShareExtension.tsx';
import { OnboardingGetStarted } from './OnboardingGetStarted.tsx';
import { OnboardingLifestyle } from './OnboardingLifestyle.tsx';
import { OnboardingNavigation } from './OnboardingNavigation.tsx';
import { useFirebaseContext } from '../../contexts/FirebaseContext.tsx';
import { AnalyticsEvent, AnalyticsParam, ScreenName } from '../../utils/analytics.ts';
import useEmblaCarousel from 'embla-carousel-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [startTime] = useState(Date.now());
  const { logAnalyticsEvent } = useFirebaseContext();
  const [emblaRef, emblaApi] = useEmblaCarousel({ watchDrag: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const screens = [
    <OnboardingValueProp key="capture" />,
    <OnboardingBulkAI key="bulk-ai" />,
    <OnboardingShareExtension key="share-extension" />,
    <OnboardingGetStarted key="event-card" />,
    <OnboardingLifestyle key="lifestyle" />,
  ];

  useEffect(() => {
    logAnalyticsEvent(AnalyticsEvent.ONBOARDING_STARTED);
  }, [logAnalyticsEvent]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);

    const screenNames = [
      ScreenName.ONBOARDING_VALUE_PROP,
      ScreenName.ONBOARDING_HOW_IT_WORKS,
      ScreenName.ONBOARDING_TICKETS,
      ScreenName.ONBOARDING_FREE_TRIAL,
      'onboarding_lifestyle', // Custom screen name
    ];

    logAnalyticsEvent(AnalyticsEvent.ONBOARDING_SCREEN_VIEWED, {
      [AnalyticsParam.SCREEN_NAME]: screenNames[index],
      [AnalyticsParam.ONBOARDING_STEP]: index + 1,
    });
  }, [emblaApi, logAnalyticsEvent]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const handleNext = () => {
    if (!emblaApi) return;
    if (selectedIndex < screens.length - 1) {
      emblaApi.scrollNext();
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    logAnalyticsEvent(AnalyticsEvent.ONBOARDING_COMPLETED, {
      [AnalyticsParam.ONBOARDING_DURATION_SEC]: duration,
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E2E3F]" data-testid="onboarding-container">
      {/* Background Pattern with low opacity */}
      <div className="magicpattern absolute inset-0 opacity-10" />

      {/* Pulsing Radial Gradient Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[#E6DE4D]/5 blur-3xl"
          style={{ animationDuration: '4s' }}
        />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-between py-6">
        {/* Embla Carousel */}
        <div className="embla flex flex-1 items-center justify-center" style={{ width: '100%' }}>
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {screens.map((screen, index) => (
                <div className="embla__slide" key={index} data-testid={`onboarding-slide-${index}`}>
                  <div className="flex h-full w-full items-center justify-center">{screen}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="w-full pb-safe-offset-8">
          <OnboardingNavigation step={selectedIndex} totalSteps={screens.length} onNext={handleNext} />
        </div>
      </div>
    </div>
  );
};

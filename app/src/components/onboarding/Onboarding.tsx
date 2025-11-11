import React, { useState, useEffect, useCallback } from 'react';
import { OnboardingValueProp } from './OnboardingValueProp.tsx';
import { OnboardingHowItWorks } from './OnboardingHowItWorks.tsx';
import { OnboardingTickets } from './OnboardingTickets.tsx';
import { OnboardingGetStarted } from './OnboardingGetStarted.tsx';
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
    <OnboardingValueProp key="value-prop" />,
    <OnboardingHowItWorks key="how-it-works" />,
    <OnboardingTickets key="tickets" />,
    <OnboardingGetStarted key="get-started" />,
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
      'onboarding_tickets' as ScreenName,
      ScreenName.ONBOARDING_FREE_TRIAL,
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

  const handleSkip = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    logAnalyticsEvent(AnalyticsEvent.ONBOARDING_SKIPPED, {
      [AnalyticsParam.ONBOARDING_STEP]: selectedIndex + 1,
      [AnalyticsParam.ONBOARDING_DURATION_SEC]: duration,
    });
    onComplete();
  };

  const handleComplete = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    logAnalyticsEvent(AnalyticsEvent.ONBOARDING_COMPLETED, {
      [AnalyticsParam.ONBOARDING_DURATION_SEC]: duration,
    });
    onComplete();
  };

  return (
    <div className="magicpattern fixed inset-0 z-50 flex flex-col items-center justify-between py-12">
      {/* Embla Carousel */}
      <div className="embla flex flex-1 items-center justify-center" style={{ width: '100%' }}>
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {screens.map((screen, index) => (
              <div className="embla__slide" key={index}>
                <div className="flex h-full w-full items-center justify-center">{screen}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full pb-safe-offset-8">
        <OnboardingNavigation
          step={selectedIndex}
          totalSteps={screens.length}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

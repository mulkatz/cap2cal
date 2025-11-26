import React, { useCallback, useEffect, useRef, useState } from 'react';
import { OnboardingSlide1 } from './OnboardingSlide1.tsx';
import { OnboardingSlide2 } from './OnboardingSlide2.tsx';
import { OnboardingSlide3 } from './OnboardingSlide3.tsx';
import { OnboardingSlide4 } from './OnboardingSlide4.tsx';
import { OnboardingGetStarted } from './OnboardingGetStarted.tsx';
import { OnboardingNavigation } from './OnboardingNavigation.tsx';
import { useFirebaseContext } from '../../contexts/FirebaseContext.tsx';
import { AnalyticsEvent, AnalyticsParam } from '../../utils/analytics.ts';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [startTime] = useState(Date.now());
  const { logAnalyticsEvent } = useFirebaseContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const screens = [
    <OnboardingSlide1 key="slide-1" />,
    <OnboardingSlide2 key="slide-2" />,
    <OnboardingSlide3 key="slide-3" />,
    <OnboardingSlide4 key="slide-4" />,
    <OnboardingGetStarted key="event-card" />,
  ];

  useEffect(() => {
    logAnalyticsEvent(AnalyticsEvent.ONBOARDING_STARTED);
  }, [logAnalyticsEvent]);

  const logScreenView = useCallback(
    (index: number) => {
      const screenNames = [
        'onboarding_slide_1',
        'onboarding_slide_2',
        'onboarding_slide_3',
        'onboarding_slide_4',
        'onboarding_event_card',
      ];

      logAnalyticsEvent(AnalyticsEvent.ONBOARDING_SCREEN_VIEWED, {
        [AnalyticsParam.SCREEN_NAME]: screenNames[index],
        [AnalyticsParam.ONBOARDING_STEP]: index + 1,
      });
    },
    [logAnalyticsEvent]
  );

  // Track scroll position and log analytics
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.clientWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);

      if (newIndex !== selectedIndex) {
        setSelectedIndex(newIndex);
        logScreenView(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedIndex, logScreenView]);

  // Log initial screen view
  useEffect(() => {
    logScreenView(0);
  }, [logScreenView]);

  const scrollToSlide = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const slideWidth = container.clientWidth;
    container.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth',
    });
  };

  const handleNext = () => {
    if (selectedIndex < screens.length - 1) {
      scrollToSlide(selectedIndex + 1);
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
      {/* Pulsing Radial Gradient Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[#E6DE4D]/5 blur-3xl"
          style={{ animationDuration: '4s' }}
        />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-between overflow-visible py-6">
        {/* Scroll Container */}
        <div className="flex flex-1 items-center justify-center overflow-visible" style={{ width: '100%' }}>
          <div className="h-full w-full overflow-visible">
            <div
              ref={scrollContainerRef}
              className="flex h-full w-full snap-x snap-mandatory overflow-x-scroll overflow-y-visible"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}>
              {screens.map((screen, index) => (
                <div
                  className="flex min-w-full snap-start items-center justify-center overflow-visible"
                  key={index}
                  data-testid={`onboarding-slide-${index}`}>
                  <div className="flex h-full w-full items-center justify-center overflow-visible">{screen}</div>
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

      {/* Hide scrollbar */}
      <style>{`
        .snap-x::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

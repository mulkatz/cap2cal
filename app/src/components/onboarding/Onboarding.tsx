import React, { useState, useEffect } from 'react';
import { OnboardingValueProp } from './OnboardingValueProp.tsx';
import { OnboardingHowItWorks } from './OnboardingHowItWorks.tsx';
import { OnboardingFreeTrial } from './OnboardingFreeTrial.tsx';
import { OnboardingNavigation } from './OnboardingNavigation.tsx';
import { useFirebaseContext } from '../../contexts/FirebaseContext.tsx';
import { AnalyticsEvent, AnalyticsParam } from '../../utils/analytics.ts';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [startTime] = useState(Date.now());
  const { logAnalyticsEvent } = useFirebaseContext();

  const totalSteps = 3;

  useEffect(() => {
    // Track onboarding started
    logAnalyticsEvent(AnalyticsEvent.ONBOARDING_STARTED);
  }, [logAnalyticsEvent]);

  useEffect(() => {
    // Track each screen view
    logAnalyticsEvent(AnalyticsEvent.ONBOARDING_SCREEN_VIEWED, {
      [AnalyticsParam.ONBOARDING_STEP]: step + 1,
    });
  }, [step, logAnalyticsEvent]);

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    logAnalyticsEvent(AnalyticsEvent.ONBOARDING_SKIPPED, {
      [AnalyticsParam.ONBOARDING_STEP]: step + 1,
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

  const screens = [
    <OnboardingValueProp key="value-prop" />,
    <OnboardingHowItWorks key="how-it-works" />,
    <OnboardingFreeTrial key="free-trial" />,
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Content */}
      <div className="flex-1 flex items-center justify-center w-full px-8">
        {screens[step]}
      </div>

      {/* Navigation */}
      <div className="w-full pb-safe-offset-8">
        <OnboardingNavigation
          step={step}
          totalSteps={totalSteps}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

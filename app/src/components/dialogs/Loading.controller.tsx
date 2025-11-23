import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoaderAnimation } from '../LoaderAnimation';

const numPhrases = 5;
const numPhrasesCollections = 5;

export const LoadingController = () => {
  const { t } = useTranslation();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentVariation, setCurrentVariation] = useState(Math.floor(Math.random() * numPhrasesCollections) + 1);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const change = () => {
      setCurrentPhraseIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % numPhrases;
        // Pick a new random variation for each phrase level
        setCurrentVariation(Math.floor(Math.random() * numPhrasesCollections) + 1);
        return nextIndex;
      });
      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    };

    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        change();
      }, 250);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="absolute inset-0 flex w-full flex-col items-center justify-center py-8 text-center"
      data-testid="loading-dialog">
      {/*<div className={'absolute inset-0 bg-gradient-to-t from-black/50 to-black/20'} />*/}
      {/**/}
      {/* Custom animated loader */}
      <div className="animate-[fadeIn_0.3s_ease-out_0.3s_both]">
        <LoaderAnimation />
      </div>

      {/* Status text feed */}
      <div className="mx-auto mt-24 flex max-w-[250px] animate-[fadeIn_0.3s_ease-out_0.3s_both] flex-col items-center justify-center">
        <span
          className={`w-full text-center font-['Plus_Jakarta_Sans'] text-lg font-medium text-white transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {t(`dialogs.loading.phrases.phrase${currentPhraseIndex + 1}.${currentVariation}`)}
        </span>
      </div>
    </div>
  );
};

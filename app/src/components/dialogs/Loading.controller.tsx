import { useEffect, useState } from 'react';
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
    <div className="flex w-full flex-col items-center justify-center text-center" data-testid="loading-dialog">
      {/* Custom animated loader */}
      <LoaderAnimation />

      {/* Status text feed */}
      <div className="mx-auto mt-8 flex w-2/3 flex-col items-center justify-center">
        <span
          className={`w-full text-center font-['Plus_Jakarta_Sans'] text-lg font-semibold text-white transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {t(`dialogs.loading.phrases.phrase${currentPhraseIndex + 1}.${currentVariation}`)}
        </span>
      </div>
    </div>
  );
};

import { PuffLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
    <div className="flex w-full flex-col items-center py-8 text-center" data-testid="loading-dialog">
      <PuffLoader
        color={'#e6de4d'}
        loading={true}
        size={120}
        aria-label="LoadingController ResultView"
        data-testid="loader"
        className={'mb-6'}
      />
      <div className="mx-4 flex h-[100px] w-full flex-col items-center justify-center px-8">
        <span
          className={`w-full font-['Plus_Jakarta_Sans'] text-base text-white transition-opacity duration-250 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {t(`dialogs.loading.phrases.phrase${currentPhraseIndex + 1}.${currentVariation}`)}
        </span>
      </div>
    </div>
  );
};

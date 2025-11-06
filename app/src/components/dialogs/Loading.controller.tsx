import { PuffLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const numPhrases = 5;
const numPhrasesCollections = 5;

export const LoadingController = () => {
  const { t } = useTranslation();
  const phraseCollectionIndex = Math.floor(Math.random() * numPhrasesCollections) + 1;
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const change = () => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % numPhrases);
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
    <div className={'mb-3 flex w-full flex-col items-center text-center'}>
      <PuffLoader
        color={'#19D8E0'}
        loading={true}
        size={120}
        aria-label="LoadingController ResultView"
        data-testid="loader"
        className={'mt-5'}
      />
      <div className={'mx-4 flex h-[100px] w-full flex-col items-center justify-center px-8'}>
        <span className={`w-full align-middle text-[16px] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {t(`dialogs.loading.phrases.phrase${currentPhraseIndex + 1}.${phraseCollectionIndex}`)}
        </span>
      </div>
    </div>
  );
};

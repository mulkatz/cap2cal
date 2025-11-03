import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface EffectContextType {
  splash: () => void;
  isSplash: boolean;
}

const EffectContext = createContext<EffectContextType | undefined>(undefined);

export const EffectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSplash, setIsSplash] = useState(false);

  const splash = () => {
    setIsSplash(true);
    setTimeout(() => setIsSplash(false), 250);
  };

  return <EffectContext.Provider value={{ splash, isSplash }}>{children}</EffectContext.Provider>;
};

export const useEffectContext = () => {
  const context = useContext(EffectContext);
  if (context === undefined) {
    throw new Error('useEffectContext must be used within a EffectProvider');
  }
  return context;
};

export const Effects: React.FC = () => {
  const { isSplash } = useEffectContext();
  return isSplash ? <FadeOutComponent /> : null;
};

export const FadeOutComponent = () => {
  // const [isVisible, setIsVisible] = useState(true); // Controls visibility
  const [isFading, setIsFading] = useState(false); // Controls fade-out

  useEffect(() => {
    // Trigger the fade-out effect after 3 seconds (for example)
    const timer = setTimeout(() => {
      setIsFading(true); // Start fading out
      setTimeout(() => setIsFading(false), 300); // Remove from DOM after fade-out completes
    }, 0); // Delay before starting the fade-out

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  });

  // if (!isVisible) return null; // Don't render after fade-out

  return (
    <div
      className={`fixed z-[100] h-screen w-full bg-white transition-opacity duration-300 ease-out ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    />
  );
};

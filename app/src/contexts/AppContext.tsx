import React, { createContext, ReactNode, useContext, useState } from 'react';
import { version } from '../../package.json';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

export type AppState = 'home' | 'loading' | 'camera' | 'result';

interface AppContextType {
  version: string;
  appLanguage: string; // utc
  userLanguage: string;
  languageOverride: string | null;
  appState: AppState
  setAppState: (appState: AppState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>('home');
  const { i18n } = useTranslation(); // Get the i18n instance
  const appLanguage = i18n.language; // Get the current app language
  const userLanguage = i18next.language; // Get the browser language
  const languageOverride = appLanguage;

  return (
    <AppContext.Provider value={{ version, appLanguage, userLanguage, languageOverride, appState, setAppState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};

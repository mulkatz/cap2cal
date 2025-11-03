import React, { createContext, ReactNode, useContext } from 'react';
import { version } from '../../package.json';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

interface AppContextType {
  version: string;
  appLanguage: string; // utc
  userLanguage: string;
  languageOverride: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation(); // Get the i18n instance
  const appLanguage = i18n.language; // Get the current app language
  const userLanguage = i18next.language; // Get the browser language
  const languageOverride = appLanguage;

  return (
    <AppContext.Provider value={{ version, appLanguage, userLanguage, languageOverride }}>
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

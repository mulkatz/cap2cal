import React, { createContext, ReactNode, useContext, useState } from 'react';
import { version } from '../../package.json';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { CaptureEvent } from '../models/CaptureEvent.ts';
import { ExtractionError } from '../api/model.ts';

export type AppState = 'home' | 'loading' | 'camera' | 'result';
export type ResultType = 'single' | 'multi' | 'error';

export interface ResultData {
  type: ResultType;
  events?: CaptureEvent[];
  errorReason?: ExtractionError;
}

interface AppContextType {
  version: string;
  appLanguage: string; // utc
  userLanguage: string;
  languageOverride: string | null;
  appState: AppState;
  setAppState: (appState: AppState) => void;
  resultData: ResultData | null;
  setResultData: (resultData: ResultData | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>('home');
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const { i18n } = useTranslation(); // Get the i18n instance
  const appLanguage = i18n.language; // Get the current app language
  const userLanguage = i18next.language; // Get the browser language
  const languageOverride = appLanguage;

  return (
    <AppContext.Provider
      value={{
        version,
        appLanguage,
        userLanguage,
        languageOverride,
        appState,
        setAppState,
        resultData,
        setResultData,
      }}>
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

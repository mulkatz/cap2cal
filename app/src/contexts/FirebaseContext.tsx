import React, { createContext, ReactNode, useContext } from 'react';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getRemoteConfig, getValue } from 'firebase/remote-config';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

import { isDevelopmentEnvironment } from '../utils.ts';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Define the types for the context
interface FirebaseContextType {
  logAnalyticsEvent: (event: string, data?: any) => void;
  sendFeedback: (data?: any) => Promise<void>;
}

// Create the FirebaseContext with default values
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Define a provider component
export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const firestore = getFirestore(app);
  const remoteConfig = getRemoteConfig(app);
  remoteConfig.settings.minimumFetchIntervalMillis = 0;

  const logAnalyticsEvent = (event: string, data?: any) => {
    if (isDevelopmentEnvironment()) {
      console.warn(`Analytics event not send since in development environment`);
      return;
    }

    logEvent(analytics, event, data);
  };

  const sendFeedback = async (data?: any) => {
    await addDoc(collection(firestore, 'feedback-db'), data);
  };

  const getVersionInfo = () => {
    const value = getValue(remoteConfig, 'version_info');
    console.log('got version info', value);
  };

  return <FirebaseContext.Provider value={{ logAnalyticsEvent, sendFeedback }}>{children}</FirebaseContext.Provider>;
};

// Custom hook to use the FirebaseContext
export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider');
  }
  return context;
};

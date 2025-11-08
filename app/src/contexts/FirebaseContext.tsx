import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getAuth, signInAnonymously, User } from 'firebase/auth';
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
  user: User | null;
  getAuthToken: () => Promise<string | null>;
}

// Create the FirebaseContext with default values
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Define a provider component
export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Sign in anonymously on mount
    const initAuth = async () => {
      try {
        const result = await signInAnonymously(auth);
        console.log('USER signed in', result);
        setUser(result.user);
      } catch (error: any) {
        console.error('Error signing in anonymously:', error);

        // Check if it's a configuration error
        if (error?.code === 'auth/configuration-not-found') {
          console.warn('⚠️ Anonymous authentication is not enabled in Firebase Console.');
          console.warn('Please enable it: Firebase Console → Authentication → Sign-in method → Anonymous');
        }
      }
    };

    initAuth();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

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

  const getAuthToken = async (): Promise<string | null> => {
    if (!user) {
      console.warn('Cannot get auth token - user not authenticated');
      return null;
    }
    return await user.getIdToken();
  };

  return (
    <FirebaseContext.Provider
      value={{
        logAnalyticsEvent,
        sendFeedback,
        user,
        getAuthToken,
      }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to use the FirebaseContext
export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider');
  }
  return context;
};

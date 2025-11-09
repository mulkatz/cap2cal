import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { getAuth, signInAnonymously, User } from 'firebase/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

import { isDevelopmentEnvironment } from '../utils.ts';
import {
  AnalyticsEvent,
  AnalyticsParam,
  ScreenName,
  type ScreenNameType,
} from '../utils/analytics.ts';
import { fetchFeatureFlags, type FeatureFlags } from '../api/api.ts';

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
  logScreenView: (screenName: ScreenNameType, previousScreen?: ScreenNameType) => void;
  setAnalyticsUserProperty: (property: string, value: string | number | boolean) => void;
  trackPerformance: (timingType: string, durationMs: number) => void;
  sendFeedback: (data?: any) => Promise<void>;
  user: User | null;
  getAuthToken: () => Promise<string | null>;
  featureFlags: FeatureFlags | null;
  featureFlagsLoading: boolean;
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
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);
  const [featureFlagsLoading, setFeatureFlagsLoading] = useState<boolean>(true);

  // Fetch feature flags on mount
  useEffect(() => {
    const loadFeatureFlags = async () => {
      try {
        const flags = await fetchFeatureFlags();
        if (flags) {
          setFeatureFlags(flags);
          console.log('[Feature Flags] Loaded:', flags);
        } else {
          console.warn('[Feature Flags] Failed to load, using defaults');
          // Set default values if fetch fails
          setFeatureFlags({
            paid_only: false,
            free_capture_limit: 5,
          });
        }
      } catch (error) {
        console.error('[Feature Flags] Error loading:', error);
        // Set default values on error
        setFeatureFlags({
          paid_only: false,
          free_capture_limit: 5,
        });
      } finally {
        setFeatureFlagsLoading(false);
      }
    };

    loadFeatureFlags();
  }, []);

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
      console.warn(`[Analytics] ${event}`, data || '');
      return;
    }

    logEvent(analytics, event, data);
  };

  const logScreenView = (screenName: ScreenNameType, previousScreen?: ScreenNameType) => {
    const params: Record<string, any> = {
      [AnalyticsParam.SCREEN_NAME]: screenName,
    };

    if (previousScreen) {
      params[AnalyticsParam.PREVIOUS_SCREEN] = previousScreen;
    }

    logAnalyticsEvent(AnalyticsEvent.SCREEN_VIEW, params);
  };

  const setAnalyticsUserProperty = (property: string, value: string | number | boolean) => {
    if (isDevelopmentEnvironment()) {
      console.warn(`[Analytics User Property] ${property} = ${value}`);
      return;
    }

    setUserProperties(analytics, { [property]: value });
  };

  const trackPerformance = (timingType: string, durationMs: number) => {
    logAnalyticsEvent(AnalyticsEvent.PERFORMANCE_TIMING, {
      [AnalyticsParam.TIMING_TYPE]: timingType,
      [AnalyticsParam.DURATION_MS]: Math.round(durationMs),
    });
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
        logScreenView,
        setAnalyticsUserProperty,
        trackPerformance,
        sendFeedback,
        user,
        getAuthToken,
        featureFlags,
        featureFlagsLoading,
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

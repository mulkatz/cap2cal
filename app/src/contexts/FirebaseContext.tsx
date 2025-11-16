import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { getAuth, initializeAuth, indexedDBLocalPersistence, signInAnonymously, User } from 'firebase/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';
import { Capacitor } from '@capacitor/core';

import { isDevelopmentEnvironment } from '../utils.ts';
import { AnalyticsEvent, AnalyticsParam, ScreenName, type ScreenNameType } from '../utils/analytics.ts';
import { fetchFeatureFlags, type FeatureFlags } from '../api/api.ts';
import {
  initializePurchases,
  checkIsProUser,
  addCustomerInfoUpdateListener,
  ENTITLEMENT_ID,
} from '../services/purchases.service.ts';
import type { CustomerInfo } from '@revenuecat/purchases-capacitor';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Debug: Validate Firebase config at module load time
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  console.error('[Firebase Config] CRITICAL: Missing required Firebase configuration!', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    hasAppId: !!firebaseConfig.appId,
    hasAuthDomain: !!firebaseConfig.authDomain,
  });
}

// Initialize Firebase once at module level (singleton pattern)
let firebaseApp: any;
let firebaseAnalytics: any;
let firebaseFirestore: any;
let firebaseAuth: any;

try {
  const platform = typeof Capacitor !== 'undefined' ? Capacitor.getPlatform() : 'web';

  firebaseApp = initializeApp(firebaseConfig);
  firebaseAnalytics = getAnalytics(firebaseApp);
  firebaseFirestore = getFirestore(firebaseApp);

  // CRITICAL: Use initializeAuth with indexedDBLocalPersistence for native platforms
  // This is required for Firebase Auth to work in iOS/Android WKWebView
  if (platform === 'ios' || platform === 'android') {
    firebaseAuth = initializeAuth(firebaseApp, {
      persistence: indexedDBLocalPersistence,
    });
  } else {
    firebaseAuth = getAuth(firebaseApp);
  }

  console.log('[Firebase] Initialized successfully');
} catch (error: any) {
  console.error('[Firebase] Failed to initialize:', error);
}

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
  // Subscription state
  isPro: boolean;
  isProLoading: boolean;
  captureCount: number;
  captureLimit: number;
  refreshProStatus: () => Promise<void>;
}

// Create the FirebaseContext with default values
const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

// Define a provider component
export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const platform = Capacitor.getPlatform();
  console.log(`[FirebaseProvider] Mounting provider on platform: ${platform}`);

  // Use singleton instances instead of re-initializing
  const app = firebaseApp;
  const analytics = firebaseAnalytics;
  const firestore = firebaseFirestore;
  const auth = firebaseAuth;

  const [user, setUser] = useState<User | null>(null);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);
  const [featureFlagsLoading, setFeatureFlagsLoading] = useState<boolean>(true);

  // Subscription state
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isProLoading, setIsProLoading] = useState<boolean>(true);
  const [captureCount, setCaptureCount] = useState<number>(0);
  const [captureLimit, setCaptureLimit] = useState<number>(5);

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
            in_app_rating: true,
          });
        }
      } catch (error) {
        console.error('[Feature Flags] Error loading:', error);
        // Set default values on error
        setFeatureFlags({
          paid_only: false,
          free_capture_limit: 5,
          in_app_rating: true,
        });
      } finally {
        setFeatureFlagsLoading(false);
      }
    };

    loadFeatureFlags();
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    let hasAttemptedSignIn = false;

    // Set up onAuthStateChanged listener
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (isSubscribed) {
        setUser(user);
      }

      // If no user and we haven't attempted sign-in yet, sign in anonymously
      if (!user && !hasAttemptedSignIn && isSubscribed) {
        hasAttemptedSignIn = true;

        try {
          const result = await signInAnonymously(auth);
          console.log('[Auth] Anonymous sign-in successful:', result.user.uid);
        } catch (error: any) {
          console.error('[Auth] Anonymous sign-in failed:', error);

          // Log specific error codes for troubleshooting
          if (error?.code === 'auth/configuration-not-found') {
            console.error('Anonymous authentication is not enabled in Firebase Console');
          } else if (error?.code === 'auth/unauthorized-domain') {
            console.error('Domain not authorized in Firebase Console');
          }
        }
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Initialize RevenueCat and set up subscription listener after user is authenticated
  useEffect(() => {
    if (!user) {
      setIsProLoading(true);
      return;
    }

    const initSubscription = async () => {
      try {
        console.log('[FirebaseContext] Initializing RevenueCat for user:', user.uid);

        // Initialize RevenueCat with Firebase UID
        await initializePurchases(user.uid);

        // Check initial pro status
        const proStatus = await checkIsProUser();
        setIsPro(proStatus);

        // Fetch user document from Firestore to get capture count
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCaptureCount(userData?.captureCount || 0);

          // Also sync isPro from Firestore (backend is source of truth)
          if (userData?.isPro !== undefined) {
            setIsPro(userData.isPro);
          }
        }

        // Set up listener for subscription changes
        addCustomerInfoUpdateListener(async (customerInfo: CustomerInfo) => {
          const hasProEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
          console.log('[FirebaseContext] Subscription status changed:', hasProEntitlement);

          setIsPro(hasProEntitlement);

          // Sync to Firestore
          try {
            await setDoc(
              userDocRef,
              {
                isPro: hasProEntitlement,
                lastSubscriptionUpdate: new Date().toISOString(),
              },
              { merge: true }
            );
            console.log('[FirebaseContext] Synced isPro to Firestore:', hasProEntitlement);
          } catch (error) {
            console.error('[FirebaseContext] Failed to sync isPro to Firestore:', error);
          }

          // Log analytics event
          logAnalyticsEvent(
            hasProEntitlement ? AnalyticsEvent.SUBSCRIPTION_ACTIVATED : AnalyticsEvent.SUBSCRIPTION_CANCELLED,
            { source: 'customer_info_listener' }
          );
        });

        setIsProLoading(false);
      } catch (error) {
        console.error('[FirebaseContext] Failed to initialize subscription:', error);
        setIsProLoading(false);
      }
    };

    initSubscription();
  }, [user]);

  // Update capture limit when feature flags change
  useEffect(() => {
    if (featureFlags) {
      setCaptureLimit(featureFlags.free_capture_limit);
    }
  }, [featureFlags]);

  // Refresh pro status from RevenueCat (useful after restore purchases)
  const refreshProStatus = async (): Promise<void> => {
    try {
      setIsProLoading(true);
      const proStatus = await checkIsProUser();
      setIsPro(proStatus);

      // Also sync to Firestore
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, { isPro: proStatus }, { merge: true });
      }
    } catch (error) {
      console.error('[FirebaseContext] Failed to refresh pro status:', error);
    } finally {
      setIsProLoading(false);
    }
  };

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
      console.warn('[Auth] Cannot get auth token - user not authenticated');
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
        // Subscription state
        isPro,
        isProLoading,
        captureCount,
        captureLimit,
        refreshProStatus,
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

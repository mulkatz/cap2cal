import Purchases, {
  LOG_LEVEL,
  CustomerInfo,
  PurchasesPackage,
  PurchasesOfferings,
} from 'react-native-purchases';
import { Platform } from 'react-native';

/**
 * Product IDs that should match your RevenueCat offerings
 * These should be configured in RevenueCat Dashboard and linked to App Store Connect / Google Play Console
 */
export const PRODUCT_IDS = {
  MONTHLY: 'cap2cal_pro_monthly', // $0.99/month
  YEARLY: 'cap2cal_pro_yearly',   // $9.99/year
} as const;

/**
 * Entitlement identifier configured in RevenueCat Dashboard
 * When a user has an active "pro" entitlement, they have unlimited captures
 */
export const ENTITLEMENT_ID = 'pro';

/**
 * Purchase error types for better error handling
 */
export enum PurchaseErrorType {
  USER_CANCELLED = 'USER_CANCELLED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PRODUCT_NOT_AVAILABLE = 'PRODUCT_NOT_AVAILABLE',
  UNKNOWN = 'UNKNOWN',
}

export interface PurchaseError {
  type: PurchaseErrorType;
  message: string;
  originalError?: unknown;
}

/**
 * Initialize RevenueCat SDK
 * Call this on app startup, after user authentication
 *
 * @param userId - Firebase user ID to identify the user in RevenueCat
 */
export const initializePurchases = async (userId: string): Promise<void> => {
  try {
    const apiKey = Platform.select({
      ios: import.meta.env.VITE_REVENUECAT_API_KEY_IOS || '',
      android: import.meta.env.VITE_REVENUECAT_API_KEY_ANDROID || '',
      default: '',
    });

    if (!apiKey) {
      console.warn('RevenueCat API key not configured. Purchases will not work.');
      return;
    }

    // Configure RevenueCat with platform-specific API key
    await Purchases.configure({
      apiKey,
      appUserID: userId, // Use Firebase UID as RevenueCat App User ID
    });

    // Enable debug logs in development
    if (__DEV__) {
      await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    console.log('[Purchases] RevenueCat initialized for user:', userId);
  } catch (error) {
    console.error('[Purchases] Failed to initialize RevenueCat:', error);
    throw error;
  }
};

/**
 * Check if user has an active Pro subscription
 *
 * @returns Promise<boolean> - true if user has active pro entitlement
 */
export const checkIsProUser = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const hasProEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    console.log('[Purchases] Pro status:', hasProEntitlement);
    return hasProEntitlement;
  } catch (error) {
    console.error('[Purchases] Failed to check pro status:', error);
    return false;
  }
};

/**
 * Fetch available offerings/packages from RevenueCat
 *
 * @returns Promise<PurchasesOfferings | null>
 */
export const getOfferings = async (): Promise<PurchasesOfferings | null> => {
  try {
    const offerings = await Purchases.getOfferings();

    if (!offerings.current) {
      console.warn('[Purchases] No current offering available');
      return null;
    }

    console.log('[Purchases] Fetched offerings:', offerings.current.identifier);
    return offerings;
  } catch (error) {
    console.error('[Purchases] Failed to fetch offerings:', error);
    return null;
  }
};

/**
 * Get a specific package by identifier
 *
 * @param packageType - 'MONTHLY' or 'YEARLY'
 * @returns Promise<PurchasesPackage | null>
 */
export const getPackage = async (
  packageType: keyof typeof PRODUCT_IDS
): Promise<PurchasesPackage | null> => {
  try {
    const offerings = await getOfferings();

    if (!offerings?.current) {
      return null;
    }

    // Try to find package by identifier
    const availablePackages = offerings.current.availablePackages;
    const packageId = PRODUCT_IDS[packageType];

    const package_ = availablePackages.find(
      (pkg) => pkg.product.identifier === packageId
    );

    if (!package_) {
      console.warn(`[Purchases] Package not found: ${packageId}`);
      return null;
    }

    return package_;
  } catch (error) {
    console.error('[Purchases] Failed to get package:', error);
    return null;
  }
};

/**
 * Purchase a subscription package
 *
 * @param packageType - 'MONTHLY' or 'YEARLY'
 * @returns Promise with customerInfo on success
 * @throws PurchaseError on failure
 */
export const purchasePackage = async (
  packageType: keyof typeof PRODUCT_IDS
): Promise<CustomerInfo> => {
  try {
    const package_ = await getPackage(packageType);

    if (!package_) {
      throw {
        type: PurchaseErrorType.PRODUCT_NOT_AVAILABLE,
        message: 'Selected subscription package is not available',
      } as PurchaseError;
    }

    console.log('[Purchases] Initiating purchase:', package_.product.identifier);

    // Make the purchase
    const { customerInfo } = await Purchases.purchasePackage(package_);

    // Check if user now has pro entitlement
    const hasProEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    if (hasProEntitlement) {
      console.log('[Purchases] Purchase successful! User is now Pro');
    } else {
      console.warn('[Purchases] Purchase completed but pro entitlement not active');
    }

    return customerInfo;
  } catch (error: any) {
    console.error('[Purchases] Purchase failed:', error);

    // Parse RevenueCat error codes
    if (error.userCancelled) {
      throw {
        type: PurchaseErrorType.USER_CANCELLED,
        message: 'Purchase was cancelled',
        originalError: error,
      } as PurchaseError;
    }

    if (error.code === 'NETWORK_ERROR' || error.code === 'UNKNOWN_ERROR') {
      throw {
        type: PurchaseErrorType.NETWORK_ERROR,
        message: 'Network error. Please check your connection and try again.',
        originalError: error,
      } as PurchaseError;
    }

    throw {
      type: PurchaseErrorType.UNKNOWN,
      message: error.message || 'An unknown error occurred during purchase',
      originalError: error,
    } as PurchaseError;
  }
};

/**
 * Restore previous purchases
 * Used when user reinstalls app or switches devices
 *
 * @returns Promise<boolean> - true if user has active pro entitlement after restore
 */
export const restorePurchases = async (): Promise<boolean> => {
  try {
    console.log('[Purchases] Restoring purchases...');

    const { customerInfo } = await Purchases.restorePurchases();
    const hasProEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    console.log('[Purchases] Restore complete. Pro status:', hasProEntitlement);
    return hasProEntitlement;
  } catch (error) {
    console.error('[Purchases] Failed to restore purchases:', error);
    throw {
      type: PurchaseErrorType.UNKNOWN,
      message: 'Failed to restore purchases. Please try again.',
      originalError: error,
    } as PurchaseError;
  }
};

/**
 * Add listener for customer info updates
 * This fires whenever the user's subscription status changes
 *
 * @param callback - Function to call when customer info updates
 */
export const addCustomerInfoUpdateListener = (
  callback: (customerInfo: CustomerInfo) => void
): void => {
  Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    console.log('[Purchases] Customer info updated');
    callback(customerInfo);
  });
};

/**
 * Get product pricing info for display
 *
 * @returns Promise with pricing strings for both plans
 */
export const getPricingInfo = async (): Promise<{
  monthly: { price: string; pricePerMonth: string } | null;
  yearly: { price: string; pricePerMonth: string; savings: string } | null;
}> => {
  try {
    const offerings = await getOfferings();

    if (!offerings?.current) {
      return { monthly: null, yearly: null };
    }

    const packages = offerings.current.availablePackages;

    const monthlyPackage = packages.find(
      (pkg) => pkg.product.identifier === PRODUCT_IDS.MONTHLY
    );

    const yearlyPackage = packages.find(
      (pkg) => pkg.product.identifier === PRODUCT_IDS.YEARLY
    );

    const monthlyInfo = monthlyPackage
      ? {
          price: monthlyPackage.product.priceString,
          pricePerMonth: monthlyPackage.product.priceString,
        }
      : null;

    const yearlyInfo = yearlyPackage
      ? {
          price: yearlyPackage.product.priceString,
          pricePerMonth: `${(yearlyPackage.product.price / 12).toFixed(2)}`,
          savings: calculateSavings(
            monthlyPackage?.product.price || 0,
            yearlyPackage.product.price
          ),
        }
      : null;

    return { monthly: monthlyInfo, yearly: yearlyInfo };
  } catch (error) {
    console.error('[Purchases] Failed to get pricing info:', error);
    return { monthly: null, yearly: null };
  }
};

/**
 * Calculate savings percentage for yearly plan
 */
const calculateSavings = (monthlyPrice: number, yearlyPrice: number): string => {
  if (monthlyPrice === 0) return '0%';

  const yearlyCostIfMonthly = monthlyPrice * 12;
  const savings = ((yearlyCostIfMonthly - yearlyPrice) / yearlyCostIfMonthly) * 100;

  return `${Math.round(savings)}%`;
};

/**
 * Log current customer info (for debugging)
 */
export const logCustomerInfo = async (): Promise<void> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log('[Purchases] Customer Info:', {
      userId: customerInfo.originalAppUserId,
      hasProEntitlement: customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined,
      activeEntitlements: Object.keys(customerInfo.entitlements.active),
      activeSubscriptions: customerInfo.activeSubscriptions,
    });
  } catch (error) {
    console.error('[Purchases] Failed to log customer info:', error);
  }
};

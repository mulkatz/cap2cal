import * as admin from 'firebase-admin';
import { Request } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const remoteConfig = admin.remoteConfig();

interface ValidationResult {
  allowed: boolean;
  userId?: string;
  error?: string;
  status?: number;
}

interface RemoteConfigValues {
  paidOnly: boolean;
  freeLimit: number;
  inAppRating: boolean;
}

/**
 * Fetches Remote Config values with fallback to defaults
 * Shared function used by both auth validation and feature flags endpoint
 */
export async function getRemoteConfigValues(): Promise<RemoteConfigValues> {
  // Default values (fallback if Remote Config fails)
  let paidOnly = false;
  let freeLimit = 5;
  let inAppRating = true; // Default: enabled

  try {
    const template = await remoteConfig.getTemplate();

    // Debug logging to see what's actually in the template
    logger.info('[Remote Config] Template fetched', {
      parameterKeys: Object.keys(template.parameters),
      version: template.version,
    });

    const paidOnlyParam = template.parameters['paid_only'];
    const freeLimitParam = template.parameters['free_capture_limit'];
    const inAppRatingParam = template.parameters['in_app_rating'];

    // Debug logging for individual parameters
    if (paidOnlyParam) {
      logger.info('[Remote Config] paid_only parameter', {
        defaultValue: paidOnlyParam.defaultValue,
      });
    } else {
      logger.warn('[Remote Config] paid_only parameter not found in template');
    }

    if (freeLimitParam) {
      logger.info('[Remote Config] free_capture_limit parameter', {
        defaultValue: freeLimitParam.defaultValue,
      });
    } else {
      logger.warn('[Remote Config] free_capture_limit parameter not found in template');
    }

    if (inAppRatingParam) {
      logger.info('[Remote Config] inAppRating parameter', {
        defaultValue: inAppRatingParam.defaultValue,
      });
    } else {
      logger.warn('[Remote Config] in_app_rating parameter not found in template, using default: true');
    }

    // Extract values from Remote Config parameters
    const paidOnlyValue = paidOnlyParam?.defaultValue as { value?: string } | undefined;
    const freeLimitValue = freeLimitParam?.defaultValue as { value?: string } | undefined;
    const inAppRatingValue = inAppRatingParam?.defaultValue as { value?: string } | undefined;

    paidOnly = paidOnlyValue?.value === 'true' || false;
    freeLimit = freeLimitValue?.value ? parseInt(freeLimitValue.value, 10) : 5;
    inAppRating = inAppRatingValue?.value === 'false' ? false : true; // Default to true unless explicitly false

    logger.info(
      `[Remote Config] Parsed values: paid_only=${paidOnly}, free_capture_limit=${freeLimit}, in_app_rating=${inAppRating}`
    );
  } catch (error: any) {
    logger.warn('Could not fetch Remote Config, using defaults', {
      error: error.message,
      stack: error.stack,
    });
    // Use default values (already set above)
  }

  return { paidOnly, freeLimit, inAppRating };
}

/**
 * Validates that the request has a valid Firebase Auth token.
 * Use this for endpoints that only need authentication without capture limit checks.
 */
export async function validateAuthRequest(request: Request): Promise<ValidationResult> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { allowed: false, error: 'Missing or invalid authorization token', status: 401 };
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    return { allowed: true, userId: decodedToken.uid };
  } catch (error) {
    logger.error('Token verification failed', error);
    return { allowed: false, error: 'Invalid authentication token', status: 401 };
  }
}

export async function validateCaptureRequest(request: Request): Promise<ValidationResult> {
  try {
    // Extract auth token from Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        allowed: false,
        error: 'Missing or invalid authorization token',
        status: 401,
      };
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify the token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      logger.error('Token verification failed', error);
      return {
        allowed: false,
        error: 'Invalid authentication token',
        status: 401,
      };
    }

    const userId = decodedToken.uid;

    // Get Remote Config values
    const { paidOnly, freeLimit } = await getRemoteConfigValues();

    // If paid_only mode is not enabled, allow all captures
    if (!paidOnly) {
      logger.info(`[Auth] paid_only is false - allowing capture for user ${userId}`);
      return { allowed: true, userId };
    }

    // Check user's subscription status
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    // If user is pro, allow capture
    if (userData?.isPro === true) {
      logger.info(`[Auth] User ${userId} is Pro - allowing capture`);
      return { allowed: true, userId };
    }

    // Check capture count for free users
    const captureCount = userData?.captureCount || 0;
    logger.info(`[Auth] User ${userId} capture count: ${captureCount}/${freeLimit}`);

    if (captureCount >= freeLimit) {
      logger.warn(`[Auth] User ${userId} reached limit - blocking capture`);
      return {
        allowed: false,
        error: 'Free capture limit reached. Upgrade to Pro to continue.',
        status: 403,
      };
    }

    // User can capture
    logger.info(`[Auth] User ${userId} allowed - ${freeLimit - captureCount} captures remaining`);
    return { allowed: true, userId };
  } catch (error) {
    logger.error('Error validating capture request', error);
    return {
      allowed: false,
      error: 'Internal server error during validation',
      status: 500,
    };
  }
}

export async function incrementUserCaptureCount(userId: string): Promise<void> {
  try {
    const userRef = db.collection('users').doc(userId);

    await userRef.set(
      {
        captureCount: admin.firestore.FieldValue.increment(1),
        lastCaptureAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Log the new count
    const updatedDoc = await userRef.get();
    const newCount = updatedDoc.data()?.captureCount || 0;
    logger.info(`[Auth] Incremented capture count for user ${userId} to ${newCount}`);
  } catch (error) {
    logger.error('Error incrementing capture count', error);
    // Don't throw error - this is non-critical
  }
}

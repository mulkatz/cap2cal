import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { getRemoteConfigValues } from '../../auth';

/**
 * Feature Flags API Endpoint
 *
 * Returns the current state of feature flags from Firebase Remote Config.
 * This allows the frontend to make decisions based on backend-controlled flags.
 *
 * GET /featureFlags
 *
 * Response:
 * {
 *   "paid_only": boolean,
 *   "free_capture_limit": number,
 *   "in_app_rating": boolean
 * }
 */
export const featureFlags = onRequest(
  {
    cors: true,
    memory: '256MiB',
    timeoutSeconds: 10,
  },
  async (request, response) => {
    // Only allow GET requests
    if (request.method !== 'GET') {
      response.status(405).json({ error: 'Method not allowed. Use GET.' });
      return;
    }

    try {
      // Get Remote Config values using shared function
      const { paidOnly, freeLimit, inAppRating } = await getRemoteConfigValues();

      logger.info(
        `[Feature Flags] Returning: paid_only=${paidOnly}, free_capture_limit=${freeLimit}, in_app_rating=${inAppRating}`
      );

      // Return the feature flags
      response.status(200).json({
        paid_only: paidOnly,
        free_capture_limit: freeLimit,
        in_app_rating: inAppRating,
      });
    } catch (error: any) {
      logger.error('Error fetching feature flags', error);
      response.status(500).json({
        error: 'Internal server error',
      });
    }
  }
);

import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

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
 *   "free_capture_limit": number
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
      const remoteConfig = admin.remoteConfig();

      // Default values (fallback if Remote Config fails)
      let paidOnly = false;
      let freeLimit = 5;

      try {
        // Fetch the Remote Config template
        const template = await remoteConfig.getTemplate();

        // Extract the feature flag parameters
        const paidOnlyParam = template.parameters['paid_only'];
        const freeLimitParam = template.parameters['free_capture_limit'];

        // Extract values from Remote Config parameters
        const paidOnlyValue = paidOnlyParam?.defaultValue as { value?: string } | undefined;
        const freeLimitValue = freeLimitParam?.defaultValue as { value?: string } | undefined;

        // Parse the values
        paidOnly = paidOnlyValue?.value === 'true' || false;
        freeLimit = freeLimitValue?.value ? parseInt(freeLimitValue.value, 10) : 5;

        console.log(`[Feature Flags] Returning: paid_only=${paidOnly}, free_capture_limit=${freeLimit}`);
      } catch (error: any) {
        console.warn('Could not fetch Remote Config, using defaults:', error.message);
        // Continue with default values
      }

      // Return the feature flags
      response.status(200).json({
        paid_only: paidOnly,
        free_capture_limit: freeLimit,
      });
    } catch (error: any) {
      console.error('Error fetching feature flags:', error);
      response.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  }
);

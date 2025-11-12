import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';

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

        // Debug logging to see what's actually in the template
        logger.info('[Feature Flags] Template fetched', {
          parameterKeys: Object.keys(template.parameters),
          version: template.version,
        });

        // Extract the feature flag parameters
        const paidOnlyParam = template.parameters['paid_only'];
        const freeLimitParam = template.parameters['free_capture_limit'];

        // Debug logging for individual parameters
        if (paidOnlyParam) {
          logger.info('[Feature Flags] paid_only parameter', {
            defaultValue: paidOnlyParam.defaultValue,
          });
        } else {
          logger.warn('[Feature Flags] paid_only parameter not found in template');
        }

        if (freeLimitParam) {
          logger.info('[Feature Flags] free_capture_limit parameter', {
            defaultValue: freeLimitParam.defaultValue,
          });
        } else {
          logger.warn('[Feature Flags] free_capture_limit parameter not found in template');
        }

        // Extract values from Remote Config parameters
        const paidOnlyValue = paidOnlyParam?.defaultValue as { value?: string } | undefined;
        const freeLimitValue = freeLimitParam?.defaultValue as { value?: string } | undefined;

        // Parse the values
        paidOnly = paidOnlyValue?.value === 'true' || false;
        freeLimit = freeLimitValue?.value ? parseInt(freeLimitValue.value, 10) : 5;

        logger.info(`[Feature Flags] Returning: paid_only=${paidOnly}, free_capture_limit=${freeLimit}`);
      } catch (error: any) {
        logger.warn('Could not fetch Remote Config, using defaults', {
          error: error.message,
          stack: error.stack,
        });
        // Continue with default values
      }

      // Return the feature flags
      response.status(200).json({
        paid_only: paidOnly,
        free_capture_limit: freeLimit,
      });
    } catch (error: any) {
      logger.error('Error fetching feature flags', error);
      response.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  }
);

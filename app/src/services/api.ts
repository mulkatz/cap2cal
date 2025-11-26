import { ApiError, ApiEvent, ApiFindResult, ApiSuccess } from '../models/api.types.ts';
import { logger } from '../utils/logger';
import { handleFetchError, logError } from '../utils/errorHandler';

const ANALYSE_API_URL = 'https://analyse-u6pn2d2dsq-uc.a.run.app';
const FIND_TICKETS_API_URL = 'https://findtickets-u6pn2d2dsq-uc.a.run.app';
const FEATURE_FLAGS_API_URL = 'https://us-central1-cap2cal.cloudfunctions.net/featureFlags';

type EventSuccess = ApiSuccess<{ items: ApiEvent[] }>;
type EventError = ApiError;

export const fetchData = async (
  image: string,
  i18n: string,
  authToken?: string
): Promise<EventSuccess | EventError> => {
  const context = 'API.fetchData';
  logger.debug(context, 'Fetching event data', { i18n, imageLength: image.length });

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(ANALYSE_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        image,
        i18n,
      }),
    });

    // Success case
    if (res.status === 200) {
      const data = await res.json();
      logger.info(context, 'Successfully fetched event data');

      // The backend returns data.data as a JSON string that needs parsing
      if (typeof data.data === 'string') {
        return JSON.parse(data.data);
      }
      // If it's already an object, return it directly
      return data.data;
    }

    // Handle 403 - capture limit reached
    if (res.status === 403) {
      try {
        const errorData = await res.json();
        logger.warn(context, 'Capture limit reached', { error: errorData });
      } catch (e) {
        logger.warn(context, 'Capture limit reached (403)');
      }

      return {
        status: 'error',
        data: {
          reason: 'LIMIT_REACHED',
        },
      };
    }

    // Handle other HTTP errors
    let errorMessage = res.statusText;
    let errorReason = 'UNKNOWN';

    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || errorMessage;

      // Try to infer the error reason from the response
      if (errorData.reason) {
        errorReason = errorData.reason;
      } else if (res.status === 400) {
        errorReason = 'PROBABLY_NOT_AN_EVENT';
      }
    } catch (e) {
      // Response body is not JSON or already consumed
      logger.debug(context, 'Could not parse error response body');
    }

    logger.error(context, `Request failed with status ${res.status}: ${errorMessage}`);

    return {
      status: 'error',
      data: {
        reason: errorReason as any,
      },
    };
  } catch (error) {
    // Network error or other exception
    const apiError = handleFetchError(error, context);
    logError(apiError, context);

    return {
      status: 'error',
      data: {
        reason: 'UNKNOWN',
      },
    };
  }
};

export const findTickets = async (query: string, i18n: string): Promise<ApiFindResult | null> => {
  const context = 'API.findTickets';
  logger.debug(context, 'Finding tickets', { query, i18n });

  try {
    const res = await fetch(FIND_TICKETS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    });

    if (res.status === 200) {
      const data = await res.json();
      logger.info(context, 'Successfully found tickets', { resultsCount: data?.results?.length || 0 });
      return data satisfies ApiFindResult;
    }

    // Log non-200 responses
    let errorMessage = res.statusText;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      // Could not parse error body
    }

    logger.warn(context, `Failed to find tickets: ${res.status} ${errorMessage}`, { query });
    return null;
  } catch (error) {
    const apiError = handleFetchError(error, context);
    logError(apiError, context);
    return null;
  }
};

/**
 * Feature Flags Response Type
 */
export interface FeatureFlags {
  paid_only: boolean;
  free_capture_limit: number;
  in_app_rating?: boolean; // Enable/disable in-app review prompts (default: true)
}

/**
 * Fetches current feature flags from the backend
 * @returns Promise with feature flags or null if request fails
 */
export const fetchFeatureFlags = async (): Promise<FeatureFlags | null> => {
  const context = 'API.fetchFeatureFlags';
  logger.debug(context, 'Fetching feature flags');

  try {
    const res = await fetch(FEATURE_FLAGS_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      logger.info(context, 'Successfully fetched feature flags', data);
      return data satisfies FeatureFlags;
    }

    // Log non-200 responses
    let errorMessage = res.statusText;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      // Could not parse error body
    }

    logger.error(context, `Failed to fetch feature flags: ${res.status} ${errorMessage}`);
    return null;
  } catch (error) {
    const apiError = handleFetchError(error, context);
    logError(apiError, context);
    return null;
  }
};

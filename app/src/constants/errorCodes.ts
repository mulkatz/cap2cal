/**
 * Error codes returned by the backend.
 * Frontend maps these to localized messages via translation keys.
 * Translation key pattern: errors.codes.{ERROR_CODE}
 */
export const ErrorCodes = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',

  // Capture limits
  CAPTURE_LIMIT_REACHED: 'CAPTURE_LIMIT_REACHED',

  // Input validation
  IMAGE_REQUIRED: 'IMAGE_REQUIRED',
  INVALID_IMAGE: 'INVALID_IMAGE',

  // AI Processing
  AI_PROCESSING_FAILED: 'AI_PROCESSING_FAILED',
  NOT_AN_EVENT: 'NOT_AN_EVENT',

  // Network
  NETWORK_ERROR: 'NETWORK_ERROR',
  REQUEST_TIMEOUT: 'REQUEST_TIMEOUT',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

  // Server
  SERVER_ERROR: 'SERVER_ERROR',
  SERVER_CONFIGURATION_ERROR: 'SERVER_CONFIGURATION_ERROR',

  // General
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

/**
 * Map error codes to translation keys.
 * Usage: t(getErrorTranslationKey(errorCode))
 */
export function getErrorTranslationKey(errorCode: string): string {
  // Check if it's a known error code, otherwise use generic error
  const knownCodes = Object.values(ErrorCodes) as string[];
  if (knownCodes.includes(errorCode)) {
    return `errors.${errorCode.toLowerCase().replace(/_/g, '')}`;
  }
  return 'errors.unexpectedError';
}

/**
 * Map backend error response to appropriate error code.
 * This handles various response formats from the backend.
 */
export function parseErrorResponse(error: unknown): ErrorCode {
  if (!error) return ErrorCodes.UNKNOWN_ERROR;

  // Handle axios-style errors
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;

    // Check for error code in response data
    if (errorObj.response && typeof errorObj.response === 'object') {
      const response = errorObj.response as Record<string, unknown>;
      if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>;
        if (typeof data.code === 'string') {
          return data.code as ErrorCode;
        }
        if (typeof data.error === 'string') {
          return mapMessageToErrorCode(data.error);
        }
      }
      // HTTP status-based fallback
      if (typeof response.status === 'number') {
        return mapStatusToErrorCode(response.status);
      }
    }

    // Direct error code
    if (typeof errorObj.code === 'string') {
      return errorObj.code as ErrorCode;
    }

    // Error message
    if (typeof errorObj.message === 'string') {
      return mapMessageToErrorCode(errorObj.message);
    }
  }

  return ErrorCodes.UNKNOWN_ERROR;
}

/**
 * Map common error messages to error codes.
 */
function mapMessageToErrorCode(message: string): ErrorCode {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('limit') || lowerMessage.includes('upgrade')) {
    return ErrorCodes.CAPTURE_LIMIT_REACHED;
  }
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('auth')) {
    return ErrorCodes.UNAUTHORIZED;
  }
  if (lowerMessage.includes('image') && lowerMessage.includes('required')) {
    return ErrorCodes.IMAGE_REQUIRED;
  }
  if (lowerMessage.includes('not an event') || lowerMessage.includes('not look like')) {
    return ErrorCodes.NOT_AN_EVENT;
  }
  if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
    return ErrorCodes.NETWORK_ERROR;
  }
  if (lowerMessage.includes('timeout')) {
    return ErrorCodes.REQUEST_TIMEOUT;
  }
  if (lowerMessage.includes('too many')) {
    return ErrorCodes.TOO_MANY_REQUESTS;
  }

  return ErrorCodes.UNKNOWN_ERROR;
}

/**
 * Map HTTP status codes to error codes.
 */
function mapStatusToErrorCode(status: number): ErrorCode {
  switch (status) {
    case 401:
      return ErrorCodes.UNAUTHORIZED;
    case 403:
      return ErrorCodes.CAPTURE_LIMIT_REACHED;
    case 429:
      return ErrorCodes.TOO_MANY_REQUESTS;
    case 408:
      return ErrorCodes.REQUEST_TIMEOUT;
    case 500:
    case 502:
    case 503:
    case 504:
      return ErrorCodes.SERVER_ERROR;
    default:
      return ErrorCodes.UNKNOWN_ERROR;
  }
}

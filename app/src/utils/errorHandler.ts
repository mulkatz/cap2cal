/**
 * Centralized error handling utilities
 * Provides structured error types and consistent error handling across the application
 */

import { logger } from './logger';

export enum ErrorType {
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  CONNECTION_FAILED = 'CONNECTION_FAILED',

  // API errors
  API_ERROR = 'API_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER_ERROR = 'SERVER_ERROR',

  // Business logic errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  LIMIT_REACHED = 'LIMIT_REACHED',
  NOT_AN_EVENT = 'NOT_AN_EVENT',
  INVALID_IMAGE = 'INVALID_IMAGE',

  // System errors
  CAMERA_ERROR = 'CAMERA_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  STORAGE_ERROR = 'STORAGE_ERROR',

  // Unknown
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error | unknown;
  context?: Record<string, any>;
  statusCode?: number;
  retryable?: boolean;
}

export class ApiError extends Error implements AppError {
  type: ErrorType;
  originalError?: Error | unknown;
  context?: Record<string, any>;
  statusCode?: number;
  retryable: boolean;

  constructor(
    type: ErrorType,
    message: string,
    statusCode?: number,
    originalError?: Error | unknown,
    context?: Record<string, any>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.context = context;
    this.retryable = this.isRetryable();
  }

  private isRetryable(): boolean {
    // Determine if the error is worth retrying
    if (this.statusCode) {
      // 5xx errors and 429 (rate limit) are retryable
      return this.statusCode >= 500 || this.statusCode === 429;
    }
    // Network errors are retryable
    return [ErrorType.NETWORK_ERROR, ErrorType.TIMEOUT, ErrorType.CONNECTION_FAILED].includes(this.type);
  }
}

/**
 * Parse HTTP response and create appropriate error
 */
export async function parseApiError(response: Response, context?: string): Promise<ApiError> {
  const statusCode = response.status;
  let errorMessage = response.statusText;
  let errorType = ErrorType.API_ERROR;

  try {
    // Try to parse error body if available
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    }
  } catch (e) {
    // If we can't parse the error body, use status text
    logger.warn('ErrorHandler', 'Failed to parse error response body', e);
  }

  // Map status codes to error types
  switch (statusCode) {
    case 400:
      errorType = ErrorType.VALIDATION_ERROR;
      break;
    case 401:
      errorType = ErrorType.UNAUTHORIZED;
      break;
    case 403:
      errorType = ErrorType.FORBIDDEN;
      break;
    case 404:
      errorType = ErrorType.NOT_FOUND;
      break;
    case 429:
      errorType = ErrorType.RATE_LIMIT;
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      errorType = ErrorType.SERVER_ERROR;
      break;
    default:
      errorType = ErrorType.API_ERROR;
  }

  return new ApiError(errorType, errorMessage, statusCode, undefined, { context });
}

/**
 * Handle fetch errors (network failures, timeouts, etc.)
 */
export function handleFetchError(error: unknown, context?: string): ApiError {
  if (error instanceof TypeError) {
    // Network error
    return new ApiError(
      ErrorType.NETWORK_ERROR,
      'Network request failed. Please check your connection.',
      undefined,
      error,
      { context },
    );
  }

  if (error instanceof Error) {
    // Check for timeout
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return new ApiError(ErrorType.TIMEOUT, 'Request timed out. Please try again.', undefined, error, { context });
    }

    // Generic error
    return new ApiError(ErrorType.UNKNOWN, error.message, undefined, error, { context });
  }

  // Unknown error type
  return new ApiError(ErrorType.UNKNOWN, 'An unknown error occurred', undefined, error, { context });
}

/**
 * Get user-friendly error message
 */
export function getUserMessage(error: AppError | ApiError): string {
  switch (error.type) {
    case ErrorType.NETWORK_ERROR:
      return 'Network connection failed. Please check your internet connection.';
    case ErrorType.TIMEOUT:
      return 'Request timed out. Please try again.';
    case ErrorType.UNAUTHORIZED:
      return 'Authentication failed. Please sign in again.';
    case ErrorType.FORBIDDEN:
    case ErrorType.LIMIT_REACHED:
      return 'Capture limit reached. Please upgrade to continue.';
    case ErrorType.RATE_LIMIT:
      return 'Too many requests. Please wait a moment and try again.';
    case ErrorType.SERVER_ERROR:
      return 'Server error. Please try again later.';
    case ErrorType.NOT_AN_EVENT:
      return "This doesn't look like an event. Please try a different image.";
    case ErrorType.INVALID_IMAGE:
      return 'Invalid image. Please try again.';
    case ErrorType.CAMERA_ERROR:
      return 'Camera error. Please check your camera permissions.';
    case ErrorType.PERMISSION_DENIED:
      return 'Permission denied. Please enable the required permissions.';
    case ErrorType.VALIDATION_ERROR:
      return error.message || 'Validation error. Please check your input.';
    case ErrorType.UNKNOWN:
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Log error with appropriate level and context
 */
export function logError(error: AppError | ApiError | Error | unknown, context: string): void {
  if (error instanceof ApiError) {
    logger.error(context, `${error.type}: ${error.message}`, error.originalError, {
      statusCode: error.statusCode,
      retryable: error.retryable,
      context: error.context,
    });
  } else if (error instanceof Error) {
    logger.error(context, error.message, error);
  } else {
    logger.error(context, 'Unknown error occurred', error);
  }
}

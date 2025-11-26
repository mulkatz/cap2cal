/**
 * Centralized error handling utilities
 * Provides structured error types and consistent error handling across the application
 */

import { logger } from './logger';
import { i18next } from '../utils/i18n';

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
    context?: Record<string, any>
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
    return new ApiError(ErrorType.NETWORK_ERROR, i18next.t('errors.networkRequestFailed'), undefined, error, {
      context,
    });
  }

  if (error instanceof Error) {
    // Check for timeout
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return new ApiError(ErrorType.TIMEOUT, i18next.t('errors.requestTimedOut'), undefined, error, { context });
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
      return i18next.t('errors.networkConnectionFailed');
    case ErrorType.TIMEOUT:
      return i18next.t('errors.requestTimedOut');
    case ErrorType.UNAUTHORIZED:
      return i18next.t('errors.authenticationFailed');
    case ErrorType.FORBIDDEN:
    case ErrorType.LIMIT_REACHED:
      return i18next.t('errors.captureLimitReached');
    case ErrorType.RATE_LIMIT:
      return i18next.t('errors.tooManyRequests');
    case ErrorType.SERVER_ERROR:
      return i18next.t('errors.serverError');
    case ErrorType.NOT_AN_EVENT:
      return i18next.t('errors.notAnEvent');
    case ErrorType.INVALID_IMAGE:
      return i18next.t('errors.invalidImage');
    case ErrorType.CAMERA_ERROR:
      return i18next.t('errors.cameraError');
    case ErrorType.PERMISSION_DENIED:
      return i18next.t('errors.permissionDenied');
    case ErrorType.VALIDATION_ERROR:
      return error.message || i18next.t('errors.validationError');
    case ErrorType.UNKNOWN:
    default:
      return error.message || i18next.t('errors.unexpectedError');
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

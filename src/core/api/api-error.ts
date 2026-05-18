/**
 * API Error — Standardized error type for all API failures
 *
 * Layer: core/api
 * Dependency direction: None (leaf node)
 */

/** Standardized API error shape returned by the backend */
export interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/**
 * Typed API error class.
 * All API errors are transformed into this shape by interceptors.
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(response: ApiErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.statusCode = response.statusCode;
    this.errorCode = response.error;
    this.fieldErrors = response.errors;
  }

  /** Check if this is a network error (no response from server) */
  get isNetworkError(): boolean {
    return this.statusCode === 0;
  }

  /** Check if this is an authentication error */
  get isAuthError(): boolean {
    return this.statusCode === 401;
  }

  /** Check if this is a validation error */
  get isValidationError(): boolean {
    return this.statusCode === 400 && !!this.fieldErrors;
  }
}

/**
 * Get a user-friendly error message for common HTTP status codes.
 */
export function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Session expired. Please login again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
}

/**
 * Get a machine-readable error code for common HTTP status codes.
 */
export function getDefaultErrorCode(status: number): string {
  switch (status) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 429:
      return 'RATE_LIMITED';
    case 500:
      return 'INTERNAL_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
}

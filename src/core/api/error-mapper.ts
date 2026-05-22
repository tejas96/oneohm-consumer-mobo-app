/**
 * Error Mapper Utility — Decouples REST API Error codes from UI Friendly Messages
 *
 * Layer: core/api
 * Dependency direction: core/api/api-error
 */

import { ApiError } from './api-error';

export interface UserFriendlyError {
  title: string;
  description: string;
  actionText?: string;
}

/**
 * Translates any raw error caught in the application boundary (mostly ApiError instances)
 * into localized, action-oriented, customer-friendly title & description structures.
 *
 * @param error The caught raw error
 */
export function mapToUserFriendlyError(error: unknown): UserFriendlyError {
  if (!(error instanceof ApiError)) {
    return {
      title: 'Unexpected Error',
      description:
        'Something went wrong on our end. Please try again in a few moments.',
    };
  }

  if (error.isNetworkError) {
    return {
      title: 'Connection Lost',
      description:
        'We cannot connect to our servers. Check your internet connection or mobile data and try again.',
      actionText: 'Retry Connection',
    };
  }

  switch (error.statusCode) {
    case 400:
      if (error.isValidationError) {
        return {
          title: 'Input Validation Failed',
          description:
            'Please review the fields highlighted below and ensure they are correct.',
        };
      }
      return {
        title: 'Unable to Process',
        description:
          error.message || 'The request was invalid. Please try again.',
      };
    case 401:
      return {
        title: 'Session Expired',
        description:
          'Your login credentials have expired. Please log back in to access your dashboard.',
        actionText: 'Log In Again',
      };
    case 403:
      return {
        title: 'Access Restricted',
        description:
          'You do not have permission to view this project resource. Please contact your manager.',
      };
    case 404:
      return {
        title: 'Not Found',
        description:
          'The requested resource or document could not be located on our systems.',
      };
    case 429:
      return {
        title: 'Too Many Requests',
        description:
          'You are sending requests too quickly. Please pause for a minute and try again.',
      };
    case 500:
    case 502:
    case 503:
      return {
        title: 'Server Maintenance',
        description:
          'Our backend system is currently undergoing optimizations. We should be back shortly.',
      };
    default:
      return {
        title: 'Service Error',
        description:
          error.message ||
          'An unexpected server issue occurred. Support has been notified.',
      };
  }
}

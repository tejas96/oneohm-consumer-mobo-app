/**
 * API Interceptors — Request & Response Handling
 *
 * Request Interceptor:
 *   → Injects Bearer token from TokenService
 *   → Injects X-Organization-Id from AuthStore (Innovation #1: auth injection at API level)
 *
 * Response Interceptor:
 *   → 401 → silent token refresh → retry original request
 *   → All errors transformed to ApiError instances
 *
 * Layer: core/api
 * Dependency direction: core/auth (TokenService, SessionService, useAuthStore)
 */

import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { SessionService, TokenService, useAuthStore } from '@/core/auth';

import type { ApiErrorResponse } from './api-error';
import {
  ApiError,
  getDefaultErrorCode,
  getDefaultErrorMessage,
} from './api-error';
import { API_ENDPOINTS } from './endpoints';

// ============================================
// Types
// ============================================

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ============================================
// Public Setup
// ============================================

export function setupInterceptors(client: AxiosInstance): void {
  setupRequestInterceptor(client);
  setupResponseInterceptor(client);
}

// ============================================
// Request Interceptor
// ============================================

function setupRequestInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    async (requestConfig: InternalAxiosRequestConfig) => {
      if (isPublicEndpoint(requestConfig.url)) {
        return requestConfig;
      }

      // Inject auth token
      const accessToken = await TokenService.getAccessToken();
      if (accessToken) {
        requestConfig.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Inject organization ID from auth store (centralized — no duplication in resources)
      const orgId = useAuthStore.getState().user?.organizationId;
      if (orgId && !requestConfig.headers['X-Organization-Id']) {
        requestConfig.headers['X-Organization-Id'] = orgId;
      }

      return requestConfig;
    },
    (error: AxiosError) => Promise.reject(error),
  );
}

// ============================================
// Response Interceptor
// ============================================

function setupResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;

      // Handle 401 with token refresh
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        if (isAuthEndpoint(originalRequest.url)) {
          return Promise.reject(transformToApiError(error));
        }

        originalRequest._retry = true;

        try {
          const newAccessToken = await SessionService.refreshAccessToken();
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return client(originalRequest);
          }
        } catch {
          return Promise.reject(transformToApiError(error));
        }
      }

      return Promise.reject(transformToApiError(error));
    },
  );
}

// ============================================
// Helpers
// ============================================

const PUBLIC_ENDPOINTS = [
  API_ENDPOINTS.AUTH.OTP_REQUEST,
  API_ENDPOINTS.AUTH.OTP_VERIFY,
  API_ENDPOINTS.AUTH.REFRESH,
];

function isPublicEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes(API_ENDPOINTS.AUTH.OTP_REQUEST) ||
    url.includes(API_ENDPOINTS.AUTH.OTP_VERIFY) ||
    url.includes(API_ENDPOINTS.AUTH.REFRESH)
  );
}

function transformToApiError(error: AxiosError<ApiErrorResponse>): ApiError {
  if (__DEV__) {
    console.log('❌ API Error:', error.message, error.code, error.config?.url);
  }

  // Network error (no response)
  if (!error.response) {
    const isTimeout =
      error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
    return new ApiError({
      message: isTimeout
        ? 'Request timed out. The server may be slow or unreachable.'
        : 'Unable to reach the server. Please check your connection.',
      error: 'NETWORK_ERROR',
      statusCode: 0,
    });
  }

  const { status, data } = error.response;

  return new ApiError({
    message: data?.message || getDefaultErrorMessage(status),
    error: data?.error || getDefaultErrorCode(status),
    statusCode: status,
    errors: data?.errors,
  });
}

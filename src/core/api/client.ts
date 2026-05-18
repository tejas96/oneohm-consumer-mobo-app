/**
 * API Client — Centralized HTTP Client
 *
 * Pre-configured Axios instance with typed convenience methods.
 * Interceptors handle: token injection, org-id injection, 401 refresh, error transformation.
 *
 * Usage:
 *   import { api } from '@/core/api';
 *   const user = await api.get<UserDto>('/users/1');
 *
 * Layer: core/api
 * Dependency direction: core/config, core/api/interceptors
 */

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import { config } from '@/core/config';

import { setupInterceptors } from './interceptors';

// ============================================
// Create Client
// ============================================

const apiClient: AxiosInstance = axios.create({
  baseURL: config.api.url,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

setupInterceptors(apiClient);

if (__DEV__) {
  console.log('🔌 API Client initialized with URL:', config.api.url);
}

// ============================================
// Typed Request Methods
// ============================================

async function get<T>(
  url: string,
  requestConfig?: AxiosRequestConfig,
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.get(url, requestConfig);
  return response.data;
}

async function post<T, D = unknown>(
  url: string,
  data?: D,
  requestConfig?: AxiosRequestConfig,
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.post(
    url,
    data,
    requestConfig,
  );
  return response.data;
}

async function put<T, D = unknown>(
  url: string,
  data?: D,
  requestConfig?: AxiosRequestConfig,
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.put(
    url,
    data,
    requestConfig,
  );
  return response.data;
}

async function patch<T, D = unknown>(
  url: string,
  data?: D,
  requestConfig?: AxiosRequestConfig,
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.patch(
    url,
    data,
    requestConfig,
  );
  return response.data;
}

async function del<T>(
  url: string,
  requestConfig?: AxiosRequestConfig,
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.delete(url, requestConfig);
  return response.data;
}

// ============================================
// Export
// ============================================

export { apiClient };

export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  client: apiClient,
};

/**
 * Consumer Property Service — Customer-safe property API calls
 *
 * Purpose: Raw API call for GET /consumer/properties.
 * No React, no hooks — pure async functions.
 *
 * Layer: data/services
 * Dependency direction: core/api, data/types
 */

import { api, API_ENDPOINTS } from '@/core/api';

import type { CustomerProperty } from '../types/project.types';

/**
 * Fetch all active properties for the logged-in customer (quotes + project eager-loaded).
 */
async function getProperties(): Promise<CustomerProperty[]> {
  return api.get<CustomerProperty[]>(API_ENDPOINTS.CONSUMER.PROPERTIES);
}

export const ConsumerPropertyService = {
  getProperties,
};

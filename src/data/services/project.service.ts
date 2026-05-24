/**
 * Project Service — Project API calls
 *
 * Layer: data/services
 * Dependency direction: core/api
 */

import { api, API_ENDPOINTS } from '@/core/api';
import type { CustomerProperty } from '../types/project.types';

/**
 * Fetch list of user's active properties, quotes, and projects.
 */
async function getProperties(): Promise<CustomerProperty[]> {
  return api.get<CustomerProperty[]>(
    API_ENDPOINTS.CUSTOMER_PROPERTIES.MY_PROPERTIES,
  );
}

/**
 * Fetch a single property detail by ID.
 *
 * @param id Property identifier
 */
async function getPropertyById(id: string): Promise<CustomerProperty> {
  return api.get<CustomerProperty>(API_ENDPOINTS.CUSTOMER_PROPERTIES.GET(id));
}

export const ProjectService = {
  getProperties,
  getPropertyById,
};

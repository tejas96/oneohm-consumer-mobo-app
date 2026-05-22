/**
 * Project Service — Project API calls
 *
 * Layer: data/services
 * Dependency direction: core/api
 */

import { api, API_ENDPOINTS } from '@/core/api';
import type { Project } from '../types/project.types';

/**
 * Fetch list of user's active solar installation projects.
 */
async function getProjects(): Promise<Project[]> {
  return api.get<Project[]>(API_ENDPOINTS.PROJECTS.LIST);
}

/**
 * Fetch a single project detail by ID.
 *
 * @param id Project identifier
 */
async function getProjectById(id: string): Promise<Project> {
  return api.get<Project>(API_ENDPOINTS.PROJECTS.GET(id));
}

export const ProjectService = {
  getProjects,
  getProjectById,
};

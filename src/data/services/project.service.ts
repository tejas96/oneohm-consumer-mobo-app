/**
 * Project Service — Project API calls
 *
 * Layer: data/services
 */

import type { Project } from '../types/project.types';

const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-pune',
    label: 'Pune Res. (In Progress)',
    status: 'IN_PROGRESS',
    totalValue: 200000,
    subsidy: 50000,
    amountPaid: 120000,
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    progress: 60,
    capacity: 5.4,
    nextStep: 'Verify site assessment NOC report',
  },
  {
    id: 'proj-mumbai',
    label: 'Mumbai Apts (Completed)',
    status: 'COMPLETED',
    totalValue: 350000,
    subsidy: 78000,
    amountPaid: 350000,
    startDate: '2025-10-01',
    endDate: '2025-12-15',
    progress: 100,
    capacity: 10.2,
    nextStep: undefined,
  },
];

async function getProjects(): Promise<Project[]> {
  // Simulate network delay
  await new Promise<void>(resolve => {
    setTimeout(() => resolve(), 500);
  });
  return MOCK_PROJECTS;
}

async function getProjectById(id: string): Promise<Project> {
  await new Promise<void>(resolve => {
    setTimeout(() => resolve(), 300);
  });
  const found = MOCK_PROJECTS.find(p => p.id === id);
  if (!found) {
    throw new Error('Project not found');
  }
  return found;
}

export const ProjectService = {
  getProjects,
  getProjectById,
};

/**
 * Project Store — Zustand store for project selection
 *
 * Layer: core/project
 */

import { create } from 'zustand';

interface ProjectSelectionState {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  isSwitcherVisible: boolean;
  setSwitcherVisible: (visible: boolean) => void;
}

export const useProjectSelectionStore = create<ProjectSelectionState>(set => ({
  selectedProjectId: 'proj-pune', // Pune Res. initially active
  setSelectedProjectId: id => set({ selectedProjectId: id }),
  isSwitcherVisible: false,
  setSwitcherVisible: visible => set({ isSwitcherVisible: visible }),
}));

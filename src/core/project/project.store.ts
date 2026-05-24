/**
 * Project Store — Zustand store for project selection
 *
 * Layer: core/project
 */

import { create } from 'zustand';

import { getItem, setItem } from '@/core/storage/app.storage';
import { STORAGE_KEYS } from '@/core/config/constants';

interface PropertySelectionState {
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  initializeSelectedProperty: () => Promise<void>;
}

export const usePropertySelectionStore = create<PropertySelectionState>(
  set => ({
    selectedPropertyId: null,
    setSelectedPropertyId: id => {
      set({ selectedPropertyId: id });
      if (id) {
        setItem(STORAGE_KEYS.SELECTED_PROPERTY_ID, id).catch(err => {
          if (__DEV__) console.error('Failed to persist property ID:', err);
        });
      }
    },
    initializeSelectedProperty: async () => {
      try {
        const stored = await getItem(STORAGE_KEYS.SELECTED_PROPERTY_ID);
        if (stored) {
          set({ selectedPropertyId: stored });
        }
      } catch (err) {
        if (__DEV__) console.error('Failed to initialize property ID:', err);
      }
    },
  }),
);

// Backward compatibility shim for selectedProjectId mapping
export const useProjectSelectionStore = create<any>(set => ({
  selectedProjectId: null,
  setSelectedProjectId: (id: string | null) => {
    usePropertySelectionStore.getState().setSelectedPropertyId(id);
    set({ selectedProjectId: id });
  },
}));

// Synchronize backward compat store when main store changes
usePropertySelectionStore.subscribe(state => {
  useProjectSelectionStore.setState({
    selectedProjectId: state.selectedPropertyId,
  });
});

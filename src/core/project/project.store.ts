/**
 * Project Store — Zustand store for property selection
 *
 * Lightweight selection context only. Changing property resets dependent
 * context and invalidates consumer-domain React Query caches.
 *
 * Layer: core/project
 */

import { create } from 'zustand';

import { STORAGE_KEYS } from '@/core/config/constants';
import { appQueryClient } from '@/core/query/query-client';
import { getItem, removeItem, setItem } from '@/core/storage/app.storage';
import { consumerKeys } from '@/data/query-keys';

/** Explicit deselection sentinel (see CustomerFlowInput / resolveCustomerFlow). */
export const PROPERTY_SELECTION_NONE = 'none' as const;

export type SelectedPropertyId = string | typeof PROPERTY_SELECTION_NONE | null;

interface PropertySelectionState {
  selectedPropertyId: SelectedPropertyId;
  setSelectedPropertyId: (id: SelectedPropertyId) => void;
  initializeSelectedProperty: () => Promise<void>;
}

function resetDependentContext(): void {
  // Extension point for T6+ dependent Zustand slices (quote/project UI context).
}

function invalidateDependentConsumerQueries(): void {
  void appQueryClient
    .invalidateQueries({ queryKey: consumerKeys.all })
    .catch(err => {
      if (__DEV__) {
        console.error('Failed to invalidate consumer queries:', err);
      }
    });
}

async function persistSelectedPropertyId(
  id: SelectedPropertyId,
): Promise<void> {
  if (id === null) {
    await removeItem(STORAGE_KEYS.SELECTED_PROPERTY_ID);
    return;
  }
  await setItem(STORAGE_KEYS.SELECTED_PROPERTY_ID, id);
}

function parseStoredSelection(stored: string): SelectedPropertyId {
  if (stored === PROPERTY_SELECTION_NONE) {
    return PROPERTY_SELECTION_NONE;
  }
  return stored;
}

export const usePropertySelectionStore = create<PropertySelectionState>(
  (set, get) => ({
    selectedPropertyId: null,
    setSelectedPropertyId: id => {
      if (id === get().selectedPropertyId) {
        return;
      }

      resetDependentContext();
      set({ selectedPropertyId: id });

      persistSelectedPropertyId(id).catch(err => {
        if (__DEV__) {
          console.error('Failed to persist property selection:', err);
        }
      });

      invalidateDependentConsumerQueries();
    },
    initializeSelectedProperty: async () => {
      try {
        const stored = await getItem(STORAGE_KEYS.SELECTED_PROPERTY_ID);
        if (stored !== null) {
          set({ selectedPropertyId: parseStoredSelection(stored) });
        }
      } catch (err) {
        if (__DEV__) {
          console.error('Failed to initialize property ID:', err);
        }
      }
    },
  }),
);

interface ProjectSelectionShimState {
  selectedProjectId: SelectedPropertyId;
  setSelectedProjectId: (id: SelectedPropertyId) => void;
}

/** @deprecated Use usePropertySelectionStore — removed in T21 */
export const useProjectSelectionStore = create<ProjectSelectionShimState>(
  set => ({
    selectedProjectId: null,
    setSelectedProjectId: (id: SelectedPropertyId) => {
      usePropertySelectionStore.getState().setSelectedPropertyId(id);
      set({ selectedProjectId: id });
    },
  }),
);

usePropertySelectionStore.subscribe(state => {
  useProjectSelectionStore.setState({
    selectedProjectId: state.selectedPropertyId,
  });
});

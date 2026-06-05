/**
 * useCustomerFlow — Central customer journey hook
 *
 * Composes T4 FDAL (useCustomerProperties), T10 FDAL (useCustomerQuotations),
 * T5 selection store, and T2 pure resolvers. Consumed exclusively by
 * CustomerFlowResolver (T6).
 *
 * Layer: shared/hooks
 * Dependency direction: data/resources, data/utils, core/project
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  PROPERTY_SELECTION_NONE,
  type SelectedPropertyId,
  usePropertySelectionStore,
} from '@/core/project/project.store';
import { useCustomerProperties, useCustomerQuotations } from '@/data';
import type {
  CustomerFlowState,
  QuotationView,
} from '@/data/types/customer-journey.types';
import type { CustomerProperty, Quote } from '@/data/types/project.types';
import {
  resolveCustomerFlow,
  resolveEffectiveQuotes,
  resolveQuotationView,
} from '@/data/utils';

export interface UseCustomerFlowResult {
  flowState: CustomerFlowState;
  quotationView: QuotationView;
  activeQuotes: Quote[];
  properties: CustomerProperty[];
  activeProperty: CustomerProperty | null;
  selectedPropertyId: SelectedPropertyId;
  setSelectedPropertyId: (id: SelectedPropertyId) => void;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => Promise<unknown>;
  refetchQuotations: () => Promise<unknown>;
}

function resolveActiveProperty(
  properties: CustomerProperty[],
  selectedPropertyId: SelectedPropertyId,
): CustomerProperty | null {
  if (selectedPropertyId === PROPERTY_SELECTION_NONE) {
    return null;
  }

  if (selectedPropertyId !== null) {
    const byId = properties.find(p => p.id === selectedPropertyId);
    if (byId) {
      return byId;
    }
  }

  if (properties.length === 1) {
    return properties[0] ?? null;
  }

  return null;
}

export function useCustomerFlow(): UseCustomerFlowResult {
  const selectedPropertyId = usePropertySelectionStore(
    state => state.selectedPropertyId,
  );
  const setSelectedPropertyId = usePropertySelectionStore(
    state => state.setSelectedPropertyId,
  );
  const initializeSelectedProperty = usePropertySelectionStore(
    state => state.initializeSelectedProperty,
  );

  const {
    data: properties = [],
    isLoading: isPropertiesLoading,
    isError: isPropertiesError,
    isFetching: isPropertiesFetching,
    refetch: refetchProperties,
  } = useCustomerProperties();

  const [isSelectionHydrated, setIsSelectionHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void initializeSelectedProperty().finally(() => {
      if (!cancelled) {
        setIsSelectionHydrated(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [initializeSelectedProperty]);

  useEffect(() => {
    if (!isSelectionHydrated || isPropertiesLoading) {
      return;
    }

    if (properties.length === 1) {
      const onlyProperty = properties[0];
      if (!onlyProperty) {
        return;
      }

      const hasValidSelection = selectedPropertyId === onlyProperty.id;
      if (
        !hasValidSelection &&
        selectedPropertyId !== PROPERTY_SELECTION_NONE
      ) {
        setSelectedPropertyId(onlyProperty.id);
      }
      return;
    }

    if (properties.length > 1 && selectedPropertyId === null) {
      setSelectedPropertyId(PROPERTY_SELECTION_NONE);
    }
  }, [
    isSelectionHydrated,
    isPropertiesLoading,
    properties,
    selectedPropertyId,
    setSelectedPropertyId,
  ]);

  const activeProperty = useMemo(
    () => resolveActiveProperty(properties, selectedPropertyId),
    [properties, selectedPropertyId],
  );

  const activePropertyId = activeProperty?.id ?? '';
  const shouldFetchQuotations =
    !!activePropertyId && isSelectionHydrated && !isPropertiesLoading;

  const {
    data: activeQuotes = [],
    isLoading: isQuotesLoading,
    isError: isQuotesError,
    isFetching: isQuotesFetching,
    refetch: refetchQuotations,
  } = useCustomerQuotations(activePropertyId, {
    enabled: shouldFetchQuotations,
  });

  const effectiveQuotes = useMemo(
    () => resolveEffectiveQuotes(activeQuotes, activeProperty?.quotes),
    [activeQuotes, activeProperty?.quotes],
  );

  const quotationView = useMemo(
    () => resolveQuotationView(effectiveQuotes),
    [effectiveQuotes],
  );

  const isLoading =
    isPropertiesLoading ||
    !isSelectionHydrated ||
    (shouldFetchQuotations && isQuotesLoading);

  const isError = isPropertiesError || (shouldFetchQuotations && isQuotesError);

  const isFetching =
    isPropertiesFetching || (shouldFetchQuotations && isQuotesFetching);

  const flowState = useMemo(
    () =>
      resolveCustomerFlow({
        isLoading,
        isError,
        properties,
        selectedPropertyId,
        activeProperty,
        quotationView,
      }),
    [
      isLoading,
      isError,
      properties,
      selectedPropertyId,
      activeProperty,
      quotationView,
    ],
  );

  const refetch = useCallback(async () => {
    const propertyResult = await refetchProperties();
    if (shouldFetchQuotations) {
      await refetchQuotations();
    }
    return propertyResult;
  }, [refetchProperties, refetchQuotations, shouldFetchQuotations]);

  return {
    flowState,
    quotationView,
    activeQuotes: effectiveQuotes,
    properties,
    activeProperty,
    selectedPropertyId,
    setSelectedPropertyId,
    isLoading,
    isError,
    isFetching,
    refetch,
    refetchQuotations,
  };
}

/**
 * useActiveProperty — Shared hook for accessing active property selection,
 * customer properties list, and property lifecycle stage resolution.
 *
 * Layer: shared/hooks
 */

import { useEffect } from 'react';
import { usePropertySelectionStore } from '@/core/project/project.store';
import { useProperties } from '@/data';
import { QuoteStatus } from '@tejas96/shared';

export type PropertyStage =
  | 'not_quoted'
  | 'quoted'
  | 'all_rejected'
  | 'quote_accepted'
  | 'project_active';

export function useActiveProperty() {
  const selectedPropertyId = usePropertySelectionStore(
    state => state.selectedPropertyId,
  );
  const setSelectedPropertyId = usePropertySelectionStore(
    state => state.setSelectedPropertyId,
  );

  const {
    data: properties = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProperties();

  // Automatically select the primary property or first property by default when properties finish loading
  const hasSelectedProperty = properties.some(p => p.id === selectedPropertyId);
  const shouldSetDefault =
    !isLoading &&
    properties.length > 0 &&
    (!selectedPropertyId || !hasSelectedProperty) &&
    selectedPropertyId !== 'none';

  useEffect(() => {
    if (shouldSetDefault) {
      const defaultProperty =
        properties.find(p => p.isPrimary) || properties[0];
      if (defaultProperty) {
        setSelectedPropertyId(defaultProperty.id);
      }
    }
  }, [shouldSetDefault, properties, setSelectedPropertyId]);

  // Selected property resolution: matches ID, or primary property, or first property, or null
  const activeProperty =
    selectedPropertyId === 'none'
      ? null
      : properties.find(p => p.id === selectedPropertyId) ||
        properties.find(p => p.isPrimary) ||
        properties[0] ||
        null;

  const isOnboarding =
    selectedPropertyId === 'none' || !activeProperty || properties.length === 0;

  // Resolve property stage & quotes
  const quotes = activeProperty?.quotes || [];

  // Sort quotes by date (newest first)
  const sortedQuotes = [...quotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const latestQuote = sortedQuotes[0] || null;
  const latestQuoteVersion =
    latestQuote?.versions && latestQuote.versions.length > 0
      ? [...latestQuote.versions].sort(
          (a, b) => b.versionNumber - a.versionNumber,
        )[0]
      : null;

  let propertyStage: PropertyStage = 'not_quoted';

  if (activeProperty) {
    const hasProject = !!activeProperty.project;
    const hasAcceptedQuote = quotes.some(
      (q: any) => String(q.status).toLowerCase() === QuoteStatus.ACCEPTED,
    );
    const allRejected =
      quotes.length > 0 &&
      quotes.every(
        (q: any) => String(q.status).toLowerCase() === QuoteStatus.REJECTED,
      );
    const hasQuotes = quotes.length > 0;

    if (hasProject) {
      propertyStage = 'project_active';
    } else if (hasAcceptedQuote) {
      propertyStage = 'quote_accepted';
    } else if (allRejected) {
      propertyStage = 'all_rejected';
    } else if (hasQuotes) {
      propertyStage = 'quoted';
    } else {
      propertyStage = 'not_quoted';
    }
  }

  return {
    selectedPropertyId,
    activeProperty,
    isOnboarding,
    properties,
    isLoading,
    isError,
    isFetching,
    refetch,
    propertyStage,
    latestQuote,
    latestQuoteVersion,
  };
}

// Backward compatibility shim for screens and hooks that are not yet migrated
export function useActiveProject(): any {
  const activeProp = useActiveProperty();

  // Map CustomerProperty/Project back to expected legacy structure
  const activeProjectMapped = activeProp.activeProperty
    ? {
        id: activeProp.activeProperty.id,
        label: activeProp.activeProperty.propertyName || '',

        status: activeProp.activeProperty.project?.status || 'PLANNING',
        totalValue:
          activeProp.latestQuoteVersion?.finalPrice ||
          activeProp.latestQuote?.versions?.[0]?.finalPrice ||
          0,
        subsidy:
          activeProp.latestQuoteVersion?.pricingBreakdown?.subsidyAmount ||
          activeProp.latestQuoteVersion?.quoteSnapshot?.pricing
            ?.subsidyAmount ||
          0,
        amountPaid:
          (activeProp.activeProperty.project?.metadata?.amountPaid as number) ||
          0,
        startDate: activeProp.activeProperty.project?.startDate || '',
        endDate: activeProp.activeProperty.project?.endDate || '',
        progress: activeProp.activeProperty.project?.progressPercentage || 0,
        capacity:
          activeProp.latestQuoteVersion?.quoteSnapshot?.calculation
            ?.actualSystemSizeKw ??
          activeProp.latestQuoteVersion?.quoteSnapshot?.inputs
            ?.actualSystemSizeKw ??
          activeProp.latestQuoteVersion?.actualSystemSizeKw ??
          0,
        projectNumber: activeProp.activeProperty.project?.projectNumber,
        property: activeProp.activeProperty,
        quoteVersion: activeProp.latestQuoteVersion,
      }
    : null;

  return {
    selectedProjectId: activeProp.selectedPropertyId,
    activeProject: activeProjectMapped,
    isOnboarding: activeProp.isOnboarding,
    projects: activeProp.properties.map(p => {
      const qList = p.quotes || [];
      const newestQ = [...qList].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
      const newestV = newestQ?.versions?.[0];

      return {
        id: p.id,
        label: p.propertyName || 'My Property',
        status: p.project?.status || 'PLANNING',
        progress: p.project?.progressPercentage || 0,
        capacity:
          newestV?.quoteSnapshot?.calculation?.actualSystemSizeKw ??
          newestV?.quoteSnapshot?.inputs?.actualSystemSizeKw ??
          newestV?.actualSystemSizeKw ??
          0,
        property: p,
      };
    }),
    isLoading: activeProp.isLoading,
    isError: activeProp.isError,
    refetch: activeProp.refetch,
  };
}

/**
 * usePropertySelectionLogic — Property picker actions for select_property leaf
 *
 * Layer: app/flow/hooks
 */

import { useCallback, useMemo } from 'react';

import { useTranslation, type TranslationKey } from '@/core/i18n';
import type { CustomerProperty } from '@/data/types/project.types';
import {
  resolvePropertyStageBadge,
  type PropertyStageBadge,
  type PropertyStageChipStatus,
} from '@/data/utils';
import { useCustomerFlow } from '@/shared/hooks/useCustomerFlow';

import { formatPropertyLocation } from '../utils/property-selection-display';

export interface PropertySelectionStageDisplay {
  stage: PropertyStageBadge;
  label: string;
  chipStatus: PropertyStageChipStatus;
}

const STAGE_I18N_KEYS: Record<PropertyStageBadge, TranslationKey> = {
  no_quotation: 'propertySelection.stage.no_quotation',
  quotation_ready: 'propertySelection.stage.quotation_ready',
  quote_accepted: 'propertySelection.stage.quote_accepted',
  in_progress: 'propertySelection.stage.in_progress',
  completed: 'propertySelection.stage.completed',
  quotations_closed: 'propertySelection.stage.quotations_closed',
};

export function usePropertySelectionLogic() {
  const { t } = useTranslation();
  const { properties, selectedPropertyId, setSelectedPropertyId } =
    useCustomerFlow();

  const getPropertyDisplayName = useCallback(
    (property: CustomerProperty) =>
      property.propertyName?.trim() ||
      t('propertySelection.defaultPropertyName'),
    [t],
  );

  const getStageForProperty = useCallback(
    (property: CustomerProperty): PropertySelectionStageDisplay => {
      const { stage, chipStatus } = resolvePropertyStageBadge(property);
      return {
        stage,
        chipStatus,
        label: t(STAGE_I18N_KEYS[stage]),
      };
    },
    [t],
  );

  const handleSelectProperty = useCallback(
    (propertyId: string) => {
      setSelectedPropertyId(propertyId);
    },
    [setSelectedPropertyId],
  );

  const propertyItems = useMemo(
    () =>
      properties.map(property => ({
        property,
        displayName: getPropertyDisplayName(property),
        locationLine: formatPropertyLocation(property),
        stage: getStageForProperty(property),
        isSelected: property.id === selectedPropertyId,
      })),
    [
      properties,
      selectedPropertyId,
      getPropertyDisplayName,
      getStageForProperty,
    ],
  );

  return {
    propertyItems,
    handleSelectProperty,
  };
}

/**
 * property-selection-display — Pure helpers for property picker UI
 *
 * Layer: app/flow/utils
 */

import type { CustomerProperty } from '@/data/types/project.types';

export function formatPropertyLocation(property: CustomerProperty): string {
  const parts: string[] = [];

  if (property.address?.trim()) {
    parts.push(property.address.trim());
  }

  const cityState = [property.city, property.state].filter(Boolean).join(', ');
  if (cityState) {
    parts.push(cityState);
  }

  if (property.pincode?.trim()) {
    parts.push(property.pincode.trim());
  }

  return parts.join(' · ');
}

/**
 * map-active-property-header — Map consumer property + quote to tab header Project shape
 *
 * Layer: shared/utils
 */

import type {
  CustomerProperty,
  Project,
  Quote,
  QuoteVersion,
} from '@/data/types/project.types';

export function getLatestQuoteVersion(
  quote: Quote | null | undefined,
): QuoteVersion | null {
  if (!quote?.versions?.length) {
    return null;
  }
  return (
    [...quote.versions].sort((a, b) => b.versionNumber - a.versionNumber)[0] ??
    null
  );
}

export function readMetadataAmountPaid(metadata: unknown): number {
  if (metadata && typeof metadata === 'object' && 'amountPaid' in metadata) {
    const paid = (metadata as { amountPaid?: unknown }).amountPaid;
    return typeof paid === 'number' ? paid : 0;
  }
  return 0;
}

function resolveSystemCapacityKw(
  project: CustomerProperty['project'],
  quoteVersion: QuoteVersion | null,
): number {
  const actualSize =
    quoteVersion?.quoteSnapshot?.calculation?.actualSystemSizeKw ??
    quoteVersion?.quoteSnapshot?.inputs?.actualSystemSizeKw ??
    quoteVersion?.actualSystemSizeKw ??
    (project as { actualSystemSizeKw?: number })?.actualSystemSizeKw;

  if (typeof actualSize === 'number' && actualSize > 0) {
    return actualSize;
  }

  if (project && 'systemSizeKw' in project) {
    const fromProject = (project as { systemSizeKw?: number }).systemSizeKw;
    if (typeof fromProject === 'number' && fromProject > 0) {
      return fromProject;
    }
  }

  return quoteVersion?.systemSizeKw ?? 0;
}

export interface MapActivePropertyToProjectOptions {
  defaultPropertyName: string;
  latestQuoteVersion?: QuoteVersion | null;
  totalValue?: number;
  subsidy?: number;
  amountPaid?: number;
  progress?: number;
  nextStep?: string;
}

export function mapActivePropertyToProject(
  activeProperty: CustomerProperty | null,
  options: MapActivePropertyToProjectOptions,
): Project | null {
  if (!activeProperty) {
    return null;
  }

  const project = activeProperty.project;
  const quoteVersion =
    options.latestQuoteVersion ??
    getLatestQuoteVersion(
      activeProperty.quotes?.[0] ? activeProperty.quotes[0] : null,
    );

  const totalValue = options.totalValue ?? quoteVersion?.finalPrice ?? 0;
  const subsidy =
    options.subsidy ??
    quoteVersion?.pricingBreakdown?.subsidyAmount ??
    quoteVersion?.quoteSnapshot?.pricing?.subsidyAmount ??
    0;
  const amountPaid =
    options.amountPaid ?? readMetadataAmountPaid(project?.metadata);
  const progress = options.progress ?? project?.progressPercentage ?? 0;

  const label =
    activeProperty.propertyName?.trim() || options.defaultPropertyName;

  return {
    id: activeProperty.id,
    label,
    status: project?.status ?? 'PLANNING',
    totalValue,
    subsidy,
    amountPaid,
    startDate: project?.startDate ?? '',
    endDate: project?.endDate ?? '',
    progress,
    capacity: resolveSystemCapacityKw(project, quoteVersion),
    nextStep: options.nextStep,
    projectNumber: project?.projectNumber,
    property: activeProperty,
    quoteVersion,
  };
}

/** Minimal header row for documents switcher badge */
export function mapActivePropertyToMinimalProject(
  activeProperty: CustomerProperty | null,
  defaultPropertyName: string,
): ActiveProjectSummaryShape | null {
  if (!activeProperty) {
    return null;
  }

  return {
    id: activeProperty.id,
    label: activeProperty.propertyName?.trim() || defaultPropertyName,
    status: activeProperty.project?.status ?? 'PLANNING',
    property: activeProperty,
  };
}

/** Header summary used by tab screens (CTPremiumHeader / PaymentsHeader). */
export interface ActiveProjectSummaryShape {
  id: string;
  label: string;
  status: string;
  property?: CustomerProperty;
}

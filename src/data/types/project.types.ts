/**
 * Project & Property Types — Synchronized from monorepo shared library
 *
 * Layer: data/types
 */

import type {
  CustomerProperty as SharedCustomerProperty,
  Quote as SharedQuote,
  QuoteVersion as SharedQuoteVersion,
  ProjectStatus,
  PropertyStatus,
  PropertyType,
  PricingBreakdown,
  QuoteSnapshot,
  PaymentMilestone,
} from '@tejas96/shared';

export type {
  ProjectStatus,
  PropertyStatus,
  PropertyType,
  PricingBreakdown,
  QuoteSnapshot,
  PaymentMilestone,
};

export interface CustomerProperty
  extends Omit<SharedCustomerProperty, 'project' | 'quotes'> {
  propertyName?: string;
  propertyType: PropertyType;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  project?: Project;
  quotes?: Quote[];
  customerName?: string;
  discomName?: string;
  consumerNumber?: string;
}

/** Flat fields from consumer QuoteResponseDto (latest version) when versions are omitted */
export interface ConsumerQuoteFlatFields {
  quoteNumber?: string;
  validUntil?: string;
  systemType?: string;
  systemSizeKw?: number;
  actualSystemSizeKw?: number;
  totalWattageWp?: number;
  projectType?: PropertyType;
  basePrice?: number;
  gstAmount?: number;
  totalPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
  effectivePrice?: number;
  isSubsidyApplicable?: boolean;
  subsidyAmount?: number;
  pricingBreakdown?: PricingBreakdown;
  propertyName?: string;
  propertyAddress?: string;
}

export interface Quote
  extends Omit<SharedQuote, 'versions' | keyof ConsumerQuoteFlatFields>,
    ConsumerQuoteFlatFields {
  versions?: QuoteVersion[];
}

export interface QuoteVersion extends SharedQuoteVersion {
  systemType: string;
  systemSizeKw: number;
  actualSystemSizeKw?: number;
  totalWattageWp: number;
  projectCompletionWeeks: number;
  pricingBreakdown?: PricingBreakdown;
  quoteSnapshot?: QuoteSnapshot;
  paymentMilestones?: PaymentMilestone[];
}

export interface Project {
  // Legacy & custom fields
  id: string;
  label: string;
  status: any;
  totalValue: number;
  subsidy: number;
  amountPaid: number;
  startDate: string;
  endDate: string;
  progress: number;
  capacity: number;
  nextStep?: string;
  projectNumber?: string;
  property?: CustomerProperty;
  quoteVersion?: QuoteVersion | null;
  metadata?: any;

  // Backend fields
  propertyId?: string;
  quoteId?: string;
  createdBy?: string;
  updatedBy?: string;
  name?: string;
  priority?: any;
  progressPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export type MilestoneDisplayStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'blocked'
  | 'no_tasks';

export interface MilestoneAggregateItem {
  name: string;
  order: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  percent: number;
  status: MilestoneDisplayStatus;
}

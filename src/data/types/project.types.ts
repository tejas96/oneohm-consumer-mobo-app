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
}

export interface Quote extends Omit<SharedQuote, 'versions'> {
  versions?: QuoteVersion[];
}

export interface QuoteVersion extends SharedQuoteVersion {
  systemType: string;
  systemSizeKw: number;
  totalWattageWp: number;
  projectCompletionWeeks: number;
  pricingBreakdown?: PricingBreakdown;
  quoteSnapshot?: QuoteSnapshot;
  paymentMilestones?: PaymentMilestone[];
}

export interface Project {
  // Legacy & custom fields
  id: string;
  label?: string;
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

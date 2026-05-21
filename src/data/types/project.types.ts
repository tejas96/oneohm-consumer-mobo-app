/**
 * Project Types — Project type definitions
 *
 * Layer: data/types
 */

export type ProjectStatus =
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ON_HOLD';

export interface CustomerProperty {
  propertyName: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  consumerNumber: string;
  consumerName: string;
  discomName: string;
  monthlyBill: number;
}

export interface QuoteVersion {
  systemType: string;
  systemSizeKw: number;
  totalWattageWp: number;
  projectCompletionWeeks: number;
}

export interface Project {
  id: string;
  label: string;
  status: ProjectStatus;
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
  quoteVersion?: QuoteVersion;
}

/**
 * Consumer Quotation Service — Customer-safe quotation API calls
 *
 * Purpose: Raw API calls for T9 /consumer quotation routes.
 * No React, no hooks — pure async functions.
 *
 * Layer: data/services
 * Dependency direction: core/api, data/types
 */

import { api, API_ENDPOINTS } from '@/core/api';

import type { Quote } from '../types/project.types';

export interface ConsumerAcceptQuotationPayload {
  customerSignature: string;
}

export interface ConsumerRejectQuotationPayload {
  rejectionReason: string;
}

async function getQuotationsByProperty(propertyId: string): Promise<Quote[]> {
  return api.get<Quote[]>(
    API_ENDPOINTS.CONSUMER.QUOTATIONS.BY_PROPERTY(propertyId),
  );
}

async function getQuotation(quotationId: string): Promise<Quote> {
  return api.get<Quote>(API_ENDPOINTS.CONSUMER.QUOTATIONS.DETAIL(quotationId));
}

async function acceptQuotation(
  quotationId: string,
  payload: ConsumerAcceptQuotationPayload,
): Promise<Quote> {
  return api.post<Quote, ConsumerAcceptQuotationPayload>(
    API_ENDPOINTS.CONSUMER.QUOTATIONS.ACCEPT(quotationId),
    payload,
  );
}

async function rejectQuotation(
  quotationId: string,
  payload: ConsumerRejectQuotationPayload,
): Promise<Quote> {
  return api.post<Quote, ConsumerRejectQuotationPayload>(
    API_ENDPOINTS.CONSUMER.QUOTATIONS.REJECT(quotationId),
    payload,
  );
}

export const ConsumerQuotationService = {
  getQuotationsByProperty,
  getQuotation,
  acceptQuotation,
  rejectQuotation,
};

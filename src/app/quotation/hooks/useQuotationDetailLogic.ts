/**
 * useQuotationDetailLogic — quotation_active detail leaf
 *
 * Layer: app/quotation/hooks
 */

import { useCallback, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';

import { DcrPreference } from '@tejas96/shared';

import type {
  InverterSpecs,
  PanelSpecs,
  ProjectSpecsData,
  StructureSpecs,
} from '@/app/project/hooks/useProjectLogic';
import { useTranslation } from '@/core/i18n';
import {
  useAcceptQuotation,
  useCustomerQuotation,
  useRejectQuotation,
} from '@/data';
import { useCustomerFlow } from '@/shared/hooks/useCustomerFlow';

import {
  getLatestQuoteVersion,
  isInactiveQuoteStatus,
} from '../utils/quote-display';

function canActOnDisplayedQuote(
  status: string,
  propertyReadOnly: boolean,
): { canAccept: boolean; canReject: boolean } {
  if (propertyReadOnly) {
    return { canAccept: false, canReject: false };
  }

  const normalized = String(status).toLowerCase();

  if (isInactiveQuoteStatus(normalized) || normalized === 'accepted') {
    return { canAccept: false, canReject: false };
  }

  return { canAccept: true, canReject: true };
}

export function useQuotationDetailLogic(
  propertyId: string,
  quotationId: string,
) {
  const { t } = useTranslation();
  const { quotationView, activeProperty, refetch } = useCustomerFlow();
  const [isPricingExpanded, setIsPricingExpanded] = useState(false);

  const [acceptDialogVisible, setAcceptDialogVisible] = useState(false);
  const [rejectDialogVisible, setRejectDialogVisible] = useState(false);
  const [signature, setSignature] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [signatureError, setSignatureError] = useState<string | undefined>();
  const [reasonError, setReasonError] = useState<string | undefined>();

  const acceptMutation = useAcceptQuotation();
  const rejectMutation = useRejectQuotation();

  const {
    data: quote,
    isLoading,
    isError,
    isFetching,
    refetch: refetchQuote,
  } = useCustomerQuotation(quotationId, {
    enabled: !!quotationId && !!propertyId,
  });

  const isPropertyReadOnly = quotationView.mode === 'read_only';
  const isSubmitting = acceptMutation.isPending || rejectMutation.isPending;

  const propertyName =
    activeProperty?.propertyName?.trim() || quote?.propertyName || undefined;

  const togglePricingExpanded = useCallback(() => {
    setIsPricingExpanded(prev => !prev);
  }, []);

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetch(), refetchQuote()]);
  }, [refetch, refetchQuote]);

  const displayQuote = useMemo(
    () => quote ?? quotationView.activeQuote,
    [quote, quotationView.activeQuote],
  );

  const displayedStatus = String(displayQuote?.status ?? '');
  const isViewingAcceptedQuote = displayedStatus.toLowerCase() === 'accepted';

  const { canAccept: canShowAccept, canReject: canShowReject } = useMemo(
    () => canActOnDisplayedQuote(displayedStatus, isPropertyReadOnly),
    [displayedStatus, isPropertyReadOnly],
  );

  /** Read-only banner when property has an accepted quote or this quote is accepted */
  const isReadOnly = isPropertyReadOnly || isViewingAcceptedQuote;

  const resetAcceptDialog = useCallback(() => {
    setSignature('');
    setSignatureError(undefined);
    setAcceptDialogVisible(false);
  }, []);

  const resetRejectDialog = useCallback(() => {
    setRejectionReason('');
    setReasonError(undefined);
    setRejectDialogVisible(false);
  }, []);

  const openAcceptDialog = useCallback(() => {
    if (!canShowAccept || isSubmitting) {
      return;
    }
    setSignatureError(undefined);
    setAcceptDialogVisible(true);
  }, [canShowAccept, isSubmitting]);

  const openRejectDialog = useCallback(() => {
    if (!canShowReject || isSubmitting) {
      return;
    }
    setReasonError(undefined);
    setRejectDialogVisible(true);
  }, [canShowReject, isSubmitting]);

  const dismissAcceptDialog = useCallback(() => {
    if (isSubmitting) {
      return;
    }
    resetAcceptDialog();
  }, [isSubmitting, resetAcceptDialog]);

  const dismissRejectDialog = useCallback(() => {
    if (isSubmitting) {
      return;
    }
    resetRejectDialog();
  }, [isSubmitting, resetRejectDialog]);

  const confirmAccept = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    const trimmed = signature.trim();
    if (!trimmed) {
      setSignatureError(t('quotation.accept.errorEmpty'));
      return;
    }

    setSignatureError(undefined);

    try {
      await acceptMutation.mutateAsync({
        quotationId,
        customerSignature: trimmed,
      });
      resetAcceptDialog();
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('quotation.accept.error'),
      });
    }
  }, [
    isSubmitting,
    signature,
    t,
    acceptMutation,
    quotationId,
    resetAcceptDialog,
  ]);

  const handleSignatureChange = useCallback((text: string) => {
    setSignature(text);
    setSignatureError(undefined);
  }, []);

  const handleRejectionReasonChange = useCallback((text: string) => {
    setRejectionReason(text);
    setReasonError(undefined);
  }, []);

  const confirmReject = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    const trimmed = rejectionReason.trim();
    if (!trimmed) {
      setReasonError(t('quotation.reject.errorEmpty'));
      return;
    }

    setReasonError(undefined);

    try {
      await rejectMutation.mutateAsync({
        quotationId,
        rejectionReason: trimmed,
      });
      resetRejectDialog();
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('quotation.reject.error'),
      });
    }
  }, [
    isSubmitting,
    rejectionReason,
    t,
    rejectMutation,
    quotationId,
    resetRejectDialog,
  ]);

  const specsData = useMemo<ProjectSpecsData>(() => {
    let dcrPanels: PanelSpecs | null = null;
    let nonDcrPanels: PanelSpecs | null = null;
    let inverter: InverterSpecs | null = null;
    let structure: StructureSpecs | null = null;

    if (!displayQuote) {
      return { dcrPanels, nonDcrPanels, inverter, structure };
    }

    const version = getLatestQuoteVersion(displayQuote);
    const inputs = version?.quoteSnapshot?.inputs;
    const calculation = version?.quoteSnapshot?.calculation;

    if (inputs) {
      const capacity =
        calculation?.actualSystemSizeKw ??
        inputs.actualSystemSizeKw ??
        version?.actualSystemSizeKw ??
        0;

      // 1. Solar Panels — derived from calculation if present
      if (calculation?.panels?.length) {
        for (const p of calculation.panels) {
          const panelSpec: PanelSpecs = {
            technology: p.technology || inputs.preferredPanelTechnology || '',
            brand: p.brand || inputs.preferredPanelBrand || '',
            count: p.quantity ?? 0,
            warranty: p.productWarrantyYears
              ? `${p.productWarrantyYears} Years Product`
              : p.performanceWarrantyYears
              ? `${p.performanceWarrantyYears} Years Performance`
              : '',
          };
          if (p.isDcr) {
            dcrPanels = panelSpec;
          } else {
            nonDcrPanels = panelSpec;
          }
        }
      } else {
        // Fallback to inputs-based panel specs
        const dcrPref = inputs.dcrPreference;
        if (dcrPref !== DcrPreference.NON_DCR_ONLY && inputs.dcrSystemSizeKw) {
          dcrPanels = {
            technology: inputs.preferredPanelTechnology || '',
            brand: inputs.preferredPanelBrand || '',
            count: inputs.manualDcrPanelCount ?? 0,
            warranty: '',
          };
        }
        if (dcrPref !== DcrPreference.DCR_ONLY && inputs.nonDcrSystemSizeKw) {
          nonDcrPanels = {
            technology: inputs.preferredPanelTechnology || '',
            brand: inputs.preferredPanelBrand || '',
            count: inputs.manualNonDcrPanelCount ?? 0,
            warranty: '',
          };
        }
      }

      // 2. Inverters — derived from calculation if present
      if (calculation?.inverters?.inverters?.length) {
        const items = calculation.inverters.inverters.map((inv, idx) => ({
          brand: inv.brand || inputs.preferredInverterBrand || '',
          capacity: `${Number(inv.capacityKw || 0).toFixed(2)} kW`,
          quantity: `${inv.quantity} Unit${inv.quantity > 1 ? 's' : ''}`,
          name: inv.name || `Inverter ${idx + 1}`,
          warranty: inv.productWarrantyYears
            ? `${inv.productWarrantyYears} Years Product`
            : '',
        }));
        inverter = {
          inverters: items,
          phaseType: inputs.phaseType || '',
          totalCapacity: `${Number(calculation.inverters.totalCapacityKw || 0).toFixed(2)} kW`,
        };
      } else if (capacity > 0) {
        // Fallback to inputs-based inverter specs
        inverter = {
          inverters: [
            {
              brand: inputs.preferredInverterBrand || '',
              capacity: `${Number(capacity || 0).toFixed(2)} kW`,
              quantity: inputs.manualInverterCount
                ? `${inputs.manualInverterCount} Unit${
                    inputs.manualInverterCount > 1 ? 's' : ''
                  }`
                : '1 Unit',
              name: 'Inverter 1',
              warranty: '',
            },
          ],
          phaseType: inputs.phaseType || '',
          totalCapacity: `${Number(capacity || 0).toFixed(2)} kW`,
        };
      }

      // 3. Mounting structure — from quote inputs
      if (inputs.structureType) {
        structure = {
          structureType: inputs.structureType,
        };
      }
    }

    return {
      dcrPanels,
      nonDcrPanels,
      inverter,
      structure,
    };
  }, [displayQuote]);

  const hasSpecs = useMemo(
    () =>
      specsData.dcrPanels !== null ||
      specsData.nonDcrPanels !== null ||
      specsData.inverter !== null ||
      specsData.structure !== null,
    [specsData],
  );

  return {
    quote: displayQuote,
    propertyName,
    isReadOnly,
    isPricingExpanded,
    togglePricingExpanded,
    isLoading,
    isError,
    isFetching,
    handleRefresh,
    canShowAccept,
    canShowReject,
    isSubmitting,
    acceptDialogVisible,
    rejectDialogVisible,
    signature,
    handleSignatureChange,
    rejectionReason,
    handleRejectionReasonChange,
    signatureError,
    reasonError,
    openAcceptDialog,
    openRejectDialog,
    dismissAcceptDialog,
    dismissRejectDialog,
    confirmAccept,
    confirmReject,
    specsData,
    hasSpecs,
  };
}

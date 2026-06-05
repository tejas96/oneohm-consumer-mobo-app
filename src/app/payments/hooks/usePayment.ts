/**
 * usePayment — Custom hook for managing Payments Screen logic and dynamic states
 *
 * Layer: app/payments/hooks
 */

import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth';
import { Route, type MainStackParamList } from '@/core/navigation';
import { useTranslation, type TranslationKey } from '@/core/i18n';
import {
  useCustomerProjectFinancialSummary,
  useCustomerProjectPayments,
} from '@/data';
import { useCustomerFlow } from '@/shared/hooks';
import {
  getLatestQuoteVersion,
  mapActivePropertyToProject,
} from '@/shared/utils';
import { formatCurrency } from '@/shared/utils/format';

import {
  mapConsumerPaymentsToMilestones,
  mapFinancialSummaryToDisplay,
} from '../utils/map-consumer-payments';

export interface Installment {
  title: string;
  subtitle: string;
  amount: number;
}

export interface PaymentMilestone {
  id: number;
  nameKey: TranslationKey;
  /** Human-readable term name from API (preferred over i18n nameKey). */
  label?: string;
  percentage: number;
  targetValue: number;
  amountPaid: number;
  status: 'PAID' | 'PARTIAL' | 'DUE' | 'LOCKED' | 'APPROVED' | 'CREDITED';
  dateText: string;
  deadlineKey: TranslationKey;
  progress: number;
  installments: Installment[];
  infoTextKey?: TranslationKey;
  infoBulletKeys?: TranslationKey[];
}

export function usePayment() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore(state => state.user);
  const { t } = useTranslation();

  const {
    activeProperty,
    properties,
    quotationView,
    isLoading: isPropertiesLoading,
    isError: isPropertiesError,
    isFetching: isPropertiesFetching,
    refetch: refetchProperties,
  } = useCustomerFlow();

  const latestQuoteVersion = useMemo(
    () => getLatestQuoteVersion(quotationView.activeQuote),
    [quotationView.activeQuote],
  );

  const projectId = activeProperty?.project?.id ?? '';
  const project = activeProperty?.project;

  const {
    data: financialSummary,
    isLoading: isFinancialLoading,
    isError: isFinancialError,
    isFetching: isFinancialFetching,
    refetch: refetchFinancial,
  } = useCustomerProjectFinancialSummary(projectId, {
    enabled: !!projectId,
  });

  const {
    data: paymentsData,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
    isFetching: isPaymentsFetching,
    refetch: refetchPayments,
  } = useCustomerProjectPayments(projectId, { enabled: !!projectId });

  const activeProject = useMemo(
    () =>
      mapActivePropertyToProject(activeProperty, {
        defaultPropertyName: t('projectSwitcher.defaultPropertyName'),
        latestQuoteVersion,
        totalValue: financialSummary?.contractValue,
        subsidy: financialSummary?.subsidyAmount,
        amountPaid: financialSummary?.totalReceived,
        progress: project?.progressPercentage,
      }),
    [
      activeProperty,
      financialSummary,
      latestQuoteVersion,
      project?.progressPercentage,
      t,
    ],
  );

  const { financials, dateRange } = useMemo(
    () => mapFinancialSummaryToDisplay(financialSummary),
    [financialSummary],
  );

  const milestones = useMemo(
    () =>
      mapConsumerPaymentsToMilestones(
        paymentsData,
        financialSummary,
        project?.status ?? 'PLANNING',
      ),
    [paymentsData, financialSummary, project?.status],
  );

  const isLoading =
    isPropertiesLoading ||
    (!!projectId && (isFinancialLoading || isPaymentsLoading));
  const isError =
    isPropertiesError || (!!projectId && (isFinancialError || isPaymentsError));
  const isRefreshing =
    isPropertiesFetching || isFinancialFetching || isPaymentsFetching;

  const refetch = useCallback(async () => {
    await refetchProperties();
    if (projectId) {
      await Promise.all([refetchFinancial(), refetchPayments()]);
    }
  }, [projectId, refetchProperties, refetchFinancial, refetchPayments]);

  useFocusEffect(
    useCallback(() => {
      if (!projectId) {
        return;
      }
      void refetchFinancial();
      void refetchPayments();
    }, [projectId, refetchFinancial, refetchPayments]),
  );

  // Accordion toggle state (tracks which term IDs are expanded)
  const [expandedTerms, setExpandedTerms] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const toggleTerm = (id: number) => {
    setExpandedTerms(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Navigations
  const handleBack = () =>
    navigation.navigate(Route.MAIN_TABS, { screen: Route.HOME_TAB });

  return {
    user,
    activeProject,
    isLoading,
    isError,
    isRefreshing,
    refetch,
    expandedTerms,
    toggleTerm,
    financials,
    milestones,
    dateRange,

    // Handlers
    handleBack,
    formatCurrency,
    hasMultipleProjects: (properties || []).length > 1,
  };
}

/**
 * useHomeDashboard — Custom hook for managing Home dashboard state and logic
 *
 * Resolver guarantees project_active before Home mounts; loads dashboard
 * analytics from useCustomerProjectDashboard and property/quote context
 * from useCustomerFlow.
 *
 * Layer: app/home/hooks
 */

import { useMemo, useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuthStore } from '@/core/auth';
import { Route, type MainStackParamList } from '@/core/navigation';
import { useTranslation } from '@/core/i18n';
import {
  useCustomerProjectDashboard,
  useChatMessages,
  useCustomerProjectFinancialSummary,
} from '@/data';
import type { Project, Quote, QuoteVersion } from '@/data/types';
import { useCustomerFlow } from '@/shared/hooks';

function getLatestQuoteVersion(
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

function readMetadataAmountPaid(metadata: unknown): number {
  if (metadata && typeof metadata === 'object' && 'amountPaid' in metadata) {
    const paid = (metadata as { amountPaid?: unknown }).amountPaid;
    return typeof paid === 'number' ? paid : 0;
  }
  return 0;
}

function resolveSystemCapacityKw(
  project: NonNullable<
    ReturnType<typeof useCustomerFlow>['activeProperty']
  >['project'],
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

export function useHomeDashboard() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAuthStore(state => state.user);
  const refreshUser = useAuthStore(state => state.refreshUser);
  const { t } = useTranslation();

  const {
    activeProperty,
    properties,
    quotationView,
    isLoading: isFlowLoading,
    isError: isFlowError,
    isFetching: isFlowFetching,
    refetch: refetchFlow,
  } = useCustomerFlow();

  const projectId = activeProperty?.project?.id ?? '';

  const {
    data: dashboard,
    isError: isDashboardError,
    isFetching: isDashboardFetching,
    refetch: refetchDashboard,
  } = useCustomerProjectDashboard(projectId, { enabled: !!projectId });

  const {
    data: financialSummary,
    isError: isFinancialError,
    isFetching: isFinancialFetching,
    refetch: refetchFinancial,
  } = useCustomerProjectFinancialSummary(projectId, { enabled: !!projectId });

  const latestQuoteVersion = useMemo(
    () => getLatestQuoteVersion(quotationView.activeQuote),
    [quotationView.activeQuote],
  );

  const isLoading = isFlowLoading;
  const isError = isFlowError || isDashboardError || isFinancialError;
  const isRefreshing =
    isFlowFetching || isDashboardFetching || isFinancialFetching;

  const handleRefetch = async () => {
    await Promise.all([
      refetchFlow(),
      refetchDashboard(),
      refetchFinancial(),
      refreshUser(),
    ]);
  };

  const totalValue = Number(latestQuoteVersion?.finalPrice ?? 0);
  const amountPaid = Number(
    financialSummary?.totalReceived ??
      readMetadataAmountPaid(activeProperty?.project?.metadata),
  );
  const subsidy = Number(
    latestQuoteVersion?.pricingBreakdown?.subsidyAmount ??
      latestQuoteVersion?.quoteSnapshot?.pricing?.subsidyAmount ??
      0,
  );
  const outstanding = Math.max(0, totalValue - amountPaid);
  const netCost = totalValue - subsidy;

  const progress =
    dashboard?.metrics.completionPercentage ??
    activeProperty?.project?.progressPercentage ??
    0;

  const nextStep = dashboard?.metrics.upcomingDeadlines[0]?.name;

  const activeProjectMapped: Project | null = useMemo(() => {
    if (!activeProperty) {
      return null;
    }

    const project = activeProperty.project;

    return {
      id: activeProperty.id,
      label:
        activeProperty.propertyName || t('projectSwitcher.defaultPropertyName'),
      status: project?.status ?? 'PLANNING',
      totalValue,
      subsidy,
      amountPaid,
      startDate: project?.startDate ?? '',
      endDate: project?.endDate ?? '',
      progress,
      capacity: resolveSystemCapacityKw(project, latestQuoteVersion),
      nextStep,
      projectNumber: project?.projectNumber,
      property: activeProperty,
      quoteVersion: latestQuoteVersion,
    };
  }, [
    activeProperty,
    amountPaid,
    latestQuoteVersion,
    nextStep,
    progress,
    subsidy,
    t,
    totalValue,
  ]);

  const isFocused = useIsFocused();
  const { data: messages = [] } = useChatMessages(projectId, {
    enabled: !!projectId && isFocused,
  });
  const [lastReadTime, setLastReadTime] = useState<number>(0);

  useEffect(() => {
    if (projectId && isFocused) {
      AsyncStorage.getItem(`chat_last_read_${projectId}`)
        .then(val => {
          if (val) setLastReadTime(parseInt(val, 10));
        })
        .catch(err => console.error(err));
    }
  }, [projectId, isFocused]);

  const hasUnreadChat = useMemo(() => {
    if (messages.length === 0) return false;
    const latestMsg = messages[messages.length - 1];
    if (latestMsg.senderId === user?.id) return false;
    return new Date(latestMsg.createdAt).getTime() > lastReadTime;
  }, [messages, lastReadTime, user?.id]);

  const navigateToPayments = () =>
    navigation.navigate(Route.MAIN_TABS, { screen: Route.PAYMENTS_TAB });
  const navigateToDocuments = () =>
    navigation.navigate(Route.MAIN_TABS, { screen: Route.DOCUMENTS_TAB });
  const navigateToSupport = () => navigation.navigate(Route.SUPPORT);
  const navigateToProjectTeam = () => {
    if (projectId) {
      navigation.navigate(Route.PROJECT_TEAM, { projectId });
    }
  };
  const navigateToProfile = () =>
    navigation.navigate(Route.MAIN_TABS, { screen: Route.PROFILE_TAB });

  const navigateToQuotations = () => {
    if (activeProperty?.id) {
      navigation.navigate(Route.QUOTATION_LIST, {
        propertyId: activeProperty.id,
      });
    }
  };

  const navigateToChat = () => {
    if (projectId) {
      navigation.navigate(Route.PROJECT_CHAT, { projectId });
    }
  };

  return {
    user,
    activeProject: activeProjectMapped,
    isLoading,
    isError,
    isRefreshing,
    refetch: handleRefetch,
    financials: {
      totalValue,
      amountPaid,
      subsidy,
      outstanding,
      netCost,
    },
    hasMultipleProjects: properties.length > 1,
    hasUnreadChat,
    navigateToPayments,
    navigateToDocuments,
    navigateToSupport,
    navigateToProjectTeam,
    navigateToProfile,
    navigateToQuotations,
    navigateToChat,
  };
}

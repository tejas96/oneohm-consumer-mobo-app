/**
 * usePayment — Custom hook for managing Payments Screen logic and dynamic states
 *
 * Layer: app/payments/hooks
 */

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/core/auth';
import { Route, type MainStackParamList } from '@/core/navigation';
import { useTranslation } from '@/core/i18n';
import { useActiveProperty } from '@/shared/hooks';
import type { TranslationKey } from '@/core/i18n';

export interface Installment {
  title: string;
  subtitle: string;
  amount: number;
}

export interface PaymentMilestone {
  id: number;
  nameKey: TranslationKey;
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

  // Fetch properties from active resource
  const {
    activeProperty,
    properties,
    isLoading,
    isError,
    refetch,
    latestQuoteVersion,
  } = useActiveProperty();

  // Create legacy activeProject compatibility structure to keep the UI view compiling
  const activeProject =
    activeProperty && activeProperty.project
      ? {
          id: activeProperty.id,
          label:
            activeProperty.propertyName ||
            t('projectSwitcher.defaultPropertyName'),
          status: activeProperty.project.status || 'PLANNING',
          totalValue: latestQuoteVersion?.finalPrice || 0,
          subsidy:
            latestQuoteVersion?.pricingBreakdown?.subsidyAmount ||
            latestQuoteVersion?.quoteSnapshot?.pricing?.subsidyAmount ||
            0,
          amountPaid:
            (activeProperty.project.metadata?.amountPaid as number) || 0,
          startDate: activeProperty.project.startDate || '',
          endDate: activeProperty.project.endDate || '',
          progress: activeProperty.project.progressPercentage || 0,
          capacity: latestQuoteVersion?.systemSizeKw || 0,
          projectNumber: activeProperty.project.projectNumber,
          property: activeProperty,
          quoteVersion: latestQuoteVersion,
        }
      : null;

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

  // Financial calculations
  const totalValue = activeProject?.totalValue || 0;
  const amountPaid = activeProject?.amountPaid || 0;
  const subsidy = activeProject?.subsidy || 0;
  const outstanding = Math.max(0, totalValue - amountPaid);
  const netCost = totalValue - subsidy;

  // Formatting utilities
  const formatCurrency = (value: number) => {
    return '₹' + value.toLocaleString('en-IN');
  };

  const formatDateString = (dateStr?: string, daysToAdd = 0): string => {
    // Return a dash when no real date is available — never show a hardcoded date.
    if (!dateStr) return '—';
    const baseDate = new Date(dateStr);
    if (daysToAdd > 0) {
      baseDate.setDate(baseDate.getDate() + daysToAdd);
    }
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return baseDate.toLocaleDateString('en-US', options);
  };

  // Dynamically compute date ranges
  const dateRange = (): string => {
    if (!activeProject) return '—';
    const start = formatDateString(activeProject.startDate);
    const end = formatDateString(activeProject.endDate);
    if (start === '—' && end === '—') return '—';
    return `${start} – ${end}`;
  };

  // Dynamic distribution of amountPaid into milestone terms
  const getMilestones = (): PaymentMilestone[] => {
    if (!activeProject) return [];

    const isCompleted = activeProject.status === 'COMPLETED';

    // Business default: 30-30-20-20 percentage split when no quote milestones are configured.
    // This is an approved fallback agreed with product — not mock data.
    // TODO: remove this fallback once all quotes are generated with explicit paymentMilestones.
    const quoteMilestones =
      latestQuoteVersion?.paymentMilestones &&
      latestQuoteVersion.paymentMilestones.length > 0
        ? latestQuoteVersion.paymentMilestones
        : [
            {
              name: 'payments.terms.t1',
              percentage: 30,
              amount: totalValue * 0.3,
              order: 1,
              stage: 'booking',
            },
            {
              name: 'payments.terms.t2',
              percentage: 30,
              amount: totalValue * 0.3,
              order: 2,
              stage: 'material',
            },
            {
              name: 'payments.terms.t3',
              percentage: 20,
              amount: totalValue * 0.2,
              order: 3,
              stage: 'install',
            },
            {
              name: 'payments.terms.t4',
              percentage: 20,
              amount: totalValue * 0.2,
              order: 4,
              stage: 'netmeter',
            },
          ];

    // Sort quote milestones by order to distribute amountPaid sequentially
    const sortedQuoteMilestones = [...quoteMilestones].sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );

    let remainingPaid = amountPaid;
    let prevWasPaid = true;

    const mappedMilestones: PaymentMilestone[] = sortedQuoteMilestones.map(
      (qm, index) => {
        const targetValue = qm.amount || 0;
        const milestonePaid = Math.min(targetValue, remainingPaid);
        remainingPaid = Math.max(0, remainingPaid - targetValue);

        // Status resolution based on payment and sequence lock rules
        let status:
          | 'PAID'
          | 'PARTIAL'
          | 'DUE'
          | 'LOCKED'
          | 'APPROVED'
          | 'CREDITED' = 'LOCKED';
        if (milestonePaid === targetValue) {
          status = 'PAID';
        } else if (milestonePaid > 0) {
          status = 'PARTIAL';
        } else if (prevWasPaid) {
          status = 'DUE';
        }

        prevWasPaid = status === 'PAID';

        // Sequence locking messages for intermediate due stages
        let infoTextKey: TranslationKey | undefined;
        if (status === 'LOCKED' || status === 'DUE') {
          if (qm.stage === 'install') {
            infoTextKey = 'payments.lockedAwaitingStructure' as TranslationKey;
          } else if (qm.stage === 'netmeter') {
            infoTextKey =
              'payments.lockedAwaitingEngineering' as TranslationKey;
          }
        }

        // Estimate dates based on project timeline sequence
        const baseDays =
          index === 0 ? 0 : index === 1 ? 25 : index === 2 ? 45 : 60;
        const dateText = qm.dueDate
          ? formatDateString(qm.dueDate)
          : formatDateString(activeProject.startDate, baseDays);

        return {
          id: index + 1,
          nameKey: (qm.name && qm.name.includes('.')
            ? qm.name
            : qm.name || `payments.terms.t${index + 1}`) as TranslationKey,
          percentage: qm.percentage || 0,
          targetValue,
          amountPaid: milestonePaid,
          status,
          dateText,
          deadlineKey: `payments.deadlines.t${index + 1}` as TranslationKey,
          progress: targetValue > 0 ? milestonePaid / targetValue : 0,
          installments: [], // Removed all fake/mock installments completely!
          infoTextKey,
        };
      },
    );

    // Append Government Subsidy Milestone dynamically if applicable
    if (subsidy > 0) {
      mappedMilestones.push({
        id: mappedMilestones.length + 1,
        nameKey: 'payments.terms.t5',
        percentage: 0,
        targetValue: subsidy,
        amountPaid: subsidy,
        status: isCompleted ? 'CREDITED' : 'APPROVED',
        dateText: '',
        deadlineKey: 'payments.deadlines.t5',
        progress: 1.0,
        installments: [], // No fake/mock subsidy installments!
        infoTextKey: 'payments.subsidyDetailsTitle',
        infoBulletKeys: [
          'payments.subsidyDetail1',
          'payments.subsidyDetail2',
          'payments.subsidyDetail3',
        ],
      });
    }

    return mappedMilestones;
  };

  // Navigations
  const handleBack = () => navigation.navigate(Route.HOME_TAB as any);

  return {
    user,
    activeProject,
    isLoading,
    isError,
    refetch,
    expandedTerms,
    toggleTerm,

    // Dynamic calculations
    financials: {
      totalValue,
      amountPaid,
      subsidy,
      outstanding,
      netCost,
    },
    milestones: getMilestones(),
    dateRange: dateRange(),

    // Handlers
    handleBack,
    formatCurrency,
    hasMultipleProjects: (properties || []).length > 1,
  };
}

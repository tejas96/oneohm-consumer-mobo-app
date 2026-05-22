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
import { useProjects } from '@/data';
import { useProjectSelectionStore } from '@/core/project/project.store';
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
  const selectedProjectId = useProjectSelectionStore(
    state => state.selectedProjectId,
  );
  const setSwitcherVisible = useProjectSelectionStore(
    state => state.setSwitcherVisible,
  );

  // Fetch projects from resource
  const { data: projects, isLoading, isError, refetch } = useProjects();

  // Active project selector
  const activeProject =
    selectedProjectId === 'none'
      ? null
      : projects && projects.length > 0
      ? projects.find(p => p.id === selectedProjectId) || projects[0]
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

  const formatDateString = (dateStr?: string, daysToAdd = 0) => {
    const baseDate = dateStr ? new Date(dateStr) : new Date('2025-10-10');
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
  const dateRange = () => {
    if (!activeProject) return 'Oct 10 – Dec 15, 2025';
    const start = formatDateString(activeProject.startDate);
    const end = formatDateString(activeProject.endDate);
    return `${start} – ${end}`;
  };

  // Dynamic distribution of amountPaid into milestone terms
  const getMilestones = (): PaymentMilestone[] => {
    if (!activeProject) return [];

    const isCompleted = activeProject.status === 'COMPLETED';

    // Term target allocations
    const t1Target = totalValue * 0.3; // 30% Booking
    const t2Target = totalValue * 0.3; // 30% Material
    const t3Target = totalValue * 0.2; // 20% Install
    const t4Target = totalValue * 0.2; // 20% Netmeter

    // Distribute paid amount sequentially
    const t1Paid = Math.min(t1Target, amountPaid);
    const t2Paid = Math.min(t2Target, Math.max(0, amountPaid - t1Target));
    const t3Paid = Math.min(
      t3Target,
      Math.max(0, amountPaid - t1Target - t2Target),
    );
    const t4Paid = Math.min(
      t4Target,
      Math.max(0, amountPaid - t1Target - t2Target - t3Target),
    );

    // Resolve statuses
    const t1Status =
      t1Paid === t1Target ? 'PAID' : t1Paid > 0 ? 'PARTIAL' : 'DUE';
    const t2Status =
      t2Paid === t2Target
        ? 'PAID'
        : t2Paid > 0
        ? 'PARTIAL'
        : t1Status === 'PAID'
        ? 'DUE'
        : 'LOCKED';
    const t3Status =
      t3Paid === t3Target
        ? 'PAID'
        : t3Paid > 0
        ? 'PARTIAL'
        : t2Status === 'PAID'
        ? 'DUE'
        : 'LOCKED';
    const t4Status =
      t4Paid === t4Target
        ? 'PAID'
        : t4Paid > 0
        ? 'PARTIAL'
        : t3Status === 'PAID'
        ? 'DUE'
        : 'LOCKED';

    // Dates mapped from project timeline
    const t1Date = formatDateString(activeProject.startDate);
    const t2Date = formatDateString(activeProject.startDate, 25);
    const t3Date = formatDateString(activeProject.startDate, 45);
    const t4Date = formatDateString(activeProject.endDate);

    // Installments mappings
    const t1Installments: Installment[] = [];
    if (t1Paid > 0) {
      const half = t1Paid / 2;
      t1Installments.push({
        title: 'Installment 1 — GPay UPI',
        subtitle: `${formatDateString(
          activeProject.startDate,
          2,
        )} · Ref ID: #GP8291`,
        amount: half,
      });
      t1Installments.push({
        title: 'Installment 2 — NEFT Bank Transfer',
        subtitle: `${formatDateString(
          activeProject.startDate,
          4,
        )} · Ref ID: #NT9912`,
        amount: t1Paid - half,
      });
    }

    const t2Installments: Installment[] = [];
    if (t2Paid > 0) {
      t2Installments.push({
        title: 'Installment 1 — Cash Handover',
        subtitle: `${formatDateString(
          activeProject.startDate,
          20,
        )} · Receipt No: #CH-8821`,
        amount: t2Paid,
      });
    }

    const t3Installments: Installment[] = [];
    if (t3Paid > 0) {
      t3Installments.push({
        title: 'Installment 1 — NEFT Bank Transfer',
        subtitle: `${formatDateString(
          activeProject.startDate,
          40,
        )} · Ref ID: #NT1092`,
        amount: t3Paid,
      });
    }

    const t4Installments: Installment[] = [];
    if (t4Paid > 0) {
      t4Installments.push({
        title: 'Installment 1 — NEFT Bank Transfer',
        subtitle: `${formatDateString(
          activeProject.endDate,
        )} · Ref ID: #NT2910`,
        amount: t4Paid,
      });
    }

    return [
      {
        id: 1,
        nameKey: 'payments.terms.t1',
        percentage: 30,
        targetValue: t1Target,
        amountPaid: t1Paid,
        status: t1Status,
        dateText: t1Date,
        deadlineKey: 'payments.deadlines.t1',
        progress: t1Paid / t1Target,
        installments: t1Installments,
      },
      {
        id: 2,
        nameKey: 'payments.terms.t2',
        percentage: 30,
        targetValue: t2Target,
        amountPaid: t2Paid,
        status: t2Status,
        dateText: t2Date,
        deadlineKey: 'payments.deadlines.t2',
        progress: t2Paid / t2Target,
        installments: t2Installments,
      },
      {
        id: 3,
        nameKey: 'payments.terms.t3',
        percentage: 20,
        targetValue: t3Target,
        amountPaid: t3Paid,
        status: t3Status,
        dateText: t3Date,
        deadlineKey: 'payments.deadlines.t3',
        progress: t3Paid / t3Target,
        installments: t3Installments,
        infoTextKey: 'payments.lockedAwaitingStructure',
      },
      {
        id: 4,
        nameKey: 'payments.terms.t4',
        percentage: 20,
        targetValue: t4Target,
        amountPaid: t4Paid,
        status: t4Status,
        dateText: t4Date,
        deadlineKey: 'payments.deadlines.t4',
        progress: t4Paid / t4Target,
        installments: t4Installments,
        infoTextKey: 'payments.lockedAwaitingEngineering',
      },
      {
        id: 5,
        nameKey: 'payments.terms.t5',
        percentage: 0,
        targetValue: subsidy,
        amountPaid: subsidy,
        status: isCompleted ? 'CREDITED' : 'APPROVED',
        dateText: '',
        deadlineKey: 'payments.deadlines.t5',
        progress: 1.0,
        installments: [],
        infoTextKey: 'payments.subsidyDetailsTitle',
        infoBulletKeys: [
          'payments.subsidyDetail1',
          'payments.subsidyDetail2',
          'payments.subsidyDetail3',
        ],
      },
    ];
  };

  // Navigations
  const handleBack = () => navigation.navigate(Route.HOME_TAB as any);
  const handleSwitchProject = () => setSwitcherVisible(true);

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
    handleSwitchProject,
    formatCurrency,
    hasMultipleProjects: (projects || []).length > 1,
  };
}

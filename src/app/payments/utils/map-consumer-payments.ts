import type { TranslationKey } from '@/core/i18n';
import type {
  ConsumerFinancialSummary,
  ConsumerPaymentTerm,
  ConsumerProjectPayments,
} from '@/data/types';

import type { PaymentMilestone } from '../hooks/usePayment';

function formatDateString(dateStr?: string | null): string {
  if (!dateStr) {
    return '—';
  }
  const baseDate = new Date(dateStr);
  if (Number.isNaN(baseDate.getTime())) {
    return '—';
  }
  return baseDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function mapTermStatus(
  term: ConsumerPaymentTerm,
  prevWasPaid: boolean,
): PaymentMilestone['status'] {
  switch (term.status) {
    case 'paid':
      return 'PAID';
    case 'partial':
      return 'PARTIAL';
    case 'waived':
      return 'APPROVED';
    case 'pending':
      return prevWasPaid ? 'DUE' : 'LOCKED';
    case 'cancelled':
    default:
      return 'LOCKED';
  }
}

export function mapConsumerPaymentsToMilestones(
  payments: ConsumerProjectPayments | undefined,
  financial: ConsumerFinancialSummary | undefined,
  projectStatus: string,
): PaymentMilestone[] {
  if (!payments?.terms.length) {
    return [];
  }

  const contractValue = financial?.contractValue ?? 0;
  const sorted = [...payments.terms].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  let prevWasPaid = true;
  const milestones: PaymentMilestone[] = sorted.map((term, index) => {
    const targetValue = term.expectedAmount ?? 0;
    const amountPaid = term.paidAmount ?? 0;
    const status = mapTermStatus(term, prevWasPaid);
    prevWasPaid = status === 'PAID';

    const percentage =
      term.expectedPercentage ??
      (contractValue > 0
        ? Math.round((targetValue / contractValue) * 1000) / 10
        : 0);

    const installments = (term.payments ?? []).map(p => {
      const date = formatDateString(p.createdAt);
      const methodLabel = p.paymentMethod
        ? p.paymentMethod.toUpperCase()
        : 'PAYMENT';
      const title = `${p.paymentNumber} (${methodLabel})`;
      const subtitle = `${date} • ${p.status.toUpperCase()}`;
      return {
        title,
        subtitle,
        amount: p.paidAmount,
      };
    });

    return {
      id: index + 1,
      nameKey: `payments.terms.t${index + 1}` as TranslationKey,
      label: term.name,
      percentage,
      targetValue,
      amountPaid,
      status,
      dateText: formatDateString(term.dueDate),
      deadlineKey: `payments.deadlines.t${index + 1}` as TranslationKey,
      progress: targetValue > 0 ? amountPaid / targetValue : 0,
      installments,
    };
  });

  const subsidy = financial?.subsidyAmount ?? 0;
  if (subsidy > 0) {
    const isCompleted = projectStatus === 'COMPLETED';
    milestones.push({
      id: milestones.length + 1,
      nameKey: 'payments.terms.t5',
      label: undefined,
      percentage: 0,
      targetValue: subsidy,
      amountPaid: subsidy,
      status: isCompleted ? 'CREDITED' : 'APPROVED',
      dateText: '',
      deadlineKey: 'payments.deadlines.t5',
      progress: 1,
      installments: [],
      infoTextKey: 'payments.subsidyDetailsTitle',
      infoBulletKeys: [
        'payments.subsidyDetail1',
        'payments.subsidyDetail2',
        'payments.subsidyDetail3',
      ],
    });
  }

  return milestones;
}

export function mapFinancialSummaryToDisplay(
  financial: ConsumerFinancialSummary | undefined,
): {
  financials: {
    totalValue: number;
    amountPaid: number;
    subsidy: number;
    outstanding: number;
    netCost: number;
  };
  dateRange: string;
} {
  if (!financial) {
    return {
      financials: {
        totalValue: 0,
        amountPaid: 0,
        subsidy: 0,
        outstanding: 0,
        netCost: 0,
      },
      dateRange: '—',
    };
  }

  const start = formatDateString(financial.startDate);
  const end = formatDateString(financial.endDate);
  const dateRange = start === '—' && end === '—' ? '—' : `${start} – ${end}`;

  return {
    financials: {
      totalValue: financial.contractValue ?? 0,
      amountPaid: financial.totalReceived ?? 0,
      subsidy: financial.subsidyAmount ?? 0,
      outstanding: financial.pending ?? 0,
      netCost: financial.netCost ?? 0,
    },
    dateRange,
  };
}

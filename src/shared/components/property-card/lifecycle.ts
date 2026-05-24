import type { CustomerProperty } from '@/data/types/project.types';
import type { AppTheme } from '@/shared/theme';
import type { TranslationKey } from '@/core/i18n';

export type ChipStatus = 'neutral' | 'success' | 'warning' | 'info' | 'error';

export interface LifecycleState {
  stageLabel: string;
  subtitleText: string;
  chipStatus: ChipStatus;
  progressVal: number;
  progressColor: string;
  borderColor: string;
  activeTintBg: string;
}

export function resolveLifecycleState(
  property: CustomerProperty,
  theme: AppTheme,
  t: (key: TranslationKey) => string,
): LifecycleState {
  const quotes = property.quotes || [];
  const hasProject = !!property.project;
  const hasAcceptedQuote = quotes.some(
    q => String(q.status).toLowerCase() === 'accepted',
  );
  const allRejected =
    quotes.length > 0 &&
    quotes.every(q => String(q.status).toLowerCase() === 'rejected');
  const hasQuotes = quotes.length > 0;

  if (hasProject) {
    const project = property.project!;
    const statusStr = String(project.status).toUpperCase();
    const progressVal = project.progressPercentage || 0;

    switch (statusStr) {
      case 'COMPLETED':
        return {
          stageLabel: t('projectSwitcher.statusCompleted' as TranslationKey),
          subtitleText: t(
            'projectSwitcher.subtitleCompleted' as TranslationKey,
          ),
          chipStatus: 'success',
          progressVal,
          progressColor: theme.colors.brandSuccess,
          borderColor: theme.colors.brandSuccessBorder,
          activeTintBg: theme.colors.brandSuccessBg,
        };
      case 'IN_PROGRESS':
        return {
          stageLabel: t('projectSwitcher.statusInProgress' as TranslationKey),
          subtitleText: t(
            'projectSwitcher.subtitleInProgress' as TranslationKey,
          ),
          chipStatus: 'warning',
          progressVal,
          progressColor: theme.colors.warningText,
          borderColor: theme.colors.warningBorder,
          activeTintBg: theme.colors.warningBg,
        };
      case 'PLANNING':
        return {
          stageLabel: t('projectSwitcher.statusPlanning' as TranslationKey),
          subtitleText: t('projectSwitcher.subtitlePlanning' as TranslationKey),
          chipStatus: 'info',
          progressVal,
          progressColor: theme.colors.brandBlue,
          borderColor: theme.colors.infoBorder,
          activeTintBg: theme.colors.infoBgChip,
        };
      case 'ON_HOLD':
        return {
          stageLabel: t('projectSwitcher.statusOnHold' as TranslationKey),
          subtitleText: t('projectSwitcher.subtitleOnHold' as TranslationKey),
          chipStatus: 'error',
          progressVal,
          progressColor: theme.colors.error,
          borderColor: theme.colors.error,
          activeTintBg: theme.colors.errorContainer,
        };
      default:
        return {
          stageLabel: statusStr,
          subtitleText: t(
            'projectSwitcher.subtitleInProgress' as TranslationKey,
          ),
          chipStatus: 'neutral',
          progressVal,
          progressColor: theme.colors.outline,
          borderColor: theme.colors.outlineVariant,
          activeTintBg: theme.colors.glassBgStrong,
        };
    }
  }

  if (hasAcceptedQuote) {
    return {
      stageLabel: t('projectSwitcher.stageQuoteAccepted' as TranslationKey),
      subtitleText: t('projectSwitcher.subtitleAccepted' as TranslationKey),
      chipStatus: 'success',
      progressVal: 0,
      progressColor: theme.colors.brandSuccess,
      borderColor: theme.colors.brandSuccessBorder,
      activeTintBg: theme.colors.brandSuccessBg,
    };
  }

  if (allRejected) {
    return {
      stageLabel: t('projectSwitcher.stageAllRejected' as TranslationKey),
      subtitleText: t('projectSwitcher.subtitleRejected' as TranslationKey),
      chipStatus: 'error',
      progressVal: 0,
      progressColor: theme.colors.error,
      borderColor: theme.colors.error,
      activeTintBg: theme.colors.errorContainer,
    };
  }

  if (hasQuotes) {
    return {
      stageLabel: t('projectSwitcher.stageQuoted' as TranslationKey),
      subtitleText: t('projectSwitcher.subtitleQuoted' as TranslationKey),
      chipStatus: 'warning',
      progressVal: 0,
      progressColor: theme.colors.warningText,
      borderColor: theme.colors.warningBorder,
      activeTintBg: theme.colors.warningBg,
    };
  }

  // Default: not quoted
  return {
    stageLabel: t('projectSwitcher.stageNotQuoted' as TranslationKey),
    subtitleText: t('projectSwitcher.subtitleNotQuoted' as TranslationKey),
    chipStatus: 'neutral',
    progressVal: 0,
    progressColor: theme.colors.outline,
    borderColor: theme.colors.outlineVariant,
    activeTintBg: theme.colors.glassBgStrong,
  };
}

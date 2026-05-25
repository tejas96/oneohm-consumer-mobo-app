/**
 * useProjectLogic — Custom hook for managing My Project screen state and logic
 *
 * Derives all specs from the active property's latest quote version.
 * No mock/fallback data is used — if real data is absent the screen
 * shows empty states or the onboarding placeholder.
 *
 * Layer: app/project/hooks
 */

import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DcrPreference } from '@tejas96/shared';

import { Route, type MainStackParamList } from '@/core/navigation';
import { useTranslation } from '@/core/i18n';
import { useActiveProperty } from '@/shared/hooks';
import { useProjectMilestones } from '@/data';

export interface TimelineStep {
  title: string;
  subtitle: string;
  status: 'completed' | 'current' | 'pending';
  completedTasks: number;
  totalTasks: number;
}

export interface PanelSpecs {
  technology: string;
  brand: string;
  count: number;
  warranty: string;
}

export interface InverterSpecs {
  capacity: string;
  quantity: string;
  phaseType: string;
  brand: string;
}

export interface StructureSpecs {
  structureType: string;
}

export interface ProjectSpecsData {
  dcrPanels: PanelSpecs | null;
  nonDcrPanels: PanelSpecs | null;
  inverter: InverterSpecs | null;
  structure: StructureSpecs | null;
}

export function useProjectLogic() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { t } = useTranslation();

  const {
    activeProperty,
    properties,
    isOnboarding: activePropOnboarding,
    isLoading: isActivePropertyLoading,
    isError: isActivePropertyError,
    refetch: refetchActiveProperty,
    latestQuoteVersion,
  } = useActiveProperty();

  const isOnboarding = activePropOnboarding || !activeProperty?.project;
  const projectId = activeProperty?.project?.id || '';

  const {
    data: milestonesRaw,
    isLoading: isMilestonesLoading,
    isError: isMilestonesError,
    refetch: refetchMilestones,
  } = useProjectMilestones(projectId, {
    enabled: !isOnboarding && !!projectId,
  });

  const isLoading =
    isActivePropertyLoading ||
    (!isOnboarding && !!projectId && isMilestonesLoading);
  const isError =
    isActivePropertyError ||
    (!isOnboarding && !!projectId && isMilestonesError);

  const refetch = async () => {
    await refetchActiveProperty();
    if (projectId) {
      await refetchMilestones();
    }
  };

  // Build activeProject from real property/quote data only — no fallbacks.
  const activeProject = activeProperty
    ? {
        id: activeProperty.id,
        label: activeProperty.propertyName || '',
        status: activeProperty.project?.status || 'PLANNING',
        totalValue: latestQuoteVersion?.finalPrice || 0,
        subsidy:
          latestQuoteVersion?.pricingBreakdown?.subsidyAmount ||
          latestQuoteVersion?.quoteSnapshot?.pricing?.subsidyAmount ||
          0,
        amountPaid:
          (activeProperty.project?.metadata?.amountPaid as number) || 0,
        startDate: activeProperty.project?.startDate || '',
        endDate: activeProperty.project?.endDate || '',
        progress: activeProperty.project?.progressPercentage || 0,
        capacity:
          latestQuoteVersion?.quoteSnapshot?.calculation?.actualSystemSizeKw ??
          latestQuoteVersion?.quoteSnapshot?.inputs?.actualSystemSizeKw ??
          latestQuoteVersion?.actualSystemSizeKw ??
          0,
        projectNumber: activeProperty.project?.projectNumber,
        property: activeProperty,
        quoteVersion: latestQuoteVersion,
      }
    : null;

  // Mapping from MilestoneAggregateItem to TimelineStep
  const getMilestoneTitle = (name: string) => {
    switch (name.toLowerCase()) {
      case 'design':
        return t('project.milestoneNames.design');
      case 'planning':
        return t('project.milestoneNames.planning');
      case 'permits & approvals':
      case 'permits approvals':
        return t('project.milestoneNames.permitsApprovals');
      case 'material procurement':
        return t('project.milestoneNames.materialProcurement');
      case 'installation':
        return t('project.milestoneNames.installation');
      case 'inspection':
        return t('project.milestoneNames.inspection');
      case 'commissioning':
        return t('project.milestoneNames.commissioning');
      case 'handover':
        return t('project.milestoneNames.handover');
      default:
        return name;
    }
  };

  const getStatusSubtitle = (status: string) => {
    switch (status) {
      case 'completed':
        return t('project.milestoneStatus.completed');
      case 'in_progress':
        return t('project.milestoneStatus.inProgress');
      case 'blocked':
        return t('project.milestoneStatus.blocked');
      case 'no_tasks':
        return t('project.milestoneStatus.noTasks');
      default:
        return t('project.milestoneStatus.pending');
    }
  };

  const timelineSteps: TimelineStep[] = milestonesRaw
    ? [...milestonesRaw]
        .filter(m => m.totalTasks > 0)
        .sort((a, b) => a.order - b.order)
        .map(m => {
          const mappedStatus: 'completed' | 'current' | 'pending' =
            m.status === 'completed'
              ? 'completed'
              : m.status === 'in_progress' || m.status === 'blocked'
              ? 'current'
              : 'pending';

          return {
            title: getMilestoneTitle(m.name),
            subtitle: getStatusSubtitle(m.status),
            status: mappedStatus,
            completedTasks: m.completedTasks,
            totalTasks: m.totalTasks,
          };
        })
    : [];

  // Derive specs from the accepted quote snapshot inputs.
  // Returns null for each section when no quote data is present.
  const inputs = latestQuoteVersion?.quoteSnapshot?.inputs;

  let dcrPanels: PanelSpecs | null = null;
  let nonDcrPanels: PanelSpecs | null = null;
  let inverter: InverterSpecs | null = null;
  let structure: StructureSpecs | null = null;

  if (inputs) {
    const capacity =
      latestQuoteVersion?.quoteSnapshot?.calculation?.actualSystemSizeKw ??
      latestQuoteVersion?.quoteSnapshot?.inputs?.actualSystemSizeKw ??
      latestQuoteVersion?.actualSystemSizeKw ??
      0;
    const dcrPref = inputs.dcrPreference;

    // DCR panels — only when the quote includes a DCR component
    if (dcrPref !== DcrPreference.NON_DCR_ONLY && inputs.dcrSystemSizeKw) {
      dcrPanels = {
        technology: inputs.preferredPanelTechnology || '',
        brand: inputs.preferredPanelBrand || '',
        count: inputs.manualDcrPanelCount ?? 0,
        warranty: '',
      };
    }

    // Non-DCR panels — only when the quote includes a non-DCR component
    if (dcrPref !== DcrPreference.DCR_ONLY && inputs.nonDcrSystemSizeKw) {
      nonDcrPanels = {
        technology: inputs.preferredPanelTechnology || '',
        brand: inputs.preferredPanelBrand || '',
        count: inputs.manualNonDcrPanelCount ?? 0,
        warranty: '',
      };
    }

    // Inverter — derived from quote inputs
    if (capacity > 0) {
      inverter = {
        capacity: `${capacity.toFixed(2)} kW`,
        quantity: inputs.manualInverterCount
          ? `${inputs.manualInverterCount} Unit${
              inputs.manualInverterCount > 1 ? 's' : ''
            }`
          : '1 Unit',
        phaseType: inputs.phaseType || '',
        brand: inputs.preferredInverterBrand || '',
      };
    }

    // Mounting structure — from quote inputs
    if (inputs.structureType) {
      structure = {
        structureType: inputs.structureType,
      };
    }
  }

  const specsData: ProjectSpecsData = {
    dcrPanels,
    nonDcrPanels,
    inverter,
    structure,
  };

  const handleBack = () => navigation.navigate(Route.HOME_TAB as any);
  const handleContactTeam = () => {
    if (activeProperty?.project?.id) {
      navigation.navigate(Route.PROJECT_TEAM, {
        projectId: activeProperty.project.id,
      });
    } else {
      Alert.alert(
        t('project.noActiveProjectTitle'),
        t('project.noActiveProjectDesc'),
      );
    }
  };

  return {
    activeProject,
    isOnboarding,
    isLoading,
    isError,
    refetch,
    timelineSteps,
    specsData,
    handleBack,
    handleContactTeam,
    hasMultipleProjects: properties.length > 1,
  };
}

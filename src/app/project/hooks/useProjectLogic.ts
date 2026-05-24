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
    isLoading,
    isError,
    refetch,
    latestQuoteVersion,
  } = useActiveProperty();

  const isOnboarding = activePropOnboarding || !activeProperty?.project;

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
        capacity: latestQuoteVersion?.systemSizeKw || 0,
        projectNumber: activeProperty.project?.projectNumber,
        property: activeProperty,
        quoteVersion: latestQuoteVersion,
      }
    : null;

  // Timeline steps come from the backend API.
  // No mock data — return empty until the project timeline API is integrated.
  const timelineSteps: TimelineStep[] = [];

  // Derive specs from the accepted quote snapshot inputs.
  // Returns null for each section when no quote data is present.
  const inputs = latestQuoteVersion?.quoteSnapshot?.inputs;

  let dcrPanels: PanelSpecs | null = null;
  let nonDcrPanels: PanelSpecs | null = null;
  let inverter: InverterSpecs | null = null;
  let structure: StructureSpecs | null = null;

  if (inputs) {
    const capacity = latestQuoteVersion?.systemSizeKw ?? 0;
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
        capacity: `${capacity.toFixed(1)} kW`,
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
    if (activeProject) {
      navigation.navigate(Route.PROJECT_TEAM, { projectId: activeProject.id });
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

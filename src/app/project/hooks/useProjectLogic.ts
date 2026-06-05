/**
 * useProjectLogic — Custom hook for managing My Project screen state and logic
 *
 * Derives all specs from the active property's latest quote version.
 * No mock/fallback data is used — if real data is absent the screen
 * shows empty states. Tabs mount only under project_active (resolver).
 *
 * Layer: app/project/hooks
 */

import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DcrPreference } from '@tejas96/shared';

import { Route, type MainStackParamList } from '@/core/navigation';
import { useTranslation } from '@/core/i18n';
import { useCustomerProjectTimeline } from '@/data';
import { useCustomerFlow } from '@/shared/hooks';
import {
  getLatestQuoteVersion,
  mapActivePropertyToProject,
  readMetadataAmountPaid,
} from '@/shared/utils';

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

export interface InverterItem {
  brand: string;
  capacity: string;
  quantity: string;
  name: string;
  warranty?: string;
}

export interface InverterSpecs {
  inverters: InverterItem[];
  phaseType: string;
  totalCapacity: string;
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
    quotationView,
    isLoading: isActivePropertyLoading,
    isError: isActivePropertyError,
    refetch: refetchActiveProperty,
  } = useCustomerFlow();

  const latestQuoteVersion = useMemo(
    () => getLatestQuoteVersion(quotationView.activeQuote),
    [quotationView.activeQuote],
  );

  const projectId = activeProperty?.project?.id ?? '';

  const {
    data: milestonesRaw,
    isLoading: isMilestonesLoading,
    isError: isMilestonesError,
    refetch: refetchMilestones,
  } = useCustomerProjectTimeline(projectId, {
    enabled: !!projectId,
  });

  const isLoading =
    isActivePropertyLoading || (!!projectId && isMilestonesLoading);
  const isError = isActivePropertyError || (!!projectId && isMilestonesError);

  const refetch = async () => {
    await refetchActiveProperty();
    if (projectId) {
      await refetchMilestones();
    }
  };

  const activeProject = useMemo(
    () =>
      mapActivePropertyToProject(activeProperty, {
        defaultPropertyName: t('projectSwitcher.defaultPropertyName'),
        latestQuoteVersion,
        amountPaid: readMetadataAmountPaid(activeProperty?.project?.metadata),
      }),
    [activeProperty, latestQuoteVersion, t],
  );

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

  const timelineSteps: TimelineStep[] = milestonesRaw?.milestones
    ? [...milestonesRaw.milestones]
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
  const calculation = latestQuoteVersion?.quoteSnapshot?.calculation;

  let dcrPanels: PanelSpecs | null = null;
  let nonDcrPanels: PanelSpecs | null = null;
  let inverter: InverterSpecs | null = null;
  let structure: StructureSpecs | null = null;

  if (inputs) {
    const capacity =
      calculation?.actualSystemSizeKw ??
      inputs.actualSystemSizeKw ??
      latestQuoteVersion?.actualSystemSizeKw ??
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
        totalCapacity: `${Number(
          calculation.inverters.totalCapacityKw || 0,
        ).toFixed(2)} kW`,
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

  const specsData: ProjectSpecsData = {
    dcrPanels,
    nonDcrPanels,
    inverter,
    structure,
  };

  const handleBack = () =>
    navigation.navigate(Route.MAIN_TABS, { screen: Route.HOME_TAB });
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

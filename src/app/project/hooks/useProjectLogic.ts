/**
 * useProjectLogic — Custom hook for managing My Project screen state and logic
 *
 * Layer: app/project/hooks
 */

import { Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Route, type MainStackParamList } from '@/core/navigation';
import { useActiveProject } from '@/shared/hooks';
import { useProjectSelectionStore } from '@/core/project/project.store';

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
  inverter: InverterSpecs;
  structure: StructureSpecs;
}

export interface Supervisor {
  name: string;
  role: string;
  phone: string;
  teamSize: string;
}

export function useProjectLogic() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const setSwitcherVisible = useProjectSelectionStore(
    state => state.setSwitcherVisible,
  );

  const { activeProject, projects, isOnboarding, isLoading, isError, refetch } =
    useActiveProject();

  const timelineSteps: TimelineStep[] = [
    {
      title: 'Site Survey & Design',
      subtitle: 'Completed on May 08',
      status: 'completed',
      completedTasks: 3,
      totalTasks: 3,
    },
    {
      title: 'DISCOM Application',
      subtitle: 'Completed on May 12',
      status: 'completed',
      completedTasks: 1,
      totalTasks: 1,
    },
    {
      title: 'Loan Processing',
      subtitle: 'Completed on May 15',
      status: 'completed',
      completedTasks: 2,
      totalTasks: 2,
    },
    {
      title: 'Permits & Approvals',
      subtitle: 'Completed on May 17',
      status: 'completed',
      completedTasks: 5,
      totalTasks: 5,
    },
    {
      title: 'Equipment Delivery',
      subtitle: 'Delivered on May 18',
      status: 'completed',
      completedTasks: 6,
      totalTasks: 6,
    },
    {
      title: 'Civil & Structural Work',
      subtitle: 'In progress',
      status: 'current',
      completedTasks: 2,
      totalTasks: 4,
    },
    {
      title: 'Electrical Work',
      subtitle: 'Pending scheduling',
      status: 'pending',
      completedTasks: 0,
      totalTasks: 3,
    },
    {
      title: 'Inspection & Testing',
      subtitle: 'Pending completion',
      status: 'pending',
      completedTasks: 0,
      totalTasks: 2,
    },
    {
      title: 'DISCOM Inspection',
      subtitle: 'Pending completion',
      status: 'pending',
      completedTasks: 0,
      totalTasks: 1,
    },
    {
      title: 'Net Metering & NOC',
      subtitle: 'Pending completion',
      status: 'pending',
      completedTasks: 0,
      totalTasks: 3,
    },
    {
      title: 'Commissioning & Testing',
      subtitle: 'Pending completion',
      status: 'pending',
      completedTasks: 0,
      totalTasks: 2,
    },
  ];

  const capacity = activeProject?.capacity ?? 5.4;

  let dcrPanels: PanelSpecs | null = null;
  let nonDcrPanels: PanelSpecs | null = null;

  if (capacity < 5.0) {
    // Case 1: DCR Only (Small System)
    dcrPanels = {
      technology: 'Mono PERC',
      brand: 'Adani Solar',
      count: Math.round(capacity * 2.2) || 8,
      warranty: '25 Years Performance Warranty',
    };
  } else if (capacity >= 5.0 && capacity <= 8.0) {
    // Case 2: Mixed DCR & Non-DCR (Medium System)
    dcrPanels = {
      technology: 'Mono PERC',
      brand: 'Adani Solar',
      count: Math.floor((capacity * 2.2) / 2) || 6,
      warranty: '25 Years Performance Warranty',
    };
    nonDcrPanels = {
      technology: 'TOPCon High-Efficiency',
      brand: 'Tata Power',
      count: Math.ceil((capacity * 2.2) / 2) || 6,
      warranty: '25 Years Product & Performance Warranty',
    };
  } else {
    // Case 3: Non-DCR Only (Large System > 8kW)
    nonDcrPanels = {
      technology: 'TOPCon High-Efficiency',
      brand: 'Tata Power',
      count: Math.round(capacity * 2.2) || 20,
      warranty: '25 Years Product & Performance Warranty',
    };
  }

  const inverter: InverterSpecs = {
    capacity: `${capacity.toFixed(1)} kW`,
    quantity: '1 Unit',
    phaseType: capacity >= 6.0 ? 'Three Phase' : 'Single Phase',
    brand: capacity >= 8.0 ? 'Sungrow' : 'Growatt',
  };

  const structure: StructureSpecs = {
    structureType: 'RCC',
  };

  const specsData: ProjectSpecsData = {
    dcrPanels,
    nonDcrPanels,
    inverter,
    structure,
  };

  const supervisor: Supervisor = {
    name: 'Rajesh Kumar',
    role: 'Solar Installation Supervisor',
    phone: '+919876543210',
    teamSize: '4 Technicians',
  };

  const handleCallSupervisor = () => {
    const url = `tel:${supervisor.phone}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            'Calling Not Supported',
            `Cannot place calls directly to ${supervisor.phone}`,
          );
        }
      })
      .catch(() => {
        Alert.alert('Error', 'An error occurred while trying to place a call.');
      });
  };

  const handleWhatsAppSupervisor = () => {
    const url = `whatsapp://send?phone=${supervisor.phone}&text=Hi Rajesh, reaching out regarding my solar installation.`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // Fallback to SMS if WhatsApp is not installed
          const smsUrl = `sms:${supervisor.phone}?body=Hi Rajesh, reaching out regarding my solar installation.`;
          Linking.openURL(smsUrl).catch(() => {
            Alert.alert(
              'Messaging Not Supported',
              `Cannot send SMS to ${supervisor.phone}`,
            );
          });
        }
      })
      .catch(() => {
        Alert.alert('Error', 'An error occurred while opening chat.');
      });
  };

  const handleBack = () => navigation.navigate(Route.HOME_TAB as any);
  const handleSwitchProject = () => setSwitcherVisible(true);
  const handleContactTeam = () => {
    if (activeProject) {
      navigation.navigate(Route.PROJECT_TEAM, { projectId: activeProject.id });
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
    supervisor,
    handleCallSupervisor,
    handleWhatsAppSupervisor,
    handleBack,
    handleSwitchProject,
    handleContactTeam,
    hasMultipleProjects: projects.length > 1,
  };
}

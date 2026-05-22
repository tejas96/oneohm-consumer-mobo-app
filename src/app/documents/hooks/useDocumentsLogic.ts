/**
 * useDocumentsLogic — Custom hook for Documents screen state and logic
 *
 * Encapsulates document data, category filtering, search, and download actions.
 * Follows "Fat Hooks, Skinny Components" (§4).
 *
 * Layer: app/documents/hooks
 */

import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Route, type MainStackParamList } from '@/core/navigation';
import { useActiveProject } from '@/shared/hooks';
import { useProjectSelectionStore } from '@/core/project/project.store';

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  date: string;
  size: string;
  status: string;
  statusType: 'success' | 'info' | 'warning' | 'error';
}

const CATEGORIES = ['All', 'Agreements', 'Technical', 'Approvals'] as const;

const ALL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Solar Installation Agreement',
    category: 'Agreements',
    date: 'May 10, 2026',
    size: '2.4 MB',
    status: 'Signed',
    statusType: 'success',
  },
  {
    id: 'doc-2',
    title: 'Engineering Design & Schematics',
    category: 'Technical',
    date: 'May 14, 2026',
    size: '8.1 MB',
    status: 'Approved',
    statusType: 'success',
  },
  {
    id: 'doc-3',
    title: 'DISCOM Grid Connection NOC',
    category: 'Approvals',
    date: 'May 18, 2026',
    size: '1.2 MB',
    status: 'Received',
    statusType: 'info',
  },
  {
    id: 'doc-4',
    title: 'Site Assessment & Shadow Report',
    category: 'Technical',
    date: 'May 08, 2026',
    size: '4.7 MB',
    status: 'Completed',
    statusType: 'success',
  },
];

export function useDocumentsLogic() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const { activeProject, projects, isOnboarding, isLoading, isError, refetch } =
    useActiveProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDocs = useMemo(() => {
    return ALL_DOCUMENTS.filter(doc => {
      const matchesCategory =
        selectedCategory === 'All' || doc.category === selectedCategory;
      const matchesSearch = doc.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleDownload = (title: string) => {
    Alert.alert('Download Started', `Downloading "${title}" to your device.`, [
      { text: 'OK' },
    ]);
  };

  const setSwitcherVisible = useProjectSelectionStore(
    state => state.setSwitcherVisible,
  );

  const handleBack = () => navigation.navigate(Route.HOME_TAB as any);
  const handleSwitchProject = () => setSwitcherVisible(true);

  return {
    activeProject,
    isOnboarding,
    isLoading,
    isError,
    refetch,
    categories: CATEGORIES,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredDocs,
    handleDownload,
    handleBack,
    handleSwitchProject,
    hasMultipleProjects: projects.length > 1,
  };
}

/**
 * useDocumentsLogic — Custom hook for Documents screen state and logic
 *
 * Encapsulates document data, category filtering, search, and download actions.
 * Follows "Fat Hooks, Skinny Components" (§4).
 *
 * NOTE: Documents are served by the backend API. There is no mock/fallback data.
 * The list will be empty until the documents API endpoint is integrated.
 *
 * Layer: app/documents/hooks
 */

import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Route, type MainStackParamList } from '@/core/navigation';
import { useTranslation } from '@/core/i18n';
import { useActiveProperty } from '@/shared/hooks';

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  date: string;
  size: string;
}

// No mock data — documents will be fetched from the backend API.
// Until the API is integrated, the list is empty by design.
const EMPTY_DOCUMENTS: DocumentItem[] = [];

export function useDocumentsLogic() {
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
  } = useActiveProperty();

  // Show onboarding state if no property is selected OR the property has no
  // active project yet — mirrors the same logic used in useProjectLogic.
  const isOnboarding = activePropOnboarding || !activeProperty?.project;

  // Expose a minimal activeProject-compatible shape for CTPremiumHeader
  const activeProject = activeProperty
    ? {
        id: activeProperty.id,
        label: activeProperty.propertyName || '',
        status: activeProperty.project?.status || 'PLANNING',
        property: activeProperty,
      }
    : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive categories dynamically from actual documents.
  // Until the API is live this will only ever contain 'All'.
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(EMPTY_DOCUMENTS.map(doc => doc.category)),
    );
    return ['All', ...unique];
  }, []);

  const filteredDocs = useMemo(() => {
    return EMPTY_DOCUMENTS.filter(doc => {
      const matchesCategory =
        selectedCategory === 'All' || doc.category === selectedCategory;
      const matchesSearch = doc.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleDownload = (title: string) => {
    Alert.alert(
      t('documents.downloadStartedTitle'),
      t('documents.downloadStartedDesc').replace('{title}', title),
      [{ text: 'OK' }],
    );
  };

  const handleBack = () => navigation.navigate(Route.HOME_TAB as any);

  return {
    activeProject,
    isOnboarding,
    isLoading,
    isError,
    refetch,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredDocs,
    handleDownload,
    handleBack,
    hasMultipleProjects: properties.length > 1,
  };
}

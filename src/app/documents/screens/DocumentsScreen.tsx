/**
 * Documents Screen — Project document viewer with search and category filtering
 *
 * Layer: app/documents/screens
 */

import React, { useRef } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Searchbar, IconButton } from 'react-native-paper';

import {
  ScreenWrapper,
  CTOnboardingPlaceholder,
  CTCard,
  CTChip,
  CTPremiumHeader,
} from '@/shared/components';
import {
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  useAppTheme,
} from '@/shared/theme';

import { useTranslation } from '@/core/i18n';
import { useDocumentsLogic } from '../hooks/useDocumentsLogic';
import {
  PropertySwitcherBottomSheet,
  type PropertySwitcherBottomSheetRef,
} from '@/shared/components/PropertySwitcherBottomSheet';

export function DocumentsScreen() {
  const switcherRef = useRef<PropertySwitcherBottomSheetRef>(null);

  const theme = useAppTheme();
  const { t } = useTranslation();
  const {
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
    hasMultipleProjects,
  } = useDocumentsLogic();

  const renderContent = () => {
    if (isOnboarding) {
      return (
        <CTOnboardingPlaceholder
          title={t('documents.onboardingTitle')}
          description={t('documents.onboardingDesc')}
          lottieSource={require('@/assets/animations/lottie/Scanning Document.json')}
          statusText={t('documents.onboardingStage')}
          status="warning"
        />
      );
    }

    return (
      <View style={styles.innerContainer}>
        {/* Search Bar */}
        <Searchbar
          placeholder={t('documents.searchPlaceholder')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surfaceVariant,
            },
          ]}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          iconColor={theme.colors.onSurfaceVariant}
          inputStyle={[styles.searchInput, { color: theme.colors.onSurface }]}
        />

        {/* Categories row */}
        <View style={styles.categoriesRow}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[...categories]}
            keyExtractor={item => item}
            renderItem={({ item }) => {
              const isSelected = selectedCategory === item;
              return (
                <CTChip
                  status={isSelected ? 'brand' : 'neutral'}
                  onPress={() => setSelectedCategory(item)}
                  style={styles.chip}
                >
                  {item}
                </CTChip>
              );
            }}
          />
        </View>

        {/* Documents FlatList */}
        <FlatList
          data={filteredDocs}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                {t('documents.emptyState')}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CTCard
              variant="glass"
              style={styles.card}
              innerStyle={styles.cardInner}
              onPress={() => handleDownload(item.title)}
            >
              <View style={styles.cardRow}>
                <IconButton
                  icon="file-pdf-box"
                  iconColor={theme.colors.error}
                  size={24}
                  style={[
                    styles.iconBg,
                    { backgroundColor: theme.colors.errorContainer },
                  ]}
                />
                <View style={styles.cardTextContainer}>
                  <Text
                    style={[styles.docTitle, { color: theme.colors.onSurface }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.metadataText,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {item.date} • {item.size}
                  </Text>
                </View>
                <View style={styles.actionContainer}>
                  <IconButton
                    icon="download"
                    iconColor={theme.colors.primary}
                    size={20}
                    style={styles.downloadIcon}
                    onPress={() => handleDownload(item.title)}
                  />
                </View>
              </View>
            </CTCard>
          )}
        />
      </View>
    );
  };

  return (
    <ScreenWrapper
      padded={false}
      edges={['top', 'left', 'right']}
      showThemeToggle={false}
      stateConfig={{
        state: isLoading ? 'loading' : isError ? 'error' : 'success',
        loadingConfig: {
          message: t('common.stateConfig.loadingDocuments'),
        },
        errorConfig: {
          title: t('common.stateConfig.errorTitleDocuments'),
          message: t('common.stateConfig.errorMessage'),
          retryText: t('common.retry'),
          onRetry: refetch,
        },
      }}
    >
      <CTPremiumHeader
        title={t('documents.title')}
        activeProject={activeProject}
        onBack={handleBack}
        onSwitchProject={() => switcherRef.current?.open()}
        hasMultipleProjects={hasMultipleProjects}
      />
      <View style={styles.container}>{renderContent()}</View>
      <PropertySwitcherBottomSheet ref={switcherRef} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  searchBar: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    fontSize: fontSize.body,
  },
  categoriesRow: {
    marginBottom: spacing.lg,
  },
  chip: {
    marginRight: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardInner: {
    padding: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    margin: 0,
    borderRadius: borderRadius.sm,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  docTitle: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
  },
  metadataText: {
    fontSize: fontSize.caption,
    marginTop: spacing.micro,
  },
  actionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  downloadIcon: {
    margin: 0,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});

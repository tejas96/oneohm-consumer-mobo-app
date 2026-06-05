/**
 * Documents Screen — Project document viewer with search and category filtering
 *
 * Layer: app/documents/screens
 */

import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  Modal,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Text, Searchbar, IconButton } from 'react-native-paper';

import {
  ScreenWrapper,
  CTCard,
  CTChip,
  CTPremiumHeader,
  CTStateWrapper,
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

const { width: screenWidth } = Dimensions.get('window');

export function DocumentsScreen() {
  const switcherRef = useRef<PropertySwitcherBottomSheetRef>(null);
  const swiperListRef = useRef<FlatList>(null);

  const theme = useAppTheme();
  const { t } = useTranslation();
  const {
    activeProject,
    isLoading,
    isError,
    isRefreshing,
    refetch,
    entityTypes,
    searchQuery,
    setSearchQuery,
    selectedEntityType,
    setSelectedEntityType,
    filteredDocs,
    handleDownload,
    handleBack,
    hasMultipleProjects,
  } = useDocumentsLogic();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const isImageFile = (url: string) => {
    const lowerUrl = (url || '').toLowerCase();
    return (
      lowerUrl.endsWith('.jpg') ||
      lowerUrl.endsWith('.jpeg') ||
      lowerUrl.endsWith('.png') ||
      lowerUrl.endsWith('.gif') ||
      lowerUrl.endsWith('.webp')
    );
  };

  const openPreview = (index: number) => {
    setActivePreviewIndex(index);
    setIsPreviewOpen(true);
    setTimeout(() => {
      swiperListRef.current?.scrollToIndex({
        index,
        animated: false,
      });
    }, 100);
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    if (
      index >= 0 &&
      index < filteredDocs.length &&
      index !== activePreviewIndex
    ) {
      setActivePreviewIndex(index);
    }
  };

  const renderContent = () => (
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

      {/* Entity Types Chips row */}
      {entityTypes.length > 1 && (
        <View style={styles.categoriesRow}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[...entityTypes]}
            keyExtractor={item => item}
            renderItem={({ item }) => {
              const isSelected = selectedEntityType === item;
              return (
                <CTChip
                  status={isSelected ? 'brand' : 'neutral'}
                  onPress={() => setSelectedEntityType(item)}
                  style={styles.chip}
                >
                  {t(`documents.entityTypes.${item}` as any)}
                </CTChip>
              );
            }}
          />
        </View>
      )}

      {/* Documents FlatList */}
      <FlatList
        data={filteredDocs}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              {t('documents.emptyState')}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <CTCard
            variant="glass"
            style={styles.card}
            innerStyle={styles.cardInner}
            onPress={() => openPreview(index)}
          >
            <View style={styles.cardRow}>
              <IconButton
                icon={isImageFile(item.fileUrl) ? 'image' : 'file-pdf-box'}
                iconColor={
                  isImageFile(item.fileUrl)
                    ? theme.colors.primary
                    : theme.colors.error
                }
                size={24}
                style={[
                  styles.iconBg,
                  {
                    backgroundColor: isImageFile(item.fileUrl)
                      ? theme.colors.primaryContainer
                      : theme.colors.errorContainer,
                  },
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
                  onPress={() => handleDownload(item)}
                />
              </View>
            </View>
          </CTCard>
        )}
      />

      {/* Document Preview Swiper Modal */}
      <Modal
        visible={isPreviewOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPreviewOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <IconButton
              icon="close"
              iconColor="#fff"
              size={24}
              onPress={() => setIsPreviewOpen(false)}
            />
            <View style={styles.modalHeaderTitleContainer}>
              <Text
                style={styles.modalDocTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {filteredDocs[activePreviewIndex]?.title || ''}
              </Text>
              <Text style={styles.modalDocSubtitle}>
                {activePreviewIndex + 1} of {filteredDocs.length} •{' '}
                {t(
                  `documents.entityTypes.${filteredDocs[activePreviewIndex]?.entityType}` as any,
                )}
              </Text>
            </View>
            <IconButton
              icon="download"
              iconColor={theme.colors.primary}
              size={24}
              onPress={() => {
                const activeDoc = filteredDocs[activePreviewIndex];
                if (activeDoc) {
                  void handleDownload(activeDoc);
                }
              }}
            />
          </View>

          {/* Swiper FlatList */}
          <FlatList
            ref={swiperListRef}
            data={filteredDocs}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => `preview-${item.id}`}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            initialScrollIndex={
              activePreviewIndex < filteredDocs.length ? activePreviewIndex : 0
            }
            onMomentumScrollEnd={handleScroll}
            renderItem={({ item }) => {
              const isImg = isImageFile(item.fileUrl);
              return (
                <View style={[styles.slide, { width: screenWidth }]}>
                  {isImg ? (
                    <Image
                      source={{ uri: item.fileUrl }}
                      style={styles.previewImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.placeholderSlideContainer}>
                      <IconButton
                        icon="file-pdf-box"
                        iconColor={theme.colors.error}
                        size={80}
                        style={styles.placeholderIcon}
                      />
                      <Text style={styles.placeholderFilename}>
                        {item.title}
                      </Text>
                      <Text style={styles.placeholderFilesize}>
                        {item.size}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.openFileBtn,
                          { backgroundColor: theme.colors.primary },
                        ]}
                        onPress={() => void handleDownload(item)}
                      >
                        <Text style={styles.openFileBtnText}>
                          {t('documents.downloadStartedTitle') ||
                            'Open Document'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );

  return (
    <ScreenWrapper
      padded={false}
      edges={['top', 'left', 'right']}
      showThemeToggle={false}
    >
      <CTPremiumHeader
        title={t('documents.title')}
        activeProject={activeProject}
        onBack={handleBack}
        onSwitchProject={() => switcherRef.current?.open()}
        hasMultipleProjects={hasMultipleProjects}
      />
      <View style={styles.container}>
        <CTStateWrapper
          state={isLoading ? 'loading' : isError ? 'error' : 'success'}
          loadingConfig={{
            message: t('common.stateConfig.loadingDocuments'),
          }}
          errorConfig={{
            title: t('common.stateConfig.errorTitleDocuments'),
            message: t('common.stateConfig.errorMessage'),
            retryText: t('common.retry'),
            onRetry: refetch,
          }}
        >
          {renderContent()}
        </CTStateWrapper>
      </View>
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
  // Modal Previewer Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeaderTitleContainer: {
    flex: 1,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  modalDocTitle: {
    color: '#fff',
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
  },
  modalDocSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: fontSize.caption,
    marginTop: spacing.micro,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
  placeholderSlideContainer: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  placeholderIcon: {
    margin: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
  },
  placeholderFilename: {
    color: '#fff',
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  placeholderFilesize: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: fontSize.caption,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  openFileBtn: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openFileBtnText: {
    color: '#fff',
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
  },
});
